"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Camera, AlertTriangle, Shield, Eye, Radio, X } from 'lucide-react';
import type { Camera as CameraType, BOP } from '@/types/camera';
import type { Alert } from '@/types/alert';

interface BorderMapProps {
  cameras: CameraType[];
  bops: BOP[];
  alerts: Alert[];
  className?: string;
  selectedCameraId?: string;
  onSelectCamera?: (id: string) => void;
}

export function BorderMap({
  cameras,
  bops,
  alerts,
  className = '',
  selectedCameraId,
  onSelectCamera,
}: BorderMapProps) {
  const [activeMarker, setActiveMarker] = useState<{
    camera: CameraType;
    alert?: Alert;
    x: number;
    y: number;
  } | null>(null);

  // Map normalized coordinates (0 to 100%) for mock Rajasthan / border geography
  const getCoordinates = (cam: CameraType, index: number) => {
    // Generate deterministic spread across sector map
    const bopOffsets: Record<string, { baseX: number; baseY: number }> = {
      'BOP-12': { baseX: 25, baseY: 30 },
      'BOP-18': { baseX: 60, baseY: 40 },
      'BOP-21': { baseX: 35, baseY: 70 },
      'BOP-07': { baseX: 75, baseY: 65 },
      'BOP-33': { baseX: 80, baseY: 25 },
    };
    const bop = bopOffsets[cam.bopId] || { baseX: 50, baseY: 50 };
    const offsetX = ((index % 4) - 1.5) * 6;
    const offsetY = (Math.floor(index / 4) - 1) * 6;
    return {
      x: Math.max(10, Math.min(90, bop.baseX + offsetX)),
      y: Math.max(12, Math.min(88, bop.baseY + offsetY)),
    };
  };

  return (
    <div
      className={`relative bg-[#070D12] border border-[#263442] rounded-[10px] overflow-hidden select-none flex flex-col ${className}`}
    >
      {/* Map Header / Controls */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-[#141C24]/90 backdrop-blur-md border border-[#263442] px-3 py-1.5 rounded-[8px]">
        <Radio className="w-3.5 h-3.5 text-[#37B9FF] animate-pulse" />
        <span className="text-xs font-semibold text-[#F3F6F8]">Western Border Sector Command</span>
        <span className="text-[10px] font-mono text-[#39D98A] bg-[#39D98A]/10 px-1.5 py-0.2 rounded border border-[#39D98A]/20">
          5 BOPS • {cameras.length} CAMERAS
        </span>
      </div>

      {/* Map Legend */}
      <div className="absolute top-3 right-3 z-20 hidden md:flex items-center gap-3 bg-[#141C24]/90 backdrop-blur-md border border-[#263442] px-3 py-1.5 rounded-[8px] text-[11px] text-[#A7B2BD]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#39D98A]" /> Online
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF8A4C]" /> Alert
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF5C67] animate-ping" /> Critical Intrusion
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#6E7B87]" /> Offline
        </div>
      </div>

      {/* Main Vector Map Canvas */}
      <div className="relative flex-1 w-full min-h-[480px] bg-[#05080B] overflow-hidden">
        {/* Radar concentric circles and grid */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[300px] h-[300px] rounded-full border border-[#37B9FF]" />
          <div className="w-[600px] h-[600px] rounded-full border border-[#37B9FF]/50" />
          <div className="w-[900px] h-[900px] rounded-full border border-[#37B9FF]/20" />
          <div className="absolute w-full h-[1px] bg-[#37B9FF]/30" />
          <div className="absolute h-full w-[1px] bg-[#37B9FF]/30" />
        </div>

        {/* Restricted Border Buffer Zone & International Boundary Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* International Border Line */}
          <polyline
            points="5,15 25,25 45,18 70,30 95,20"
            fill="none"
            stroke="#FF5C67"
            strokeWidth="0.6"
            strokeDasharray="1.5,1"
          />
          {/* Virtual Buffer Zone */}
          <polygon
            points="5,15 25,25 45,18 70,30 95,20 95,45 70,55 45,42 25,50 5,38"
            fill="rgba(255, 92, 103, 0.04)"
            stroke="rgba(255, 92, 103, 0.2)"
            strokeWidth="0.3"
            strokeDasharray="2,2"
          />
          {/* Sector division paths */}
          <line x1="45" y1="18" x2="45" y2="90" stroke="#263442" strokeWidth="0.3" strokeDasharray="1,2" />
          <line x1="70" y1="30" x2="70" y2="90" stroke="#263442" strokeWidth="0.3" strokeDasharray="1,2" />
        </svg>

        {/* Sector Labels */}
        <div className="absolute top-8 left-[15%] text-[10px] font-mono font-bold text-[#FF5C67]/40 tracking-widest pointer-events-none uppercase">
          ZONE ALPHA • RESTRICTED PERIMETER FENCE
        </div>
        <div className="absolute top-8 right-[20%] text-[10px] font-mono font-bold text-[#FF5C67]/40 tracking-widest pointer-events-none uppercase">
          ZONE BRAVO • HIGH-VIGILANCE RIDGE
        </div>

        {/* BOP Hub Markers */}
        {bops.map((bop) => {
          const coords: Record<string, { x: number; y: number }> = {
            'BOP-12': { x: 25, y: 30 },
            'BOP-18': { x: 60, y: 40 },
            'BOP-21': { x: 35, y: 70 },
            'BOP-07': { x: 75, y: 65 },
            'BOP-33': { x: 80, y: 25 },
          };
          const pos = coords[bop.id] || { x: 50, y: 50 };

          return (
            <div
              key={bop.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
            >
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border border-[#37B9FF]/60 bg-[#0F151C]/90 flex items-center justify-center shadow-lg">
                  <Shield className="w-4 h-4 text-[#37B9FF]" />
                </div>
                <span className="text-[10px] font-mono font-bold text-[#F3F6F8] bg-black/80 px-1.5 py-0.5 rounded border border-[#263442] mt-1 whitespace-nowrap">
                  {bop.id}
                </span>
              </div>
            </div>
          );
        })}

        {/* Camera Nodes */}
        {cameras.map((cam, idx) => {
          const pos = getCoordinates(cam, idx);
          const camAlert = alerts.find(
            (a) => a.cameraId === cam.id && a.status !== 'RESOLVED'
          );
          const isCritical = camAlert?.severity === 'CRITICAL';
          const isAlert = !!camAlert;
          const isOffline = cam.status === 'OFFLINE';

          let pinColor = '#39D98A';
          if (isOffline) pinColor = '#6E7B87';
          if (isAlert) pinColor = '#FF8A4C';
          if (isCritical) pinColor = '#FF5C67';

          return (
            <button
              key={cam.id}
              onClick={() => {
                setActiveMarker({ camera: cam, alert: camAlert, x: pos.x, y: pos.y });
                if (onSelectCamera) onSelectCamera(cam.id);
              }}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group p-1 transition-transform hover:scale-125 focus:outline-none"
              title={`${cam.name} (${cam.id})`}
            >
              <div className="relative flex items-center justify-center">
                {isCritical && (
                  <span className="absolute w-6 h-6 rounded-full bg-[#FF5C67] opacity-75 animate-ping" />
                )}
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0A0F14] shadow-md"
                  style={{ backgroundColor: pinColor }}
                >
                  <Camera className="w-2.5 h-2.5 text-[#0A0F14]" />
                </div>
              </div>
            </button>
          );
        })}

        {/* Compact Click Popup (Section 33, 35) */}
        {activeMarker && (
          <div
            style={{
              left: `${Math.min(75, Math.max(25, activeMarker.x))}%`,
              top: `${Math.max(20, activeMarker.y - 12)}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-full z-30 w-64 bg-[#141C24] border border-[#344454] rounded-[10px] p-3 shadow-2xl animate-fade-in"
          >
            <div className="flex items-start justify-between mb-1.5">
              <div>
                <span className="text-xs font-mono font-bold text-[#F3F6F8]">
                  {activeMarker.camera.id}
                </span>
                <span className="text-[11px] text-[#A7B2BD] block font-mono">
                  {activeMarker.camera.bopId} • {activeMarker.camera.status}
                </span>
              </div>
              <button
                onClick={() => setActiveMarker(null)}
                className="text-[#6E7B87] hover:text-[#F3F6F8] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeMarker.alert ? (
              <div className="p-2 rounded bg-[#FF5C67]/10 border border-[#FF5C67]/30 my-2 text-[11px]">
                <div className="font-bold text-[#FF5C67] flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Current Event: {activeMarker.alert.eventType}
                </div>
                <div className="text-[#F3F6F8] text-[10px] mt-0.5">{activeMarker.alert.description}</div>
              </div>
            ) : (
              <div className="text-[11px] text-[#39D98A] my-2 font-medium">
                Sector Secured • AI Active ({activeMarker.camera.fps} FPS)
              </div>
            )}

            <div className="flex items-center gap-2 pt-1 border-t border-[#263442]">
              <Link
                href={`/cameras/${activeMarker.camera.id}`}
                className="flex-1 py-1.5 bg-[#37B9FF] hover:bg-[#37B9FF]/90 text-[#071018] rounded-[6px] text-xs font-bold text-center transition-colors flex items-center justify-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                Open Camera
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
