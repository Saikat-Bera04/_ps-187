import { prisma } from '../config/database';
import { AppError } from '../utils/app-error';
import { v4 as uuidv4 } from 'uuid';

export class BlockchainService {
  static async registerEvidence(evidenceId: string) {
    const evidence = await prisma.evidence.findFirst({
      where: { OR: [{ id: evidenceId }, { evidenceCode: evidenceId }] },
    });

    if (!evidence) throw AppError.notFound('Evidence not found');

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

  static async getEvidenceRecord(evidenceId: string) {
    const evidence = await prisma.evidence.findFirst({
      where: { OR: [{ id: evidenceId }, { evidenceCode: evidenceId }] },
      include: { blockchainRecords: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!evidence) throw AppError.notFound('Evidence not found');

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

  static async verifyEvidence(evidenceId: string) {
    const evidence = await prisma.evidence.findFirst({
      where: { OR: [{ id: evidenceId }, { evidenceCode: evidenceId }] },
      include: { blockchainRecords: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!evidence) throw AppError.notFound('Evidence not found');

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

  static async getEvidenceHistory(evidenceId: string) {
    const evidence = await prisma.evidence.findFirst({
      where: { OR: [{ id: evidenceId }, { evidenceCode: evidenceId }] },
      include: { blockchainRecords: { orderBy: { timestamp: 'asc' } } },
    });

    if (!evidence) throw AppError.notFound('Evidence not found');

    return {
      evidenceId: evidence.evidenceCode,
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
