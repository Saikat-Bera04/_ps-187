export interface Camera {
  id: string;
  name: string;
  bopId: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  fps: number;
  resolution: string;
  aiStatus: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  lastSeen: string;
  latitude: number;
  longitude: number;
  previewUrl?: string;
  zones?: CameraZone[];
}

export interface CameraZone {
  id?: string;
  name: string;
  zoneType: string;
  coordinates: [number, number][];
}

export interface BOP {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  cameraCount: number;
  status: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';
}
