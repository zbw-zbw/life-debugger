'use client';

import { useBugStore } from '@/hooks/useBugStore';
import { buildHeatmapData, getHeatColor, getMonthLabels } from '@/lib/heatmap';
import { useState } from 'react';

const CELL_SIZE = 12;
const CELL_GAP = 2;
const CELL_STEP = CELL_SIZE + CELL_GAP;
const DAY_LABELS = ['一', '', '三', '', '五', '', '日'];

export default function CheckinHeatmap() {
  const { bugs } = useBugStore();
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  if (bugs.length === 0) return null;

  const data = buildHeatmapData(bugs, 16);
  const weeks = Math.ceil(data.days.length / 7);
  const monthLabels = getMonthLabels(data.days);

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider">
          打卡热力图
        </h3>
        <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--text-tertiary)]">
          <span>连续 {data.currentStreak} 天</span>
          <span>最长 {data.longestStreak} 天</span>
          <span>共 {data.totalDays} 天</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="relative" style={{ minWidth: weeks * CELL_STEP + 24 }}>
          {/* Day labels */}
          <div className="absolute left-0 top-0" style={{ width: 24 }}>
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                className="text-[10px] font-mono text-[var(--text-tertiary)]"
                style={{ height: CELL_STEP, lineHeight: `${CELL_SIZE}px`, width: 20, textAlign: 'right' }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="ml-6 relative">
            {/* Month labels */}
            <div className="absolute -top-5 left-0 flex" style={{ width: weeks * CELL_STEP }}>
              {monthLabels.map((m, i) => (
                <span
                  key={i}
                  className="text-[10px] font-mono text-[var(--text-tertiary)] absolute"
                  style={{ left: m.colIndex * CELL_STEP }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            <svg
              width={weeks * CELL_STEP}
              height={7 * CELL_STEP}
              className="mt-5"
            >
              {data.days.map((day, i) => {
                const col = Math.floor(i / 7);
                const row = i % 7;
                const x = col * CELL_STEP;
                const y = row * CELL_STEP;
                const color = getHeatColor(day.count, data.maxCount);

                return (
                  <rect
                    key={day.date}
                    x={x}
                    y={y}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    rx={2}
                    fill={color}
                    className="cursor-pointer transition-opacity duration-150 hover:opacity-80"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const parentRect = e.currentTarget.closest('svg')?.getBoundingClientRect();
                      const px = parentRect ? rect.left - parentRect.left + CELL_SIZE / 2 : 0;
                      const py = parentRect ? rect.top - parentRect.top - 8 : 0;
                      const dateLabel = day.date.replace(/^\d{4}-/, '');
                      setTooltip({
                        text: day.count > 0
                          ? `${dateLabel}: ${day.count}次打卡`
                          : `${dateLabel}: 无打卡`,
                        x: px,
                        y: py,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}

              {/* Tooltip */}
              {tooltip && (
                <g>
                  <rect
                    x={tooltip.x - 30}
                    y={tooltip.y - 20}
                    width={60}
                    height={18}
                    rx={4}
                    fill="var(--bg-elevated)"
                    stroke="var(--border-default)"
                    strokeWidth={0.5}
                  />
                  <text
                    x={tooltip.x}
                    y={tooltip.y - 8}
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontSize={9}
                    fontFamily="monospace"
                  >
                    {tooltip.text}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 mt-3">
          <span className="text-[10px] font-mono text-[var(--text-tertiary)]">少</span>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                backgroundColor: ratio === 0 ? 'var(--bg-tertiary)' : `rgba(57,211,83,${ratio})`,
              }}
            />
          ))}
          <span className="text-[10px] font-mono text-[var(--text-tertiary)]">多</span>
        </div>
      </div>
    </div>
  );
}
