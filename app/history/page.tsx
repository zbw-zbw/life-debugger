'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBugStore, StoredBug } from '@/hooks/useBugStore';
import BugReportCard from '@/components/bug/BugReportCard';
import SeverityBadge from '@/components/ui/SeverityBadge';
import Toast, { ToastData } from '@/components/ui/Toast';
import { AlertIcon, WrenchIcon, CheckIcon, ClipboardIcon } from '@/components/ui/Icon';

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

export default function HistoryPage() {
  const { bugs, stats, loaded, deleteBug, selectPatch, resolveBug } = useBugStore();
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  const filteredBugs = filter === 'ALL'
    ? bugs
    : bugs.filter(bug => bug.status === filter);

  const handleDelete = (bugId: string, title: string) => {
    if (window.confirm(`确定要删除 Bug「${title}」吗？此操作不可撤销。`)) {
      deleteBug(bugId);
      if (expandedId === bugId) setExpandedId(null);
      setToast({ id: Date.now().toString(), type: 'info', message: `Bug「${title}」已删除` });
    }
  };

  const handleSelectPatch = (bugId: string, patchId: string, patchName: string) => {
    selectPatch(bugId, patchId, patchName);
    setToast({ id: Date.now().toString(), type: 'success', message: `修复方案「${patchName}」已激活` });
  };

  const handleResolve = (bugId: string) => {
    resolveBug(bugId);
    setToast({ id: Date.now().toString(), type: 'success', message: 'Bug 已标记为修复！' });
  };

  const toggleExpand = (bugId: string) => {
    setExpandedId(prev => prev === bugId ? null : bugId);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="font-mono text-sm text-[var(--text-tertiary)]">加载中...</div>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Bug 历史</h1>
          </div>
          <p className="text-[var(--text-secondary)] pl-4">查看和管理你的人生 Bug 档案</p>
        </div>

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
                    <div className="flex items-center gap-2">
                      {bug.impactAreas.slice(0, 2).map((area) => (
                        <span key={area} className="px-2 py-0.5 text-[10px] font-mono rounded-md border border-[var(--border-default)] text-[var(--text-tertiary)]">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-tertiary)]">
                      <span>预计{bug.fixDays}天修复</span>
                      <span>置信度 {bug.confidence}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDelete(bug.id, bug.title)}
                        className="text-xs font-mono text-[var(--red)] hover:opacity-100 opacity-60 transition-opacity"
                      >
                        删除
                      </button>
                      <button
                        onClick={() => toggleExpand(bug.id)}
                        className="text-xs font-mono text-[var(--blue)] hover:text-[var(--green)] transition-colors"
                      >
                        {isExpanded ? '收起 ↑' : '查看详情 ↓'}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-[var(--border-default)] p-4 sm:p-5 bg-[var(--bg-primary)]/50">
                    <BugReportCard
                      bug={bug}
                      interactive={true}
                      selectedPatchId={bug.selectedPatchId}
                      onSelectPatch={(patchId, patchName) => handleSelectPatch(bug.id, patchId, patchName)}
                      onResolve={() => handleResolve(bug.id)}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {filteredBugs.length === 0 && (
            <div className="text-center py-16">
              {bugs.length === 0 ? (
                <>
                  <div className="font-mono text-4xl mb-4">🐛</div>
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
                  <ClipboardIcon className="mx-auto mb-3 text-[var(--text-tertiary)]" size={40} />
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
