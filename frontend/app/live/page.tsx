"use client";

import React, { useState, useEffect } from 'react';
import {
  MonitorPlay,
  Search,
  Filter,
  Maximize2,
  RefreshCw,
  Volume2,
  VolumeX,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { VideoPlayer } from '@/components/cameras/VideoPlayer';
import { useCameras } from '@/hooks/useCameras';
import { useAlerts } from '@/hooks/useAlerts';
import { useToast } from '@/components/ui/Toast';

export default function LiveSurveillancePage() {
  const { cameras, isLoading, refetch } = useCameras();
  const { alerts } = useAlerts();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [bopFilter, setBopFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [gridDensity, setGridDensity] = useState<'2x2' | '3x3' | '4x4'>('2x2');
  const [isAlertsMuted, setIsAlertsMuted] = useState(false);

  const filteredCameras = cameras.filter((cam) => {
    const matchesSearch =
      cam.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBop = !bopFilter || cam.bopId === bopFilter;
    const matchesStatus = !statusFilter || cam.status === statusFilter;
    return matchesSearch && matchesBop && matchesStatus;
  });

  const densityCount = {
    '2x2': 4,
    '3x3': 9,
    '4x4': 16,
  }[gridDensity];

  const gridColsClass = {
    '2x2': 'grid-cols-1 md:grid-cols-2',
    '3x3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4x4': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
  }[gridDensity];

  const displayedCameras = filteredCameras.slice(0, densityCount);

  return (
    <div className="space-y-4 flex flex-col min-h-full">
      {/* Surveillance Control Room Toolbar (Section 23) */}
      <div className="bg-[#141C24] border border-[#263442] rounded-[10px] p-4 flex flex-wrap items-center justify-between gap-3">
        {/* Left filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6E7B87]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search camera..."
              className="bg-[#0F151C] border border-[#263442] rounded-[7px] pl-8 pr-3 h-8 text-xs text-[#F3F6F8] placeholder:text-[#677480] focus:border-[#37B9FF] focus:outline-none"
            />
          </div>

          <select
            value={bopFilter}
            onChange={(e) => setBopFilter(e.target.value)}
            className="bg-[#0F151C] border border-[#263442] rounded-[7px] px-2.5 h-8 text-xs text-[#F3F6F8] focus:border-[#37B9FF] focus:outline-none cursor-pointer"
          >
            <option value="">All Sector BOPs</option>
            <option value="BOP-12">BOP-12</option>
            <option value="BOP-18">BOP-18</option>
            <option value="BOP-21">BOP-21</option>
            <option value="BOP-07">BOP-07</option>
            <option value="BOP-33">BOP-33</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0F151C] border border-[#263442] rounded-[7px] px-2.5 h-8 text-xs text-[#F3F6F8] focus:border-[#37B9FF] focus:outline-none cursor-pointer"
          >
            <option value="">All Network States</option>
            <option value="ONLINE">Online Only</option>
            <option value="DEGRADED">Degraded</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>

        {/* Right Density & Actions */}
        <div className="flex items-center gap-2">
          {/* Grid Density Switcher */}
          <div className="flex items-center bg-[#0F151C] border border-[#263442] rounded-[7px] p-0.5">
            {(['2x2', '3x3', '4x4'] as const).map((density) => (
              <button
                key={density}
                onClick={() => setGridDensity(density)}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-[5px] transition-colors ${
                  gridDensity === density
                    ? 'bg-[#37B9FF] text-[#071018]'
                    : 'text-[#8D99A5] hover:text-[#F3F6F8]'
                }`}
              >
                {density}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setIsAlertsMuted(!isAlertsMuted);
              showToast({
                title: isAlertsMuted ? 'Alarms Unmuted' : 'Alarms Muted',
                message: isAlertsMuted ? 'Audio alarms enabled for intrusions.' : 'Silent watch mode active.',
                type: 'info',
              });
            }}
            className={`p-2 rounded-[7px] border transition-colors ${
              isAlertsMuted
                ? 'bg-[#FF5C67]/15 border-[#FF5C67]/30 text-[#FF5C67]'
                : 'bg-[#18222C] border-[#344454] text-[#A7B2BD] hover:text-[#F3F6F8]'
            }`}
            title={isAlertsMuted ? 'Unmute Alarms' : 'Mute Alarms'}
          >
            {isAlertsMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={refetch}
            className="p-2 rounded-[7px] bg-[#18222C] hover:bg-[#1E2A35] border border-[#344454] text-[#A7B2BD] hover:text-[#F3F6F8] transition-colors"
            title="Refresh Camera Streams"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main CCTV Feed Grid (Section 23) */}
      <div className={`grid ${gridColsClass} gap-3 flex-1`}>
        {displayedCameras.map((cam, idx) => {
          const camAlert = alerts.find(
            (a) => a.cameraId === cam.id && a.severity === 'CRITICAL' && a.status !== 'RESOLVED'
          );
          const hasIntrusion = !!camAlert || cam.id === 'BOP12-CAM04';

          return (
            <div key={cam.id} className="relative group">
              <VideoPlayer
                camera={cam}
                isLive={cam.status === 'ONLINE'}
                hasIntrusion={hasIntrusion}
                className="w-full shadow-lg"
              />
            </div>
          );
        })}

        {/* Empty placeholder slots for remaining tiles */}
        {Array.from({ length: Math.max(0, densityCount - displayedCameras.length) }).map((_, i) => (
          <div
            key={`placeholder-${i}`}
            className="bg-[#05080B] border border-[#263442] border-dashed rounded-[8px] flex flex-col items-center justify-center text-[#4E5A64]"
            style={{ aspectRatio: '16/9' }}
          >
            <MonitorPlay className="w-8 h-8 mb-2 opacity-40" />
            <span className="text-xs font-mono">CHANNEL {displayedCameras.length + i + 1} — NO SIGNAL</span>
          </div>
        ))}
      </div>
    </div>
  );
}
