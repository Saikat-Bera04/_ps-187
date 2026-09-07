"use client";

import React from 'react';
import Link from 'next/link';
import { Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import type { SystemHealth } from '@/types/system';

interface SystemHealthMiniProps {
  health: SystemHealth;
  className?: string;
}

export function SystemHealthMini({ health, className = '' }: SystemHealthMiniProps) {
  const statusColors = {
    ONLINE: 'bg-[#39D98A] text-[#39D98A]',
    DEGRADED: 'bg-[#F4C95D] text-[#F4C95D]',
    OFFLINE: 'bg-[#FF5C67] text-[#FF5C67]',
  };

  return (
    <div className={`bg-[#141C24] border border-[#263442] rounded-[10px] p-5 flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#39D98A]" />
          <h3 className="text-sm font-semibold text-[#F3F6F8]">System Infrastructure</h3>
        </div>
        <Link
          href="/system-health"
          className="text-xs text-[#37B9FF] hover:underline flex items-center gap-1 font-medium"
        >
          Diagnostics <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {health.services.slice(0, 5).map((svc) => (
          <div
            key={svc.name}
            className="flex items-center justify-between p-2 rounded-[6px] bg-[#0F151C] border border-[#263442]/60"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusColors[svc.status].split(' ')[0]}`} />
              <span className="text-xs font-medium text-[#F3F6F8]">{svc.name}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-[#A7B2BD]">{svc.latency}ms</span>
              <span className={`font-semibold ${statusColors[svc.status].split(' ')[1]}`}>
                {svc.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
