type WSEventType = 'new_alert' | 'new_event' | 'camera_status_changed' | 'evidence_created' | 'blockchain_updated';

interface WSMessage {
  type: WSEventType;
  data: Record<string, unknown>;
  timestamp: string;
}

type WSListener = (msg: WSMessage) => void;

class MockWebSocket {
  private listeners: Map<WSEventType, WSListener[]> = new Map();
  private intervalId: ReturnType<typeof setInterval> | null = null;

  connect() {
    // Simulate periodic incoming events
    this.intervalId = setInterval(() => {
      const types: WSEventType[] = ['new_alert', 'new_event', 'camera_status_changed'];
      const type = types[Math.floor(Math.random() * types.length)];

      const msg: WSMessage = {
        type,
        data: this.generateMockPayload(type),
        timestamp: new Date().toISOString(),
      };

      this.emit(type, msg);
    }, 15000 + Math.random() * 30000); // every 15–45s
  }

  disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  on(event: WSEventType, listener: WSListener) {
    const list = this.listeners.get(event) || [];
    list.push(listener);
    this.listeners.set(event, list);
  }

  off(event: WSEventType, listener: WSListener) {
    const list = this.listeners.get(event) || [];
    this.listeners.set(event, list.filter(l => l !== listener));
  }

  private emit(event: WSEventType, msg: WSMessage) {
    const list = this.listeners.get(event) || [];
    list.forEach(l => l(msg));
  }

  private generateMockPayload(type: WSEventType): Record<string, unknown> {
    const id = Math.floor(10000 + Math.random() * 90000);
    switch (type) {
      case 'new_alert':
        return { alertId: `ALT-${id}`, severity: ['CRITICAL', 'HIGH', 'MEDIUM'][Math.floor(Math.random() * 3)], eventType: 'INTRUSION' };
      case 'new_event':
        return { eventId: `EVT-${id}`, eventType: 'PERSON_DETECTED', cameraId: 'BOP12-CAM04' };
      case 'camera_status_changed':
        return { cameraId: 'BOP21-CAM02', status: 'ONLINE' };
      default:
        return {};
    }
  }
}

export const wsClient = new MockWebSocket();
