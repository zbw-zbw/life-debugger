import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '开始诊断 — 人生Debug器',
  description: '描述你的生活烦恼，AI 帮你生成程序员风格的 Bug Report 诊断报告。',
};

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
