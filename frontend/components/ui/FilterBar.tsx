"use client";

import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';

interface FilterOption {
  key: string;
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
}

interface FilterBarProps {
  filters: FilterOption[];
  onReset: () => void;
  activeCount?: number;
  className?: string;
}

export function FilterBar({
  filters,
  onReset,
  activeCount = 0,
  className = '',
}: FilterBarProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs text-[#A7B2BD] font-medium mr-1">
        <Filter className="w-3.5 h-3.5 text-[#37B9FF]" />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="bg-[#37B9FF]/20 text-[#37B9FF] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
            {activeCount}
          </span>
        )}
      </div>

      {filters.map((filter) => (
        <select
          key={filter.key}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className="bg-[#0F151C] border border-[#263442] hover:border-[#344454] text-[#F3F6F8] rounded-[7px] px-3 h-9 text-xs focus:outline-none focus:border-[#37B9FF] transition-colors cursor-pointer"
        >
          <option value="">All {filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}

      {activeCount > 0 && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-[#6E7B87] hover:text-[#FF5C67] px-2 py-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Clear
        </button>
      )}
    </div>
  );
}
