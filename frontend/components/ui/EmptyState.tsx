"use client";

import React from 'react';
import * as LucideIcons from 'lucide-react';

interface EmptyStateProps {
  icon?: keyof typeof LucideIcons;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon = 'Inbox',
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  const IconComponent = (LucideIcons[icon] || LucideIcons.Inbox) as any;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-[#141C24] border border-[#263442] rounded-[10px] ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#18222C] border border-[#263442] flex items-center justify-center text-[#6E7B87] mb-3.5">
        <IconComponent className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-[#F3F6F8] mb-1">{title}</h4>
      <p className="text-xs text-[#A7B2BD] max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-3.5 py-1.5 bg-[#37B9FF] text-[#071018] rounded-[7px] text-xs font-semibold hover:bg-[#37B9FF]/90 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
