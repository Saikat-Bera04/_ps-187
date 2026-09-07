"use client";

import React from 'react';
import Link from 'next/link';
import { Activity, ArrowRight, User, Car, ScanFace, AlertTriangle } from 'lucide-react';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { formatTime } from '@/lib/utils';
import { EVENT_TYPE_LABELS } from '@/lib/constants';
import type { IBVAPEvent } from '@/types/event';

interface RecentEventsTableProps {
  events: IBVAPEvent[];
  className?: string;
}

export function RecentEventsTable({ events, className = '' }: RecentEventsTableProps) {
  const recentEvents = events.slice(0, 5);

  const getIcon = (type: string) => {
    if (type.includes('PERSON') || type === 'INTRUSION') return <User className="w-3.5 h-3.5 text-[#37B9FF]" />;
    if (type.includes('VEHICLE') || type === 'ANPR_MATCH') return <Car className="w-3.5 h-3.5 text-[#F4C95D]" />;
    if (type.includes('FACE')) return <ScanFace className="w-3.5 h-3.5 text-[#39D98A]" />;
    return <AlertTriangle className="w-3.5 h-3.5 text-[#FF8A4C]" />;
  };

  return (
    <div className={`bg-[#141C24] border border-[#263442] rounded-[10px] overflow-hidden flex flex-col ${className}`}>
      <div className="p-4 border-b border-[#263442] bg-[#18222C]/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#37B9FF]" />
          <h3 className="text-sm font-semibold text-[#F3F6F8]">Recent AI Surveillance Events</h3>
        </div>
        <Link
          href="/events"
          className="text-xs text-[#37B9FF] hover:underline flex items-center gap-1 font-medium"
        >
          All Events <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#101820] border-b border-[#25313C] text-[10px] font-semibold uppercase tracking-[0.04em] text-[#8E9AA6]">
              <th className="px-4 py-3">Event ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">BOP & Camera</th>
              <th className="px-4 py-3">Threat</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#25313C]">
            {recentEvents.map((evt) => (
              <tr
                key={evt.eventId}
                className="hover:bg-[#17212A] transition-colors cursor-pointer group"
                onClick={() => (window.location.href = `/events/${evt.eventId}`)}
              >
                <td className="px-4 py-3 font-mono font-medium text-[#37B9FF] group-hover:underline">
                  {evt.eventId}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-[#F3F6F8] font-medium">
                    {getIcon(evt.eventType)}
                    <span>{EVENT_TYPE_LABELS[evt.eventType] || evt.eventType}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#A7B2BD]">
                  <span className="font-mono text-[#F3F6F8] font-medium">{evt.bopId}</span> • {evt.cameraId}
                </td>
                <td className="px-4 py-3">
                  <SeverityBadge severity={evt.severity} />
                </td>
                <td className="px-4 py-3 font-mono text-[#A7B2BD]">{formatTime(evt.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
