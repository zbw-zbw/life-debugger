'use client';

import { useBugStore } from '@/hooks/useBugStore';
import { SEVERITY_MAP } from '@/lib/constants';

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'var(--yellow)',
  FIXING: 'var(--blue)',
  RESOLVED: 'var(--green)',
};

export default function StatsCharts() {
  const { bugs, stats, severityStats, impactAreaStats } = useBugStore();

  if (bugs.length === 0) return null;

  const maxSeverityCount = Math.max(...severityStats.map(s => s.count), 1);
  const maxAreaCount = Math.max(...impactAreaStats.map(a => a.count), 1);
  const total = stats.total;

  // Donut chart calculations
  const donutSegments: { status: string; count: number; color: string; percentage: number }[] = [];
  if (stats.open > 0) donutSegments.push({ status: 'OPEN', count: stats.open, color: STATUS_COLORS.OPEN, percentage: (stats.open / total) * 100 });
  if (stats.fixing > 0) donutSegments.push({ status: 'FIXING', count: stats.fixing, color: STATUS_COLORS.FIXING, percentage: (stats.fixing / total) * 100 });
  if (stats.resolved > 0) donutSegments.push({ status: 'RESOLVED', count: stats.resolved, color: STATUS_COLORS.RESOLVED, percentage: (stats.resolved / total) * 100 });

  // SVG donut math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let offsetAccumulator = 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
      {/* Status Donut */}
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5">
        <h3 className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-4">
          状态分布
        </h3>
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90">
              <circle cx="65" cy="65" r={radius} fill="none" stroke="var(--bg-tertiary)" strokeWidth="12" />
              {donutSegments.map((seg) => {
                const dash = (seg.percentage / 100) * circumference;
                const offset = offsetAccumulator;
                offsetAccumulator += dash;
                return (
                  <circle
                    key={seg.status}
                    cx="65" cy="65" r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="12"
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    strokeDashoffset={-offset}
                    strokeLinecap="butt"
                    style={{ transition: 'stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease' }}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold font-mono text-[var(--text-primary)]">{total}</span>
              <span className="text-[10px] font-mono text-[var(--text-tertiary)]">总计</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {donutSegments.map(seg => (
              <div key={seg.status} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: seg.color }} />
                  <span className="text-[var(--text-secondary)]">{seg.status}</span>
                </div>
                <span style={{ color: seg.color }}>{seg.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Severity Distribution */}
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5">
        <h3 className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-4">
          严重等级分布
        </h3>
        <div className="space-y-3">
          {severityStats.map(s => {
            const config = SEVERITY_MAP[s.severity as keyof typeof SEVERITY_MAP];
            const color = config?.color || 'var(--text-tertiary)';
            const widthPct = (s.count / maxSeverityCount) * 100;
            return (
              <div key={s.severity}>
                <div className="flex items-center justify-between mb-1 text-xs font-mono">
                  <span style={{ color }} className="font-bold">{s.severity}</span>
                  <span className="text-[var(--text-tertiary)]">{s.count}</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${widthPct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Impact Areas */}
      <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5">
        <h3 className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-4">
          影响领域 Top 5
        </h3>
        <div className="space-y-2.5">
          {impactAreaStats.slice(0, 5).map(area => {
            const widthPct = (area.count / maxAreaCount) * 100;
            return (
              <div key={area.area}>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="text-[var(--text-secondary)] truncate pr-2">{area.area}</span>
                  <span className="font-mono text-[var(--text-tertiary)] flex-shrink-0">{area.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--purple)] transition-all duration-700 ease-out"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
          {impactAreaStats.length === 0 && (
            <div className="text-xs font-mono text-[var(--text-tertiary)] text-center py-4">
              暂无数据
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
