import { emitEvent } from './socket';

export const WsEvents = {
  newAlert: (bopId: string, alertData: any) => emitEvent('new_alert', alertData, bopId),
  newEvent: (bopId: string, eventData: any) => emitEvent('new_event', eventData, bopId),
  cameraStatusChanged: (bopId: string, cameraData: any) => emitEvent('camera_status_changed', cameraData, bopId),
  evidenceCreated: (bopId: string, evidenceData: any) => emitEvent('evidence_created', evidenceData, bopId),
  blockchainUpdated: (bopId: string, data: any) => emitEvent('blockchain_updated', data, bopId),
};
