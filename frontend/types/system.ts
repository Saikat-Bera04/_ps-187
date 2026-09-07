export type ServiceStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE';

export interface ServiceHealth {
  name: string;
  status: ServiceStatus;
  latency: number;
  lastCheck: string;
  uptime: number;
}

export interface HardwareMetrics {
  cpu: number;
  ram: number;
  gpu: number;
  storage: number;
}

export interface SystemHealth {
  services: ServiceHealth[];
  hardware: HardwareMetrics;
  cameraSummary: {
    total: number;
    online: number;
    offline: number;
    warning: number;
  };
  aiMetrics: {
    inferenceFps: number;
    inferenceLatency: number;
  };
  infrastructure: {
    eventProcessingRate: number;
    apiResponseTime: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'OPERATOR' | 'COMMANDER' | 'ANALYST' | 'INVESTIGATOR' | 'AUDITOR' | 'ADMIN';
  avatar?: string;
}
