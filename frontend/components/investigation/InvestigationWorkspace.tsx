"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Send,
} from 'lucide-react';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { useToast } from '@/components/ui/Toast';
import { formatTime, truncateHash } from '@/lib/utils';
import type { IBVAPEvent } from '@/types/event';

interface InvestigationWorkspaceProps {
  events: IBVAPEvent[];
  initialEventId?: string;
  className?: string;
}

export function InvestigationWorkspace({
  events,
  initialEventId,
  className = '',
}: InvestigationWorkspaceProps) {
  const { showToast } = useToast();
  const [selectedEventId, setSelectedEventId] = useState<string>(
    initialEventId || events[0]?.eventId || 'EVT-10001'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [timelineProgress, setTimelineProgress] = useState(35);
  const [notes, setNotes] = useState<string[]>([
    '02:32 IST — Initial operator triage: Subject confirmed trespassing north perimeter tripwire.',
    '02:34 IST — Forensic snapshot extracted & registered on Hyperledger Fabric ledger (TX-8F72A91).',
  ]);
  const [currentNote, setCurrentNote] = useState('');

  const selectedEvent = events.find((e) => e.eventId === selectedEventId) || events[0];

  const filteredEvents = events.filter(
    (e) =>
      e.eventId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.bopId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNote.trim()) return;
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setNotes([...notes, `${time} IST — ${currentNote.trim()}`]);
    setCurrentNote('');
    showToast({
      title: 'Investigation Note Recorded',
      message: 'Appended to auditable case chain.',
      type: 'success',
    });
  };

  const handleMarkReviewed = () => {
    showToast({
      title: 'Case Marked Reviewed',
      message: `Forensic assessment completed for ${selectedEvent?.eventId}.`,
      type: 'success',
    });
  };

  const handleEscalate = () => {
    showToast({
      title: 'Incident Escalated',
      message: `Priority alarm broadcast to Quick Reaction Team (QRT) at ${selectedEvent?.bopId}.`,
      type: 'error',
    });
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[700px] ${className}`}>
      {/* ─── COLUMN 1: INCIDENT / EVENT LIST (3 COLS) ───── */}
      <div className="lg:col-span-3 bg-[#141C24] border border-[#263442] rounded-[10px] flex flex-col overflow-hidden">
        <div className="p-3.5 border-b border-[#263442] bg-[#18222C]">
          <h3 className="text-xs font-bold uppercase tracking-[0.06em] text-[#A7B2BD] mb-2.5">
            Incidents & Events ({filteredEvents.length})
          </h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6E7B87]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by ID, zone, BOP..."
              className="w-full bg-[#0F151C] border border-[#263442] rounded-[6px] pl-8 pr-3 h-8 text-xs text-[#F3F6F8] placeholder:text-[#677480] focus:outline-none focus:border-[#37B9FF]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#263442] max-h-[680px]">
          {filteredEvents.map((evt) => {
            const isSelected = evt.eventId === selectedEventId;
            return (
              <div
                key={evt.eventId}
                onClick={() => setSelectedEventId(evt.eventId)}
                className={`p-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#18222C] border-l-2 border-l-[#37B9FF]' : 'hover:bg-[#17212A]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-[#F3F6F8]">{evt.eventId}</span>
                  <SeverityBadge severity={evt.severity} />
                </div>
                <div className="text-[11px] text-[#A7B2BD] flex items-center justify-between">
                  <span>{evt.bopId} • {evt.zone}</span>
                  <span className="font-mono text-[#6E7B87]">{formatTime(evt.timestamp)}</span>
                </div>
                <div className="text-[10px] font-mono text-[#37B9FF] mt-1">
                  Track #{evt.trackId} • Score: {evt.threatScore}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── COLUMN 2: EVIDENCE VIEWER & PLAYBACK (6 COLS) ─── */}
      <div className="lg:col-span-6 bg-[#141C24] border border-[#263442] rounded-[10px] flex flex-col overflow-hidden">
        <div className="p-3.5 border-b border-[#263442] bg-[#18222C] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#F3F6F8]">
              High-Precision Forensic Playback
            </span>
            <span className="text-[10px] font-mono text-[#37B9FF] bg-[#37B9FF]/10 px-1.5 py-0.5 rounded border border-[#37B9FF]/20">
              {selectedEvent?.cameraId}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#A7B2BD]">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(75, prev - 15))}
              className="p-1 hover:text-[#F3F6F8] rounded hover:bg-[#0F151C]"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(200, prev + 15))}
              className="p-1 hover:text-[#F3F6F8] rounded hover:bg-[#0F151C]"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1 hover:text-[#F3F6F8] rounded hover:bg-[#0F151C]"
              title="Reset Viewport"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Viewport canvas */}
        <div className="relative flex-1 bg-[#05080B] flex items-center justify-center overflow-hidden min-h-[360px]">
          <div
            className="relative w-full h-full flex items-center justify-center transition-transform duration-150"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {/* Background synthetic CCTV evidence view */}
            <div className="absolute inset-0 bg-[radial-gradient(#263442_1px,transparent_1px)] [background-size:20px_20px] opacity-25" />

            {/* Virtual polygon line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
              <polygon
                points="10,85 90,85 75,35 25,35"
                fill="rgba(255, 92, 103, 0.12)"
                stroke="#FF5C67"
                strokeWidth="0.75"
                strokeDasharray="2"
              />
            </svg>

            {/* Simulated Tracked Target Bounding Box */}
            <div
              className="absolute border-2 border-[#FF5C67] bg-[#FF5C67]/20 flex flex-col justify-start"
              style={{
                top: `${30 + (timelineProgress / 100) * 15}%`,
                left: `${35 + (timelineProgress / 100) * 20}%`,
                width: '18%',
                height: '42%',
              }}
            >
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-[#FF5C67] text-[#071018] w-max">
                {selectedEvent?.objectType} {(selectedEvent?.confidence * 100).toFixed(0)}% TRK-
                {selectedEvent?.trackId}
              </span>
            </div>
          </div>

          {/* OSD metadata */}
          <div className="absolute top-3 left-3 bg-black/75 px-2.5 py-1 rounded text-[10px] font-mono text-[#F3F6F8] border border-white/10 pointer-events-none">
            FRAME: #{Math.floor(1000 + timelineProgress * 24)} • REPLAY RATE 1.0X
          </div>
        </div>

        {/* Video controls toolbar */}
        <div className="p-3 bg-[#101820] border-t border-[#263442] space-y-2">
          {/* Timeline scrubber slider */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-[#6E7B87]">00:00:00</span>
            <input
              type="range"
              min="0"
              max="100"
              value={timelineProgress}
              onChange={(e) => setTimelineProgress(Number(e.target.value))}
              className="w-full h-1 bg-[#263442] rounded-lg appearance-none cursor-pointer accent-[#37B9FF]"
            />
            <span className="text-[10px] font-mono text-[#37B9FF]">00:01:24</span>
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTimelineProgress((prev) => Math.max(0, prev - 5))}
                className="p-1.5 rounded text-[#A7B2BD] hover:text-[#F3F6F8] hover:bg-[#18222C]"
                title="Step Back 1 Frame"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-[6px] bg-[#37B9FF] text-[#071018] hover:bg-[#37B9FF]/90 font-bold"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setTimelineProgress((prev) => Math.min(100, prev + 5))}
                className="p-1.5 rounded text-[#A7B2BD] hover:text-[#F3F6F8] hover:bg-[#18222C]"
                title="Step Forward 1 Frame"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-mono text-[#A7B2BD]">
              <span>Event Timestamp: </span>
              <strong className="text-[#F3F6F8]">{selectedEvent?.timestamp}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ─── COLUMN 3: INVESTIGATION DETAILS & NOTES (3 COLS) ─ */}
      <div className="lg:col-span-3 bg-[#141C24] border border-[#263442] rounded-[10px] flex flex-col overflow-hidden">
        <div className="p-3.5 border-b border-[#263442] bg-[#18222C] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.06em] text-[#A7B2BD]">
            Forensic Case File
          </h3>
          <Link
            href={`/evidence/${selectedEvent?.evidenceId}`}
            className="text-[11px] font-semibold text-[#37B9FF] hover:underline flex items-center gap-1"
          >
            Verify <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {/* Threat Metric Card */}
          <div className="p-3 bg-[#0F151C] border border-[#263442] rounded-[8px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A7B2BD] font-medium">Threat Assessment</span>
              <span className="text-sm font-mono font-bold text-[#FF5C67]">
                {selectedEvent?.threatScore} / 100
              </span>
            </div>
            <div className="w-full bg-[#141C24] h-1.5 rounded-full overflow-hidden border border-[#263442]">
              <div
                className="bg-[#FF5C67] h-full"
                style={{ width: `${selectedEvent?.threatScore}%` }}
              />
            </div>
            <div className="text-[11px] text-[#A7B2BD] flex justify-between">
              <span>Confidence: {(selectedEvent?.confidence * 100).toFixed(0)}%</span>
              <span>Track ID: #{selectedEvent?.trackId}</span>
            </div>
          </div>

          {/* Chain of Custody / Blockchain Record */}
          <div className="p-3 bg-[#0F151C] border border-[#263442] rounded-[8px] space-y-1.5 text-xs font-mono">
            <div className="text-[10px] uppercase font-bold text-[#39D98A] tracking-wider flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" /> Blockchain Integrity
            </div>
            <div className="flex justify-between text-[#A7B2BD]">
              <span>Ledger:</span>
              <span className="text-[#F3F6F8]">Hyperledger Fabric</span>
            </div>
            <div className="flex justify-between text-[#A7B2BD]">
              <span>Evidence ID:</span>
              <span className="text-[#37B9FF]">{selectedEvent?.evidenceId}</span>
            </div>
            <div className="flex justify-between text-[#A7B2BD]">
              <span>SHA-256:</span>
              <span className="text-[#F3F6F8]">{truncateHash('a94f2e8b1c3d5e7f9a2b4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e72bc')}</span>
            </div>
          </div>

          {/* Investigator Notes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#A7B2BD] uppercase tracking-wider block">
              Investigator Audit Log
            </label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {notes.map((note, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-[#0F151C] border border-[#263442] text-[11px] text-[#F3F6F8] leading-relaxed"
                >
                  {note}
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
              <input
                type="text"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Append case note..."
                className="flex-1 bg-[#0F151C] border border-[#2B3947] rounded-[6px] px-2.5 h-8 text-xs text-[#F3F6F8] focus:border-[#37B9FF] focus:outline-none"
              />
              <button
                type="submit"
                className="px-2.5 h-8 bg-[#18222C] hover:bg-[#37B9FF] hover:text-[#071018] border border-[#344454] rounded-[6px] text-[#F3F6F8] transition-colors"
                title="Add Note"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Action Buttons (Section 31) */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleMarkReviewed}
              className="w-full py-2 bg-[#39D98A]/15 border border-[#39D98A]/40 text-[#39D98A] hover:bg-[#39D98A]/25 rounded-[7px] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark Reviewed
            </button>
            <button
              onClick={handleEscalate}
              className="w-full py-2 bg-[#FF5C67]/15 border border-[#FF5C67]/40 text-[#FF7A83] hover:bg-[#FF5C67]/25 rounded-[7px] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Escalate Incident
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
