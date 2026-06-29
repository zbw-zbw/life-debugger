'use client';

import { BugReport, Patch } from '@/types/bug';
import SeverityBadge from '@/components/ui/SeverityBadge';
import { computeStreak, hasCheckedInToday } from '@/lib/checkIn';
import {
  BugIcon, AlertIcon, WrenchIcon, CheckIcon, ClipboardIcon,
  SearchIcon, CalendarIcon, DiffDot,
} from '@/components/ui/Icon';

interface BugReportCardProps {
  bug: BugReport;
  interactive?: boolean;
  className?: string;
  selectedPatchId?: string | null;
  onSelectPatch?: (patchId: string, patchName: string) => void;
  onResolve?: () => void;
  onCheckIn?: () => void;
}

const SEVERITY_SIDE_COLORS: Record<string, string> = {
  P0: 'var(--severity-p0)',
  P1: 'var(--severity-p1)',
  P2: 'var(--severity-p2)',
  P3: 'var(--severity-p3)',
  P4: 'var(--severity-p4)',
};

const STATUS_CONFIG = {
  OPEN: { label: 'OPEN', color: 'var(--yellow)', icon: AlertIcon, bgColor: 'rgba(227,179,65,0.1)' },
  FIXING: { label: 'FIXING', color: 'var(--blue)', icon: WrenchIcon, bgColor: 'rgba(88,166,255,0.1)' },
  RESOLVED: { label: 'RESOLVED', color: 'var(--green)', icon: CheckIcon, bgColor: 'rgba(57,211,83,0.1)' },
};

export default function BugReportCard({
  bug,
  interactive = true,
  className = '',
  selectedPatchId: externalSelectedPatchId,
  onSelectPatch,
  onResolve,
  onCheckIn,
}: BugReportCardProps) {
  const currentStatus = STATUS_CONFIG[bug.status];
  const sideColor = SEVERITY_SIDE_COLORS[bug.severity] || 'var(--border-default)';
  const isHighSeverity = bug.severity === 'P0' || bug.severity === 'P1';

  const StatusIcon = currentStatus.icon;

  const checkInDates = bug.checkInDates ?? [];
  const streak = computeStreak(checkInDates);
  const checkedInToday = hasCheckedInToday(checkInDates);

  return (
    <div
      className={`relative rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden ${interactive ? 'card-hover' : ''} ${className}`}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: sideColor }}
      />

      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: 'linear-gradient(to bottom, var(--bg-elevated), transparent)' }}
      >
        <div className="flex items-center gap-2">
          <BugIcon className="text-base" size={16} />
          <span className="font-mono text-sm font-bold text-[var(--text-primary)]">Bug Report</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono ${isHighSeverity ? 'severity-pulse' : ''}`}
            style={{
              color: currentStatus.color,
              backgroundColor: currentStatus.bgColor,
            }}
          >
            <StatusIcon className="text-xs" size={12} />
            <span>{currentStatus.label}</span>
          </span>
          <span className="font-mono text-sm text-[var(--text-tertiary)]">#{bug.id}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">{bug.title}</h3>
          <div className="flex flex-wrap items-center gap-3">
            <SeverityBadge severity={bug.severity} />
            {bug.status === 'OPEN' && (
              <span className="text-sm text-[var(--text-secondary)]">
                已触发 {bug.triggerCount} 次
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {bug.impactAreas.map((area) => (
              <span
                key={area}
                className="px-2 py-0.5 text-xs font-mono rounded-md border border-[var(--border-default)] text-[var(--text-secondary)] bg-[var(--bg-tertiary)]"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-tertiary)] mb-2 uppercase tracking-wider">
            <ClipboardIcon className="text-xs" size={12} />
            复现步骤
          </h4>
          <ol className="space-y-2">
            {bug.reproSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)]">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--green-muted)]/20 text-[var(--green)] text-xs font-mono flex items-center justify-center">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider">
              <SearchIcon className="text-xs" size={12} />
              根因分析
            </h4>
            <span className="ai-badge px-1.5 py-0.5 text-[10px] font-mono rounded border text-[var(--text-tertiary)]">
              AI Generated
            </span>
          </div>
          <ul className="space-y-2">
            {bug.rootCauses.map((cause, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                <span className="text-[var(--orange)]">→</span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-tertiary)] mb-2 uppercase tracking-wider">
            <WrenchIcon className="text-xs" size={12} />
            修复方案
          </h4>
          <div className="space-y-2">
            {bug.patches.map((patch) => (
              <PatchItem
                key={patch.id}
                patch={patch}
                isSelected={externalSelectedPatchId === patch.id}
                isResolved={bug.status === 'RESOLVED'}
                isInteractive={interactive}
                onSelect={() => onSelectPatch?.(patch.id, patch.name)}
              />
            ))}
          </div>
        </div>

        {interactive && bug.status === 'FIXING' && (
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-[var(--border-default)] bg-[var(--bg-tertiary)] px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <CalendarIcon size={16} className="text-[var(--blue)]" />
                <span>连续打卡</span>
                <span className="font-mono font-bold text-[var(--blue)]">{streak}</span>
                <span>天</span>
              </div>
              <button
                onClick={onCheckIn}
                disabled={checkedInToday}
                className={`btn-primary inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                  checkedInToday
                    ? 'text-[var(--green)] border border-[var(--green)] opacity-60 cursor-default'
                    : 'bg-[var(--blue)] text-white hover:bg-[var(--blue)]/90'
                }`}
              >
                <CheckIcon size={12} />
                {checkedInToday ? '今日已打卡' : '今日打卡'}
              </button>
            </div>

            <button
              onClick={onResolve}
              className="btn-primary w-full py-2.5 rounded-lg bg-[var(--green)] text-[var(--bg-primary)] font-mono font-bold text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(57,211,83,0.3)]"
            >
              <span className="inline-flex items-center gap-1.5">
                <CheckIcon className="text-sm" size={14} />
                标记为已修复
              </span>
            </button>
          </div>
        )}

        {interactive && bug.status === 'RESOLVED' && (
          <div className="pt-2 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--green-muted)]/20 text-[var(--green)] font-mono text-sm">
              <CheckIcon className="text-sm" size={14} />
              Bug 已修复 — 继续保持
            </span>
          </div>
        )}

        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-tertiary)]">
            <span>预计修复周期：{bug.fixDays}天</span>
            <span>置信度：{bug.confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PatchItem({
  patch,
  isSelected,
  isResolved,
  isInteractive,
  onSelect,
}: {
  patch: Patch;
  isSelected: boolean;
  isResolved: boolean;
  isInteractive: boolean;
  onSelect: () => void;
}) {
  const diffColor =
    patch.difficulty === '低难度'
      ? 'var(--green)'
      : patch.difficulty === '中难度'
      ? 'var(--yellow)'
      : 'var(--red)';

  const diffBg =
    patch.difficulty === '低难度'
      ? 'rgba(57,211,83,0.1)'
      : patch.difficulty === '中难度'
      ? 'rgba(227,179,65,0.1)'
      : 'rgba(248,81,73,0.1)';

  return (
    <button
      onClick={onSelect}
      disabled={isResolved || !isInteractive}
      className={`w-full text-left rounded-lg border transition-all duration-200 ${
        isSelected
          ? 'border-[var(--green)] bg-[var(--green-muted)]/10'
          : 'border-[var(--border-default)] bg-[var(--bg-tertiary)]'
      } ${isResolved || !isInteractive ? 'opacity-50 cursor-default' : 'cursor-pointer hover:border-[var(--border-muted)] hover:bg-[var(--bg-elevated)]'}`}
    >
      <div className="p-3 sm:p-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-[var(--text-primary)]">{patch.name}</span>
              <span
                className="flex-shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono rounded border"
                style={{
                  color: diffColor,
                  borderColor: diffColor,
                  backgroundColor: diffBg,
                }}
              >
                <DiffDot color={diffColor} size={8} />
                {patch.difficulty}
              </span>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{patch.description}</p>
          </div>
          {isInteractive && !isResolved && (
            <span
              className={`flex-shrink-0 self-center px-4 py-2 rounded-lg text-xs font-mono border transition-all duration-200 ${
                isSelected
                  ? 'bg-[var(--green)] text-[var(--bg-primary)] border-[var(--green)]'
                  : 'border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--green)] hover:text-[var(--green)]'
              }`}
            >
              {isSelected ? '已选择' : '选择此方案'}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
