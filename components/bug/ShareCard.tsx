'use client';

import { BugReport } from '@/types/bug';
import { SEVERITY_MAP } from '@/lib/constants';

export function getShareText(bug: BugReport): string {
  const severityInfo = SEVERITY_MAP[bug.severity];
  return `我在人生Debug器发现了一个Bug！
Bug #${bug.id}「${bug.title}」
严重等级: ${bug.severity} ${severityInfo?.label || ''} | 已触发 ${bug.triggerCount} 次
来诊断你的人生Bug → https://life-debugger.vercel.app`;
}

export async function shareBugReport(bug: BugReport): Promise<'copied' | 'failed'> {
  try {
    await navigator.clipboard.writeText(getShareText(bug));
    return 'copied';
  } catch {
    return 'failed';
  }
}
