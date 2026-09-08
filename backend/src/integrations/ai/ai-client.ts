import { config } from '../../config';

export class AiClient {
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
}
