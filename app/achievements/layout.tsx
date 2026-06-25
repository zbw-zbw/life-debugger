import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '成就墙 — 人生Debug器',
  description: '收集你的人生 Patch 徽章，见证每一步成长。',
};

export default function AchievementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
