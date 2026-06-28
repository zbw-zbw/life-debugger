'use client';

import { useEffect } from 'react';
import { useBugStore } from '@/hooks/useBugStore';
import { MOCK_ACHIEVEMENTS, RARITY_CONFIG } from '@/lib/mockData';
import { TrophyIcon, CloseIcon } from '@/components/ui/Icon';

export default function AchievementToast() {
  const { newlyUnlocked, shiftNewlyUnlocked } = useBugStore();

  const currentId = newlyUnlocked[0] ?? null;
  const current = currentId ? MOCK_ACHIEVEMENTS.find(a => a.id === currentId) : null;

  // Auto-advance queue after 5s via async callback, not synchronous setState
  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => shiftNewlyUnlocked(), 5000);
    return () => clearTimeout(timer);
  }, [current, shiftNewlyUnlocked]);

  if (!current) return null;

  const rarity = RARITY_CONFIG[current.rarity];

  return (
    <div
      key={current.id}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] achievement-toast-enter"
      role="alert"
      aria-live="assertive"
    >
      <div
        className="relative flex items-center gap-4 px-5 py-4 rounded-xl bg-[var(--bg-secondary)] border-2 shadow-[0_8px_40px_rgba(0,0,0,0.4)] min-w-[300px] max-w-[90vw]"
        style={{ borderColor: rarity.borderColor, backgroundColor: rarity.bgColor }}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none achievement-glow"
          style={{ boxShadow: `0 0 30px ${rarity.color}40` }}
        />

        {/* Icon */}
        <div
          className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${rarity.color}20`, color: rarity.color }}
        >
          <TrophyIcon size={28} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: rarity.color }}>
              成就解锁
            </span>
            <span
              className="px-1.5 py-0.5 text-[9px] font-mono rounded border"
              style={{ color: rarity.color, borderColor: rarity.borderColor }}
            >
              {rarity.label}
            </span>
          </div>
          <div className="text-sm font-bold text-[var(--text-primary)] truncate">
            {current.title}
          </div>
          <div className="text-xs text-[var(--text-secondary)] truncate">
            {current.description}
          </div>
        </div>

        {/* Close */}
        <button
          onClick={() => shiftNewlyUnlocked()}
          className="btn-primary flex-shrink-0 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="关闭"
        >
          <CloseIcon size={16} />
        </button>
      </div>
    </div>
  );
}
