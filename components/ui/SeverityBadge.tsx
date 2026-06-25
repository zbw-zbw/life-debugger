'use client';

import { Severity } from '@/types/bug';
import { SEVERITY_MAP } from '@/lib/constants';

interface SeverityBadgeProps {
  severity: Severity;
  showLabel?: boolean;
}

export default function SeverityBadge({ severity, showLabel = true }: SeverityBadgeProps) {
  const info = SEVERITY_MAP[severity];
  if (!info) return null;

  const severityText = severity === 'P0' ? 'CRITICAL' : severity === 'P1' ? 'CRITICAL' : severity === 'P2' ? 'HIGH' : severity === 'P3' ? 'MEDIUM' : 'LOW';

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono font-bold border"
      style={{
        color: info.color,
        borderColor: info.borderColor,
        backgroundColor: info.bgColor,
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: info.color }}
      />
      {severity}
      {showLabel && (
        <span className="opacity-80">{severityText}</span>
      )}
    </span>
  );
}
