"use client";

import React from 'react';
import { Blocks, Layers, Clock, Building2, UserCheck, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { truncateHash } from '@/lib/utils';
import type { Evidence } from '@/types/evidence';

interface BlockchainStatusProps {
  evidence: Evidence;
  className?: string;
}

export function BlockchainStatus({ evidence, className = '' }: BlockchainStatusProps) {
  return (
    <div className={`bg-[#141C24] border border-[#263442] rounded-[10px] p-5 space-y-4 ${className}`}>
      <div className="flex items-center justify-between border-b border-[#263442] pb-3">
        <div className="flex items-center gap-2">
          <Blocks className="w-4 h-4 text-[#37B9FF]" />
          <h3 className="text-sm font-semibold text-[#F3F6F8]">Permissioned Enterprise Ledger Status</h3>
        </div>
        <StatusBadge status={evidence.verificationStatus} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-3 bg-[#0F151C] border border-[#263442] rounded-[8px]">
          <div className="text-[10px] text-[#6E7B87] uppercase font-bold tracking-wider flex items-center gap-1 mb-1">
            <Layers className="w-3.5 h-3.5 text-[#37B9FF]" /> Distributed Ledger
          </div>
          <div className="text-sm font-bold text-[#F3F6F8]">Hyperledger Fabric v2.5</div>
          <div className="text-[10px] text-[#A7B2BD] mt-0.5">Channel: border-surveillance-prod</div>
        </div>

        <div className="p-3 bg-[#0F151C] border border-[#263442] rounded-[8px]">
          <div className="text-[10px] text-[#6E7B87] uppercase font-bold tracking-wider flex items-center gap-1 mb-1">
            <Blocks className="w-3.5 h-3.5 text-[#37B9FF]" /> Transaction Reference
          </div>
          <div className="text-sm font-bold text-[#37B9FF]">{evidence.blockchainTxId}</div>
          <div className="text-[10px] text-[#A7B2BD] mt-0.5">Block Height: #{evidence.blockNumber}</div>
        </div>

        <div className="p-3 bg-[#0F151C] border border-[#263442] rounded-[8px]">
          <div className="text-[10px] text-[#6E7B87] uppercase font-bold tracking-wider flex items-center gap-1 mb-1">
            <Clock className="w-3.5 h-3.5 text-[#37B9FF]" /> Immutable Timestamp
          </div>
          <div className="text-sm font-bold text-[#F3F6F8]">{evidence.timestamp}</div>
          <div className="text-[10px] text-[#39D98A] mt-0.5">Consensus Verified (Raft)</div>
        </div>

        <div className="p-3 bg-[#0F151C] border border-[#263442] rounded-[8px]">
          <div className="text-[10px] text-[#6E7B87] uppercase font-bold tracking-wider flex items-center gap-1 mb-1">
            <Building2 className="w-3.5 h-3.5 text-[#37B9FF]" /> Endorsing Organization
          </div>
          <div className="text-sm font-bold text-[#F3F6F8]">{evidence.recordedOrg}</div>
          <div className="text-[10px] text-[#A7B2BD] mt-0.5">MSPID: BSFMSP</div>
        </div>

        <div className="p-3 bg-[#0F151C] border border-[#263442] rounded-[8px]">
          <div className="text-[10px] text-[#6E7B87] uppercase font-bold tracking-wider flex items-center gap-1 mb-1">
            <UserCheck className="w-3.5 h-3.5 text-[#37B9FF]" /> Certified Operator
          </div>
          <div className="text-sm font-bold text-[#F3F6F8]">{evidence.recordedBy}</div>
          <div className="text-[10px] text-[#A7B2BD] mt-0.5">PKI Certificate: X.509 Validated</div>
        </div>

        <div className="p-3 bg-[#0F151C] border border-[#263442] rounded-[8px]">
          <div className="text-[10px] text-[#6E7B87] uppercase font-bold tracking-wider flex items-center gap-1 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#37B9FF]" /> Cryptographic Seal
          </div>
          <div className="text-sm font-bold text-[#39D98A] truncate">
            {truncateHash(evidence.hash, 8)}
          </div>
          <div className="text-[10px] text-[#A7B2BD] mt-0.5">ECDSA P-256 Signature</div>
        </div>
      </div>
    </div>
  );
}
