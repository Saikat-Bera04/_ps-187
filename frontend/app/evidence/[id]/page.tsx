"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileCheck, ShieldCheck, Image as ImageIcon, ExternalLink, Search } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { HashVerification } from '@/components/evidence/HashVerification';
import { BlockchainStatus } from '@/components/evidence/BlockchainStatus';
import { getEvidenceById, verifyEvidence } from '@/lib/api';
import type { Evidence } from '@/types/evidence';

export default function EvidenceVerificationPage({ params }: { params: { id: string } }) {
  const [evidence, setEvidence] = useState<Evidence | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getEvidenceById(params.id).then((data) => {
      if (data) setEvidence(data);
      setIsLoading(false);
    });
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-[#A7B2BD] flex items-center justify-center gap-2">
        <span className="w-4 h-4 border-2 border-[#37B9FF] border-t-transparent rounded-full animate-spin" />
        Connecting to Hyperledger Fabric cryptographic peer...
      </div>
    );
  }

  if (!evidence) {
    return (
      <div className="p-8 text-center space-y-3">
        <h2 className="text-base font-bold text-[#FF5C67]">Evidence File Not Found</h2>
        <p className="text-xs text-[#A7B2BD]">No immutable ledger record exists for ID {params.id}.</p>
        <Link
          href="/evidence"
          className="inline-block px-4 py-2 bg-[#18222C] text-xs font-semibold rounded-[7px] text-[#F3F6F8]"
        >
          Return to Evidence Ledger
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence Verification Console"
        subtitle={`Cryptographic integrity and chain-of-custody audit for ${evidence.evidenceId}`}
        breadcrumbs={[
          { label: 'Evidence', href: '/evidence' },
          { label: evidence.evidenceId },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href={`/events/${evidence.eventId}`}
              className="px-3 py-1.5 rounded-[7px] bg-[#18222C] border border-[#344454] text-xs font-semibold text-[#F3F6F8] hover:bg-[#1E2A35] transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#37B9FF]" />
              Linked Event {evidence.eventId}
            </Link>
            <Link
              href={`/investigation?eventId=${evidence.eventId}`}
              className="px-3.5 py-1.5 rounded-[7px] bg-[#37B9FF] hover:bg-[#37B9FF]/90 text-[#071018] text-xs font-bold transition-all shadow-lg flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              Investigate Case
            </Link>
          </div>
        }
      />

      {/* ─── INTERACTIVE HASH VERIFICATION CONSOLE (Section 33) ─── */}
      <HashVerification
        evidence={evidence}
        onVerify={() => verifyEvidence(evidence.evidenceId)}
      />

      {/* ─── ENTERPRISE HYPERLEDGER FABRIC STATUS (Section 34) ─── */}
      <BlockchainStatus evidence={evidence} />

      {/* Forensic Evidence Binary Preview Card */}
      <div className="bg-[#141C24] border border-[#263442] rounded-[10px] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#F3F6F8] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#37B9FF]" />
            Encrypted Evidence Binary Payload
          </h3>
          <span className="text-xs font-mono text-[#A7B2BD]">
            File Size: {evidence.fileSizeKB || 245} KB • Format: PNG / SHA-256
          </span>
        </div>

        <div
          className="relative bg-[#05080B] border border-[#263442] rounded-[8px] overflow-hidden flex items-center justify-center p-8"
          style={{ minHeight: '260px' }}
        >
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#263442_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-16 rounded-xl bg-[#0F151C] border border-[#344454] flex items-center justify-center text-[#37B9FF]">
              <FileCheck className="w-8 h-8" />
            </div>
            <div className="font-mono text-xs text-[#F3F6F8] font-bold">
              {evidence.evidenceId}.secbin
            </div>
            <div className="text-[11px] text-[#A7B2BD] max-w-md font-mono">
              Digest: {evidence.hash}
            </div>
            <div className="text-[10px] text-[#39D98A] font-semibold bg-[#39D98A]/10 px-2.5 py-1 rounded border border-[#39D98A]/20">
              AES-256 ENCRYPTED AT REST • ZERO THIRD-PARTY EXPOSURE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
