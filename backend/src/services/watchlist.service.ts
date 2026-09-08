import { prisma } from '../config/database';
import { AppError } from '../utils/app-error';

export class WatchlistService {
  // ─── Persons ─────────────────────────────────────────
  static async getPersons(filters?: { status?: string; page?: number; limit?: number }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters?.status) where.status = filters.status;

    const [persons, total] = await Promise.all([
      prisma.watchlistPerson.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.watchlistPerson.count({ where }),
    ]);

    return {
      data: persons.map((p) => ({
        referenceId: p.referenceId,
        name: p.name,
        status: p.status,
        lastMatch: p.lastMatch?.toISOString() || null,
        addedAt: p.createdAt.toISOString(),
        addedBy: p.addedBy,
        description: p.description,
        category: p.category,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  static async createPerson(data: { name: string; category: string; addedBy: string; description?: string }) {
    const count = await prisma.watchlistPerson.count();
    const referenceId = `WLP-${String(count + 1).padStart(3, '0')}`;

    const person = await prisma.watchlistPerson.create({
      data: { referenceId, name: data.name, category: data.category, addedBy: data.addedBy, description: data.description },
    });

    return {
      referenceId: person.referenceId,
      name: person.name,
      status: person.status,
      addedAt: person.createdAt.toISOString(),
      addedBy: person.addedBy,
      category: person.category,
    };
  }

  static async updatePerson(id: string, data: Partial<{ name: string; status: string; description: string; category: string }>) {
    const person = await prisma.watchlistPerson.findFirst({ where: { OR: [{ id }, { referenceId: id }] } });
    if (!person) throw AppError.notFound('Watchlist person not found');

    const updated = await prisma.watchlistPerson.update({ where: { id: person.id }, data: data as any });
    return updated;
  }

  static async deletePerson(id: string) {
    const person = await prisma.watchlistPerson.findFirst({ where: { OR: [{ id }, { referenceId: id }] } });
    if (!person) throw AppError.notFound('Watchlist person not found');
    await prisma.watchlistPerson.delete({ where: { id: person.id } });
    return { message: 'Person removed from watchlist' };
  }

  // ─── Vehicles ────────────────────────────────────────
  static async getVehicles(filters?: { status?: string; page?: number; limit?: number }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters?.status) where.status = filters.status;

    const [vehicles, total] = await Promise.all([
      prisma.watchlistVehicle.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.watchlistVehicle.count({ where }),
    ]);

    return {
      data: vehicles.map((v) => ({
        vehicleId: v.vehicleId,
        numberPlate: v.numberPlate,
        vehicleType: v.vehicleType,
        status: v.status,
        lastMatch: v.lastMatch?.toISOString() || null,
        addedAt: v.createdAt.toISOString(),
        addedBy: v.addedBy,
        description: v.description,
        category: v.category,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  static async createVehicle(data: {
    numberPlate: string;
    vehicleType: string;
    category: string;
    addedBy: string;
    description?: string;
  }) {
    const count = await prisma.watchlistVehicle.count();
    const vehicleId = `WLV-${String(count + 1).padStart(3, '0')}`;

    const vehicle = await prisma.watchlistVehicle.create({
      data: {
        vehicleId,
        numberPlate: data.numberPlate,
        vehicleType: data.vehicleType,
        category: data.category,
        addedBy: data.addedBy,
        description: data.description,
      },
    });

    return {
      vehicleId: vehicle.vehicleId,
      numberPlate: vehicle.numberPlate,
      vehicleType: vehicle.vehicleType,
      addedAt: vehicle.createdAt.toISOString(),
      addedBy: vehicle.addedBy,
      category: vehicle.category,
    };
  }

  static async updateVehicle(id: string, data: Partial<{ numberPlate: string; vehicleType: string; status: string; description: string; category: string }>) {
    const vehicle = await prisma.watchlistVehicle.findFirst({ where: { OR: [{ id }, { vehicleId: id }] } });
    if (!vehicle) throw AppError.notFound('Watchlist vehicle not found');

    const updated = await prisma.watchlistVehicle.update({ where: { id: vehicle.id }, data: data as any });
    return updated;
  }

  static async deleteVehicle(id: string) {
    const vehicle = await prisma.watchlistVehicle.findFirst({ where: { OR: [{ id }, { vehicleId: id }] } });
    if (!vehicle) throw AppError.notFound('Watchlist vehicle not found');
    await prisma.watchlistVehicle.delete({ where: { id: vehicle.id } });
    return { message: 'Vehicle removed from watchlist' };
  }
}
