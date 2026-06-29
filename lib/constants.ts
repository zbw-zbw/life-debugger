import { SeverityInfo } from '@/types/bug';

export const SEVERITY_MAP: Record<string, SeverityInfo> = {
  P0: { level: 'P0', label: '致命', englishLabel: 'CRITICAL', color: 'var(--severity-p0)', bgColor: 'rgba(248,81,73,0.1)', borderColor: 'rgba(248,81,73,0.25)' },
  P1: { level: 'P1', label: '严重', englishLabel: 'HIGH', color: 'var(--severity-p1)', bgColor: 'rgba(248,81,73,0.1)', borderColor: 'rgba(248,81,73,0.25)' },
  P2: { level: 'P2', label: '高', englishLabel: 'HIGH', color: 'var(--severity-p2)', bgColor: 'rgba(210,153,34,0.1)', borderColor: 'rgba(210,153,34,0.25)' },
  P3: { level: 'P3', label: '中', englishLabel: 'MEDIUM', color: 'var(--severity-p3)', bgColor: 'rgba(88,166,255,0.1)', borderColor: 'rgba(88,166,255,0.25)' },
  P4: { level: 'P4', label: '低', englishLabel: 'LOW', color: 'var(--severity-p4)', bgColor: 'rgba(139,148,158,0.1)', borderColor: 'rgba(139,148,158,0.25)' },
};

export const DEMO_BUG_REPORTS = [
  {
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
  },
  {
    id: 'LIFE-0042',
    title: '任务启动困难症',
    severity: 'P2' as const,
    status: 'OPEN' as const,
    triggerCount: 342,
    impactAreas: ['工作效率', '学业进度', '心理健康'],
    reproSteps: [
      '面对任务，感觉"还没准备好"',
      '打开社交媒体"放松一下再开始"',
      '焦虑感上升，进入逃避循环',
      '截止时间逼近，被迫熬夜赶工',
    ],
    rootCauses: [
      '完美主义导致的启动门槛过高',
      '任务颗粒度太大，缺乏可执行的第一步',
      '即时满足偏好 > 延迟满足能力',
    ],
    patches: [
      { id: 'patch-a', name: '2分钟法则：先做2分钟再说', difficulty: '低难度' as const, description: '降低启动门槛' },
      { id: 'patch-b', name: '番茄工作法 + 任务拆解', difficulty: '中难度' as const, description: '结构化时间管理' },
      { id: 'patch-c', name: '认知行为疗法重塑完美主义', difficulty: '高难度' as const, description: '深度心理干预' },
    ],
    fixDays: 30,
    confidence: 72,
    createdAt: '2026-06-18',
  },
  {
    id: 'LIFE-0233',
    title: '糖分依赖循环',
    severity: 'P3' as const,
    status: 'OPEN' as const,
    triggerCount: 156,
    impactAreas: ['身体健康', '财务状况', '皮肤状态'],
    reproSteps: [
      '下午3点能量低谷，产生"奖励自己"的想法',
      '打开外卖App浏览奶茶菜单',
      '下单大杯全糖 + 珍珠 + 奶盖',
      '血糖飙升后迅速下降，2小时后再次 craving',
    ],
    rootCauses: [
      '下午能量低谷被误认为"需要糖分"',
      '多巴胺奖励回路将奶茶与"快乐"绑定',
      '环境触发器：外卖App常驻手机首页',
    ],
    patches: [
      { id: 'patch-a', name: '替换为无糖茶或黑咖啡', difficulty: '低难度' as const, description: '渐进式替代' },
      { id: 'patch-b', name: '设置每周奶茶预算上限', difficulty: '中难度' as const, description: '量化控制' },
      { id: 'patch-c', name: '建立"渴了先喝水"的IF-THEN规则', difficulty: '低难度' as const, description: '习惯替换' },
    ],
    fixDays: 14,
    confidence: 85,
    createdAt: '2026-06-10',
  },
];

/** @deprecated Use DEMO_BUG_REPORTS instead. Kept for backward compat. */
export const DEMO_BUG_REPORT = DEMO_BUG_REPORTS[0];
