'use client';

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-mono text-sm text-[var(--text-tertiary)]">
            © 2026 人生Debug器
          </div>
          <div className="flex items-center gap-2 font-mono text-sm text-[var(--text-secondary)]">
            <span>system status: online</span>
            <span className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse-dot" />
          </div>
        </div>
      </div>
    </footer>
  );
}
