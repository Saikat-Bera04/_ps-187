/*
 * IBVAP Evidence — On-chain data interface
 *
 * This is the structure stored on the Fabric ledger.
 * Only metadata and the SHA-256 hash go on-chain.
 * Actual files (images/videos) remain in local/MinIO storage.
 */

export interface Evidence {
  docType: string;
  evidenceId: string;
  eventId: string;
  cameraId: string;
  bopId: string;
  sha256: string;
  timestamp: string;
  registeredBy: string;
  status: 'REGISTERED' | 'VERIFIED' | 'TAMPER_DETECTED';
}
