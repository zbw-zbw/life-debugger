'use client';

import { useState } from 'react';
import { MOCK_ACHIEVEMENTS, RARITY_CONFIG } from '@/lib/mockData';
import { Achievement } from '@/lib/mockData';
import { useScrollReveal, getScrollRevealStyle } from '@/hooks/useScrollReveal';
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

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const rarity = RARITY_CONFIG[achievement.rarity];
  const IconComp = iconMap[achievement.icon] || BugIcon;

  return (
    <div
      ref={ref}
      className={`relative rounded-xl border overflow-hidden transition-all duration-600 ${
        achievement.unlocked
          ? 'hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]'
          : 'opacity-50'
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}
      style={{
        ...getScrollRevealStyle({ direction: 'up', delay: index * 80 }),
        borderColor: achievement.unlocked ? rarity.borderColor : 'var(--border-default)',
        backgroundColor: achievement.unlocked ? rarity.bgColor : 'var(--bg-secondary)',
      }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className={achievement.unlocked ? 'emoji-float' : 'grayscale blur-[1px]'}>
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
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{achievement.description}</p>
        {achievement.unlocked && achievement.unlockedAt && (
          <div className="mt-3 pt-3 border-t border-[var(--border-default)]/50">
            <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
              解锁于 {achievement.unlockedAt}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const [filter, setFilter] = useState<FilterCategory>('ALL');
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: progressRef, isVisible: progressVisible } = useScrollReveal<HTMLDivElement>();
  const { unlockedAchievements, loaded } = useBugStore();

  // 始终使用 MOCK 数据，加载后用真实解锁覆盖
  const achievements = loaded
    ? MOCK_ACHIEVEMENTS.map(a => {
        const unlock = unlockedAchievements.find(u => u.id === a.id);
        if (unlock) return { ...a, unlocked: true, unlockedAt: unlock.unlockedAt };
        return a;
      })
    : MOCK_ACHIEVEMENTS;

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
        <div
          ref={headerRef}
          className={`mb-8 transition-all duration-600 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}
          style={getScrollRevealStyle({ direction: 'up' })}
        >
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
        <div
          ref={progressRef}
          className={`rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5 mb-8 transition-all duration-600 ${progressVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}
          style={getScrollRevealStyle({ direction: 'up', delay: 100 })}
        >
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

        {/* Achievement Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement, i) => (
            <AchievementCard key={achievement.id} achievement={achievement} index={i} />
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <MedalIcon className="mx-auto mb-3 text-[var(--text-tertiary)]" size={40} />
            <p className="text-[var(--text-secondary)]">该分类下暂无成就</p>
          </div>
        )}
      </div>
    </div>
  );
}
