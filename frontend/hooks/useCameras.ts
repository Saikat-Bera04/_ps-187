"use client";

import { useState, useEffect, useCallback } from 'react';
import { getCameras, addCamera as apiAddCamera, deleteCamera as apiDeleteCamera, toggleCameraStatus as apiToggleStatus } from '@/lib/api';
import type { Camera } from '@/types/camera';

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

  const addCamera = async (camData: Omit<Camera, 'id' | 'lastSeen'>) => {
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
      setCameras((prev) => prev.map((c) => (c.id === id ? { ...c, status: updated.status, aiStatus: updated.aiStatus } : c)));
    }
    return updated;
  };

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
