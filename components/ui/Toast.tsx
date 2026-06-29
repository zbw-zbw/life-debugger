'use client';

import { useEffect, useState } from 'react';
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
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 200);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 200);
  };

  const config = TOAST_CONFIG[toast.type];
  const { IconComp } = config;

  return (
    <div
      className={`fixed top-20 right-4 z-[60] flex items-start gap-3 px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-200 ${
        exiting ? 'opacity-0 translate-x-2' : 'animate-fade-in-up'
      }`}
      style={{ borderLeft: `3px solid ${config.color}`, borderTopColor: 'var(--border-default)', borderRightColor: 'var(--border-default)', borderBottomColor: 'var(--border-default)' }}
    >
      <span className="mt-0.5" style={{ color: config.color }}>
        <IconComp size={16} />
      </span>
      <span className="text-sm text-[var(--text-primary)] pr-2">{toast.message}</span>
      <button
        onClick={handleClose}
        className="btn-primary text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] ml-2"
        aria-label="关闭"
      >
        <CloseIcon size={14} />
      </button>
    </div>
  );
}
