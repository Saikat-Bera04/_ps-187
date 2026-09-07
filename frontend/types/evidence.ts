export type EvidenceType = 'SNAPSHOT' | 'VIDEO_CLIP' | 'FRAME' | 'METADATA';

export type VerificationStatus = 'VERIFIED' | 'FAILED' | 'PENDING' | 'NOT_VERIFIED';

export interface Evidence {
  evidenceId: string;
  eventId: string;
  cameraId: string;
  bopId: string;
  evidenceType: EvidenceType;
  timestamp: string;
  hash: string;
  blockchainTxId: string;
  blockNumber: number;
  verificationStatus: VerificationStatus;
  recordedBy: string;
  recordedOrg: string;
  fileUrl?: string;
  fileSizeKB?: number;
}

export interface BlockchainRecord {
  transactionId: string;
  blockNumber: number;
  ledger: string;
  timestamp: string;
  evidenceHash: string;
  recordedOrg: string;
  recordedBy: string;
  channel: string;
  chaincode: string;
}
