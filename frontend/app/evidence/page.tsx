"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FileCheck, Search, Filter, Copy, Check, ExternalLink, ShieldCheck, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { FilterBar } from '@/components/ui/FilterBar';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import { useEvidence } from '@/hooks/useEvidence';
import { useToast } from '@/components/ui/Toast';
import { formatTimestamp, truncateHash } from '@/lib/utils';
import type { Evidence } from '@/types/evidence';

export default function EvidencePage() {
  const { evidenceList, isLoading, refetch } = useEvidence();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    showToast({
      title: 'Evidence SHA-256 Copied',
      message: hash,
      type: 'info',
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredEvidence = evidenceList.filter((ev) => {
    const matchesSearch =
      ev.evidenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.eventId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.cameraId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.blockchainTxId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || ev.evidenceType === typeFilter;
    const matchesStatus = !statusFilter || ev.verificationStatus === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const activeFilterCount = (typeFilter ? 1 : 0) + (statusFilter ? 1 : 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence Ledger"
        subtitle="Tamper-proof surveillance snapshots, video clips, and metadata sealed on Hyperledger Fabric."
        actions={
          <button
            onClick={refetch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] bg-[#18222C] hover:bg-[#1E2A35] border border-[#344454] text-xs font-semibold text-[#F3F6F8] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#37B9FF]" />
            Sync Ledger
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-[#141C24] border border-[#263442] rounded-[10px] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7B87]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Evidence ID, Event ID, Tx ID..."
            className="w-full bg-[#0F151C] border border-[#263442] rounded-[7px] pl-9 pr-4 h-9 text-xs text-[#F3F6F8] placeholder:text-[#677480] focus:border-[#37B9FF] focus:outline-none"
          />
        </div>

        <FilterBar
          filters={[
            {
              key: 'type',
              label: 'Evidence Types',
              options: [
                { label: 'Snapshot', value: 'SNAPSHOT' },
                { label: 'Video Clip', value: 'VIDEO_CLIP' },
                { label: 'Key Frame', value: 'FRAME' },
                { label: 'Metadata', value: 'METADATA' },
              ],
              value: typeFilter,
              onChange: setTypeFilter,
            },
            {
              key: 'status',
              label: 'Verification Statuses',
              options: [
                { label: 'Verified', value: 'VERIFIED' },
                { label: 'Pending', value: 'PENDING' },
                { label: 'Failed', value: 'FAILED' },
              ],
              value: statusFilter,
              onChange: setStatusFilter,
            },
          ]}
          activeCount={activeFilterCount}
          onReset={() => {
            setTypeFilter('');
            setStatusFilter('');
          }}
        />
      </div>

      {/* Main Evidence Table (Section 32) */}
      {isLoading ? (
        <TableSkeleton rows={8} cols={8} />
      ) : (
        <div className="bg-[#141C24] border border-[#263442] rounded-[10px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#101820] border-b border-[#25313C] text-[10px] font-semibold uppercase tracking-[0.04em] text-[#8E9AA6]">
                  <th className="px-4 py-3.5">Evidence ID</th>
                  <th className="px-4 py-3.5">Event ID</th>
                  <th className="px-4 py-3.5">Camera / BOP</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Timestamp</th>
                  <th className="px-4 py-3.5">SHA-256 Digest</th>
                  <th className="px-4 py-3.5">Blockchain Tx</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#25313C]">
                {filteredEvidence.map((ev) => (
                  <tr key={ev.evidenceId} className="hover:bg-[#17212A] transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-[#37B9FF]">
                      <Link href={`/evidence/${ev.evidenceId}`} className="hover:underline">
                        {ev.evidenceId}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[#F3F6F8]">
                      <Link href={`/events/${ev.eventId}`} className="hover:text-[#37B9FF] hover:underline">
                        {ev.eventId}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-[#F3F6F8]">{ev.cameraId}</div>
                      <div className="text-[11px] text-[#A7B2BD] font-mono">{ev.bopId}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-[#0F151C] border border-[#263442] font-mono text-[10px] text-[#A7B2BD]">
                        {ev.evidenceType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[#A7B2BD]">
                      {formatTimestamp(ev.timestamp)}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs">
                      <button
                        onClick={() => handleCopyHash(ev.hash, ev.evidenceId)}
                        className="flex items-center gap-1 text-[#A7B2BD] hover:text-[#37B9FF] transition-colors"
                        title="Click to copy full SHA-256"
                      >
                        <span>{truncateHash(ev.hash)}</span>
                        {copiedId === ev.evidenceId ? (
                          <Check className="w-3 h-3 text-[#39D98A]" />
                        ) : (
                          <Copy className="w-3 h-3 opacity-60" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[#39D98A]">
                      {ev.blockchainTxId}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={ev.verificationStatus} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/evidence/${ev.evidenceId}`}
                        className="px-2.5 py-1 text-[11px] font-bold text-[#071018] bg-[#37B9FF] hover:bg-[#37B9FF]/90 rounded-[6px] transition-colors inline-flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verify
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
