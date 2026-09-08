/*
 * IBVAP Evidence Chaincode — Entry Point
 *
 * Exports the EvidenceContract for Fabric peer to discover.
 */

import { EvidenceContract } from './evidence-contract';

export { EvidenceContract } from './evidence-contract';
export const contracts: any[] = [EvidenceContract];
