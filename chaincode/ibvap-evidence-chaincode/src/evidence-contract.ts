/*
 * IBVAP Evidence Smart Contract
 *
 * Provides on-chain evidence integrity management for the
 * Intelligent Border Video Analytics Platform (IBVAP).
 *
 * Functions:
 *   RegisterEvidence  — Store evidence metadata + SHA-256 hash
 *   GetEvidence        — Retrieve a single evidence record
 *   VerifyEvidence     — Compare a submitted hash against on-chain hash
 *   GetEvidenceHistory — Full transaction history for an evidence ID
 *   EvidenceExists     — Boolean check if evidence is registered
 */

import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction,
} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import { Evidence } from './evidence';

@Info({
  title: 'IBVAP Evidence Contract',
  description: 'Smart contract for border surveillance evidence integrity on Hyperledger Fabric',
})
export class EvidenceContract extends Contract {

  constructor() {
    super('EvidenceContract');
  }

  // ──────────────────────────────────────────────────────────
  //  RegisterEvidence — Submit a new evidence record on-chain
  // ──────────────────────────────────────────────────────────

  @Transaction()
  public async RegisterEvidence(
    ctx: Context,
    evidenceId: string,
    eventId: string,
    cameraId: string,
    bopId: string,
    sha256: string,
    timestamp: string,
  ): Promise<string> {
    // Check for duplicates
    const exists = await this.EvidenceExists(ctx, evidenceId);
    if (exists) {
      throw new Error(`Evidence ${evidenceId} is already registered on the ledger`);
    }

    // Get the MSP ID of the submitting organization
    const registeredBy = ctx.clientIdentity.getMSPID();

    const evidence: Evidence = {
      docType: 'evidence',
      evidenceId,
      eventId,
      cameraId,
      bopId,
      sha256,
      timestamp,
      registeredBy,
      status: 'REGISTERED',
    };

    // Deterministic JSON serialization ensures consistent hashing across peers
    const buffer = Buffer.from(stringify(sortKeysRecursive(evidence)));
    await ctx.stub.putState(evidenceId, buffer);

    // Emit an event for off-chain listeners
    ctx.stub.setEvent('EvidenceRegistered', Buffer.from(JSON.stringify({
      evidenceId,
      sha256,
      registeredBy,
      timestamp,
    })));

    return JSON.stringify(evidence);
  }

  // ──────────────────────────────────────────────────────────
  //  GetEvidence — Query a single evidence record by ID
  // ──────────────────────────────────────────────────────────

  @Transaction(false)
  @Returns('string')
  public async GetEvidence(ctx: Context, evidenceId: string): Promise<string> {
    const data = await ctx.stub.getState(evidenceId);
    if (!data || data.length === 0) {
      throw new Error(`Evidence ${evidenceId} does not exist on the ledger`);
    }
    return data.toString();
  }

  // ──────────────────────────────────────────────────────────
  //  VerifyEvidence — Compare a hash against the on-chain hash
  // ──────────────────────────────────────────────────────────

  @Transaction(false)
  @Returns('string')
  public async VerifyEvidence(
    ctx: Context,
    evidenceId: string,
    currentHash: string,
  ): Promise<string> {
    const data = await ctx.stub.getState(evidenceId);
    if (!data || data.length === 0) {
      throw new Error(`Evidence ${evidenceId} does not exist on the ledger`);
    }

    const evidence: Evidence = JSON.parse(data.toString());
    const verified = evidence.sha256 === currentHash;

    // If tampering is detected, update the on-chain status
    if (!verified) {
      evidence.status = 'TAMPER_DETECTED';
      const buffer = Buffer.from(stringify(sortKeysRecursive(evidence)));
      await ctx.stub.putState(evidenceId, buffer);
    } else {
      evidence.status = 'VERIFIED';
      const buffer = Buffer.from(stringify(sortKeysRecursive(evidence)));
      await ctx.stub.putState(evidenceId, buffer);
    }

    return JSON.stringify({
      evidenceId,
      verified,
      onChainHash: evidence.sha256,
      submittedHash: currentHash,
      status: verified ? 'VERIFIED' : 'TAMPER_DETECTED',
      message: verified
        ? 'Evidence integrity confirmed — hash matches on-chain record'
        : 'WARNING: Evidence hash mismatch — possible tampering detected',
    });
  }

  // ──────────────────────────────────────────────────────────
  //  GetEvidenceHistory — Full modification history from ledger
  // ──────────────────────────────────────────────────────────

  @Transaction(false)
  @Returns('string')
  public async GetEvidenceHistory(ctx: Context, evidenceId: string): Promise<string> {
    const exists = await this.EvidenceExists(ctx, evidenceId);
    if (!exists) {
      throw new Error(`Evidence ${evidenceId} does not exist on the ledger`);
    }

    const iterator = await ctx.stub.getHistoryForKey(evidenceId);
    const history: any[] = [];

    let result = await iterator.next();
    while (!result.done) {
      const record: any = {
        txId: result.value.txId,
        timestamp: result.value.timestamp,
        isDelete: result.value.isDelete,
      };

      if (result.value.value && result.value.value.length > 0) {
        record.value = JSON.parse(result.value.value.toString());
      }

      history.push(record);
      result = await iterator.next();
    }

    await iterator.close();
    return JSON.stringify(history);
  }

  // ──────────────────────────────────────────────────────────
  //  EvidenceExists — Check if an evidence record exists
  // ──────────────────────────────────────────────────────────

  @Transaction(false)
  @Returns('boolean')
  public async EvidenceExists(ctx: Context, evidenceId: string): Promise<boolean> {
    const data = await ctx.stub.getState(evidenceId);
    return !!data && data.length > 0;
  }
}
