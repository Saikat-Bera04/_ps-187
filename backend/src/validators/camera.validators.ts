import { z } from 'zod';

export const createCameraSchema = z.object({
  cameraCode: z.string().min(3),
  name: z.string().min(2),
  location: z.string().min(2),
  bopCode: z.string().min(2),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  resolution: z.string().optional(),
  streamUrl: z.string().url().optional(),
  rtspUsername: z.string().optional(),
  rtspPassword: z.string().optional(),
});

export const updateCameraSchema = z.object({
  name: z.string().min(2).optional(),
  location: z.string().min(2).optional(),
  resolution: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  streamUrl: z.string().url().optional(),
  rtspUsername: z.string().optional(),
  rtspPassword: z.string().optional(),
});
