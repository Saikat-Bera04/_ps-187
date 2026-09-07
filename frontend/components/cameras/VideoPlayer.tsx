"use client";

import React, { useState, useEffect } from 'react';
import { Video, Maximize2, ShieldAlert, Activity, Volume2, VolumeX } from 'lucide-react';
import type { Camera } from '@/types/camera';

interface DetectionOverlay {
  label: string;
  confidence: number;
  trackId: number;
  top: string;
  left: string;
  width: string;
  height: string;
  color?: string;
}

interface VideoPlayerProps {
  camera: Camera;
  isLive?: boolean;
  hasIntrusion?: boolean;
  detections?: DetectionOverlay[];
  showVirtualFence?: boolean;
  fencePolygon?: { x: number; y: number }[];
  className?: string;
  onFullscreen?: () => void;
}

export function VideoPlayer({
  camera,
  isLive = true,
  hasIntrusion = false,
  detections = [],
  showVirtualFence = true,
  fencePolygon,
  className = '',
  onFullscreen,
}: VideoPlayerProps) {
  const [timeString, setTimeString] = useState('');
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setTimeString(
        d.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Default fence polygon points if none passed
  const defaultFence = [
    { x: 15, y: 75 },
    { x: 85, y: 75 },
    { x: 70, y: 35 },
    { x: 30, y: 35 },
  ];
  const activePolygon = fencePolygon || defaultFence;
  const polyPointsString = activePolygon.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div
      className={`relative bg-[#05080B] rounded-[8px] overflow-hidden border transition-all ${
        hasIntrusion ? 'border-[#FF5C67] ring-1 ring-[#FF5C67]/50' : 'border-[#263442]'
      } ${className}`}
      style={{ aspectRatio: '16/9' }}
    >
      {/* Background simulated CCTV stream pattern */}
      <div className="absolute inset-0 bg-[#070D12] overflow-hidden">
        {/* Subtle scanline and grid texture */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#263442_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Animated radar sweep line simulating active sensor telemetry */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-48 h-48 rounded-full border border-[#37B9FF]/40 animate-pulse-subtle" />
          <div className="w-80 h-80 rounded-full border border-[#37B9FF]/20" />
        </div>
      </div>

      {/* Virtual fence SVG overlay */}
      {showVirtualFence && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon
            points={polyPointsString}
            fill={hasIntrusion ? 'rgba(255, 92, 103, 0.15)' : 'rgba(57, 217, 138, 0.08)'}
            stroke={hasIntrusion ? '#FF5C67' : '#39D98A'}
            strokeWidth="0.75"
            strokeDasharray={hasIntrusion ? '0' : '2,1'}
          />
          {activePolygon.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r="1.2"
              fill={hasIntrusion ? '#FF5C67' : '#39D98A'}
            />
          ))}
          <text
            x={activePolygon[0].x + 2}
            y={activePolygon[0].y - 2}
            fill={hasIntrusion ? '#FF5C67' : '#39D98A'}
            fontSize="3"
            fontFamily="monospace"
            fontWeight="bold"
          >
            VIRTUAL FENCE ZONE: {camera.location?.toUpperCase() || 'SECTOR'}
          </text>
        </svg>
      )}

      {/* AI Bounding Box Overlays */}
      {detections.map((det, idx) => (
        <div
          key={idx}
          className="absolute border-2 z-20 pointer-events-none flex flex-col justify-start transition-all"
          style={{
            top: det.top,
            left: det.left,
            width: det.width,
            height: det.height,
            borderColor: det.color || (hasIntrusion ? '#FF5C67' : '#39D98A'),
            backgroundColor: `${det.color || (hasIntrusion ? '#FF5C67' : '#39D98A')}15`,
          }}
        >
          <span
            className="text-[9px] font-mono font-bold px-1 py-0.5 w-max tracking-wider text-[#071018]"
            style={{ backgroundColor: det.color || (hasIntrusion ? '#FF5C67' : '#39D98A') }}
          >
            {det.label} {det.confidence}% TRACK {det.trackId}
          </span>
        </div>
      ))}

      {/* Simulated Person Tracking if intrusion */}
      {hasIntrusion && detections.length === 0 && (
        <div
          className="absolute border-2 border-[#FF5C67] bg-[#FF5C67]/15 z-20 pointer-events-none"
          style={{ top: '32%', left: '42%', width: '15%', height: '38%' }}
        >
          <span className="text-[9px] font-mono font-bold px-1 py-0.5 bg-[#FF5C67] text-[#071018] block w-max tracking-wider">
            PERSON 96% TRACK 72
          </span>
        </div>
      )}

      {/* Header Overlay (Section 24: 36px–40px) */}
      <div className="absolute top-0 inset-x-0 h-9 bg-gradient-to-b from-black/85 via-black/50 to-transparent px-3 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="text-xs font-bold text-[#F3F6F8] font-mono tracking-wider">
            {camera.id}
          </span>
          <span className="text-[10px] text-[#A7B2BD] font-medium hidden sm:inline">
            {camera.name}
          </span>
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          {isLive && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#FF5C67] animate-pulse" />
              <span className="text-[10px] font-bold text-white tracking-widest font-mono">
                LIVE
              </span>
            </div>
          )}
          <span className="text-[10px] font-mono text-white/80">{timeString}</span>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 text-white/70 hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          {onFullscreen && (
            <button
              onClick={onFullscreen}
              className="p-1 text-white/70 hover:text-white transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Footer Overlay (Section 24) */}
      <div className="absolute bottom-0 inset-x-0 h-9 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold text-white/90">
            {camera.bopId} | {camera.location?.toUpperCase()}
          </span>
          {hasIntrusion && (
            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-[#FF5C67] text-[#071018] animate-pulse">
              INTRUSION DETECTED • THREAT 91
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-[10px] font-mono text-white/70">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-[#37B9FF]" />
            {camera.fps} FPS
          </span>
          <span>•</span>
          <span>{camera.resolution}</span>
        </div>
      </div>
    </div>
  );
}
