'use client';

import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = '确认',
  cancelLabel = '取消',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onCancel]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onCancel();
    }
  };

  const confirmColor = variant === 'danger' ? 'var(--red)' : 'var(--green)';

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-[80] m-auto max-w-md w-[calc(100%-2rem)] p-0 bg-transparent backdrop:bg-[rgba(0,0,0,0.5)] open:backdrop:bg-[rgba(0,0,0,0.5)] animate-fade-in-up"
      onClick={handleBackdropClick}
      onClose={onCancel}
    >
      <div
        className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-elevated)]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
          </div>
          <span className="ml-2 text-xs font-mono text-[var(--text-tertiary)]">
            {variant === 'danger' ? 'confirm-delete.sh' : 'confirm.sh'}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-bold text-[var(--text-primary)] mb-2">
            {title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 bg-[var(--bg-elevated)]">
          <button
            onClick={onCancel}
            className="btn-primary px-4 py-2 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] font-mono text-sm transition-all duration-200 hover:border-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="btn-primary px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all duration-200 hover:shadow-[0_0_15px_rgba(0,0,0,0.2)]"
            style={{
              backgroundColor: confirmColor,
              color: confirmColor === 'var(--red)' ? 'white' : 'var(--bg-primary)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
