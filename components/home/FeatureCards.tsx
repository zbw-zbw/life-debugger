'use client';

import Link from 'next/link';
import { useScrollReveal, getScrollRevealStyle } from '@/hooks/useScrollReveal';
import { SearchIcon, WrenchIcon, ShareIcon, TrophyIcon } from '@/components/ui/Icon';

interface Feature {
  number: string;
  icon: React.FC<{ className?: string; size?: number }>;
  title: string;
  description: string;
  tags: string[];
  hoverColor: string;
  href: string;
}

const features: Feature[] = [
  {
    number: '01',
    icon: SearchIcon,
    title: 'Bug 诊断',
    description: '用自然语言描述你的烦恼，AI 自动生成结构化 Bug Report，包含根因分析和修复方案',
    tags: ['AI 驱动', '流式诊断'],
    hoverColor: 'var(--green)',
    href: '/debug',
  },
  {
    number: '02',
    icon: WrenchIcon,
    title: '修复追踪',
    description: '选择修复方案，每日打卡记录 streak，数据可视化追踪你的修复进度',
    tags: ['打卡 streak', '可视化'],
    hoverColor: 'var(--blue)',
    href: '/history',
  },
  {
    number: '03',
    icon: ShareIcon,
    title: '诊断分享',
    description: '将你的 Bug Report 一键分享给朋友，看看谁也有同样的"人生 Bug"',
    tags: ['Web Share', '社交'],
    hoverColor: 'var(--orange)',
    href: '/debug',
  },
  {
    number: '04',
    icon: TrophyIcon,
    title: '成就系统',
    description: '诊断、修复、打卡解锁程序员风格成就徽章，见证每一步成长',
    tags: ['游戏化', '激励'],
    hoverColor: 'var(--purple)',
    href: '/achievements',
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLAnchorElement>();

  return (
    <Link
      ref={ref}
      href={feature.href}
      className={`relative block p-5 sm:p-6 rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] card-hover group overflow-hidden transition-all duration-600 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
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
          <feature.icon className="text-2xl" size={24} />
        </div>
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          {feature.title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
          {feature.description}
        </p>
        <div className="flex items-center justify-between">
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
          <span className="font-mono text-xs text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {'->'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function FeatureCards() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div
          ref={titleRef}
          className={`flex items-center gap-3 mb-10 transition-all duration-600 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}
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
