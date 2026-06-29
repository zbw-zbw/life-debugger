import { BugReport } from '@/types/bug';

function generateShareText(bug: BugReport): string {
  return `我在「人生Debug器」诊断出一个 Bug：${bug.title}\n严重等级：${bug.severity}\n预计修复周期：${bug.fixDays}天\n置信度：${bug.confidence}%\n\n用 Debug 的视角，拆解生活难题。`;
}

function generateShareUrl(): string {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
  }
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://life-debugger.vercel.app';
}

export type ShareResult = 'shared' | 'copied' | 'failed';

export async function shareBugReport(bug: BugReport): Promise<ShareResult> {
  const text = generateShareText(bug);
  const url = generateShareUrl();

  // Try native Web Share API first
  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      await navigator.share({
        title: `人生Debug器 — ${bug.title}`,
        text,
        url,
      });
      return 'shared';
    } catch (err) {
      // User cancelled or share failed — fall through to clipboard
      if ((err as Error).name === 'AbortError') {
        return 'shared';
      }
      console.warn('Web Share API failed, falling back to clipboard:', err);
    }
  }

  // Fallback to clipboard
  if (typeof navigator !== 'undefined' && 'clipboard' in navigator) {
    try {
      await navigator.clipboard.writeText(`${text}\n\n${url}`);
      return 'copied';
    } catch {
      return 'failed';
    }
  }

  return 'failed';
}
