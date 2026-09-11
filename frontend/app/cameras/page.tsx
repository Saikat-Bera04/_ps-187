"use client";

import React, { useState } from 'react';
import { Camera, Plus, Search } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { CameraTable } from '@/components/cameras/CameraTable';
import { AddCameraModal } from '@/components/cameras/AddCameraModal';
import { UploadCustomVideoModal } from '@/components/cameras/UploadCustomVideoModal';
import { FilterBar } from '@/components/ui/FilterBar';
import { useCameras } from '@/hooks/useCameras';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';

export default function CamerasPage() {
  const { cameras, isLoading, addCamera, deleteCamera, toggleStatus } = useCameras();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bopFilter, setBopFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredCameras = cameras.filter((cam) => {
    const matchesQuery =
      cam.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cam.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBop = !bopFilter || cam.bopId === bopFilter;
    const matchesStatus = !statusFilter || cam.status === statusFilter;
    return matchesQuery && matchesBop && matchesStatus;
  });

  const activeFilterCount = (bopFilter ? 1 : 0) + (statusFilter ? 1 : 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cameras"
        subtitle="Manage connected border surveillance cameras, RTSP streams, and edge AI detection models."
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#18222C] border border-[#344454] hover:bg-[#1E2A35] text-[#F3F6F8] rounded-[7px] text-xs font-bold transition-all shadow-lg"
            >
              Upload Custom Video
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#37B9FF] hover:bg-[#37B9FF]/90 text-[#071018] rounded-[7px] text-xs font-bold transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add Camera
            </button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-[#141C24] border border-[#263442] rounded-[10px] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7B87]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, name, or sector location..."
            className="w-full bg-[#0F151C] border border-[#263442] rounded-[7px] pl-9 pr-4 h-9 text-xs text-[#F3F6F8] placeholder:text-[#677480] focus:border-[#37B9FF] focus:outline-none"
          />
        </div>

        <FilterBar
          filters={[
            {
              key: 'bop',
              label: 'BOPs',
              options: [
                { label: 'BOP-12', value: 'BOP-12' },
                { label: 'BOP-18', value: 'BOP-18' },
                { label: 'BOP-21', value: 'BOP-21' },
                { label: 'BOP-07', value: 'BOP-07' },
                { label: 'BOP-33', value: 'BOP-33' },
              ],
              value: bopFilter,
              onChange: setBopFilter,
            },
            {
              key: 'status',
              label: 'Statuses',
              options: [
                { label: 'Online', value: 'ONLINE' },
                { label: 'Degraded', value: 'DEGRADED' },
                { label: 'Offline', value: 'OFFLINE' },
              ],
              value: statusFilter,
              onChange: setStatusFilter,
            },
          ]}
          activeCount={activeFilterCount}
          onReset={() => {
            setBopFilter('');
            setStatusFilter('');
          }}
        />
      </div>

      {/* Main Table */}
      {isLoading ? (
        <TableSkeleton rows={8} cols={7} />
      ) : (
        <CameraTable
          cameras={filteredCameras}
          onToggleStatus={toggleStatus}
          onDelete={deleteCamera}
        />
      )}

      {/* Add Camera Modal */}
      <AddCameraModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addCamera}
      />

      {/* Upload Custom Video Modal */}
      <UploadCustomVideoModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </div>
  );
}
