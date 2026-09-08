import { prisma } from '../config/database';
import { AppError } from '../utils/app-error';
import { calculateSHA256 } from '../utils/hash';

export class EvidenceService {
  static async getAll(filters?: { bopId?: string; status?: string; page?: number; limit?: number }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters?.bopId) where.bop = { OR: [{ id: filters.bopId }, { code: filters.bopId }] };
    if (filters?.status) where.verificationStatus = filters.status;

    const [evidence, total] = await Promise.all([
      prisma.evidence.findMany({
        where,
        include: {
          event: { select: { eventCode: true } },
          camera: { select: { cameraCode: true } },
          bop: { select: { code: true } },
          blockchainRecords: {
            select: { transactionId: true, blockNumber: true },
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      prisma.evidence.count({ where }),
    ]);

    return {
      data: evidence.map((ev) => ({
        evidenceId: ev.evidenceCode,
        eventId: ev.event.eventCode,
        cameraId: ev.camera.cameraCode,
        bopId: ev.bop.code,
        evidenceType: ev.evidenceType,
        timestamp: ev.timestamp.toISOString(),
        hash: ev.hash,
        blockchainTxId: ev.blockchainRecords[0]?.transactionId || '',
        blockNumber: ev.blockchainRecords[0]?.blockNumber || 0,
        verificationStatus: ev.verificationStatus,
        recordedBy: ev.recordedBy,
        recordedOrg: ev.recordedOrg,
        fileSizeKB: ev.fileSizeKB,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  static async getById(id: string) {
    const evidence = await prisma.evidence.findFirst({
      where: { OR: [{ id }, { evidenceCode: id }] },
      include: {
        event: { select: { eventCode: true, eventType: true } },
        camera: { select: { cameraCode: true, name: true } },
        bop: { select: { code: true, name: true } },
        blockchainRecords: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!evidence) throw AppError.notFound('Evidence not found');

    const latestRecord = evidence.blockchainRecords[0];

    return {
      evidenceId: evidence.evidenceCode,
      eventId: evidence.event.eventCode,
      cameraId: evidence.camera.cameraCode,
      bopId: evidence.bop.code,
      evidenceType: evidence.evidenceType,
      timestamp: evidence.timestamp.toISOString(),
      hash: evidence.hash,
      blockchainTxId: latestRecord?.transactionId || '',
      blockNumber: latestRecord?.blockNumber || 0,
      verificationStatus: evidence.verificationStatus,
      recordedBy: evidence.recordedBy,
      recordedOrg: evidence.recordedOrg,
      fileSizeKB: evidence.fileSizeKB,
      blockchainRecords: evidence.blockchainRecords,
    };
  }

  static async verify(id: string) {
    const evidence = await prisma.evidence.findFirst({
      where: { OR: [{ id }, { evidenceCode: id }] },
      include: { blockchainRecords: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!evidence) throw AppError.notFound('Evidence not found');

    const latestRecord = evidence.blockchainRecords[0];
    const currentHash = evidence.hash; // In real scenario: recalculate from stored file

    const verified = latestRecord ? currentHash === latestRecord.evidenceHash : false;

    if (verified) {
      await prisma.evidence.update({
        where: { id: evidence.id },
        data: { verificationStatus: 'VERIFIED' },
      });
    } else if (latestRecord) {
      await prisma.evidence.update({
        where: { id: evidence.id },
        data: { verificationStatus: 'FAILED' },
      });
    }

    return {
      verified,
      currentHash,
      blockchainHash: latestRecord?.evidenceHash || '',
      timestamp: evidence.timestamp.toISOString(),
      blockNumber: latestRecord?.blockNumber || 0,
      txId: latestRecord?.transactionId || '',
      recordedBy: evidence.recordedBy,
      recordedOrg: evidence.recordedOrg,
    };
  }

  static async getAuditTrail(id: string) {
    const evidence = await prisma.evidence.findFirst({
      where: { OR: [{ id }, { evidenceCode: id }] },
      include: { blockchainRecords: { orderBy: { createdAt: 'asc' } } },
    });

    if (!evidence) throw AppError.notFound('Evidence not found');

    return {
      evidenceId: evidence.evidenceCode,
      history: evidence.blockchainRecords.map((r) => ({
        transactionId: r.transactionId,
        blockNumber: r.blockNumber,
        timestamp: r.timestamp.toISOString(),
        evidenceHash: r.evidenceHash,
        recordedBy: r.recordedBy,
        recordedOrg: r.recordedOrg,
      })),
    };
  }
}
