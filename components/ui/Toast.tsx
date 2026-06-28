'use client';

import { useEffect } from 'react';
import { CheckIcon, CloseIcon, AlertIcon } from '@/components/ui/Icon';

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toast: ToastData;
  onClose: () => void;
}

const TOAST_CONFIG = {
  success: { IconComp: CheckIcon, color: 'var(--green)', borderColor: 'var(--green-muted)' },
  error: { IconComp: CloseIcon, color: 'var(--red)', borderColor: 'var(--red)' },
  info: { IconComp: AlertIcon, color: 'var(--blue)', borderColor: 'var(--blue)' },
};

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = TOAST_CONFIG[toast.type];
  const { IconComp } = config;

  return (
    <div
      className="fixed top-20 right-4 z-[60] flex items-start gap-3 px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border shadow-[0_4px_20px_rgba(0,0,0,0.3)] animate-fade-in-up"
      style={{ borderLeft: `3px solid ${config.color}`, borderTopColor: 'var(--border-default)', borderRightColor: 'var(--border-default)', borderBottomColor: 'var(--border-default)' }}
    >
      <span className="mt-0.5" style={{ color: config.color }}>
        <IconComp size={16} />
      </span>
      <span className="text-sm text-[var(--text-primary)] pr-2">{toast.message}</span>
      <button
        onClick={onClose}
        className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] ml-2"
        aria-label="关闭"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}

export function useToast() {
  // This hook will be used in parent components
  // For simplicity, we'll implement toast management inline in the page
  return {};
}
