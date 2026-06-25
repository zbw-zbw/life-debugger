import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Bug历史 — 人生Debug器',
  description: '查看和管理你的人生 Bug 档案，追踪修复进度。',
};

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
