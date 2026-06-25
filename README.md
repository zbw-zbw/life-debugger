# 人生Debug器

AI 驱动的生活问题诊断工具，用程序员风格的 Bug Report 拆解生活烦恼，给出根因分析和可执行的修复方案。

## 技术栈

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS 4
- DeepSeek API (流式响应)

## 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的 API Key

# 启动开发服务器
npm run dev
```

打开 http://localhost:3000 查看效果。

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | 无（不配置则使用 Demo 模式） |
| `DEEPSEEK_BASE_URL` | DeepSeek API 地址 | `https://api.deepseek.com` |

> 不配置 API Key 时，应用自动降级为 Demo 模式，使用预设诊断数据，无需任何外部服务即可运行。

## 部署

### Vercel 部署

1. Fork 本仓库
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 在 Vercel Dashboard → Settings → Environment Variables 中配置：
   - `DEEPSEEK_API_KEY`
   - `DEEPSEEK_BASE_URL`（可选）
4. 部署

项目已包含 `vercel.json`，默认部署到香港节点 (`hkg1`)。

## 项目结构

```
app/
  layout.tsx          # 全局布局 + SEO metadata
  page.tsx            # 首页
  debug/              # 诊断页
  history/            # Bug 历史页
  achievements/       # 成就页
  api/diagnose/       # DeepSeek API Route
components/
  layout/             # Header, Footer
  home/               # HeroSection, FeatureCards, DemoBugReport
  bug/                # BugReportCard, ShareCard
  debug/              # AnalysisProcess
  ui/                 # Toast, ErrorState, SeverityBadge, TerminalBlock
hooks/
  useScrollReveal.ts  # 滚动渐入动画
  useBugDiagnosis.ts # 诊断流程 hook
lib/
  constants.ts        # 颜色映射、Demo 数据
  mockGenerator.ts    # Mock 生成器 + 快捷模板
  mockData.ts         # 历史/成就 Mock 数据
  prompts.ts          # DeepSeek System Prompt
types/
  bug.ts              # BugReport 类型定义
```

## 功能特性

- **Bug 诊断**：自然语言输入 → AI 生成结构化 Bug Report
- **流式响应**：实时显示 AI 分析过程
- **Bug 历史**：查看和管理已诊断的 Bug
- **成就系统**：修复 Bug 解锁成就徽章
- **分享功能**：Web Share API / 剪贴板复制
- **响应式设计**：完整移动端适配
- **无障碍**：`prefers-reduced-motion` 支持
