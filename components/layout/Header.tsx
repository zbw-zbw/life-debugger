'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { path: '/debug', label: '~/debug' },
  { path: '/history', label: '~/history' },
  { path: '/achievements', label: '~/achievements' },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  // Lock body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className={`flex items-center gap-3 transition-opacity duration-150 ${isActive('/') ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`} onClick={() => setMenuOpen(false)}>
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md border border-[var(--border-default)] bg-[var(--bg-secondary)]">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f56' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#27c93f' }} />
              </div>
            </div>
            <span className="font-mono text-lg font-bold text-[var(--green)]">
              人生Debug器
            </span>
            <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-tertiary)] border border-[var(--border-default)] rounded-md">
              v0.1.0
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`font-mono text-sm transition-colors duration-150 relative pb-1 ${
                  isActive(item.path)
                    ? 'text-[var(--green)] nav-active-indicator'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col items-center justify-center gap-1.5 w-11 h-11 relative z-50"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="菜单"
            aria-expanded={menuOpen}
          >
            <span className={`block w-5 h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${menuOpen ? 'opacity-0 scale-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[var(--text-primary)] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-0 top-16 z-40 drawer-overlay ${
          menuOpen ? 'is-open pointer-events-auto' : 'pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      />
      <div
        ref={drawerRef}
        className={`md:hidden fixed top-16 right-0 bottom-0 w-60 bg-[var(--bg-secondary)] drawer-panel z-40 ${
          menuOpen ? 'is-open pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <nav className="px-4 py-6">
          {/* Home link in drawer */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={`flex items-center gap-3 font-mono text-sm py-3.5 px-3 rounded-lg transition-colors border-l-2 mb-1 ${
              isActive('/')
                ? 'text-[var(--green)] bg-[var(--bg-tertiary)] border-[var(--green)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border-transparent'
            }`}
          >
            <span className="text-[var(--text-tertiary)]">{'>'}</span>
            <span>~</span>
            <span className="text-[var(--text-tertiary)] text-xs">首页</span>
          </Link>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 font-mono text-sm py-3.5 px-3 rounded-lg transition-colors border-l-2 ${
                isActive(item.path)
                  ? 'text-[var(--green)] bg-[var(--bg-tertiary)] border-[var(--green)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border-transparent'
              }`}
            >
              <span className="text-[var(--text-tertiary)]">{'>'}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
