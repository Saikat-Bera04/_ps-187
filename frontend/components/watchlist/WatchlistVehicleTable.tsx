"use client";

import React from 'react';
import { Car } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatTimestamp } from '@/lib/utils';
import type { WatchlistVehicle } from '@/types/watchlist';

interface WatchlistVehicleTableProps {
  vehicles: WatchlistVehicle[];
  className?: string;
}

export function WatchlistVehicleTable({ vehicles, className = '' }: WatchlistVehicleTableProps) {
  return (
    <div className={`bg-[#141C24] border border-[#263442] rounded-[10px] overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#101820] border-b border-[#25313C] text-[10px] font-semibold uppercase tracking-[0.04em] text-[#8E9AA6]">
              <th className="px-4 py-3.5">Vehicle ID</th>
              <th className="px-4 py-3.5">Number Plate (ANPR)</th>
              <th className="px-4 py-3.5">Vehicle Classification</th>
              <th className="px-4 py-3.5">Priority Category</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Last Match</th>
              <th className="px-4 py-3.5">Added Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#25313C]">
            {vehicles.map((v) => (
              <tr key={v.vehicleId} className="hover:bg-[#17212A] transition-colors">
                <td className="px-4 py-3.5 font-mono font-bold text-[#37B9FF]">
                  {v.vehicleId}
                </td>
                <td className="px-4 py-3.5 font-mono font-bold text-[#F3F6F8]">
                  <span className="px-2 py-0.5 rounded bg-[#0F151C] border border-[#344454] tracking-wider">
                    {v.numberPlate}
                  </span>
                </td>
                <td className="px-4 py-3.5 font-semibold text-[#F3F6F8]">
                  <div className="flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#A7B2BD]" />
                    <span>{v.vehicleType}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#FF8A4C]/15 text-[#FF8A4C] border border-[#FF8A4C]/30">
                    {v.category}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={v.status} />
                </td>
                <td className="px-4 py-3.5 font-mono text-[#F3F6F8]">
                  {v.lastMatch ? formatTimestamp(v.lastMatch) : '— No Match Yet —'}
                </td>
                <td className="px-4 py-3.5 font-mono text-[#A7B2BD]">
                  {formatTimestamp(v.addedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
