import { prisma } from '../config/database';
import { AppError } from '../utils/app-error';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { FabricClient } from '../integrations/blockchain/fabric-client';

export class BlockchainService {

  // ──────────────────────────────────────────────────────────
  //  Register Evidence
  // ──────────────────────────────────────────────────────────

  static async registerEvidence(evidenceId: string) {
    const evidence = await prisma.evidence.findFirst({
      where: { OR: [{ id: evidenceId }, { evidenceCode: evidenceId }] },
    });

    if (!evidence) throw AppError.notFound('Evidence not found');

    // ── Fabric mode: submit to real blockchain ──────────────
    if (config.blockchainMode === 'fabric') {
      try {
        const fabricResult = await FabricClient.registerEvidence({
          evidenceId: evidence.evidenceCode,
          eventId: evidence.eventId,
          cameraId: evidence.cameraId,
          bopId: evidence.bopId,
          sha256: evidence.hash,
          timestamp: evidence.timestamp.toISOString(),
        });

        // Store the Fabric transaction in the local database too
        const record = await prisma.blockchainRecord.create({
          data: {
            transactionId: `TX-${uuidv4().substring(0, 7).toUpperCase()}`,
            blockNumber: 0,  // Fabric doesn't return block number directly
            evidenceHash: evidence.hash,
            recordedOrg: fabricResult.registeredBy,
            recordedBy: evidence.recordedBy,
            timestamp: new Date(),
            evidenceId: evidence.id,
          },
        });

        await prisma.evidence.update({
          where: { id: evidence.id },
          data: { verificationStatus: 'VERIFIED' },
        });

        return {
          transactionId: record.transactionId,
          blockNumber: record.blockNumber,
          evidenceHash: record.evidenceHash,
          ledger: record.ledger,
          channel: record.channel,
          chaincode: record.chaincode,
          timestamp: record.timestamp.toISOString(),
          fabricStatus: fabricResult.status,
          message: 'Evidence registered on Hyperledger Fabric',
        };
      } catch (error: any) {
        // If the evidence is already registered on-chain, handle gracefully
        if (error.message?.includes('already registered')) {
          throw AppError.conflict('Evidence is already registered on the blockchain');
        }
        throw AppError.internal(`Fabric registration failed: ${error.message}`);
      }
    }

    // ── Mock mode: existing local-only logic ────────────────
    const transactionId = `TX-${uuidv4().substring(0, 7).toUpperCase()}`;
    const blockNumber = Math.floor(Math.random() * 10000) + 14500;

    const record = await prisma.blockchainRecord.create({
      data: {
        transactionId,
        blockNumber,
        evidenceHash: evidence.hash,
        recordedOrg: evidence.recordedOrg,
        recordedBy: evidence.recordedBy,
        timestamp: new Date(),
        evidenceId: evidence.id,
      },
    });

    // Update evidence verification status
    await prisma.evidence.update({
      where: { id: evidence.id },
      data: { verificationStatus: 'VERIFIED' },
    });

    return {
      transactionId: record.transactionId,
      blockNumber: record.blockNumber,
      evidenceHash: record.evidenceHash,
      ledger: record.ledger,
      channel: record.channel,
      chaincode: record.chaincode,
      timestamp: record.timestamp.toISOString(),
      message: 'Evidence registered on blockchain (mock)',
    };
  }

  // ──────────────────────────────────────────────────────────
  //  Get Evidence Record
  // ──────────────────────────────────────────────────────────

  static async getEvidenceRecord(evidenceId: string) {
    const evidence = await prisma.evidence.findFirst({
      where: { OR: [{ id: evidenceId }, { evidenceCode: evidenceId }] },
      include: { blockchainRecords: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!evidence) throw AppError.notFound('Evidence not found');

    // ── Fabric mode: query the ledger directly ──────────────
    if (config.blockchainMode === 'fabric') {
      try {
        const fabricRecord = await FabricClient.getEvidence(evidence.evidenceCode);
        const localRecord = evidence.blockchainRecords[0];

        return {
          transactionId: localRecord?.transactionId || 'N/A',
          blockNumber: localRecord?.blockNumber || 0,
          ledger: localRecord?.ledger || 'ibvap-evidence-ledger',
          timestamp: localRecord?.timestamp.toISOString() || new Date().toISOString(),
          evidenceHash: fabricRecord.sha256,
          recordedOrg: fabricRecord.registeredBy,
          recordedBy: localRecord?.recordedBy || evidence.recordedBy,
          channel: config.fabric.channel,
          chaincode: config.fabric.chaincode,
          onChainStatus: fabricRecord.status,
        };
      } catch (error: any) {
        // Fall through to local database if Fabric query fails
        console.warn(`[Fabric] Query failed, falling back to local DB: ${error.message}`);
      }
    }

    // ── Mock / fallback: read from local database ───────────
    const record = evidence.blockchainRecords[0];
    if (!record) throw AppError.notFound('No blockchain record found for this evidence');

    return {
      transactionId: record.transactionId,
      blockNumber: record.blockNumber,
      ledger: record.ledger,
      timestamp: record.timestamp.toISOString(),
      evidenceHash: record.evidenceHash,
      recordedOrg: record.recordedOrg,
      recordedBy: record.recordedBy,
      channel: record.channel,
      chaincode: record.chaincode,
    };
  }

  // ──────────────────────────────────────────────────────────
  //  Verify Evidence
  // ──────────────────────────────────────────────────────────

  static async verifyEvidence(evidenceId: string) {
    const evidence = await prisma.evidence.findFirst({
      where: { OR: [{ id: evidenceId }, { evidenceCode: evidenceId }] },
      include: { blockchainRecords: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!evidence) throw AppError.notFound('Evidence not found');

    // ── Fabric mode: verify against on-chain hash ───────────
    if (config.blockchainMode === 'fabric') {
      try {
        const fabricResult = await FabricClient.verifyEvidence(
          evidence.evidenceCode,
          evidence.hash,
        );

        // Update local verification status
        await prisma.evidence.update({
          where: { id: evidence.id },
          data: {
            verificationStatus: fabricResult.verified ? 'VERIFIED' : 'FAILED',
          },
        });

        return {
          verified: fabricResult.verified,
          currentHash: fabricResult.submittedHash,
          blockchainHash: fabricResult.onChainHash,
          blockNumber: evidence.blockchainRecords[0]?.blockNumber || 0,
          transactionId: evidence.blockchainRecords[0]?.transactionId || 'N/A',
          timestamp: new Date().toISOString(),
          status: fabricResult.status,
          message: fabricResult.message,
        };
      } catch (error: any) {
        if (error.message?.includes('does not exist')) {
          return {
            verified: false,
            message: 'Evidence not found on the blockchain ledger',
            currentHash: evidence.hash,
            blockchainHash: '',
          };
        }
        throw AppError.internal(`Fabric verification failed: ${error.message}`);
      }
    }

    // ── Mock mode: compare local hashes ─────────────────────
    const record = evidence.blockchainRecords[0];
    if (!record) {
      return {
        verified: false,
        message: 'No blockchain record exists for this evidence',
        currentHash: evidence.hash,
        blockchainHash: '',
      };
    }

    const verified = evidence.hash === record.evidenceHash;

    await prisma.evidence.update({
      where: { id: evidence.id },
      data: { verificationStatus: verified ? 'VERIFIED' : 'FAILED' },
    });

    return {
      verified,
      currentHash: evidence.hash,
      blockchainHash: record.evidenceHash,
      blockNumber: record.blockNumber,
      transactionId: record.transactionId,
      timestamp: record.timestamp.toISOString(),
      message: verified ? 'Evidence integrity confirmed' : 'Evidence hash mismatch - possible tampering',
    };
  }

  // ──────────────────────────────────────────────────────────
  //  Get Evidence History
  // ──────────────────────────────────────────────────────────

  static async getEvidenceHistory(evidenceId: string) {
    const evidence = await prisma.evidence.findFirst({
      where: { OR: [{ id: evidenceId }, { evidenceCode: evidenceId }] },
      include: { blockchainRecords: { orderBy: { timestamp: 'asc' } } },
    });

    if (!evidence) throw AppError.notFound('Evidence not found');

    // ── Fabric mode: get history from the ledger ────────────
    if (config.blockchainMode === 'fabric') {
      try {
        const fabricHistory = await FabricClient.getEvidenceHistory(evidence.evidenceCode);

        return {
          evidenceId: evidence.evidenceCode,
          source: 'fabric',
          history: fabricHistory.map((entry) => ({
            transactionId: entry.txId,
            timestamp: entry.timestamp,
            isDelete: entry.isDelete,
            evidenceHash: entry.value?.sha256 || '',
            status: entry.value?.status || '',
            registeredBy: entry.value?.registeredBy || '',
          })),
        };
      } catch (error: any) {
        console.warn(`[Fabric] History query failed, falling back to local DB: ${error.message}`);
      }
    }

    // ── Mock / fallback: read from local database ───────────
    return {
      evidenceId: evidence.evidenceCode,
      source: 'local',
      history: evidence.blockchainRecords.map((r) => ({
        transactionId: r.transactionId,
        blockNumber: r.blockNumber,
        evidenceHash: r.evidenceHash,
        timestamp: r.timestamp.toISOString(),
        recordedBy: r.recordedBy,
        recordedOrg: r.recordedOrg,
        ledger: r.ledger,
        channel: r.channel,
      })),
    };
  }
}
