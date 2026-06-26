import { BugReport } from '@/types/bug';

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  condition: string;
  category: '诊断' | '修复' | '特殊';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const MOCK_HISTORY: BugReport[] = [
  {
    id: 'LIFE-0001',
    title: '睡眠延迟综合症',
    severity: 'P1',
    status: 'FIXING',
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
      { id: 'patch-a', name: '手机放卧室外充电', difficulty: '低难度', description: '物理隔离触发器' },
      { id: 'patch-b', name: '设置22:30屏幕时间限制', difficulty: '中难度', description: '系统级拦截' },
      { id: 'patch-c', name: '建立睡前阅读仪式', difficulty: '高难度', description: '替换习惯回路' },
    ],
    fixDays: 21,
    confidence: 78,
    createdAt: '2026-06-20',
  },
  {
    id: 'LIFE-0042',
    title: '任务启动困难症',
    severity: 'P2',
    status: 'OPEN',
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
      { id: 'patch-a', name: '2分钟法则：先做2分钟再说', difficulty: '低难度', description: '降低启动门槛' },
      { id: 'patch-b', name: '番茄工作法 + 任务拆解', difficulty: '中难度', description: '结构化时间管理' },
      { id: 'patch-c', name: '认知行为疗法重塑完美主义', difficulty: '高难度', description: '深度心理干预' },
    ],
    fixDays: 30,
    confidence: 72,
    createdAt: '2026-06-18',
  },
  {
    id: 'LIFE-0233',
    title: '糖分依赖循环',
    severity: 'P3',
    status: 'RESOLVED',
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
      { id: 'patch-a', name: '替换为无糖茶或黑咖啡', difficulty: '低难度', description: '渐进式替代' },
      { id: 'patch-b', name: '设置每周奶茶预算上限', difficulty: '中难度', description: '量化控制' },
      { id: 'patch-c', name: '建立"渴了先喝水"的IF-THEN规则', difficulty: '低难度', description: '习惯替换' },
    ],
    fixDays: 14,
    confidence: 85,
    createdAt: '2026-06-10',
  },
  {
    id: 'LIFE-0156',
    title: '健身计划执行失败',
    severity: 'P2',
    status: 'OPEN',
    triggerCount: 89,
    impactAreas: ['身体健康', '自信心', '体能水平'],
    reproSteps: [
      '周一满怀信心制定本周健身计划',
      '周二加班，"今天太累了明天再说"',
      '周三下雨，"不适合出门跑步"',
      '周末发现本周0次运动，陷入自责',
    ],
    rootCauses: [
      '计划过于理想化，未考虑现实约束',
      '依赖意志力而非系统设计',
      '缺乏问责机制，违约成本为零',
    ],
    patches: [
      { id: 'patch-a', name: '降级目标：每天5分钟拉伸', difficulty: '低难度', description: '最小可行行动' },
      { id: 'patch-b', name: '找健身伙伴互相打卡', difficulty: '中难度', description: '外部问责' },
      { id: 'patch-c', name: '预付健身房费用增加沉没成本', difficulty: '中难度', description: '经济承诺机制' },
    ],
    fixDays: 28,
    confidence: 68,
    createdAt: '2026-06-05',
  },
  {
    id: 'LIFE-0088',
    title: '冲动消费综合症',
    severity: 'P3',
    status: 'FIXING',
    triggerCount: 67,
    impactAreas: ['财务状况', '储物空间', '心理焦虑'],
    reproSteps: [
      '深夜浏览购物App',
      '被"限时折扣"倒计时刺激',
      '将商品加入购物车并立即下单',
      '收到货后意识到"其实不需要"',
    ],
    rootCauses: [
      '损失厌恶心理被"错过折扣"触发',
      '即时满足回路占主导',
      '深夜意志力低谷期做出决策',
    ],
    patches: [
      { id: 'patch-a', name: '设置24小时冷静期', difficulty: '低难度', description: '延迟决策' },
      { id: 'patch-b', name: '卸载购物App，改用网页版', difficulty: '中难度', description: '增加摩擦' },
      { id: 'patch-c', name: '建立"需要vs想要"评估清单', difficulty: '中难度', description: '认知重构' },
    ],
    fixDays: 21,
    confidence: 75,
    createdAt: '2026-05-28',
  },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-bug',
    icon: 'bug',
    title: '初识Bug',
    description: '完成第一次Bug诊断',
    condition: '诊断第1个Bug',
    category: '诊断',
    rarity: 'common',
  },
  {
    id: 'debugger',
    icon: 'search',
    title: '调试新手',
    description: '累计诊断3个Bug',
    condition: '累计诊断3个Bug',
    category: '诊断',
    rarity: 'common',
  },
  {
    id: 'senior-debugger',
    icon: 'spy',
    title: '资深调试员',
    description: '累计诊断10个Bug',
    condition: '累计诊断10个Bug',
    category: '诊断',
    rarity: 'rare',
  },
  {
    id: 'first-patch',
    icon: 'wrench',
    title: '首次修复',
    description: '应用第一个Patch',
    condition: '选择第1个修复方案',
    category: '修复',
    rarity: 'common',
  },
  {
    id: 'patch-master',
    icon: 'tools',
    title: 'Patch 大师',
    description: '累计应用10个Patch',
    condition: '累计选择10个修复方案',
    category: '修复',
    rarity: 'rare',
  },
  {
    id: 'bug-hunter',
    icon: 'target',
    title: 'Bug 猎人',
    description: '修复一个P0或P1级别的严重Bug',
    condition: '修复一个P0或P1级别的Bug',
    category: '修复',
    rarity: 'epic',
  },
  {
    id: 'night-owl',
    icon: 'moon',
    title: '夜猫子克星',
    description: '成功修复睡眠相关Bug',
    condition: '修复一个睡眠/熬夜/刷手机相关Bug',
    category: '特殊',
    rarity: 'rare',
  },
  {
    id: 'sugar-free',
    icon: 'cup',
    title: '戒糖先锋',
    description: '成功控制糖分摄入Bug',
    condition: '修复一个饮食/糖分相关Bug',
    category: '特殊',
    rarity: 'rare',
  },
  {
    id: 'marathon',
    icon: 'running',
    title: '21天马拉松',
    description: '修复一个预计周期>=21天的Bug',
    condition: '修复一个预计周期>=21天的Bug',
    category: '特殊',
    rarity: 'epic',
  },
  {
    id: 'legend',
    icon: 'crown',
    title: '人生Debug大师',
    description: '修复所有已诊断的Bug',
    condition: '诊断>=3个Bug且全部修复',
    category: '特殊',
    rarity: 'legendary',
  },
];

export const RARITY_CONFIG: Record<string, { label: string; color: string; borderColor: string; bgColor: string }> = {
  common: {
    label: '普通',
    color: 'var(--text-secondary)',
    borderColor: 'var(--border-default)',
    bgColor: 'var(--bg-tertiary)',
  },
  rare: {
    label: '稀有',
    color: 'var(--blue)',
    borderColor: 'var(--blue)',
    bgColor: 'rgba(88,166,255,0.1)',
  },
  epic: {
    label: '史诗',
    color: 'var(--purple)',
    borderColor: 'var(--purple)',
    bgColor: 'rgba(188,140,255,0.1)',
  },
  legendary: {
    label: '传说',
    color: 'var(--yellow)',
    borderColor: 'var(--yellow)',
    bgColor: 'rgba(227,179,65,0.1)',
  },
};
