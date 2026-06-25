'use client';

import { useState } from 'react';
import { BugReport, Patch } from '@/types/bug';
import { SEVERITY_MAP } from '@/lib/constants';
import SeverityBadge from '@/components/ui/SeverityBadge';
import { BugIcon, AlertIcon, WrenchIcon, CheckIcon, ClipboardIcon, SearchIcon, DiffDot } from '@/components/ui/Icon';

interface BugReportCardProps {
  bug: BugReport;
  interactive?: boolean;
  className?: string;
}

const SEVERITY_SIDE_COLORS: Record<string, string> = {
  P0: 'var(--severity-p0)',
  P1: 'var(--severity-p1)',
  P2: 'var(--severity-p2)',
  P3: 'var(--severity-p3)',
  P4: 'var(--severity-p4)',
};

const STATUS_CONFIG = {
  OPEN: { label: 'OPEN', color: 'var(--yellow)', icon: <AlertIcon className="text-xs" />, bgColor: 'rgba(227,179,65,0.1)' },
  FIXING: { label: 'FIXING', color: 'var(--blue)', icon: <WrenchIcon className="text-xs" />, bgColor: 'rgba(88,166,255,0.1)' },
  RESOLVED: { label: 'RESOLVED', color: 'var(--green)', icon: <CheckIcon className="text-xs" />, bgColor: 'rgba(57,211,83,0.1)' },
};

export default function BugReportCard({ bug, interactive = true, className = '' }: BugReportCardProps) {
  const [selectedPatch, setSelectedPatch] = useState<string | null>(null);
  const [status, setStatus] = useState(bug.status);

  const handleApplyPatch = (patchId: string) => {
    if (!interactive) return;
    setSelectedPatch(patchId);
    setStatus('FIXING');
  };

  const handleResolve = () => {
    if (!interactive) return;
    setStatus('RESOLVED');
  };

  const currentStatus = STATUS_CONFIG[status];
  const sideColor = SEVERITY_SIDE_COLORS[bug.severity] || 'var(--border-default)';
  const isHighSeverity = bug.severity === 'P0' || bug.severity === 'P1';

  return (
    <div
      className={`relative rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden animate-fade-in-up card-hover ${className}`}
    >
      {/* Left severity color bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: sideColor }}
      />

      {/* Header with gradient */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ background: 'linear-gradient(to bottom, var(--bg-elevated), transparent)' }}
      >
        <div className="flex items-center gap-2">
          <BugIcon className="text-base" />
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
            {currentStatus.icon}
            <span>{currentStatus.label}</span>
          </span>
          <span className="font-mono text-sm text-[var(--text-tertiary)]">#{bug.id}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Info */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">{bug.title}</h3>
          <div className="flex flex-wrap items-center gap-3">
            <SeverityBadge severity={bug.severity} />
            {status === 'OPEN' && (
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

        {/* Repro Steps */}
        <div>
          <h4 className="text-xs font-mono text-[var(--text-tertiary)] mb-2 uppercase tracking-wider">
            <ClipboardIcon className="text-xs inline-block mr-1" /> 复现步骤
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

        {/* Root Causes */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider">
              <SearchIcon className="text-xs inline-block mr-1" /> 根因分析
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

        {/* Patches */}
        <div>
          <h4 className="text-xs font-mono text-[var(--text-tertiary)] mb-2 uppercase tracking-wider">
            <WrenchIcon className="text-xs inline-block mr-1" /> 修复方案
          </h4>
          <div className="space-y-2">
            {bug.patches.map((patch) => (
              <PatchItem
                key={patch.id}
                patch={patch}
                isSelected={selectedPatch === patch.id}
                isResolved={status === 'RESOLVED'}
                isInteractive={interactive}
                onSelect={() => handleApplyPatch(patch.id)}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {interactive && status === 'FIXING' && (
          <div className="pt-2">
            <button
              onClick={handleResolve}
              className="btn-primary w-full py-2.5 rounded-lg bg-[var(--green)] text-[var(--bg-primary)] font-mono font-bold text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(57,211,83,0.3)]"
            >
              <CheckIcon className="text-xs inline-block mr-1" /> 标记为已修复
            </button>
          </div>
        )}

        {interactive && status === 'RESOLVED' && (
          <div className="pt-2 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--green-muted)]/20 text-[var(--green)] font-mono text-sm">
              <CheckIcon className="text-xs" />
              <span>Bug 已修复 — 继续保持！</span>
            </span>
          </div>
        )}

        {/* Footer */}
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
  const diffIcon =
    patch.difficulty === '低难度'
      ? <DiffDot color="var(--green)" />
      : patch.difficulty === '中难度'
      ? <DiffDot color="var(--yellow)" />
      : <DiffDot color="var(--red)" />;

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
                {diffIcon}
                {patch.difficulty}
              </span>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{patch.description}</p>
          </div>
          {isInteractive && !isResolved && (
            <span
              className={`flex-shrink-0 px-3 py-1 rounded-md text-xs font-mono border transition-all duration-200 ${
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
