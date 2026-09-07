import { prisma } from '../config/database';
import { AppError } from '../utils/app-error';
import { AlertStatus } from '@prisma/client';

export class AlertService {
  static async getAll(filters?: { bopId?: string; severity?: string; status?: string; page?: number; limit?: number }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters?.bopId) where.bop = { OR: [{ id: filters.bopId }, { code: filters.bopId }] };
    if (filters?.severity) where.severity = filters.severity;
    if (filters?.status) where.status = filters.status;

    const [alerts, total] = await Promise.all([
      prisma.alert.findMany({
        where,
        include: {
          event: { select: { eventCode: true } },
          camera: { select: { cameraCode: true } },
          bop: { select: { code: true } },
          assignedTo: { select: { name: true } },
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limit,
      }),
      prisma.alert.count({ where }),
    ]);

    return {
      data: alerts.map((a) => ({
        alertId: a.alertCode,
        eventId: a.event.eventCode,
        cameraId: a.camera.cameraCode,
        bopId: a.bop.code,
        timestamp: a.timestamp.toISOString(),
        eventType: a.eventType,
        severity: a.severity,
        threatScore: a.threatScore,
        status: a.status,
        description: a.description,
        assignedTo: a.assignedTo?.name || undefined,
        resolvedAt: a.resolvedAt?.toISOString() || undefined,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  static async getById(id: string) {
    const alert = await prisma.alert.findFirst({
      where: { OR: [{ id }, { alertCode: id }] },
      include: {
        event: { select: { eventCode: true, eventType: true, confidence: true, zone: true } },
        camera: { select: { cameraCode: true, name: true } },
        bop: { select: { code: true, name: true } },
        assignedTo: { select: { name: true, email: true } },
      },
    });

    if (!alert) throw AppError.notFound('Alert not found');

    return {
      alertId: alert.alertCode,
      eventId: alert.event.eventCode,
      cameraId: alert.camera.cameraCode,
      bopId: alert.bop.code,
      timestamp: alert.timestamp.toISOString(),
      eventType: alert.eventType,
      severity: alert.severity,
      threatScore: alert.threatScore,
      status: alert.status,
      description: alert.description,
      assignedTo: alert.assignedTo?.name || undefined,
      resolvedAt: alert.resolvedAt?.toISOString() || undefined,
      acknowledgedAt: alert.acknowledgedAt?.toISOString() || undefined,
      escalatedAt: alert.escalatedAt?.toISOString() || undefined,
    };
  }

  static async acknowledge(id: string) {
    const alert = await prisma.alert.findFirst({ where: { OR: [{ id }, { alertCode: id }] } });
    if (!alert) throw AppError.notFound('Alert not found');

    const updated = await prisma.alert.update({
      where: { id: alert.id },
      data: { status: 'ACKNOWLEDGED', acknowledgedAt: new Date() },
    });

    return { alertId: updated.alertCode, status: updated.status };
  }

  static async resolve(id: string) {
    const alert = await prisma.alert.findFirst({ where: { OR: [{ id }, { alertCode: id }] } });
    if (!alert) throw AppError.notFound('Alert not found');

    const updated = await prisma.alert.update({
      where: { id: alert.id },
      data: { status: 'RESOLVED', resolvedAt: new Date() },
    });

    return { alertId: updated.alertCode, status: updated.status };
  }

  static async escalate(id: string) {
    const alert = await prisma.alert.findFirst({ where: { OR: [{ id }, { alertCode: id }] } });
    if (!alert) throw AppError.notFound('Alert not found');

    const updated = await prisma.alert.update({
      where: { id: alert.id },
      data: { status: 'ESCALATED', escalatedAt: new Date() },
    });

    return { alertId: updated.alertCode, status: updated.status };
  }
}
