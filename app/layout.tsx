import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: '人生Debug器 — 把生活烦恼变成可修复的Bug报告',
  description: 'AI驱动的生活问题诊断工具，用程序员风格的Bug Report拆解生活烦恼，给出根因分析和可执行的修复方案。',
  keywords: ['人生Debug器', 'AI诊断', 'Bug Report', '习惯养成', '自我改善'],
  authors: [{ name: '人生Debug器' }],
  openGraph: {
    title: '人生Debug器 — 你的生活，也可以提Bug、修Bug、关Bug',
    description: '用AI把生活烦恼变成可修复的Bug报告。描述你的问题，获得程序员风格的诊断报告。',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '人生Debug器',
    description: '把生活烦恼变成可修复的Bug报告',
  },
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
