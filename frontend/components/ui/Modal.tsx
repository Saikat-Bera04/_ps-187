"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'md',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-[420px]',
    md: 'max-w-[520px]',
    lg: 'max-w-[650px]',
    xl: 'max-w-[800px]',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-[2px] animate-fade-in">
      <div
        className={`w-full ${widthClasses} bg-[#141C24] border border-[#344454] rounded-[12px] shadow-2xl overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#263442] bg-[#18222C]/50">
          <div>
            <h3 className="text-base font-semibold text-[#F3F6F8] leading-tight">{title}</h3>
            {description && (
              <p className="text-xs text-[#A7B2BD] mt-1 leading-normal">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[6px] text-[#6E7B87] hover:text-[#F3F6F8] hover:bg-[#18222C] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-5 py-3.5 border-t border-[#263442] bg-[#0F151C]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
