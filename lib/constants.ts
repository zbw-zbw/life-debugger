import { SeverityInfo } from '@/types/bug';

export const SEVERITY_MAP: Record<string, SeverityInfo> = {
  P0: { level: 'P0', label: '致命', color: 'var(--severity-p0)', bgColor: 'rgba(248,81,73,0.1)', borderColor: 'rgba(248,81,73,0.25)' },
  P1: { level: 'P1', label: '严重', color: 'var(--severity-p1)', bgColor: 'rgba(248,81,73,0.1)', borderColor: 'rgba(248,81,73,0.25)' },
  P2: { level: 'P2', label: '高', color: 'var(--severity-p2)', bgColor: 'rgba(210,153,34,0.1)', borderColor: 'rgba(210,153,34,0.25)' },
  P3: { level: 'P3', label: '中', color: 'var(--severity-p3)', bgColor: 'rgba(88,166,255,0.1)', borderColor: 'rgba(88,166,255,0.25)' },
  P4: { level: 'P4', label: '低', color: 'var(--severity-p4)', bgColor: 'rgba(139,148,158,0.1)', borderColor: 'rgba(139,148,158,0.25)' },
};

export const DEMO_BUG_REPORT = {
  id: 'LIFE-0001',
  title: '睡眠延迟综合症',
  severity: 'P1' as const,
  status: 'OPEN' as const,
  triggerCount: 847,
  impactAreas: ['睡眠质量', '工作效率', '身体健康'],
  reproSteps: [
    '躺上床，拿起手机"只刷5分钟"',
    '打开短视频，进入推荐信息流',
    '多巴胺分泌，注意力被劫持',
    '时间流逝 2-3 小时，Bug 稳定复现',
  ],
  rootCauses: [
    '奖励机制错位：即时娱乐 >> 长期健康',
    '睡前无仪式感，状态切换失败',
    '触发器（手机）始终在线，无防火墙',
  ],
  patches: [
    { id: 'patch-a', name: '手机放卧室外充电', difficulty: '低难度' as const, description: '物理隔离触发器' },
    { id: 'patch-b', name: '设置22:30屏幕时间限制', difficulty: '中难度' as const, description: '系统级拦截' },
    { id: 'patch-c', name: '建立睡前阅读仪式', difficulty: '高难度' as const, description: '替换习惯回路' },
  ],
  fixDays: 21,
  confidence: 78,
  createdAt: '2026-06-25',
};
