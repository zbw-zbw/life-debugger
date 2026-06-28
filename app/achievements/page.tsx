'use client';

import { useState } from 'react';
import { MOCK_ACHIEVEMENTS, RARITY_CONFIG } from '@/lib/mockData';
import { Achievement } from '@/lib/mockData';
import { useBugStore } from '@/hooks/useBugStore';
import {
  BugIcon, SearchIcon, SpyIcon, WrenchIcon, ToolsIcon,
  TargetIcon, MoonIcon, CupIcon, RunningIcon, CrownIcon,
  LockIcon, TrophyIcon, MedalIcon,
} from '@/components/ui/Icon';

const iconMap: Record<string, React.FC<{ className?: string; size?: number }>> = {
  bug: BugIcon,
  search: SearchIcon,
  spy: SpyIcon,
  wrench: WrenchIcon,
  tools: ToolsIcon,
  target: TargetIcon,
  moon: MoonIcon,
  cup: CupIcon,
  running: RunningIcon,
  crown: CrownIcon,
};

type FilterCategory = 'ALL' | '诊断' | '修复' | '特殊';

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

interface AchievementViewModel extends Achievement {
  unlocked: boolean;
  unlockedAt?: string;
}

function AchievementCard({ achievement }: { achievement: AchievementViewModel }) {
  const rarity = RARITY_CONFIG[achievement.rarity];
  const IconComp = iconMap[achievement.icon] || BugIcon;

  return (
    <div
      className={`relative rounded-xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        achievement.unlocked
          ? 'hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]'
          : 'opacity-60'
      }`}
      style={{
        borderColor: achievement.unlocked ? rarity.borderColor : 'var(--border-default)',
        backgroundColor: achievement.unlocked ? rarity.bgColor : 'var(--bg-secondary)',
      }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className={achievement.unlocked ? 'text-[var(--text-primary)]' : 'grayscale blur-[1px]'}>
            {achievement.unlocked ? <IconComp size={32} /> : <LockIcon size={32} />}
          </span>
          <span
            className="px-2 py-0.5 text-[10px] font-mono rounded border"
            style={{
              color: rarity.color,
              borderColor: achievement.unlocked ? rarity.borderColor : 'var(--border-default)',
            }}
          >
            {rarity.label}
          </span>
        </div>
        <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">{achievement.title}</h3>
        {achievement.unlocked ? (
          <>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{achievement.description}</p>
            {achievement.unlockedAt && (
              <div className="mt-3">
                <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
                  解锁于 {formatDisplayDate(achievement.unlockedAt)}
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
              解锁条件：{achievement.condition}
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-tertiary)]">
              <LockIcon size={10} />
              <span>未解锁</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const [filter, setFilter] = useState<FilterCategory>('ALL');
  const { unlockedAchievements, loaded } = useBugStore();

  const achievements: AchievementViewModel[] = MOCK_ACHIEVEMENTS.map(a => {
    const unlock = unlockedAchievements.find(u => u.id === a.id);
    return {
      ...a,
      unlocked: !!unlock,
      unlockedAt: unlock?.unlockedAt,
    };
  });

  const filteredAchievements = filter === 'ALL'
    ? achievements
    : achievements.filter(a => a.category === filter);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = Math.round((unlockedCount / totalCount) * 100);

  const filledBlocks = Math.round((unlockedCount / totalCount) * 10);
  const emptyBlocks = 10 - filledBlocks;
  const progressText = '\u2588'.repeat(filledBlocks) + '\u2591'.repeat(emptyBlocks);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-[var(--purple)] rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              成就系统
            </h1>
          </div>
          <p className="text-[var(--text-secondary)] pl-4">
            收集你的人生 Patch 徽章，见证每一步成长
          </p>
        </div>

        {/* Progress */}
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <TrophyIcon size={24} />
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  解锁进度
                </div>
                <div className="text-xs font-mono text-[var(--text-tertiary)]">
                  {progressText} {unlockedCount}/{totalCount}
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-[var(--purple)]">{progress}%</div>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progress}%`,
                backgroundColor: 'var(--purple)',
              }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['ALL', '诊断', '修复', '特殊'] as FilterCategory[]).map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`btn-primary px-3 py-1.5 rounded-lg text-sm font-mono transition-all duration-200 ${
                filter === category
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-default)]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {category === 'ALL' ? '全部' : category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {!loaded && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="skeleton w-6 h-6 rounded" />
                  <div>
                    <div className="skeleton h-4 w-24 rounded mb-2" />
                    <div className="skeleton h-3 w-32 rounded" />
                  </div>
                </div>
                <div className="skeleton h-8 w-12 rounded" />
              </div>
              <div className="skeleton h-2 w-full rounded-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="skeleton w-8 h-8 rounded" />
                    <div className="skeleton h-4 w-10 rounded" />
                  </div>
                  <div className="skeleton h-4 w-20 rounded mb-2" />
                  <div className="skeleton h-3 w-full rounded mb-1" />
                  <div className="skeleton h-3 w-2/3 rounded" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievement Grid */}
        {loaded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        )}

        {loaded && filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <MedalIcon className="mx-auto mb-3 text-[var(--text-tertiary)]" size={40} />
            <p className="text-[var(--text-secondary)]">该分类下暂无成就</p>
          </div>
        )}
      </div>
    </div>
  );
}
