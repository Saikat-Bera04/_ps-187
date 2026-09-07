"use client";

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  message = 'Unable to load surveillance data. Check network connection and retry.',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 bg-[#141C24] border border-[#FF5C67]/30 rounded-[10px] ${className}`}
    >
      <div className="w-11 h-11 rounded-full bg-[#FF5C67]/10 border border-[#FF5C67]/20 flex items-center justify-center text-[#FF5C67] mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-[#F3F6F8] mb-1">Operational Request Failed</h4>
      <p className="text-xs text-[#A7B2BD] max-w-sm mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#18222C] border border-[#344454] hover:bg-[#1E2A35] text-[#F3F6F8] rounded-[7px] text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#37B9FF]" />
          Retry
        </button>
      )}
    </div>
  );
}
