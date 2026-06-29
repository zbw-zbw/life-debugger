import { BugReport } from '@/types/bug';

// 基础 Bug 模板（去重后）
const BUG_TEMPLATES: Record<string, BugReport> = {
  sleep: {
    id: 'LIFE-0001',
    title: '睡眠延迟综合症',
    severity: 'P1',
    status: 'OPEN',
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
    createdAt: new Date().toISOString().split('T')[0],
  },
  procrastination: {
    id: 'LIFE-0042',
    title: '任务启动障碍症',
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
    createdAt: new Date().toISOString().split('T')[0],
  },
  diet: {
    id: 'LIFE-0233',
    title: '健康饮食执行失败',
    severity: 'P3',
    status: 'OPEN',
    triggerCount: 156,
    impactAreas: ['身体健康', '财务状况', '皮肤状态'],
    reproSteps: [
      '买了健身餐、囤了食材',
      '每到饭点还是打开外卖App',
      '下单高热量重口味食物',
      '吃完后感到内疚，但下次重复',
    ],
    rootCauses: [
      '便利性偏好战胜了健康目标',
      '多巴胺奖励回路将外卖与"快乐"绑定',
      '环境触发器：外卖App常驻手机首页',
    ],
    patches: [
      { id: 'patch-a', name: '周末批量备餐，工作日带饭', difficulty: '低难度', description: '降低便利门槛' },
      { id: 'patch-b', name: '卸载外卖App，增加下单摩擦', difficulty: '中难度', description: '增加行动成本' },
      { id: 'patch-c', name: '建立"吃之前拍照记录"机制', difficulty: '中难度', description: '增加觉察成本' },
    ],
    fixDays: 21,
    confidence: 75,
    createdAt: new Date().toISOString().split('T')[0],
  },
  fitness: {
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
    createdAt: new Date().toISOString().split('T')[0],
  },
  social: {
    id: 'LIFE-0077',
    title: '社交能量耗尽症',
    severity: 'P3',
    status: 'OPEN',
    triggerCount: 123,
    impactAreas: ['人际关系', '心理健康', '自我认知'],
    reproSteps: [
      '聚会前很期待，设想各种有趣话题',
      '到了现场不知道说什么，尴尬沉默',
      '强颜欢笑应付，内心持续消耗能量',
      '结束后感到精疲力尽，回避下次社交',
    ],
    rootCauses: [
      '社交脚本缺失，不知如何开启和维持对话',
      '过度关注自我表现，导致注意力内耗',
      '恢复机制不足，社交后没有充电时间',
    ],
    patches: [
      { id: 'patch-a', name: '准备3个万能话题随身携带', difficulty: '低难度', description: '降低即兴压力' },
      { id: 'patch-b', name: '设定社交时间上限，允许提前离场', difficulty: '中难度', description: '可控边界' },
      { id: 'patch-c', name: '从小型1对1聚会开始练习', difficulty: '低难度', description: '渐进暴露' },
    ],
    fixDays: 30,
    confidence: 70,
    createdAt: new Date().toISOString().split('T')[0],
  },
  spending: {
    id: 'LIFE-0088',
    title: '冲动消费综合症',
    severity: 'P3',
    status: 'OPEN',
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
    createdAt: new Date().toISOString().split('T')[0],
  },
};

// 关键词到模板ID的映射
const KEYWORD_MAP: Record<string, string> = {
  熬夜: 'sleep',
  手机: 'sleep',
  睡觉: 'sleep',
  拖延: 'procrastination',
  截止: 'procrastination',
  deadline: 'procrastination',
  报告: 'procrastination',
  外卖: 'diet',
  吃: 'diet',
  健身: 'fitness',
  减肥: 'fitness',
  社交: 'social',
  焦虑: 'social',
  消费: 'spending',
  打折: 'spending',
};

const DEFAULT_REPORT: BugReport = {
  id: `LIFE-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
  title: '未命名生活Bug',
  severity: 'P3',
  status: 'OPEN',
  triggerCount: Math.floor(Math.random() * 500) + 50,
  impactAreas: ['日常生活', '心理健康'],
  reproSteps: [
    '触发条件出现',
    '自动执行默认行为模式',
    '短期满足但长期后悔',
    '循环重复，形成稳定Bug',
  ],
  rootCauses: [
    '习惯回路过于固化',
    '缺乏有效的干预机制',
    '环境触发器未被识别和消除',
  ],
  patches: [
    { id: 'patch-a', name: '识别并记录触发时刻', difficulty: '低难度', description: '觉察是改变的第一步' },
    { id: 'patch-b', name: '设计替代行为', difficulty: '中难度', description: '替换而非压制' },
    { id: 'patch-c', name: '建立支持系统', difficulty: '高难度', description: '环境重塑' },
  ],
  fixDays: 21,
  confidence: 65,
  createdAt: new Date().toISOString().split('T')[0],
};

export function generateBugReport(input: string): BugReport {
  const lowerInput = input.toLowerCase();

  for (const [keyword, templateId] of Object.entries(KEYWORD_MAP)) {
    if (lowerInput.includes(keyword)) {
      const template = BUG_TEMPLATES[templateId];
      if (template) {
        return {
          ...template,
          id: `LIFE-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
          createdAt: new Date().toISOString().split('T')[0],
        };
      }
    }
  }

  // Default fallback
  return {
    ...DEFAULT_REPORT,
    id: `LIFE-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
  };
}

export const ANALYSIS_STEPS = [
  { text: '> 接收到Bug描述，开始分析...', delay: 300 },
  { text: '> [██████████] 自然语言解析 .............. 完成 ✓', delay: 500 },
  { text: '> [██████████] 行为模式匹配 .............. 完成 ✓', delay: 600 },
  { text: '> [██████████] 触发条件识别 .............. 完成 ✓', delay: 500 },
  { text: '> [██████████] 根因推理引擎 .............. 完成 ✓', delay: 700 },
  { text: '> [██████████] 修复方案生成 .............. 完成 ✓', delay: 500 },
  { text: '> 分析完成！正在生成 Bug Report...', delay: 400 },
];

export const QUICK_TEMPLATES: { label: string; text: string }[] = [
  {
    label: '熬夜刷手机',
    text: '每天说好12点睡，结果刷短视频到凌晨2点，第二天又后悔，但晚上又重复',
  },
  {
    label: '拖延症',
    text: '重要的事情总是拖到最后一刻才做，明明有时间但就是启动不了',
  },
  {
    label: '社交焦虑',
    text: '聚会前很期待，到了之后不知道说什么，结束后觉得很累很尴尬',
  },
  {
    label: '外卖依赖',
    text: '买了健身餐、囤了食材，但每到饭点还是忍不住打开外卖App',
  },
  {
    label: '冲动消费',
    text: '每次看到打折就忍不住下单，买完又后悔，快递堆了一堆没拆的',
  },
  {
    label: '健身放弃',
    text: '每次办完健身卡头三天去得很积极，之后就各种理由不去，最后卡过期了',
  },
  {
    label: '情绪内耗',
    text: '经常因为别人的一句话反复想很久，明明知道没必要但就是控制不住，晚上尤其严重',
  },
  {
    label: '信息过载',
    text: '打开手机想查个东西，结果刷了一个小时各种APP，什么正事都没做',
  },
  {
    label: '立Flag打脸',
    text: '每年年初都列一堆计划，一个月后一个都没执行，年底又开始后悔',
  },
];
