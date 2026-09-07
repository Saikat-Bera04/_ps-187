"use client";

import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-[#D8E0E6] bg-[#18222C] border border-[#344454] rounded-[7px] hover:bg-[#1E2A35] transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-xs font-semibold rounded-[7px] transition-colors flex items-center gap-1.5 ${
              isDestructive
                ? 'bg-[#FF5C67]/20 border border-[#FF5C67]/50 text-[#FF7A83] hover:bg-[#FF5C67]/30'
                : 'bg-[#37B9FF] text-[#071018] hover:bg-[#37B9FF]/90 font-bold'
            }`}
          >
            {isLoading && (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {confirmText}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3 py-2">
        <div
          className={`p-2.5 rounded-lg border flex-shrink-0 ${
            isDestructive
              ? 'bg-[#FF5C67]/10 border-[#FF5C67]/30 text-[#FF5C67]'
              : 'bg-[#37B9FF]/10 border-[#37B9FF]/30 text-[#37B9FF]'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm text-[#A7B2BD] leading-relaxed mt-0.5">{message}</p>
      </div>
    </Modal>
  );
}
