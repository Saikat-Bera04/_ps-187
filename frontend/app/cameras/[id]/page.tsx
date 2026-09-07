"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Video, Cpu, Activity, ShieldAlert, Settings, User, Car, ScanFace, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { VideoPlayer } from '@/components/cameras/VideoPlayer';
import { VirtualFenceEditor } from '@/components/cameras/VirtualFenceEditor';
import { getCamera } from '@/lib/api';
import { formatTimestamp } from '@/lib/utils';
import type { Camera } from '@/types/camera';

export default function CameraDetailPage({ params }: { params: { id: string } }) {
  const [camera, setCamera] = useState<Camera | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCamera(params.id).then((data) => {
      if (data) setCamera(data);
      setIsLoading(false);
    });
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-[#A7B2BD] flex items-center justify-center gap-2">
        <span className="w-4 h-4 border-2 border-[#37B9FF] border-t-transparent rounded-full animate-spin" />
        Connecting to camera feed telemetry...
      </div>
    );
  }

  if (!camera) {
    return (
      <div className="p-8 text-center space-y-3">
        <h2 className="text-base font-bold text-[#FF5C67]">Camera Feed Not Found</h2>
        <p className="text-xs text-[#A7B2BD]">No registered hardware node found for ID {params.id}.</p>
        <Link
          href="/cameras"
          className="inline-block px-4 py-2 bg-[#18222C] text-xs font-semibold rounded-[7px] text-[#F3F6F8]"
        >
          Return to Cameras
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumb */}
      <PageHeader
        title={camera.name}
        subtitle={`${camera.id} • ${camera.bopId} • ${camera.location}`}
        breadcrumbs={[
          { label: 'Cameras', href: '/cameras' },
          { label: camera.id },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={camera.status} />
            <Link
              href="/live"
              className="px-3 py-1.5 rounded-[7px] bg-[#18222C] border border-[#344454] text-xs font-semibold text-[#F3F6F8] hover:bg-[#1E2A35] transition-colors"
            >
              Control Room Feed
            </Link>
          </div>
        }
      />

      {/* ─── SECTION: VIDEO PLAYER (LEFT) & INFO PANEL (RIGHT) (Section 26) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Video Player */}
        <div className="lg:col-span-8 space-y-4">
          <VideoPlayer
            camera={camera}
            isLive={camera.status === 'ONLINE'}
            hasIntrusion={camera.id === 'BOP12-CAM04'}
            className="w-full shadow-2xl"
          />

          {/* Current Detections Pill List (Section 26) */}
          <div className="bg-[#141C24] border border-[#263442] rounded-[10px] p-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#A7B2BD]">
              Active Edge AI Sensor Detections
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#0F151C] border border-[#263442] rounded-[8px] flex items-center gap-2.5">
                <div className="p-2 rounded bg-[#37B9FF]/15 text-[#37B9FF]">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#6E7B87]">Person Model</div>
                  <div className="text-xs font-bold text-[#F3F6F8]">1 Detected</div>
                </div>
              </div>

              <div className="p-3 bg-[#0F151C] border border-[#263442] rounded-[8px] flex items-center gap-2.5">
                <div className="p-2 rounded bg-[#F4C95D]/15 text-[#F4C95D]">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#6E7B87]">Vehicle Model</div>
                  <div className="text-xs font-bold text-[#F3F6F8]">0 In View</div>
                </div>
              </div>

              <div className="p-3 bg-[#0F151C] border border-[#263442] rounded-[8px] flex items-center gap-2.5">
                <div className="p-2 rounded bg-[#39D98A]/15 text-[#39D98A]">
                  <ScanFace className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#6E7B87]">Face Recognizer</div>
                  <div className="text-xs font-bold text-[#39D98A]">Standby</div>
                </div>
              </div>

              <div className="p-3 bg-[#0F151C] border border-[#263442] rounded-[8px] flex items-center gap-2.5">
                <div className="p-2 rounded bg-[#63A8FF]/15 text-[#63A8FF]">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#6E7B87]">ANPR OCR</div>
                  <div className="text-xs font-bold text-[#37B9FF]">Active (98%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Panel (Right) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-[#141C24] border border-[#263442] rounded-[10px] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#F3F6F8] flex items-center gap-2 border-b border-[#263442] pb-3">
              <Cpu className="w-4 h-4 text-[#37B9FF]" />
              Telemetry & Node Specifications
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[#263442]/50">
                <span className="text-[#A7B2BD]">Camera ID:</span>
                <span className="font-bold text-[#F3F6F8]">{camera.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#263442]/50">
                <span className="text-[#A7B2BD]">Sector BOP:</span>
                <span className="text-[#37B9FF] font-bold">{camera.bopId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#263442]/50">
                <span className="text-[#A7B2BD]">Physical Location:</span>
                <span className="text-[#F3F6F8]">{camera.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#263442]/50">
                <span className="text-[#A7B2BD]">Sensor Resolution:</span>
                <span className="text-[#F3F6F8]">{camera.resolution}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#263442]/50">
                <span className="text-[#A7B2BD]">Stream FPS:</span>
                <span className="text-[#F3F6F8]">{camera.fps} frames/sec</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#263442]/50">
                <span className="text-[#A7B2BD]">Network Latency:</span>
                <span className="text-[#39D98A]">18 ms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#263442]/50">
                <span className="text-[#A7B2BD]">AI Engine State:</span>
                <span className="text-[#39D98A] font-bold">{camera.aiStatus}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#263442]/50">
                <span className="text-[#A7B2BD]">GPS Latitude:</span>
                <span className="text-[#F3F6F8]">{camera.latitude.toFixed(4)}° N</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#263442]/50">
                <span className="text-[#A7B2BD]">GPS Longitude:</span>
                <span className="text-[#F3F6F8]">{camera.longitude.toFixed(4)}° E</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#A7B2BD]">Last Seen:</span>
                <span className="text-[#A7B2BD]">{formatTimestamp(camera.lastSeen)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECTION: VIRTUAL FENCE EDITOR (Section 26) ─── */}
      <VirtualFenceEditor cameraId={camera.id} />
    </div>
  );
}
