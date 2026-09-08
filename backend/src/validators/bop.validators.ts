import { z } from 'zod';

export const createBopSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  location: z.string().min(2),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  status: z.enum(['OPERATIONAL', 'DEGRADED', 'OFFLINE']).optional(),
});

export const updateBopSchema = z.object({
  name: z.string().min(2).optional(),
  location: z.string().min(2).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  status: z.enum(['OPERATIONAL', 'DEGRADED', 'OFFLINE']).optional(),
});
