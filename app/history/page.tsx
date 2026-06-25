'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MOCK_HISTORY } from '@/lib/mockData';
import { BugReport } from '@/types/bug';
import SeverityBadge from '@/components/ui/SeverityBadge';
import { useScrollReveal, getScrollRevealStyle } from '@/hooks/useScrollReveal';
import { useBugStore } from '@/hooks/useBugStore';
import { ClipboardIcon } from '@/components/ui/Icon';
import { AlertIcon, WrenchIcon, CheckIcon } from '@/components/ui/Icon';

type FilterStatus = 'ALL' | 'OPEN' | 'FIXING' | 'RESOLVED';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.FC<{ className?: string; size?: number }>; bgColor: string }> = {
  OPEN: { label: 'OPEN', color: 'var(--yellow)', icon: AlertIcon, bgColor: 'rgba(227,179,65,0.1)' },
  FIXING: { label: 'FIXING', color: 'var(--blue)', icon: WrenchIcon, bgColor: 'rgba(88,166,255,0.1)' },
  RESOLVED: { label: 'RESOLVED', color: 'var(--green)', icon: CheckIcon, bgColor: 'rgba(57,211,83,0.1)' },
};

function BugListItem({ bug, index, onDelete, isDemo }: { bug: BugReport; index: number; onDelete?: (id: string) => void; isDemo?: boolean }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const status = STATUS_CONFIG[bug.status] || STATUS_CONFIG.OPEN;
  const StatusIcon = status.icon;

  return (
    <div
      ref={ref}
      className={`rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden card-hover transition-all duration-600 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
      }`}
      style={getScrollRevealStyle({ direction: 'up', delay: index * 80 })}
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-[var(--text-tertiary)]">#{bug.id}</span>
              <SeverityBadge severity={bug.severity} showLabel={false} />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">{bug.title}</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono"
                style={{ color: status.color, backgroundColor: status.bgColor }}
              >
                <StatusIcon className="text-xs" size={12} />
                <span>{status.label}</span>
              </span>
              <span className="text-[var(--text-tertiary)]">·</span>
              <span>已触发 {bug.triggerCount} 次</span>
              <span className="text-[var(--text-tertiary)]">·</span>
              <span>{bug.createdAt}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {bug.impactAreas.slice(0, 2).map((area) => (
              <span
                key={area}
                className="px-2 py-0.5 text-[10px] font-mono rounded-md border border-[var(--border-default)] text-[var(--text-tertiary)]"
              >
                {area}
              </span>
            ))}
            {bug.impactAreas.length > 2 && (
              <span className="text-[10px] text-[var(--text-tertiary)]">+{bug.impactAreas.length - 2}</span>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-tertiary)]">
            <span>预计{bug.fixDays}天修复</span>
            <span>置信度 {bug.confidence}%</span>
          </div>
          <div className="flex items-center gap-3">
            {!isDemo && onDelete && (
              <button
                onClick={() => {
                  if (window.confirm('确定要删除这个 Bug 记录吗？')) {
                    onDelete(bug.id);
                  }
                }}
                className="text-xs font-mono text-[var(--red)] hover:text-[var(--text-primary)] transition-colors"
              >
                删除
              </button>
            )}
            <Link
              href={`/debug`}
              className="text-xs font-mono text-[var(--blue)] hover:text-[var(--green)] transition-colors"
            >
              查看详情 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, index }: { label: string; value: number; color: string; index: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4 text-center transition-all duration-600 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
      }`}
      style={getScrollRevealStyle({ direction: 'up', delay: index * 80 })}
    >
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-xs font-mono text-[var(--text-tertiary)] mt-1">{label}</div>
    </div>
  );
}

export default function HistoryPage() {
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>();
  const { bugs, loaded, deleteBug } = useBugStore();

  // 始终至少显示 mock 数据
  const displayBugs = loaded && bugs.length > 0 ? bugs : MOCK_HISTORY;
  const isShowingDemo = !loaded || bugs.length === 0;

  // mock 数据的统计
  const mockStats = {
    total: MOCK_HISTORY.length,
    open: MOCK_HISTORY.filter(b => b.status === 'OPEN').length,
    fixing: MOCK_HISTORY.filter(b => b.status === 'FIXING').length,
    resolved: MOCK_HISTORY.filter(b => b.status === 'RESOLVED').length,
  };
  const stats = loaded && bugs.length > 0 ? {
    total: bugs.length,
    open: bugs.filter(b => b.status === 'OPEN').length,
    fixing: bugs.filter(b => b.status === 'FIXING').length,
    resolved: bugs.filter(b => b.status === 'RESOLVED').length,
  } : mockStats;

  const filteredBugs = filter === 'ALL'
    ? displayBugs
    : displayBugs.filter(bug => bug.status === filter);

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
            <div className="w-1 h-6 bg-[var(--blue)] rounded-full" />
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              Bug 历史
            </h1>
          </div>
          <p className="text-[var(--text-secondary)] pl-4">
            查看和管理你的人生 Bug 档案
          </p>
        </div>

        {/* Stats - 2x2 on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="总计" value={stats.total} color="var(--text-primary)" index={0} />
          <StatCard label="待处理" value={stats.open} color="var(--yellow)" index={1} />
          <StatCard label="修复中" value={stats.fixing} color="var(--blue)" index={2} />
          <StatCard label="已修复" value={stats.resolved} color="var(--green)" index={3} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['ALL', 'OPEN', 'FIXING', 'RESOLVED'] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`btn-primary px-3 py-1.5 rounded-lg text-sm font-mono transition-all duration-200 ${
                filter === status
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-default)]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {status === 'ALL' ? '全部' : status}
            </button>
          ))}
        </div>

        {/* Demo hint */}
        {isShowingDemo && (
          <div className="mb-4 px-4 py-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] text-xs font-mono text-[var(--text-tertiary)]">
            {'>'} 以下为示例数据。前往 ~/debug 诊断你的第一个Bug，诊断结果将保存在这里。
          </div>
        )}

        {/* Bug List */}
        <div className="space-y-4">
          {filteredBugs.map((bug, i) => (
            <BugListItem key={bug.id} bug={bug} index={i} onDelete={deleteBug} isDemo={isShowingDemo} />
          ))}
          {filteredBugs.length === 0 && (
            <div className="text-center py-12">
              <ClipboardIcon className="mx-auto mb-3 text-[var(--text-tertiary)]" size={40} />
              <p className="text-[var(--text-secondary)]">该状态下暂无 Bug 记录</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
