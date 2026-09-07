import {
  mockCameras,
  mockBOPs,
  mockEvents,
  mockAlerts,
  mockEvidence,
  mockWatchlistPersons,
  mockWatchlistVehicles,
  mockSystemHealth,
  mockTimeline,
  mockAnalyticsAlertsByHour,
  mockAnalyticsEventsByDay,
  mockThreatDistribution,
  mockBopEvents,
  mockUser,
} from './mock-data';
import type { Camera, BOP } from '@/types/camera';
import type { IBVAPEvent, TimelineEntry } from '@/types/event';
import type { Alert, AlertStatus } from '@/types/alert';
import type { Evidence } from '@/types/evidence';
import type { WatchlistPerson, WatchlistVehicle } from '@/types/watchlist';
import type { SystemHealth, User } from '@/types/system';

// In-memory mutable copies for interactive prototype demonstrations
let camerasState: Camera[] = [...mockCameras];
let alertsState: Alert[] = [...mockAlerts];
let eventsState: IBVAPEvent[] = [...mockEvents];
let evidenceState: Evidence[] = [...mockEvidence];
let watchlistPersonsState: WatchlistPerson[] = [...mockWatchlistPersons];
let watchlistVehiclesState: WatchlistVehicle[] = [...mockWatchlistVehicles];

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Dashboard (Section 21-22) ──────────────────────────
export async function getDashboardStats() {
  await delay(120);
  const totalCameras = camerasState.length;
  const onlineCameras = camerasState.filter((c) => c.status === 'ONLINE').length;
  const offlineCameras = camerasState.filter((c) => c.status === 'OFFLINE').length;
  const activeAlerts = alertsState.filter((a) => a.status !== 'RESOLVED').length;
  const criticalAlerts = alertsState.filter((a) => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length;
  const eventsToday = eventsState.length;

  return {
    totalCameras,
    onlineCameras,
    offlineCameras,
    activeAlerts,
    criticalAlerts,
    eventsToday,
  };
}

// ─── Cameras (Section 24-26) ─────────────────────────────
export async function getCameras(): Promise<Camera[]> {
  await delay(150);
  return [...camerasState];
}

export async function getCamera(id: string): Promise<Camera | undefined> {
  await delay(100);
  return camerasState.find((c) => c.id === id);
}

export async function addCamera(newCam: Omit<Camera, 'id' | 'lastSeen'> & { id?: string; lastSeen?: string }): Promise<Camera> {
  await delay(200);
  const id = newCam.id || `BOP12-CAM${String(camerasState.length + 1).padStart(2, '0')}`;
  const camera: Camera = {
    ...newCam,
    id,
    lastSeen: new Date().toISOString(),
  };
  camerasState = [camera, ...camerasState];
  return camera;
}

export async function deleteCamera(id: string): Promise<boolean> {
  await delay(200);
  camerasState = camerasState.filter((c) => c.id !== id);
  return true;
}

export async function toggleCameraStatus(id: string): Promise<Camera | undefined> {
  await delay(150);
  const cam = camerasState.find((c) => c.id === id);
  if (cam) {
    cam.status = cam.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    cam.aiStatus = cam.status === 'ONLINE' ? 'ACTIVE' : 'INACTIVE';
  }
  return cam;
}

// ─── Events (Section 29-30) ──────────────────────────────
export async function getEvents(): Promise<IBVAPEvent[]> {
  await delay(150);
  return [...eventsState];
}

export async function getEvent(id: string): Promise<IBVAPEvent | undefined> {
  await delay(100);
  return eventsState.find((e) => e.eventId === id);
}

export async function getEventTimeline(eventId: string): Promise<TimelineEntry[]> {
  await delay(120);
  return mockTimeline;
}

// ─── Alerts (Section 27-28) ──────────────────────────────
export async function getAlerts(): Promise<Alert[]> {
  await delay(150);
  return [...alertsState];
}

export async function updateAlertStatus(alertId: string, status: AlertStatus): Promise<Alert | undefined> {
  await delay(150);
  const alert = alertsState.find((a) => a.alertId === alertId);
  if (alert) {
    alert.status = status;
    if (status === 'RESOLVED') {
      alert.resolvedAt = new Date().toISOString();
    }
  }
  return alert;
}

// ─── Evidence (Section 32-33) ────────────────────────────
export async function getEvidence(): Promise<Evidence[]> {
  await delay(150);
  return [...evidenceState];
}

export async function getEvidenceById(id: string): Promise<Evidence | undefined> {
  await delay(100);
  return evidenceState.find((e) => e.evidenceId === id);
}

export async function verifyEvidence(id: string): Promise<{
  verified: boolean;
  currentHash: string;
  blockchainHash: string;
  timestamp: string;
  blockNumber: number;
  txId: string;
  recordedBy: string;
  recordedOrg: string;
}> {
  await delay(1200); // realistic cryptographic re-hash simulation delay
  const evidence = evidenceState.find((e) => e.evidenceId === id);
  if (!evidence) {
    return {
      verified: false,
      currentHash: '',
      blockchainHash: '',
      timestamp: new Date().toISOString(),
      blockNumber: 0,
      txId: '',
      recordedBy: '',
      recordedOrg: '',
    };
  }

  const verified = evidence.verificationStatus !== 'FAILED';
  const blockchainHash = verified
    ? evidence.hash
    : 'b21c9d5f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e' + 'tampered_mismatch';

  if (verified) {
    evidence.verificationStatus = 'VERIFIED';
  }

  return {
    verified,
    currentHash: evidence.hash,
    blockchainHash,
    timestamp: evidence.timestamp,
    blockNumber: evidence.blockNumber,
    txId: evidence.blockchainTxId,
    recordedBy: evidence.recordedBy,
    recordedOrg: evidence.recordedOrg,
  };
}

// ─── Watchlist (Section 36) ──────────────────────────────
export async function getWatchlist(): Promise<{
  persons: WatchlistPerson[];
  vehicles: WatchlistVehicle[];
}> {
  await delay(150);
  return {
    persons: [...watchlistPersonsState],
    vehicles: [...watchlistVehiclesState],
  };
}

export async function addWatchlistPerson(person: Omit<WatchlistPerson, 'referenceId' | 'addedAt'>): Promise<WatchlistPerson> {
  await delay(200);
  const newPerson: WatchlistPerson = {
    ...person,
    referenceId: `WLP-${String(watchlistPersonsState.length + 1).padStart(3, '0')}`,
    addedAt: new Date().toISOString(),
  };
  watchlistPersonsState = [newPerson, ...watchlistPersonsState];
  return newPerson;
}

export async function addWatchlistVehicle(vehicle: Omit<WatchlistVehicle, 'vehicleId' | 'addedAt'>): Promise<WatchlistVehicle> {
  await delay(200);
  const newVehicle: WatchlistVehicle = {
    ...vehicle,
    vehicleId: `WLV-${String(watchlistVehiclesState.length + 1).padStart(3, '0')}`,
    addedAt: new Date().toISOString(),
  };
  watchlistVehiclesState = [newVehicle, ...watchlistVehiclesState];
  return newVehicle;
}

// ─── Analytics (Section 37) ──────────────────────────────
export async function getAnalytics() {
  await delay(200);
  return {
    alertsByHour: mockAnalyticsAlertsByHour,
    eventsByDay: mockAnalyticsEventsByDay,
    threatDistribution: mockThreatDistribution,
    bopEvents: mockBopEvents,
  };
}

// ─── System Health (Section 38) ──────────────────────────
export async function getSystemHealth(): Promise<SystemHealth> {
  await delay(150);
  return mockSystemHealth;
}

// ─── BOPs & User ─────────────────────────────────────────
export async function getBOPs(): Promise<BOP[]> {
  await delay(120);
  return mockBOPs;
}

export async function getCurrentUser(): Promise<User> {
  await delay(80);
  return mockUser;
}

// ─── Global Search (Section 40) ──────────────────────────
export async function globalSearch(query: string) {
  await delay(100);
  const q = query.toLowerCase().trim();
  if (!q) return { cameras: [], alerts: [], events: [], evidence: [], watchlist: [] };

  const matchedCameras = camerasState.filter(
    (c) => c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q)
  );
  const matchedAlerts = alertsState.filter(
    (a) => a.alertId.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.bopId.toLowerCase().includes(q)
  );
  const matchedEvents = eventsState.filter(
    (e) => e.eventId.toLowerCase().includes(q) || e.eventType.toLowerCase().includes(q) || e.zone.toLowerCase().includes(q)
  );
  const matchedEvidence = evidenceState.filter(
    (ev) => ev.evidenceId.toLowerCase().includes(q) || ev.blockchainTxId.toLowerCase().includes(q) || ev.hash.toLowerCase().includes(q)
  );
  const matchedWatchlist = [
    ...watchlistPersonsState.filter((p) => p.name.toLowerCase().includes(q) || p.referenceId.toLowerCase().includes(q)),
    ...watchlistVehiclesState.filter((v) => v.numberPlate.toLowerCase().includes(q) || v.vehicleId.toLowerCase().includes(q)),
  ];

  return {
    cameras: matchedCameras,
    alerts: matchedAlerts,
    events: matchedEvents,
    evidence: matchedEvidence,
    watchlist: matchedWatchlist,
  };
}
