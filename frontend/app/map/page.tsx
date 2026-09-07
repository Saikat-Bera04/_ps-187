"use client";

import React, { useState, useEffect } from 'react';
import { Map, Layers, Radio, Camera, ShieldAlert, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { BorderMap } from '@/components/map/BorderMap';
import { getCameras, getBOPs, getAlerts } from '@/lib/api';
import type { Camera as CameraType, BOP } from '@/types/camera';
import type { Alert } from '@/types/alert';

export default function MapPage() {
  const [cameras, setCameras] = useState<CameraType[]>([]);
  const [bops, setBops] = useState<BOP[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const [camsData, bopsData, alertsData] = await Promise.all([
      getCameras(),
      getBOPs(),
      getAlerts(),
    ]);
    setCameras(camsData);
    setBops(bopsData);
    setAlerts(alertsData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-100px)]">
      <PageHeader
        title="Border Tactical Map"
        subtitle="Geospatial tactical view of all Border Outposts (BOPs), sensor coverage cones, and intrusion alerts."
        actions={
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[7px] bg-[#18222C] hover:bg-[#1E2A35] border border-[#344454] text-xs font-semibold text-[#F3F6F8] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#37B9FF] ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Radars
          </button>
        }
      />

      <div className="flex-1 min-h-[550px] flex flex-col">
        <BorderMap cameras={cameras} bops={bops} alerts={alerts} className="flex-1 h-full shadow-2xl" />
      </div>
    </div>
  );
}
