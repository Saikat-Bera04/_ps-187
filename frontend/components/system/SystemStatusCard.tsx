"use client";

import React from 'react';
import { Cpu, HardDrive, Zap, Server } from 'lucide-react';
import type { HardwareMetrics } from '@/types/system';

interface HardwareMonitorProps {
  metrics: HardwareMetrics;
  className?: string;
}

export function SystemStatusCard({ metrics, className = '' }: HardwareMonitorProps) {
  const getMeterColor = (pct: number) => {
    if (pct > 85) return 'bg-[#FF5C67]';
    if (pct > 70) return 'bg-[#F4C95D]';
    return 'bg-[#37B9FF]';
  };

  const meters = [
    { label: 'C2 Edge Cluster CPU', value: metrics.cpu, icon: Cpu, unit: '%' },
    { label: 'System Memory (RAM)', value: metrics.ram, icon: Server, unit: '%' },
    { label: 'Neural Tensor GPU', value: metrics.gpu, icon: Zap, unit: '%' },
    { label: 'Encrypted Storage Array', value: metrics.storage, icon: HardDrive, unit: '%' },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {meters.map((meter) => {
        const Icon = meter.icon;
        return (
          <div
            key={meter.label}
            className="bg-[#141C24] border border-[#263442] rounded-[10px] p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#A7B2BD]">
                {meter.label}
              </span>
              <Icon className="w-4 h-4 text-[#37B9FF]" />
            </div>

            <div className="my-2">
              <div className="text-2xl font-bold font-mono text-[#F3F6F8]">
                {meter.value}
                <span className="text-xs font-normal text-[#A7B2BD] ml-0.5">{meter.unit}</span>
              </div>
            </div>

            <div className="w-full h-1.5 bg-[#0F151C] rounded-full overflow-hidden border border-[#263442] mt-1">
              <div
                className={`h-full transition-all duration-500 ${getMeterColor(meter.value)}`}
                style={{ width: `${meter.value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
