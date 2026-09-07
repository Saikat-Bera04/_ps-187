import { prisma } from '../config/database';
import { AppError } from '../utils/app-error';

export class BopService {
  static async getAll() {
    const bops = await prisma.bop.findMany({
      include: { _count: { select: { cameras: true, events: true, alerts: true } } },
      orderBy: { code: 'asc' },
    });

    return bops.map((bop) => ({
      id: bop.code,
      name: bop.name,
      location: bop.location,
      latitude: bop.latitude,
      longitude: bop.longitude,
      cameraCount: bop._count.cameras,
      status: bop.status,
    }));
  }

  static async getById(id: string) {
    const bop = await prisma.bop.findFirst({
      where: { OR: [{ id }, { code: id }] },
      include: {
        cameras: { select: { id: true, cameraCode: true, name: true, status: true } },
        _count: { select: { cameras: true, events: true, alerts: true } },
      },
    });

    if (!bop) throw AppError.notFound('BOP not found');

    return {
      id: bop.code,
      name: bop.name,
      location: bop.location,
      latitude: bop.latitude,
      longitude: bop.longitude,
      cameraCount: bop._count.cameras,
      status: bop.status,
      cameras: bop.cameras,
    };
  }

  static async create(data: {
    code: string;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    status?: string;
  }) {
    const bop = await prisma.bop.create({
      data: {
        code: data.code,
        name: data.name,
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        status: (data.status as any) || 'OPERATIONAL',
      },
    });

    return bop;
  }

  static async update(id: string, data: Partial<{
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    status: string;
  }>) {
    const bop = await prisma.bop.findFirst({ where: { OR: [{ id }, { code: id }] } });
    if (!bop) throw AppError.notFound('BOP not found');

    const updated = await prisma.bop.update({
      where: { id: bop.id },
      data: data as any,
    });

    return updated;
  }

  static async delete(id: string) {
    const bop = await prisma.bop.findFirst({ where: { OR: [{ id }, { code: id }] } });
    if (!bop) throw AppError.notFound('BOP not found');

    await prisma.bop.delete({ where: { id: bop.id } });
    return { message: 'BOP deleted' };
  }

  // Helper to resolve BOP code to UUID
  static async resolveId(codeOrId: string): Promise<string> {
    const bop = await prisma.bop.findFirst({ where: { OR: [{ id: codeOrId }, { code: codeOrId }] } });
    if (!bop) throw AppError.notFound('BOP not found');
    return bop.id;
  }
}
