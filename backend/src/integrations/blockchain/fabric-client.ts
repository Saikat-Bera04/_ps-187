/*
 * IBVAP Fabric Client
 *
 * Connects the Node.js backend to Hyperledger Fabric via the Gateway API.
 * Uses @hyperledger/fabric-gateway (recommended for Fabric v2.4+).
 *
 * Architecture:
 *   Node.js → gRPC → Org1 Peer → evidence-channel → ibvap-evidence-cc
 *
 * This is a singleton — connect() once on startup, reuse for all requests.
 */

import * as grpc from '@grpc/grpc-js';
import {
  connect,
  Contract,
  Gateway,
  Identity,
  Signer,
  signers,
} from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../../config';

// ── Types ──────────────────────────────────────────────────

export interface EvidenceRegistrationPayload {
  evidenceId: string;
  eventId: string;
  cameraId: string;
  bopId: string;
  sha256: string;
  timestamp: string;
}

export interface FabricEvidenceRecord {
  docType: string;
  evidenceId: string;
  eventId: string;
  cameraId: string;
  bopId: string;
  sha256: string;
  timestamp: string;
  registeredBy: string;
  status: string;
}

export interface VerificationResult {
  evidenceId: string;
  verified: boolean;
  onChainHash: string;
  submittedHash: string;
  status: string;
  message: string;
}

export interface HistoryEntry {
  txId: string;
  timestamp: any;
  isDelete: boolean;
  value?: FabricEvidenceRecord;
}

// ── Fabric Client Singleton ────────────────────────────────

let gateway: Gateway | null = null;
let grpcClient: grpc.Client | null = null;
let contract: Contract | null = null;

/**
 * Read a file as UTF-8 and trim whitespace.
 */
function readFile(filePath: string): string {
  return fs.readFileSync(path.resolve(filePath), 'utf-8').trim();
}

/**
 * Read the first matching file from a directory (used for keystore
 * where the private key filename is generated dynamically by Fabric CA).
 */
function readFirstFileInDir(dirPath: string): string {
  const resolvedDir = path.resolve(dirPath);
  const files = fs.readdirSync(resolvedDir);
  if (files.length === 0) {
    throw new Error(`No files found in directory: ${resolvedDir}`);
  }
  return fs.readFileSync(path.join(resolvedDir, files[0]), 'utf-8').trim();
}

/**
 * Create a gRPC TLS connection to the Fabric peer.
 */
function createGrpcConnection(): grpc.Client {
  const tlsCert = readFile(config.fabric.tlsCertPath);
  const tlsCredentials = grpc.credentials.createSsl(Buffer.from(tlsCert));

  return new grpc.Client(config.fabric.peerEndpoint, tlsCredentials, {
    'grpc.ssl_target_name_override': config.fabric.peerHostAlias,
  });
}

/**
 * Build the organization identity from the signing certificate.
 */
function createIdentity(): Identity {
  const certPath = config.fabric.certPath;
  let certificate: string;

  // certPath may point to a file or a directory (e.g. signcerts/)
  const stat = fs.statSync(path.resolve(certPath));
  if (stat.isDirectory()) {
    certificate = readFirstFileInDir(certPath);
  } else {
    certificate = readFile(certPath);
  }

  return {
    mspId: config.fabric.mspId,
    credentials: Buffer.from(certificate),
  };
}

/**
 * Build the signing function from the organization's private key.
 */
function createSigner(): Signer {
  const keyPath = config.fabric.keyPath;
  let privateKeyPem: string;

  // keyPath may point to a file or a directory (e.g. keystore/)
  const stat = fs.statSync(path.resolve(keyPath));
  if (stat.isDirectory()) {
    privateKeyPem = readFirstFileInDir(keyPath);
  } else {
    privateKeyPem = readFile(keyPath);
  }

  const privateKey = crypto.createPrivateKey(privateKeyPem);
  return signers.newPrivateKeySigner(privateKey);
}

// ── Public API ─────────────────────────────────────────────

export class FabricClient {

  /**
   * Establish a connection to the Fabric network.
   * Call this once on backend startup.
   */
  static async connect(): Promise<void> {
    if (config.blockchainMode !== 'fabric') {
      console.log('[Fabric] Blockchain mode is not "fabric", skipping connection');
      return;
    }

    // Validate that credential paths are configured
    if (!config.fabric.tlsCertPath || !config.fabric.certPath || !config.fabric.keyPath) {
      throw new Error(
        '[Fabric] Missing credential paths. Set FABRIC_TLS_CERT_PATH, FABRIC_CERT_PATH, and FABRIC_KEY_PATH in .env'
      );
    }

    try {
      console.log('[Fabric] Connecting to peer at', config.fabric.peerEndpoint);

      grpcClient = createGrpcConnection();
      gateway = connect({
        client: grpcClient,
        identity: createIdentity(),
        signer: createSigner(),
        // Default timeouts for gateway operations
        evaluateOptions: () => ({ deadline: Date.now() + 5000 }),
        endorseOptions: () => ({ deadline: Date.now() + 15000 }),
        submitOptions: () => ({ deadline: Date.now() + 5000 }),
        commitStatusOptions: () => ({ deadline: Date.now() + 60000 }),
      });

      const network = gateway.getNetwork(config.fabric.channel);
      contract = network.getContract(config.fabric.chaincode);

      console.log('[Fabric] Connected successfully');
      console.log(`[Fabric]   Channel:   ${config.fabric.channel}`);
      console.log(`[Fabric]   Chaincode: ${config.fabric.chaincode}`);
      console.log(`[Fabric]   MSP:       ${config.fabric.mspId}`);
    } catch (error) {
      console.error('[Fabric] Connection failed:', error);
      throw error;
    }
  }

  /**
   * Gracefully disconnect from the Fabric network.
   * Call this on backend shutdown.
   */
  static disconnect(): void {
    if (gateway) {
      gateway.close();
      gateway = null;
      contract = null;
      console.log('[Fabric] Gateway closed');
    }
    if (grpcClient) {
      grpcClient.close();
      grpcClient = null;
      console.log('[Fabric] gRPC connection closed');
    }
  }

  /**
   * Get the active contract instance.
   * Throws if not connected.
   */
  private static getContract(): Contract {
    if (!contract) {
      throw new Error('[Fabric] Not connected. Call FabricClient.connect() first.');
    }
    return contract;
  }

  // ── Chaincode Operations ──────────────────────────────────

  /**
   * Register evidence on the Fabric ledger.
   * Submits a transaction (writes to the ledger).
   */
  static async registerEvidence(
    payload: EvidenceRegistrationPayload
  ): Promise<FabricEvidenceRecord> {
    const c = this.getContract();

    const resultBytes = await c.submitTransaction(
      'RegisterEvidence',
      payload.evidenceId,
      payload.eventId,
      payload.cameraId,
      payload.bopId,
      payload.sha256,
      payload.timestamp,
    );

    const result: FabricEvidenceRecord = JSON.parse(
      Buffer.from(resultBytes).toString('utf-8')
    );

    console.log(`[Fabric] Evidence registered: ${payload.evidenceId}`);
    return result;
  }

  /**
   * Get an evidence record from the Fabric ledger.
   * Evaluates a query (reads from the ledger, no transaction).
   */
  static async getEvidence(evidenceId: string): Promise<FabricEvidenceRecord> {
    const c = this.getContract();

    const resultBytes = await c.evaluateTransaction('GetEvidence', evidenceId);
    return JSON.parse(Buffer.from(resultBytes).toString('utf-8'));
  }

  /**
   * Verify evidence integrity by comparing a hash against the on-chain hash.
   * Evaluates a query but may also update status on-chain if tampered.
   */
  static async verifyEvidence(
    evidenceId: string,
    currentHash: string
  ): Promise<VerificationResult> {
    const c = this.getContract();

    // VerifyEvidence writes status changes, so use submitTransaction
    const resultBytes = await c.submitTransaction(
      'VerifyEvidence',
      evidenceId,
      currentHash,
    );

    return JSON.parse(Buffer.from(resultBytes).toString('utf-8'));
  }

  /**
   * Get the full transaction history for an evidence record.
   */
  static async getEvidenceHistory(evidenceId: string): Promise<HistoryEntry[]> {
    const c = this.getContract();

    const resultBytes = await c.evaluateTransaction(
      'GetEvidenceHistory',
      evidenceId,
    );

    return JSON.parse(Buffer.from(resultBytes).toString('utf-8'));
  }

  /**
   * Check if an evidence record exists on the ledger.
   */
  static async evidenceExists(evidenceId: string): Promise<boolean> {
    const c = this.getContract();

    const resultBytes = await c.evaluateTransaction(
      'EvidenceExists',
      evidenceId,
    );

    return JSON.parse(Buffer.from(resultBytes).toString('utf-8'));
  }

  /**
   * Simple mock invoke for when BLOCKCHAIN_MODE is not 'fabric'.
   * Kept for backward compatibility.
   */
  static async invoke(chaincodeId: string, fcn: string, args: string[]) {
    if (config.blockchainMode === 'mock') {
      return { success: true, message: 'Mock invoke successful' };
    }
    return { success: true, message: 'Fabric invoke successful' };
  }
}
