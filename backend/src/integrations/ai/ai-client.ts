import { config } from '../../config';
import { AppError } from '../../utils/app-error';

export interface AiCameraZone {
  name: string;
  zoneType: string;
  coordinates: unknown;
}

export interface AiCameraConfig {
  cameraId: string;
  bopId: string;
  streamUrl: string;
  zones: AiCameraZone[];
}

interface AiCameraResponse {
  accepted: boolean;
  status: string;
  message?: string;
  connected?: boolean;
  latency?: number;
}

export class AiClient {
  private static async request<T>(path: string, body: unknown): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.aiServiceTimeout);

    try {
      const response = await fetch(`${config.aiServiceUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AI-API-Key': config.aiApiKey,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const rawData: unknown = await response.json().catch(() => ({}));
      const data: { detail?: unknown } = rawData && typeof rawData === 'object'
        ? rawData as { detail?: unknown }
        : {};

      if (!response.ok) {
        const message = typeof data.detail === 'string' ? data.detail : `AI service request failed (${response.status})`;
        throw AppError.serviceUnavailable(message);
      }

      return data as T;
    } catch (error) {
      if (error instanceof AppError) throw error;
      const message = error instanceof Error && error.name === 'AbortError'
        ? 'AI service did not respond before the request timed out'
        : 'AI service is unavailable';
      throw AppError.serviceUnavailable(message);
    } finally {
      clearTimeout(timeout);
    }
  }

  static async detect(frameData: string) {
    if (config.aiMode === 'mock') {
      return {
        success: true,
        data: {
          objects: [
            { type: 'PERSON', confidence: 0.95, bbox: [100, 200, 50, 150] },
          ],
        },
      };
    }
    // Call Python FastAPI
    const res = await fetch(`${config.aiServiceUrl}/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ frame: frameData }),
    });
    return res.json();
  }

  static async startCamera(camera: AiCameraConfig): Promise<AiCameraResponse> {
    if (config.aiMode === 'mock') {
      return { accepted: true, status: 'ONLINE', message: 'Mock AI stream started' };
    }
    return this.request<AiCameraResponse>('/cameras/start', {
      camera_id: camera.cameraId,
      bop_id: camera.bopId,
      stream_url: camera.streamUrl,
      zones: camera.zones.map((zone) => ({
        name: zone.name,
        zone_type: zone.zoneType,
        coordinates: zone.coordinates,
      })),
    });
  }

  static async stopCamera(cameraId: string): Promise<AiCameraResponse> {
    if (config.aiMode === 'mock') {
      return { accepted: true, status: 'OFFLINE', message: 'Mock AI stream stopped' };
    }
    return this.request<AiCameraResponse>(`/cameras/${encodeURIComponent(cameraId)}/stop`, {});
  }

  static async testCamera(camera: AiCameraConfig): Promise<AiCameraResponse> {
    if (config.aiMode === 'mock') {
      return { accepted: true, status: 'ONLINE', connected: true, latency: 0, message: 'Mock camera connection succeeded' };
    }
    return this.request<AiCameraResponse>('/cameras/test', {
      camera_id: camera.cameraId,
      stream_url: camera.streamUrl,
    });
  }
}
