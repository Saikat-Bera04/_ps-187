"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className = '',
}: PaginationProps) {
  if (totalItems <= pageSize && currentPage === 1) return null;

  const start = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 bg-[#141C24] border-t border-[#25313C] text-xs text-[#A7B2BD] ${className}`}
    >
      <div>
        Showing <span className="text-[#F3F6F8] font-mono font-medium">{start}</span>–
        <span className="text-[#F3F6F8] font-mono font-medium">{end}</span> of{' '}
        <span className="text-[#F3F6F8] font-mono font-medium">{totalItems}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-[6px] border border-[#263442] hover:bg-[#18222C] text-[#F3F6F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-2.5 py-1 rounded-[6px] bg-[#0F151C] border border-[#263442] font-mono text-[11px] text-[#F3F6F8]">
          {currentPage} / {Math.max(1, totalPages)}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-[6px] border border-[#263442] hover:bg-[#18222C] text-[#F3F6F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
