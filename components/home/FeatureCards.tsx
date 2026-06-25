'use client';

import { useScrollReveal, getScrollRevealStyle } from '@/hooks/useScrollReveal';

interface Feature {
  number: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  hoverColor: string;
}

const features: Feature[] = [
  {
    number: '01',
    icon: '🔍',
    title: 'Bug 诊断',
    description: '用自然语言描述你的烦恼，AI 自动生成结构化 Bug Report',
    tags: ['核心功能', 'AI 驱动'],
    hoverColor: 'var(--green)',
  },
  {
    number: '02',
    icon: '🔧',
    title: '修复追踪',
    description: '选择修复方案，每日签到记录进度，数据可视化追踪',
    tags: ['进度管理', '习惯养成'],
    hoverColor: 'var(--blue)',
  },
  {
    number: '03',
    icon: '🌐',
    title: 'Bug 图鉴',
    description: '浏览社区热门人生 Bug，"我也有这个Bug"一键共鸣',
    tags: ['社区', '共鸣'],
    hoverColor: 'var(--orange)',
  },
  {
    number: '04',
    icon: '🏆',
    title: '成就系统',
    description: '修复 Bug 解锁程序员风格成就，收集你的人生 Patch 徽章',
    tags: ['游戏化', '激励'],
    hoverColor: 'var(--purple)',
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`relative p-5 sm:p-6 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] card-hover group overflow-hidden ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={getScrollRevealStyle({ direction: 'up', delay: index * 100 })}
    >
      {/* Top color line */}
      <div className="feature-card-line" style={{ backgroundColor: feature.hoverColor }} />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <span className="font-mono text-4xl font-bold text-[var(--text-tertiary)] opacity-30">
            {feature.number}
          </span>
          <span className="text-2xl">{feature.icon}</span>
        </div>
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          {feature.title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
          {feature.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {feature.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[10px] font-mono rounded-md border border-[var(--border-default)] text-[var(--text-tertiary)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeatureCards() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div
          ref={titleRef}
          className="flex items-center gap-3 mb-10"
          style={getScrollRevealStyle({ direction: 'up' })}
        >
          <div className="w-1 h-8 bg-[var(--green)] rounded-full" />
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            核心功能
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.number} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
