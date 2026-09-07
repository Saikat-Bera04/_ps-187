import { Severity } from './event';

export type AlertStatus = 'NEW' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED' | 'ESCALATED';

export interface Alert {
  alertId: string;
  eventId: string;
  cameraId: string;
  bopId: string;
  timestamp: string;
  eventType: string;
  severity: Severity;
  threatScore: number;
  status: AlertStatus;
  description: string;
  assignedTo?: string;
  resolvedAt?: string;
}
