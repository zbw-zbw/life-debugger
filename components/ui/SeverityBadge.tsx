import { SEVERITY_MAP } from '@/lib/constants';

interface SeverityBadgeProps {
  severity: string;
  showLabel?: boolean;
  className?: string;
}

export default function SeverityBadge({ severity, showLabel = true, className = '' }: SeverityBadgeProps) {
  const info = SEVERITY_MAP[severity];
  if (!info) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono border ${className}`}
      style={{
        color: info.color,
        borderColor: info.borderColor,
        backgroundColor: info.bgColor,
      }}
    >
      <span className="font-bold">{info.level}</span>
      {showLabel && <span className="text-[10px] opacity-70">{info.englishLabel}</span>}
    </span>
  );
}
