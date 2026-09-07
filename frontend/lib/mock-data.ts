import type { Camera, BOP } from '@/types/camera';
import type { IBVAPEvent, TimelineEntry } from '@/types/event';
import type { Alert } from '@/types/alert';
import type { Evidence, BlockchainRecord } from '@/types/evidence';
import type { WatchlistPerson, WatchlistVehicle } from '@/types/watchlist';
import type { SystemHealth, User } from '@/types/system';

// ─── BOPs ────────────────────────────────────────────────
export const mockBOPs: BOP[] = [
  { id: 'BOP-12', name: 'Border Outpost 12', location: 'North Sector', latitude: 26.912, longitude: 75.787, cameraCount: 8, status: 'OPERATIONAL' },
  { id: 'BOP-18', name: 'Border Outpost 18', location: 'East Sector', latitude: 26.845, longitude: 75.854, cameraCount: 6, status: 'OPERATIONAL' },
  { id: 'BOP-21', name: 'Border Outpost 21', location: 'West Sector', latitude: 26.978, longitude: 75.712, cameraCount: 5, status: 'DEGRADED' },
  { id: 'BOP-07', name: 'Border Outpost 07', location: 'South Sector', latitude: 26.801, longitude: 75.823, cameraCount: 4, status: 'OPERATIONAL' },
  { id: 'BOP-33', name: 'Border Outpost 33', location: 'Northeast Sector', latitude: 27.012, longitude: 75.901, cameraCount: 7, status: 'OPERATIONAL' },
];

// ─── CAMERAS ─────────────────────────────────────────────
export const mockCameras: Camera[] = [
  { id: 'BOP12-CAM01', name: 'Main Gate Camera 01', bopId: 'BOP-12', location: 'Main Gate', status: 'ONLINE', fps: 30, resolution: '1920x1080', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 26.912, longitude: 75.787 },
  { id: 'BOP12-CAM02', name: 'Perimeter Camera 02', bopId: 'BOP-12', location: 'East Perimeter', status: 'ONLINE', fps: 25, resolution: '1920x1080', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:18Z', latitude: 26.913, longitude: 75.789 },
  { id: 'BOP12-CAM03', name: 'Watchtower Camera 03', bopId: 'BOP-12', location: 'Watchtower A', status: 'ONLINE', fps: 30, resolution: '2560x1440', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 26.914, longitude: 75.788 },
  { id: 'BOP12-CAM04', name: 'North Fence Camera 04', bopId: 'BOP-12', location: 'North Fence', status: 'ONLINE', fps: 24, resolution: '1920x1080', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 26.916, longitude: 75.786 },
  { id: 'BOP12-CAM05', name: 'South Approach Camera 05', bopId: 'BOP-12', location: 'South Approach', status: 'ONLINE', fps: 25, resolution: '1920x1080', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:19Z', latitude: 26.910, longitude: 75.785 },
  { id: 'BOP12-CAM06', name: 'Vehicle Checkpoint 06', bopId: 'BOP-12', location: 'Checkpoint Alpha', status: 'OFFLINE', fps: 0, resolution: '1920x1080', aiStatus: 'INACTIVE', lastSeen: '2026-09-07T06:42:10Z', latitude: 26.911, longitude: 75.790 },
  { id: 'BOP12-CAM07', name: 'Rear Gate Camera 07', bopId: 'BOP-12', location: 'Rear Gate', status: 'ONLINE', fps: 24, resolution: '1280x720', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 26.909, longitude: 75.784 },
  { id: 'BOP12-CAM08', name: 'Night Vision Camera 08', bopId: 'BOP-12', location: 'North Fence', status: 'ONLINE', fps: 15, resolution: '1920x1080', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:15Z', latitude: 26.917, longitude: 75.787 },
  { id: 'BOP18-CAM01', name: 'Main Gate Camera 01', bopId: 'BOP-18', location: 'Main Gate', status: 'ONLINE', fps: 30, resolution: '1920x1080', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 26.845, longitude: 75.854 },
  { id: 'BOP18-CAM02', name: 'East Perimeter Camera 02', bopId: 'BOP-18', location: 'East Perimeter', status: 'ONLINE', fps: 25, resolution: '1920x1080', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:18Z', latitude: 26.846, longitude: 75.856 },
  { id: 'BOP18-CAM03', name: 'River Crossing Camera 03', bopId: 'BOP-18', location: 'River Crossing', status: 'DEGRADED', fps: 12, resolution: '1280x720', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:16:50Z', latitude: 26.844, longitude: 75.858 },
  { id: 'BOP18-CAM04', name: 'Hilltop Camera 04', bopId: 'BOP-18', location: 'Hilltop B', status: 'ONLINE', fps: 24, resolution: '1920x1080', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 26.847, longitude: 75.852 },
  { id: 'BOP18-CAM05', name: 'West Flank Camera 05', bopId: 'BOP-18', location: 'West Flank', status: 'ONLINE', fps: 25, resolution: '1920x1080', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:19Z', latitude: 26.843, longitude: 75.850 },
  { id: 'BOP18-CAM06', name: 'Vehicle Bay Camera 06', bopId: 'BOP-18', location: 'Vehicle Bay', status: 'ONLINE', fps: 30, resolution: '2560x1440', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 26.848, longitude: 75.855 },
  { id: 'BOP21-CAM01', name: 'Main Entrance Camera 01', bopId: 'BOP-21', location: 'Main Entrance', status: 'ONLINE', fps: 30, resolution: '1920x1080', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 26.978, longitude: 75.712 },
  { id: 'BOP21-CAM02', name: 'Border Road Camera 02', bopId: 'BOP-21', location: 'Border Road', status: 'OFFLINE', fps: 0, resolution: '1920x1080', aiStatus: 'INACTIVE', lastSeen: '2026-09-07T04:10:00Z', latitude: 26.979, longitude: 75.714 },
  { id: 'BOP21-CAM03', name: 'Fence Line Camera 03', bopId: 'BOP-21', location: 'Fence Line West', status: 'ONLINE', fps: 24, resolution: '1920x1080', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 26.977, longitude: 75.710 },
  { id: 'BOP21-CAM04', name: 'Patrol Route Camera 04', bopId: 'BOP-21', location: 'Patrol Route C', status: 'ONLINE', fps: 25, resolution: '1280x720', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:18Z', latitude: 26.980, longitude: 75.711 },
  { id: 'BOP21-CAM05', name: 'Observation Post Camera 05', bopId: 'BOP-21', location: 'Observation Post', status: 'ONLINE', fps: 30, resolution: '2560x1440', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 26.976, longitude: 75.713 },
  { id: 'BOP07-CAM01', name: 'South Gate Camera 01', bopId: 'BOP-07', location: 'South Gate', status: 'ONLINE', fps: 30, resolution: '1920x1080', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 26.801, longitude: 75.823 },
  { id: 'BOP07-CAM02', name: 'Perimeter Camera 02', bopId: 'BOP-07', location: 'South Perimeter', status: 'ONLINE', fps: 25, resolution: '1920x1080', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:18Z', latitude: 26.802, longitude: 75.825 },
  { id: 'BOP07-CAM03', name: 'Outpost Camera 03', bopId: 'BOP-07', location: 'Forward Outpost', status: 'ONLINE', fps: 24, resolution: '1280x720', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 26.800, longitude: 75.821 },
  { id: 'BOP07-CAM04', name: 'Night Watch Camera 04', bopId: 'BOP-07', location: 'South Perimeter', status: 'OFFLINE', fps: 0, resolution: '1920x1080', aiStatus: 'INACTIVE', lastSeen: '2026-09-07T03:20:00Z', latitude: 26.803, longitude: 75.824 },
  { id: 'BOP33-CAM01', name: 'Northeast Gate Camera 01', bopId: 'BOP-33', location: 'NE Gate', status: 'ONLINE', fps: 30, resolution: '1920x1080', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 27.012, longitude: 75.901 },
  { id: 'BOP33-CAM02', name: 'Ridge Camera 02', bopId: 'BOP-33', location: 'Ridge Point', status: 'ONLINE', fps: 25, resolution: '2560x1440', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:18Z', latitude: 27.014, longitude: 75.903 },
  { id: 'BOP33-CAM03', name: 'Valley Camera 03', bopId: 'BOP-33', location: 'Valley Floor', status: 'ONLINE', fps: 24, resolution: '1920x1080', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 27.010, longitude: 75.899 },
  { id: 'BOP33-CAM04', name: 'Bridge Camera 04', bopId: 'BOP-33', location: 'Bridge North', status: 'ONLINE', fps: 30, resolution: '1920x1080', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 27.013, longitude: 75.905 },
  { id: 'BOP33-CAM05', name: 'Outpost Camera 05', bopId: 'BOP-33', location: 'Forward Post NE', status: 'DEGRADED', fps: 10, resolution: '1280x720', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:16:40Z', latitude: 27.015, longitude: 75.902 },
  { id: 'BOP33-CAM06', name: 'Thermal Camera 06', bopId: 'BOP-33', location: 'Ridge Point', status: 'ONLINE', fps: 15, resolution: '640x480', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 27.014, longitude: 75.904 },
  { id: 'BOP33-CAM07', name: 'Wide Angle Camera 07', bopId: 'BOP-33', location: 'NE Perimeter', status: 'ONLINE', fps: 24, resolution: '3840x2160', aiStatus: 'ACTIVE', lastSeen: '2026-09-07T08:17:20Z', latitude: 27.011, longitude: 75.900 },
];

// ─── EVENTS ──────────────────────────────────────────────
export const mockEvents: IBVAPEvent[] = [
  { eventId: 'EVT-10001', cameraId: 'BOP12-CAM04', bopId: 'BOP-12', timestamp: '2026-09-07T02:31:14Z', eventType: 'INTRUSION', objectType: 'PERSON', trackId: 72, confidence: 0.96, zone: 'NORTH_FENCE', severity: 'CRITICAL', threatScore: 91, evidenceId: 'EVD-10001', status: 'NEW' },
  { eventId: 'EVT-10002', cameraId: 'BOP12-CAM01', bopId: 'BOP-12', timestamp: '2026-09-07T03:14:22Z', eventType: 'VEHICLE_DETECTED', objectType: 'VEHICLE', trackId: 73, confidence: 0.92, zone: 'MAIN_GATE', severity: 'MEDIUM', threatScore: 45, evidenceId: 'EVD-10002', status: 'ACKNOWLEDGED' },
  { eventId: 'EVT-10003', cameraId: 'BOP18-CAM03', bopId: 'BOP-18', timestamp: '2026-09-07T03:45:08Z', eventType: 'PERSON_DETECTED', objectType: 'PERSON', trackId: 74, confidence: 0.88, zone: 'RIVER_CROSSING', severity: 'HIGH', threatScore: 72, evidenceId: 'EVD-10003', status: 'INVESTIGATING' },
  { eventId: 'EVT-10004', cameraId: 'BOP21-CAM03', bopId: 'BOP-21', timestamp: '2026-09-07T04:02:33Z', eventType: 'LOITERING', objectType: 'PERSON', trackId: 75, confidence: 0.84, zone: 'FENCE_LINE_WEST', severity: 'HIGH', threatScore: 68, evidenceId: 'EVD-10004', status: 'NEW' },
  { eventId: 'EVT-10005', cameraId: 'BOP12-CAM02', bopId: 'BOP-12', timestamp: '2026-09-07T04:18:41Z', eventType: 'SUSPICIOUS_ACTIVITY', objectType: 'PERSON', trackId: 76, confidence: 0.91, zone: 'EAST_PERIMETER', severity: 'CRITICAL', threatScore: 88, evidenceId: 'EVD-10005', status: 'NEW' },
  { eventId: 'EVT-10006', cameraId: 'BOP33-CAM01', bopId: 'BOP-33', timestamp: '2026-09-07T04:55:19Z', eventType: 'ANPR_MATCH', objectType: 'PLATE', trackId: 77, confidence: 0.97, zone: 'NE_GATE', severity: 'HIGH', threatScore: 75, evidenceId: 'EVD-10006', status: 'ACKNOWLEDGED' },
  { eventId: 'EVT-10007', cameraId: 'BOP18-CAM01', bopId: 'BOP-18', timestamp: '2026-09-07T05:12:05Z', eventType: 'FACE_MATCH', objectType: 'FACE', trackId: 78, confidence: 0.93, zone: 'MAIN_GATE', severity: 'CRITICAL', threatScore: 95, evidenceId: 'EVD-10007', status: 'INVESTIGATING' },
  { eventId: 'EVT-10008', cameraId: 'BOP07-CAM01', bopId: 'BOP-07', timestamp: '2026-09-07T05:30:47Z', eventType: 'VEHICLE_DETECTED', objectType: 'VEHICLE', trackId: 79, confidence: 0.89, zone: 'SOUTH_GATE', severity: 'LOW', threatScore: 22, evidenceId: 'EVD-10008', status: 'RESOLVED' },
  { eventId: 'EVT-10009', cameraId: 'BOP12-CAM08', bopId: 'BOP-12', timestamp: '2026-09-07T05:48:33Z', eventType: 'NIGHT_ACTIVITY', objectType: 'PERSON', trackId: 80, confidence: 0.85, zone: 'NORTH_FENCE', severity: 'HIGH', threatScore: 70, evidenceId: 'EVD-10009', status: 'NEW' },
  { eventId: 'EVT-10010', cameraId: 'BOP33-CAM02', bopId: 'BOP-33', timestamp: '2026-09-07T06:05:12Z', eventType: 'INTRUSION', objectType: 'PERSON', trackId: 81, confidence: 0.94, zone: 'RIDGE_POINT', severity: 'CRITICAL', threatScore: 89, evidenceId: 'EVD-10010', status: 'NEW' },
  { eventId: 'EVT-10011', cameraId: 'BOP18-CAM05', bopId: 'BOP-18', timestamp: '2026-09-07T06:22:50Z', eventType: 'ABANDONED_OBJECT', objectType: 'OBJECT', trackId: 82, confidence: 0.78, zone: 'WEST_FLANK', severity: 'MEDIUM', threatScore: 55, evidenceId: 'EVD-10011', status: 'ACKNOWLEDGED' },
  { eventId: 'EVT-10012', cameraId: 'BOP21-CAM01', bopId: 'BOP-21', timestamp: '2026-09-07T06:40:15Z', eventType: 'PERSON_DETECTED', objectType: 'PERSON', trackId: 83, confidence: 0.90, zone: 'MAIN_ENTRANCE', severity: 'LOW', threatScore: 18, evidenceId: 'EVD-10012', status: 'RESOLVED' },
  { eventId: 'EVT-10013', cameraId: 'BOP12-CAM03', bopId: 'BOP-12', timestamp: '2026-09-07T07:01:28Z', eventType: 'SUSPICIOUS_ACTIVITY', objectType: 'PERSON', trackId: 84, confidence: 0.87, zone: 'WATCHTOWER_A', severity: 'HIGH', threatScore: 74, evidenceId: 'EVD-10013', status: 'INVESTIGATING' },
  { eventId: 'EVT-10014', cameraId: 'BOP33-CAM04', bopId: 'BOP-33', timestamp: '2026-09-07T07:18:42Z', eventType: 'VEHICLE_DETECTED', objectType: 'VEHICLE', trackId: 85, confidence: 0.91, zone: 'BRIDGE_NORTH', severity: 'MEDIUM', threatScore: 42, evidenceId: 'EVD-10014', status: 'ACKNOWLEDGED' },
  { eventId: 'EVT-10015', cameraId: 'BOP07-CAM03', bopId: 'BOP-07', timestamp: '2026-09-07T07:35:55Z', eventType: 'INTRUSION', objectType: 'PERSON', trackId: 86, confidence: 0.95, zone: 'FORWARD_OUTPOST', severity: 'CRITICAL', threatScore: 92, evidenceId: 'EVD-10015', status: 'NEW' },
  { eventId: 'EVT-10016', cameraId: 'BOP18-CAM04', bopId: 'BOP-18', timestamp: '2026-09-07T07:50:10Z', eventType: 'PERSON_DETECTED', objectType: 'PERSON', trackId: 87, confidence: 0.86, zone: 'HILLTOP_B', severity: 'LOW', threatScore: 25, evidenceId: 'EVD-10016', status: 'RESOLVED' },
  { eventId: 'EVT-10017', cameraId: 'BOP12-CAM05', bopId: 'BOP-12', timestamp: '2026-09-07T08:02:30Z', eventType: 'LOITERING', objectType: 'PERSON', trackId: 88, confidence: 0.82, zone: 'SOUTH_APPROACH', severity: 'MEDIUM', threatScore: 48, evidenceId: 'EVD-10017', status: 'ACKNOWLEDGED' },
  { eventId: 'EVT-10018', cameraId: 'BOP33-CAM03', bopId: 'BOP-33', timestamp: '2026-09-07T08:08:44Z', eventType: 'FACE_MATCH', objectType: 'FACE', trackId: 89, confidence: 0.96, zone: 'VALLEY_FLOOR', severity: 'CRITICAL', threatScore: 94, evidenceId: 'EVD-10018', status: 'NEW' },
  { eventId: 'EVT-10019', cameraId: 'BOP21-CAM04', bopId: 'BOP-21', timestamp: '2026-09-07T08:10:20Z', eventType: 'ANPR_MATCH', objectType: 'PLATE', trackId: 90, confidence: 0.98, zone: 'PATROL_ROUTE_C', severity: 'HIGH', threatScore: 71, evidenceId: 'EVD-10019', status: 'NEW' },
  { eventId: 'EVT-10020', cameraId: 'BOP07-CAM02', bopId: 'BOP-07', timestamp: '2026-09-07T08:14:55Z', eventType: 'PERSON_DETECTED', objectType: 'PERSON', trackId: 91, confidence: 0.88, zone: 'SOUTH_PERIMETER', severity: 'LOW', threatScore: 20, evidenceId: 'EVD-10020', status: 'RESOLVED' },
];

// ─── ALERTS ──────────────────────────────────────────────
export const mockAlerts: Alert[] = [
  { alertId: 'ALT-10001', eventId: 'EVT-10001', cameraId: 'BOP12-CAM04', bopId: 'BOP-12', timestamp: '2026-09-07T02:31:15Z', eventType: 'INTRUSION', severity: 'CRITICAL', threatScore: 91, status: 'NEW', description: 'Unauthorized person detected crossing north fence boundary at BOP-12.' },
  { alertId: 'ALT-10002', eventId: 'EVT-10005', cameraId: 'BOP12-CAM02', bopId: 'BOP-12', timestamp: '2026-09-07T04:18:42Z', eventType: 'SUSPICIOUS_ACTIVITY', severity: 'CRITICAL', threatScore: 88, status: 'NEW', description: 'Suspicious movement pattern detected along east perimeter at BOP-12.' },
  { alertId: 'ALT-10003', eventId: 'EVT-10007', cameraId: 'BOP18-CAM01', bopId: 'BOP-18', timestamp: '2026-09-07T05:12:06Z', eventType: 'FACE_MATCH', severity: 'CRITICAL', threatScore: 95, status: 'INVESTIGATING', description: 'Watchlist face match detected at main gate of BOP-18.', assignedTo: 'Operator Sharma' },
  { alertId: 'ALT-10004', eventId: 'EVT-10003', cameraId: 'BOP18-CAM03', bopId: 'BOP-18', timestamp: '2026-09-07T03:45:09Z', eventType: 'PERSON_DETECTED', severity: 'HIGH', threatScore: 72, status: 'INVESTIGATING', description: 'Person detected near river crossing at BOP-18.', assignedTo: 'Operator Verma' },
  { alertId: 'ALT-10005', eventId: 'EVT-10004', cameraId: 'BOP21-CAM03', bopId: 'BOP-21', timestamp: '2026-09-07T04:02:34Z', eventType: 'LOITERING', severity: 'HIGH', threatScore: 68, status: 'NEW', description: 'Loitering detected at west fence line of BOP-21.' },
  { alertId: 'ALT-10006', eventId: 'EVT-10006', cameraId: 'BOP33-CAM01', bopId: 'BOP-33', timestamp: '2026-09-07T04:55:20Z', eventType: 'ANPR_MATCH', severity: 'HIGH', threatScore: 75, status: 'ACKNOWLEDGED', description: 'Watchlist vehicle plate matched at NE gate of BOP-33.' },
  { alertId: 'ALT-10007', eventId: 'EVT-10010', cameraId: 'BOP33-CAM02', bopId: 'BOP-33', timestamp: '2026-09-07T06:05:13Z', eventType: 'INTRUSION', severity: 'CRITICAL', threatScore: 89, status: 'NEW', description: 'Perimeter intrusion detected at ridge point of BOP-33.' },
  { alertId: 'ALT-10008', eventId: 'EVT-10015', cameraId: 'BOP07-CAM03', bopId: 'BOP-07', timestamp: '2026-09-07T07:35:56Z', eventType: 'INTRUSION', severity: 'CRITICAL', threatScore: 92, status: 'NEW', description: 'Intrusion detected at forward outpost of BOP-07.' },
  { alertId: 'ALT-10009', eventId: 'EVT-10018', cameraId: 'BOP33-CAM03', bopId: 'BOP-33', timestamp: '2026-09-07T08:08:45Z', eventType: 'FACE_MATCH', severity: 'CRITICAL', threatScore: 94, status: 'NEW', description: 'Watchlist face match detected at valley floor of BOP-33.' },
  { alertId: 'ALT-10010', eventId: 'EVT-10009', cameraId: 'BOP12-CAM08', bopId: 'BOP-12', timestamp: '2026-09-07T05:48:34Z', eventType: 'NIGHT_ACTIVITY', severity: 'HIGH', threatScore: 70, status: 'NEW', description: 'Unauthorized night activity detected along north fence at BOP-12.' },
  { alertId: 'ALT-10011', eventId: 'EVT-10002', cameraId: 'BOP12-CAM01', bopId: 'BOP-12', timestamp: '2026-09-07T03:14:23Z', eventType: 'VEHICLE_DETECTED', severity: 'MEDIUM', threatScore: 45, status: 'ACKNOWLEDGED', description: 'Unregistered vehicle detected at main gate of BOP-12.' },
  { alertId: 'ALT-10012', eventId: 'EVT-10019', cameraId: 'BOP21-CAM04', bopId: 'BOP-21', timestamp: '2026-09-07T08:10:21Z', eventType: 'ANPR_MATCH', severity: 'HIGH', threatScore: 71, status: 'NEW', description: 'Watchlist plate match detected on patrol route C at BOP-21.' },
];

// ─── EVIDENCE ────────────────────────────────────────────
export const mockEvidence: Evidence[] = [
  { evidenceId: 'EVD-10001', eventId: 'EVT-10001', cameraId: 'BOP12-CAM04', bopId: 'BOP-12', evidenceType: 'SNAPSHOT', timestamp: '2026-09-07T02:31:16Z', hash: 'a94f2e8b1c3d5e7f9a2b4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e72bc', blockchainTxId: 'TX-8F72A91', blockNumber: 14523, verificationStatus: 'VERIFIED', recordedBy: 'BOP Operator', recordedOrg: 'BSF-BOP12', fileSizeKB: 245 },
  { evidenceId: 'EVD-10002', eventId: 'EVT-10002', cameraId: 'BOP12-CAM01', bopId: 'BOP-12', evidenceType: 'VIDEO_CLIP', timestamp: '2026-09-07T03:14:24Z', hash: 'b85e3f9c2d4a6b8c0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e', blockchainTxId: 'TX-A3B5C91', blockNumber: 14524, verificationStatus: 'VERIFIED', recordedBy: 'BOP Operator', recordedOrg: 'BSF-BOP12', fileSizeKB: 1840 },
  { evidenceId: 'EVD-10003', eventId: 'EVT-10003', cameraId: 'BOP18-CAM03', bopId: 'BOP-18', evidenceType: 'SNAPSHOT', timestamp: '2026-09-07T03:45:10Z', hash: 'c76d4e0a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f', blockchainTxId: 'TX-D7E9F12', blockNumber: 14525, verificationStatus: 'VERIFIED', recordedBy: 'BOP Operator', recordedOrg: 'BSF-BOP18', fileSizeKB: 312 },
  { evidenceId: 'EVD-10004', eventId: 'EVT-10004', cameraId: 'BOP21-CAM03', bopId: 'BOP-21', evidenceType: 'VIDEO_CLIP', timestamp: '2026-09-07T04:02:35Z', hash: 'd67e5f1b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a', blockchainTxId: 'TX-F1A3B56', blockNumber: 14526, verificationStatus: 'PENDING', recordedBy: 'BOP Operator', recordedOrg: 'BSF-BOP21', fileSizeKB: 2100 },
  { evidenceId: 'EVD-10005', eventId: 'EVT-10005', cameraId: 'BOP12-CAM02', bopId: 'BOP-12', evidenceType: 'SNAPSHOT', timestamp: '2026-09-07T04:18:43Z', hash: 'e58f6a2c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b', blockchainTxId: 'TX-C5D7E90', blockNumber: 14527, verificationStatus: 'VERIFIED', recordedBy: 'BOP Operator', recordedOrg: 'BSF-BOP12', fileSizeKB: 278 },
  { evidenceId: 'EVD-10006', eventId: 'EVT-10006', cameraId: 'BOP33-CAM01', bopId: 'BOP-33', evidenceType: 'FRAME', timestamp: '2026-09-07T04:55:21Z', hash: 'f49a7b3d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c', blockchainTxId: 'TX-B9C1D34', blockNumber: 14528, verificationStatus: 'VERIFIED', recordedBy: 'BOP Operator', recordedOrg: 'BSF-BOP33', fileSizeKB: 156 },
  { evidenceId: 'EVD-10007', eventId: 'EVT-10007', cameraId: 'BOP18-CAM01', bopId: 'BOP-18', evidenceType: 'SNAPSHOT', timestamp: '2026-09-07T05:12:07Z', hash: 'a30b8c4e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d', blockchainTxId: 'TX-E3F5A78', blockNumber: 14529, verificationStatus: 'VERIFIED', recordedBy: 'BOP Operator', recordedOrg: 'BSF-BOP18', fileSizeKB: 290 },
  { evidenceId: 'EVD-10010', eventId: 'EVT-10010', cameraId: 'BOP33-CAM02', bopId: 'BOP-33', evidenceType: 'SNAPSHOT', timestamp: '2026-09-07T06:05:14Z', hash: 'b21c9d5f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e', blockchainTxId: 'TX-A7B9C12', blockNumber: 14532, verificationStatus: 'FAILED', recordedBy: 'BOP Operator', recordedOrg: 'BSF-BOP33', fileSizeKB: 267 },
  { evidenceId: 'EVD-10015', eventId: 'EVT-10015', cameraId: 'BOP07-CAM03', bopId: 'BOP-07', evidenceType: 'VIDEO_CLIP', timestamp: '2026-09-07T07:35:57Z', hash: 'c12d0e6a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f', blockchainTxId: 'TX-D1E3F56', blockNumber: 14537, verificationStatus: 'VERIFIED', recordedBy: 'BOP Operator', recordedOrg: 'BSF-BOP07', fileSizeKB: 1920 },
  { evidenceId: 'EVD-10018', eventId: 'EVT-10018', cameraId: 'BOP33-CAM03', bopId: 'BOP-33', evidenceType: 'SNAPSHOT', timestamp: '2026-09-07T08:08:46Z', hash: 'd03e1f7b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a', blockchainTxId: 'TX-F5A7B90', blockNumber: 14540, verificationStatus: 'PENDING', recordedBy: 'BOP Operator', recordedOrg: 'BSF-BOP33', fileSizeKB: 301 },
];

// ─── EVT-10001 TIMELINE ──────────────────────────────────
export const mockTimeline: TimelineEntry[] = [
  { time: '02:31:10', description: 'Person detected by AI engine', type: 'detection' },
  { time: '02:31:11', description: 'Person entered restricted zone NORTH_FENCE', type: 'zone' },
  { time: '02:31:14', description: 'Virtual fence boundary crossed — Intrusion event generated', type: 'boundary' },
  { time: '02:31:15', description: 'Critical alert ALT-10001 created — Threat score: 91', type: 'alert' },
  { time: '02:31:16', description: 'Snapshot evidence EVD-10001 captured', type: 'evidence' },
  { time: '02:31:17', description: 'Blockchain record TX-8F72A91 created on Hyperledger Fabric', type: 'blockchain' },
];

// ─── WATCHLIST ───────────────────────────────────────────
export const mockWatchlistPersons: WatchlistPerson[] = [
  { referenceId: 'WLP-001', name: 'Subject Alpha', status: 'ACTIVE', lastMatch: '2026-09-07T05:12:05Z', addedAt: '2026-08-15T10:00:00Z', addedBy: 'Commander Singh', category: 'HIGH PRIORITY', description: 'Subject of ongoing investigation.' },
  { referenceId: 'WLP-002', name: 'Subject Bravo', status: 'ACTIVE', lastMatch: '2026-09-07T08:08:44Z', addedAt: '2026-08-20T14:30:00Z', addedBy: 'Analyst Patel', category: 'HIGH PRIORITY' },
  { referenceId: 'WLP-003', name: 'Subject Charlie', status: 'ACTIVE', lastMatch: null, addedAt: '2026-08-25T09:00:00Z', addedBy: 'Commander Singh', category: 'MEDIUM PRIORITY' },
  { referenceId: 'WLP-004', name: 'Subject Delta', status: 'INACTIVE', lastMatch: '2026-08-30T02:15:00Z', addedAt: '2026-07-10T11:00:00Z', addedBy: 'Analyst Verma', category: 'LOW PRIORITY' },
  { referenceId: 'WLP-005', name: 'Subject Echo', status: 'ACTIVE', lastMatch: null, addedAt: '2026-09-01T08:00:00Z', addedBy: 'Commander Gupta', category: 'HIGH PRIORITY' },
];

export const mockWatchlistVehicles: WatchlistVehicle[] = [
  { vehicleId: 'WLV-001', numberPlate: 'RJ-14-AB-1234', vehicleType: 'SUV', status: 'ACTIVE', lastMatch: '2026-09-07T04:55:19Z', addedAt: '2026-08-12T10:00:00Z', addedBy: 'Commander Singh', category: 'HIGH PRIORITY' },
  { vehicleId: 'WLV-002', numberPlate: 'RJ-27-CD-5678', vehicleType: 'Truck', status: 'ACTIVE', lastMatch: '2026-09-07T08:10:20Z', addedAt: '2026-08-18T15:00:00Z', addedBy: 'Analyst Patel', category: 'HIGH PRIORITY' },
  { vehicleId: 'WLV-003', numberPlate: 'HR-26-EF-9012', vehicleType: 'Sedan', status: 'ACTIVE', lastMatch: null, addedAt: '2026-08-22T09:30:00Z', addedBy: 'Analyst Verma', category: 'MEDIUM PRIORITY' },
  { vehicleId: 'WLV-004', numberPlate: 'PB-10-GH-3456', vehicleType: 'Pickup', status: 'INACTIVE', lastMatch: '2026-08-28T23:10:00Z', addedAt: '2026-07-05T12:00:00Z', addedBy: 'Commander Gupta', category: 'LOW PRIORITY' },
];

// ─── SYSTEM HEALTH ───────────────────────────────────────
export const mockSystemHealth: SystemHealth = {
  services: [
    { name: 'API Gateway', status: 'ONLINE', latency: 12, lastCheck: '2026-09-07T08:17:20Z', uptime: 99.98 },
    { name: 'Database', status: 'ONLINE', latency: 8, lastCheck: '2026-09-07T08:17:20Z', uptime: 99.99 },
    { name: 'Redis Cache', status: 'ONLINE', latency: 2, lastCheck: '2026-09-07T08:17:20Z', uptime: 99.99 },
    { name: 'AI Engine', status: 'ONLINE', latency: 45, lastCheck: '2026-09-07T08:17:20Z', uptime: 99.95 },
    { name: 'Blockchain Node', status: 'ONLINE', latency: 120, lastCheck: '2026-09-07T08:17:20Z', uptime: 99.92 },
    { name: 'Evidence Storage', status: 'ONLINE', latency: 18, lastCheck: '2026-09-07T08:17:20Z', uptime: 99.97 },
    { name: 'WebSocket Server', status: 'ONLINE', latency: 5, lastCheck: '2026-09-07T08:17:20Z', uptime: 99.96 },
  ],
  hardware: { cpu: 42, ram: 68, gpu: 71, storage: 54 },
  cameraSummary: { total: 30, online: 26, offline: 3, warning: 1 },
  aiMetrics: { inferenceFps: 28.4, inferenceLatency: 34 },
  infrastructure: { eventProcessingRate: 1247, apiResponseTime: 12 },
};

// ─── CURRENT USER ────────────────────────────────────────
export const mockUser: User = {
  id: 'USR-001',
  name: 'Saikat Bera',
  email: 'saikat.bera@ibvap.gov.in',
  role: 'OPERATOR',
};

// ─── ANALYTICS CHART DATA ────────────────────────────────
export const mockAnalyticsAlertsByHour = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  critical: Math.floor(Math.random() * 4),
  high: Math.floor(Math.random() * 6),
  medium: Math.floor(Math.random() * 8),
  low: Math.floor(Math.random() * 10),
}));

export const mockAnalyticsEventsByDay = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return {
    date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    persons: 40 + Math.floor(Math.random() * 30),
    vehicles: 15 + Math.floor(Math.random() * 15),
    intrusions: Math.floor(Math.random() * 8),
    anpr: Math.floor(Math.random() * 5),
  };
});

export const mockThreatDistribution = [
  { name: 'Critical', value: 6, color: '#FF5C67' },
  { name: 'High', value: 8, color: '#FF8A4C' },
  { name: 'Medium', value: 5, color: '#F4C95D' },
  { name: 'Low', value: 5, color: '#63A8FF' },
];

export const mockBopEvents = mockBOPs.map(bop => ({
  name: bop.id,
  events: 10 + Math.floor(Math.random() * 40),
  alerts: Math.floor(Math.random() * 12),
}));
