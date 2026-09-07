export type EventType =
  | 'PERSON_DETECTED'
  | 'VEHICLE_DETECTED'
  | 'ANPR_MATCH'
  | 'FACE_MATCH'
  | 'INTRUSION'
  | 'LOITERING'
  | 'ABANDONED_OBJECT'
  | 'SUSPICIOUS_ACTIVITY'
  | 'NIGHT_ACTIVITY';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ObjectType = 'PERSON' | 'VEHICLE' | 'FACE' | 'PLATE' | 'OBJECT';

export interface Detection {
  objectType: ObjectType;
  trackId: number;
  confidence: number;
  bbox: { x: number; y: number; w: number; h: number };
  label?: string;
}

export interface IBVAPEvent {
  eventId: string;
  cameraId: string;
  bopId: string;
  timestamp: string;
  eventType: EventType;
  objectType: ObjectType;
  trackId: number;
  confidence: number;
  zone: string;
  severity: Severity;
  threatScore: number;
  evidenceId: string;
  status: 'NEW' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'RESOLVED';
  direction?: string;
}

export interface TimelineEntry {
  time: string;
  description: string;
  type: 'detection' | 'zone' | 'boundary' | 'alert' | 'evidence' | 'blockchain';
}
