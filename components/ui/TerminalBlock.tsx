'use client';

import { ReactNode } from 'react';

interface TerminalBlockProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export default function TerminalBlock({ children, title = 'terminal', className = '' }: TerminalBlockProps) {
  return (
    <div className={`rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-elevated)]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[var(--red)]" />
          <div className="w-3 h-3 rounded-full bg-[var(--yellow)]" />
          <div className="w-3 h-3 rounded-full bg-[var(--green)]" />
        </div>
        <span className="ml-2 text-xs font-mono text-[var(--text-tertiary)]">{title}</span>
      </div>
      <div className="p-4 font-mono text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
