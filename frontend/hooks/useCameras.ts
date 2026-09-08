"use client";

import { useState, useEffect, useCallback } from 'react';
import { getCameras, addCamera as apiAddCamera, deleteCamera as apiDeleteCamera, toggleCameraStatus as apiToggleStatus } from '@/lib/api';
import type { Camera } from '@/types/camera';
import { useWebSocket } from '@/hooks/useWebSocket';
import type { CameraRegistration } from '@/lib/api';

export function useCameras() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCameras = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCameras();
      setCameras(data);
    } catch (err) {
      setError('Failed to fetch cameras');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  const addCamera = async (camData: CameraRegistration) => {
    const created = await apiAddCamera(camData);
    setCameras((prev) => [created, ...prev]);
    return created;
  };

  const deleteCamera = async (id: string) => {
    await apiDeleteCamera(id);
    setCameras((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleStatus = async (id: string) => {
    const updated = await apiToggleStatus(id);
    if (updated) {
      setCameras((prev) => prev.map((c) => (c.id === id ? {
        ...c,
        status: updated.status,
        aiStatus: updated.aiStatus,
        fps: updated.fps,
        lastSeen: updated.lastSeen || c.lastSeen,
      } : c)));
    }
    return updated;
  };

  useWebSocket('camera_status_changed', (data) => {
    const cameraId = typeof data.id === 'string' ? data.id : '';
    const status = typeof data.status === 'string' ? data.status as Camera['status'] : undefined;
    const aiStatus = typeof data.aiStatus === 'string' ? data.aiStatus as Camera['aiStatus'] : undefined;
    if (!cameraId || !status || !aiStatus) return;
    setCameras((previous) => previous.map((camera) => camera.id === cameraId ? {
      ...camera,
      status,
      aiStatus,
      fps: typeof data.fps === 'number' ? data.fps : camera.fps,
      lastSeen: typeof data.lastSeen === 'string' ? data.lastSeen : camera.lastSeen,
    } : camera));
  });

  return {
    cameras,
    isLoading,
    error,
    refetch: fetchCameras,
    addCamera,
    deleteCamera,
    toggleStatus,
  };
}
