'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { BugStoreProvider } from "@/hooks/useBugStore";
import AchievementToast from "@/components/ui/AchievementToast";
import AppMeta from '@/components/layout/AppMeta';

function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <AppMeta />
        <BugStoreProvider>
          <ScrollToTop />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AchievementToast />
        </BugStoreProvider>
      </body>
    </html>
  );
}
