"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import Link from 'next/link';
import { Camera, Shield, Eye, AlertTriangle } from 'lucide-react';
import type { Camera as CameraType, BOP } from '@/types/camera';
import type { Alert } from '@/types/alert';

interface LeafletMapProps {
  cameras: CameraType[];
  bops: BOP[];
  alerts: Alert[];
  className?: string;
  selectedCameraId?: string;
  onSelectCamera?: (id: string) => void;
}

// Map center for the Western Sector (e.g., coordinates from seed)
const DEFAULT_CENTER: [number, number] = [28.6139, 77.2090];
const DEFAULT_ZOOM = 13;

function createBopIcon(bop: BOP) {
  const htmlString = renderToString(
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-full border border-[#37B9FF]/60 bg-[#0F151C]/90 flex items-center justify-center shadow-lg">
        <Shield className="w-4 h-4 text-[#37B9FF]" />
      </div>
      <span className="text-[10px] font-mono font-bold text-[#F3F6F8] bg-black/80 px-1.5 py-0.5 rounded border border-[#263442] mt-1 whitespace-nowrap shadow-md">
        {bop.id}
      </span>
    </div>
  );

  return L.divIcon({
    html: htmlString,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20], // Center
  });
}

function createCameraIcon(camera: CameraType, isCritical: boolean, isAlert: boolean, isOffline: boolean) {
  let pinColor = '#39D98A'; // Default ONLINE
  if (isOffline) pinColor = '#6E7B87';
  if (isAlert) pinColor = '#FF8A4C';
  if (isCritical) pinColor = '#FF5C67';

  const htmlString = renderToString(
    <div className="relative flex items-center justify-center w-8 h-8 group hover:scale-125 transition-transform duration-200">
      {isCritical && (
        <span className="absolute w-8 h-8 rounded-full bg-[#FF5C67] opacity-75 animate-ping" />
      )}
      <div
        className="w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0A0F14] shadow-md z-10"
        style={{ backgroundColor: pinColor }}
      >
        <Camera className="w-3 h-3 text-[#0A0F14]" />
      </div>
    </div>
  );

  return L.divIcon({
    html: htmlString,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

// Component to handle dynamic map bounds/centering if needed
function MapController({ cameras, bops, selectedCameraId }: { cameras: CameraType[], bops: BOP[], selectedCameraId?: string }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCameraId) {
      const selectedCam = cameras.find(c => c.id === selectedCameraId);
      if (selectedCam) {
        map.flyTo([selectedCam.latitude, selectedCam.longitude], 16, {
          duration: 1.5,
        });
      }
    } else if (bops.length > 0 && cameras.length > 0) {
      // Determine bounds of all cameras and BOPS to center map on load
      const bounds = L.latLngBounds(cameras.map(c => [c.latitude, c.longitude]));
      bops.forEach(b => bounds.extend([b.latitude, b.longitude]));
      
      // If bounds are valid and not a single point
      if (bounds.isValid()) {
         map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [selectedCameraId, map, cameras, bops]);

  // Adjust zoom control position
  useEffect(() => {
    map.zoomControl.setPosition('bottomright');
  }, [map]);

  return null;
}

export default function LeafletMap({
  cameras,
  bops,
  alerts,
  className = '',
  selectedCameraId,
  onSelectCamera,
}: LeafletMapProps) {

  // Default center point. If we have cameras, we could start with the first one's location.
  const initialCenter = cameras.length > 0 ? [cameras[0].latitude, cameras[0].longitude] as [number, number] : DEFAULT_CENTER;

  return (
    <div className={`relative w-full h-full bg-[#070D12] rounded-[10px] overflow-hidden border border-[#263442] shadow-xl ${className}`}>
      <MapContainer
        center={initialCenter}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%', background: '#0A0F14' }}
      >
        <TileLayer
          attribution={process.env.NEXT_PUBLIC_MAP_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
          url={process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
          subdomains="abcd"
          maxZoom={20}
        />
        
        <MapController cameras={cameras} bops={bops} selectedCameraId={selectedCameraId} />

        {bops.map(bop => (
          <Marker
            key={`bop-${bop.id}`}
            position={[bop.latitude, bop.longitude]}
            icon={createBopIcon(bop)}
            zIndexOffset={100}
          />
        ))}

        {cameras.map(cam => {
          const camAlert = alerts.find(a => a.cameraId === cam.id && a.status !== 'RESOLVED');
          const isCritical = camAlert?.severity === 'CRITICAL';
          const isAlert = !!camAlert;
          const isOffline = cam.status === 'OFFLINE';

          return (
            <Marker
              key={`cam-${cam.id}`}
              position={[cam.latitude, cam.longitude]}
              icon={createCameraIcon(cam, isCritical, isAlert, isOffline)}
              zIndexOffset={isAlert ? 200 : 50}
              eventHandlers={{
                click: () => {
                  if (onSelectCamera) onSelectCamera(cam.id);
                }
              }}
            >
              <Popup className="custom-popup" closeButton={true} minWidth={260}>
                <div className="flex flex-col min-w-[240px]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-sm font-mono font-bold text-[#F3F6F8]">
                        {cam.cameraCode || cam.id}
                      </span>
                      <span className="text-xs text-[#A7B2BD] block font-mono mt-0.5">
                        {cam.bopId} • {cam.status}
                      </span>
                    </div>
                  </div>

                  {camAlert ? (
                    <div className="p-2.5 rounded bg-[#FF5C67]/10 border border-[#FF5C67]/30 my-2 text-xs">
                      <div className="font-bold text-[#FF5C67] flex items-center gap-1.5 mb-1">
                        <AlertTriangle className="w-4 h-4" /> {camAlert.eventType}
                      </div>
                      <div className="text-[#F3F6F8] text-[11px] leading-relaxed">{camAlert.description}</div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#39D98A] my-2 font-medium bg-[#39D98A]/10 border border-[#39D98A]/20 p-2 rounded">
                      Sector Secured • AI Active ({cam.fps} FPS)
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-3 mt-1 border-t border-[#263442]">
                    <Link
                      href={`/cameras/${cam.id}`}
                      className="flex-1 py-2 bg-[#37B9FF] hover:bg-[#37B9FF]/90 text-[#071018] rounded-[6px] text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      Open Camera Feed
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
