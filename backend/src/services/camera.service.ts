import { prisma } from '../config/database';
import { config } from '../config';
import { AppError } from '../utils/app-error';
import { encryptCameraCredential } from '../utils/crypto';

export class CameraService {
  static async getAll(userBopId?: string | null) {
    const where: any = {};
    if (userBopId) {
      where.bop = { OR: [{ id: userBopId }, { code: userBopId }] };
    }

    const cameras = await prisma.camera.findMany({
      where,
      include: { bop: { select: { code: true, name: true } } },
      orderBy: { cameraCode: 'asc' },
    });

    return cameras.map((cam) => ({
      id: cam.cameraCode,
      name: cam.name,
      bopId: cam.bop.code,
      location: cam.location,
      status: cam.status,
      fps: cam.fps,
      resolution: cam.resolution,
      aiStatus: cam.aiStatus,
      lastSeen: cam.lastSeen?.toISOString() || null,
      latitude: cam.latitude,
      longitude: cam.longitude,
      // Never return RTSP credentials
    }));
  }

  static async getById(id: string) {
    const camera = await prisma.camera.findFirst({
      where: { OR: [{ id }, { cameraCode: id }] },
      include: {
        bop: { select: { code: true, name: true } },
        zones: true,
      },
    });

    if (!camera) throw AppError.notFound('Camera not found');

    return {
      id: camera.cameraCode,
      name: camera.name,
      bopId: camera.bop.code,
      location: camera.location,
      status: camera.status,
      fps: camera.fps,
      resolution: camera.resolution,
      aiStatus: camera.aiStatus,
      lastSeen: camera.lastSeen?.toISOString() || null,
      latitude: camera.latitude,
      longitude: camera.longitude,
      zones: camera.zones,
      // Never return RTSP credentials
    };
  }

  static async create(data: {
    cameraCode: string;
    name: string;
    location: string;
    bopCode: string;
    latitude: number;
    longitude: number;
    resolution?: string;
    streamUrl?: string;
    rtspUsername?: string;
    rtspPassword?: string;
  }) {
    // Resolve BOP
    const bop = await prisma.bop.findFirst({ where: { OR: [{ code: data.bopCode }, { id: data.bopCode }] } });
    if (!bop) throw AppError.notFound('BOP not found');

    // Encrypt RTSP credentials if provided
    let rtspUsernameEncrypted: string | null = null;
    let rtspPasswordEncrypted: string | null = null;

    if (data.rtspUsername) {
      rtspUsernameEncrypted = encryptCameraCredential(data.rtspUsername, config.encryptionKey);
    }
    if (data.rtspPassword) {
      rtspPasswordEncrypted = encryptCameraCredential(data.rtspPassword, config.encryptionKey);
    }

    const camera = await prisma.camera.create({
      data: {
        cameraCode: data.cameraCode,
        name: data.name,
        location: data.location,
        bopId: bop.id,
        latitude: data.latitude,
        longitude: data.longitude,
        resolution: data.resolution || '1920x1080',
        streamUrl: data.streamUrl,
        rtspUsernameEncrypted,
        rtspPasswordEncrypted,
      },
      include: { bop: { select: { code: true } } },
    });

    return {
      id: camera.cameraCode,
      name: camera.name,
      bopId: camera.bop.code,
      location: camera.location,
      status: camera.status,
      resolution: camera.resolution,
      latitude: camera.latitude,
      longitude: camera.longitude,
    };
  }

  static async update(id: string, data: Partial<{
    name: string;
    location: string;
    resolution: string;
    latitude: number;
    longitude: number;
    streamUrl: string;
    rtspUsername: string;
    rtspPassword: string;
  }>) {
    const camera = await prisma.camera.findFirst({ where: { OR: [{ id }, { cameraCode: id }] } });
    if (!camera) throw AppError.notFound('Camera not found');

    const updateData: any = { ...data };
    delete updateData.rtspUsername;
    delete updateData.rtspPassword;

    if (data.rtspUsername) {
      updateData.rtspUsernameEncrypted = encryptCameraCredential(data.rtspUsername, config.encryptionKey);
    }
    if (data.rtspPassword) {
      updateData.rtspPasswordEncrypted = encryptCameraCredential(data.rtspPassword, config.encryptionKey);
    }

    const updated = await prisma.camera.update({ where: { id: camera.id }, data: updateData });
    return { id: updated.cameraCode, name: updated.name, status: updated.status };
  }

  static async delete(id: string) {
    const camera = await prisma.camera.findFirst({ where: { OR: [{ id }, { cameraCode: id }] } });
    if (!camera) throw AppError.notFound('Camera not found');
    await prisma.camera.delete({ where: { id: camera.id } });
    return { message: 'Camera deleted' };
  }

  static async testConnection(id: string) {
    const camera = await prisma.camera.findFirst({ where: { OR: [{ id }, { cameraCode: id }] } });
    if (!camera) throw AppError.notFound('Camera not found');
    // Mock connection test
    return { connected: true, latency: Math.floor(Math.random() * 50) + 10, message: 'Connection successful (mock)' };
  }

  static async start(id: string) {
    const camera = await prisma.camera.findFirst({ where: { OR: [{ id }, { cameraCode: id }] } });
    if (!camera) throw AppError.notFound('Camera not found');

    await prisma.camera.update({
      where: { id: camera.id },
      data: { status: 'ONLINE', aiStatus: 'ACTIVE', fps: 25, lastSeen: new Date() },
    });

    return { id: camera.cameraCode, status: 'ONLINE', message: 'Camera started' };
  }

  static async stop(id: string) {
    const camera = await prisma.camera.findFirst({ where: { OR: [{ id }, { cameraCode: id }] } });
    if (!camera) throw AppError.notFound('Camera not found');

    await prisma.camera.update({
      where: { id: camera.id },
      data: { status: 'OFFLINE', aiStatus: 'INACTIVE', fps: 0 },
    });

    return { id: camera.cameraCode, status: 'OFFLINE', message: 'Camera stopped' };
  }

  static async getHealth(id: string) {
    const camera = await prisma.camera.findFirst({ where: { OR: [{ id }, { cameraCode: id }] } });
    if (!camera) throw AppError.notFound('Camera not found');

    return {
      id: camera.cameraCode,
      status: camera.status,
      fps: camera.fps,
      aiStatus: camera.aiStatus,
      lastSeen: camera.lastSeen?.toISOString() || null,
      uptime: camera.status === 'ONLINE' ? '99.7%' : '0%',
      networkLatency: camera.status === 'ONLINE' ? `${Math.floor(Math.random() * 30) + 5}ms` : 'N/A',
    };
  }

  // Helper to get BOP ID for a camera (used in authorization)
  static async getCameraBopId(cameraId: string): Promise<string | null> {
    const camera = await prisma.camera.findFirst({
      where: { OR: [{ id: cameraId }, { cameraCode: cameraId }] },
      include: { bop: { select: { id: true, code: true } } },
    });
    return camera?.bop.id || null;
  }
}
