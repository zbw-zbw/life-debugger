'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useBugStore } from '@/hooks/useBugStore';
import BugReportCard from '@/components/bug/BugReportCard';
import SeverityBadge from '@/components/ui/SeverityBadge';
import Toast, { ToastData } from '@/components/ui/Toast';
import StatsCharts from '@/components/history/StatsCharts';
import { useToastId } from '@/hooks/useToastId';
import { AlertIcon, WrenchIcon, CheckIcon, ClipboardIcon, BugIcon, ChevronDownIcon, ChevronUpIcon } from '@/components/ui/Icon';

type FilterStatus = 'ALL' | 'OPEN' | 'FIXING' | 'RESOLVED';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.FC<{ className?: string; size?: number }>; bgColor: string }> = {
  OPEN: { label: 'OPEN', color: 'var(--yellow)', icon: AlertIcon, bgColor: 'rgba(227,179,65,0.1)' },
  FIXING: { label: 'FIXING', color: 'var(--blue)', icon: WrenchIcon, bgColor: 'rgba(88,166,255,0.1)' },
  RESOLVED: { label: 'RESOLVED', color: 'var(--green)', icon: CheckIcon, bgColor: 'rgba(57,211,83,0.1)' },
};

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-5 w-12 rounded-full" />
      </div>
      <div className="skeleton h-4 w-2/3 rounded mb-2" />
      <div className="flex gap-2 mb-4">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-3 w-24 rounded" />
      </div>
      <div className="skeleton h-3 w-full rounded mb-2" />
      <div className="skeleton h-3 w-3/4 rounded" />
    </div>
  );
}

export default function HistoryPage() {
  const { bugs, stats, loaded, deleteBug, selectPatch, resolveBug, checkIn } = useBugStore();
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);
  const nextToastId = useToastId();

  const filteredBugs = filter === 'ALL'
    ? bugs
    : bugs.filter(bug => bug.status === filter);

  const showToast = useCallback((type: ToastData['type'], message: string) => {
    setToast({ id: nextToastId(), type, message });
  }, [nextToastId]);

  const handleDelete = (bugId: string, title: string) => {
    if (window.confirm(`确定要删除 Bug「${title}」吗？此操作不可撤销。`)) {
      deleteBug(bugId);
      if (expandedId === bugId) setExpandedId(null);
      showToast('info', `Bug「${title}」已删除`);
    }
  };

  const handleSelectPatch = (bugId: string, patchId: string, patchName: string) => {
    selectPatch(bugId, patchId, patchName);
    showToast('success', `修复方案「${patchName}」已激活`);
  };

  const handleResolve = (bugId: string) => {
    resolveBug(bugId);
    showToast('success', 'Bug 已标记为修复');
  };

  const handleCheckIn = (bugId: string) => {
    checkIn(bugId);
    showToast('success', '今日打卡成功，修复进度 +1');
  };

  const toggleExpand = (bugId: string) => {
    setExpandedId(prev => prev === bugId ? null : bugId);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="skeleton h-8 w-48 rounded mb-2" />
            <div className="skeleton h-4 w-64 rounded" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4 text-center">
                <div className="skeleton h-8 w-12 rounded mx-auto mb-2" />
                <div className="skeleton h-3 w-16 rounded mx-auto" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-[var(--blue)] rounded-full" />
            <h1 className="text-xl sm:text-3xl font-bold text-[var(--text-primary)]">Bug 历史</h1>
          </div>
          <p className="text-[var(--text-secondary)] pl-4 text-sm sm:text-base">查看和管理你的人生 Bug 档案</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: '总计', value: stats.total, color: 'var(--text-primary)' },
            { label: '待处理', value: stats.open, color: 'var(--yellow)' },
            { label: '修复中', value: stats.fixing, color: 'var(--blue)' },
            { label: '已修复', value: stats.resolved, color: 'var(--green)' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-4 text-center">
              <div className="text-2xl font-bold font-mono" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs font-mono text-[var(--text-tertiary)] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Data Visualization Charts */}
        <StatsCharts />

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['ALL', 'OPEN', 'FIXING', 'RESOLVED'] as FilterStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`btn-primary px-4 py-2.5 rounded-lg text-sm font-mono transition-all duration-200 ${
                filter === status
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-default)]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {status === 'ALL' ? '全部' : status}
            </button>
          ))}
        </div>

        {/* Bug List */}
        <div className="space-y-4">
          {filteredBugs.map((bug) => {
            const status = STATUS_CONFIG[bug.status];
            const StatusIcon = status.icon;
            const isExpanded = expandedId === bug.id;

            return (
              <div key={bug.id} className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden">
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
                        <span>{formatDisplayDate(bug.createdAt)}</span>
                      </div>
                      {bug.status === 'FIXING' && bug.selectedPatchName && (
                        <div className="mt-2 text-xs font-mono text-[var(--blue)]">
                          当前方案：{bug.selectedPatchName}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {bug.impactAreas.slice(0, 2).map((area) => (
                        <span key={area} className="px-2 py-0.5 text-[10px] font-mono rounded-md border border-[var(--border-default)] text-[var(--text-tertiary)]">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-tertiary)]">
                      <span>预计{bug.fixDays}天修复</span>
                      <span>置信度 {bug.confidence}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDelete(bug.id, bug.title)}
                        className="btn-primary px-3 py-2 text-xs font-mono text-[var(--red)] opacity-60 hover:opacity-100 transition-opacity rounded-lg"
                      >
                        删除
                      </button>
                      <button
                        onClick={() => toggleExpand(bug.id)}
                        className="btn-primary inline-flex items-center gap-1 px-3 py-2 text-xs font-mono text-[var(--blue)] hover:text-[var(--green)] transition-colors rounded-lg"
                      >
                        {isExpanded ? (
                          <>
                            <span>收起</span>
                            <ChevronUpIcon size={12} />
                          </>
                        ) : (
                          <>
                            <span>查看详情</span>
                            <ChevronDownIcon size={12} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Detail with smooth transition */}
                <div className={`expand-container ${isExpanded ? 'is-open' : ''}`}>
                  <div className="expand-inner">
                    <div className="p-4 sm:p-5 bg-[var(--bg-primary)]/50">
                      <BugReportCard
                      bug={bug}
                      interactive={true}
                      selectedPatchId={bug.selectedPatchId}
                      onSelectPatch={(patchId, patchName) => handleSelectPatch(bug.id, patchId, patchName)}
                      onResolve={() => handleResolve(bug.id)}
                      onCheckIn={() => handleCheckIn(bug.id)}
                    />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {filteredBugs.length === 0 && (
            <div className="text-center py-16">
              {bugs.length === 0 ? (
                <>
                  <div className="mb-4 flex justify-center text-[var(--text-tertiary)]">
                    <BugIcon size={40} />
                  </div>
                  <div className="font-mono text-sm text-[var(--text-secondary)] mb-2">
                    {'>'} git log --bugs
                  </div>
                  <div className="font-mono text-sm text-[var(--text-tertiary)] mb-6">
                    {'>'} (empty) 还没有诊断过任何 Bug
                  </div>
                  <Link
                    href="/debug"
                    className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--green)] text-[var(--bg-primary)] font-mono font-bold text-sm"
                  >
                    $ life-debug start
                  </Link>
                </>
              ) : (
                <>
                  <div className="mb-3 flex justify-center text-[var(--text-tertiary)]">
                    <ClipboardIcon size={40} />
                  </div>
                  <p className="text-[var(--text-secondary)]">该状态下暂无 Bug 记录</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
