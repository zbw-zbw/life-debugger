'use client';

import { BugReport } from '@/types/bug';
import { SEVERITY_MAP } from '@/lib/constants';

export function getShareText(bug: BugReport): string {
  const severityInfo = SEVERITY_MAP[bug.severity];
  return `🐛 我在人生Debug器发现了一个Bug！
Bug #${bug.id}「${bug.title}」
严重等级: ${bug.severity} ${severityInfo?.label || ''} | 已触发 ${bug.triggerCount} 次
来诊断你的人生Bug → https://life-debugger.vercel.app`;
}

export async function shareBugReport(bug: BugReport): Promise<'shared' | 'copied' | 'failed'> {
  const shareText = getShareText(bug);

  // 尝试 Web Share API
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: `Bug #${bug.id}「${bug.title}」`,
        text: shareText,
        url: typeof window !== 'undefined' ? window.location.origin : '',
      });
      return 'shared';
    } catch {
      // 用户取消或不支持，降级到剪贴板
    }
  }

  // 降级：复制到剪贴板
  try {
    await navigator.clipboard.writeText(shareText);
    return 'copied';
  } catch {
    return 'failed';
  }
}
