"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, Play, Square, Trash2, LoaderCircle } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatTime } from '@/lib/utils';
import type { Camera } from '@/types/camera';

interface CameraTableProps {
  cameras: Camera[];
  onToggleStatus?: (id: string) => Promise<unknown>;
  onDelete?: (id: string) => Promise<unknown>;
  className?: string;
}

export function CameraTable({
  cameras,
  onToggleStatus,
  onDelete,
  className = '',
}: CameraTableProps) {
  const [cameraToDelete, setCameraToDelete] = useState<Camera | null>(null);
  const [pendingCameraId, setPendingCameraId] = useState<string | null>(null);

  const toggleCamera = async (id: string) => {
    if (!onToggleStatus) return;
    setPendingCameraId(id);
    try {
      await onToggleStatus(id);
    } finally {
      setPendingCameraId(null);
    }
  };

  return (
    <>
      <div className={`bg-[#141C24] border border-[#263442] rounded-[10px] overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#101820] border-b border-[#25313C] text-[10px] font-semibold uppercase tracking-[0.04em] text-[#8E9AA6]">
                <th className="px-4 py-3.5">Camera ID</th>
                <th className="px-4 py-3.5">Name & Location</th>
                <th className="px-4 py-3.5">BOP</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">FPS</th>
                <th className="px-4 py-3.5">AI Engine</th>
                <th className="px-4 py-3.5">Last Seen</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#25313C]">
              {cameras.map((cam) => (
                <tr key={cam.id} className="hover:bg-[#17212A] transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-[#F3F6F8]">
                    <Link href={`/cameras/${cam.id}`} className="hover:text-[#37B9FF] transition-colors">
                      {cam.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-[#F3F6F8]">{cam.name}</div>
                    <div className="text-[11px] text-[#A7B2BD]">{cam.location}</div>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-medium text-[#37B9FF]">{cam.bopId}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={cam.status} />
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[#F3F6F8]">{cam.fps}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={cam.aiStatus} />
                  </td>
                  <td className="px-4 py-3.5 font-mono text-[#A7B2BD]">{formatTime(cam.lastSeen)}</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/cameras/${cam.id}`}
                        className="p-1.5 rounded-[6px] text-[#A7B2BD] hover:text-[#37B9FF] hover:bg-[#18222C] transition-colors"
                        title="View CCTV Stream & Virtual Fence"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      {onToggleStatus && (
                        <button
                          onClick={() => toggleCamera(cam.id)}
                          disabled={pendingCameraId === cam.id}
                          className={`p-1.5 rounded-[6px] hover:bg-[#18222C] transition-colors ${
                            cam.status === 'ONLINE'
                              ? 'text-[#F4C95D] hover:text-[#F4C95D]'
                              : 'text-[#39D98A] hover:text-[#39D98A]'
                          }`}
                          title={cam.status === 'ONLINE' ? 'Stop Stream' : 'Start Stream'}
                        >
                          {pendingCameraId === cam.id ? (
                            <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                          ) : cam.status === 'ONLINE' ? (
                            <Square className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => setCameraToDelete(cam)}
                          className="p-1.5 rounded-[6px] text-[#6E7B87] hover:text-[#FF5C67] hover:bg-[#FF5C67]/10 transition-colors"
                          title="Delete Camera"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!cameraToDelete}
        onClose={() => setCameraToDelete(null)}
        onConfirm={() => {
          if (cameraToDelete && onDelete) {
                            onDelete(cameraToDelete.id);
            setCameraToDelete(null);
          }
        }}
        title="Delete Border Camera?"
        message={`Are you sure you want to delete ${cameraToDelete?.name} (${cameraToDelete?.id})? This will immediately disconnect the AI feed and remove virtual fence zones.`}
        confirmText="Delete Camera"
        isDestructive={true}
      />
    </>
  );
}
