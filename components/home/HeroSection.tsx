'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TerminalTyping from './TerminalTyping';

const DESKTOP_LINES = [
  {
    text: '> 正在扫描人生系统...',
    styles: { prefix: '> ', prefixColor: 'var(--green)' },
  },
  {
    text: '> 检测到以下已知Bug：',
    styles: { prefix: '> ', prefixColor: 'var(--green)' },
  },
  {
    text: '  ✗ 熬夜刷手机死循环 [LIFE-0001] .............. P1 HIGH',
    styles: {
      highlights: [
        { text: '✗', color: 'var(--red)' },
        { text: '[LIFE-0001]', color: 'var(--blue)' },
        { text: 'P1 HIGH', color: 'var(--severity-p1)' },
      ],
    },
  },
  {
    text: '  ✗ 拖延症反复触发 [LIFE-0042] .............. P2 HIGH',
    styles: {
      highlights: [
        { text: '✗', color: 'var(--red)' },
        { text: '[LIFE-0042]', color: 'var(--blue)' },
        { text: 'P2 HIGH', color: 'var(--severity-p2)' },
      ],
    },
  },
  {
    text: '  ✗ 糖分依赖循环泄漏 [LIFE-0233] .............. P3 MEDIUM',
    styles: {
      highlights: [
        { text: '✗', color: 'var(--red)' },
        { text: '[LIFE-0233]', color: 'var(--blue)' },
        { text: 'P3 MEDIUM', color: 'var(--severity-p3)' },
      ],
    },
  },
  {
    text: '  ✗ 情绪内耗后台进程 [LIFE-0512] ............ P3 MEDIUM',
    styles: {
      highlights: [
        { text: '✗', color: 'var(--red)' },
        { text: '[LIFE-0512]', color: 'var(--blue)' },
        { text: 'P3 MEDIUM', color: 'var(--severity-p3)' },
      ],
    },
  },
  {
    text: '  ✗ 周末计划总是404 [LIFE-0888] .............. P4 LOW',
    styles: {
      highlights: [
        { text: '✗', color: 'var(--yellow)' },
        { text: '[LIFE-0888]', color: 'var(--blue)' },
        { text: 'P4 LOW', color: 'var(--severity-p4)' },
      ],
    },
  },
  {
    text: '> 共发现 5 个未修复Bug',
    styles: { prefix: '> ', prefixColor: 'var(--green)' },
  },
  {
    text: '> 诊断引擎已就绪。输入 life-debug start 开始修复',
    styles: { prefix: '> ', prefixColor: 'var(--green)' },
  },
];

const MOBILE_LINES = [
  {
    text: '> 扫描人生系统...',
    styles: { prefix: '> ', prefixColor: 'var(--green)' },
  },
  {
    text: '> 发现已知Bug：',
    styles: { prefix: '> ', prefixColor: 'var(--green)' },
  },
  {
    text: '  ✗ 熬夜死循环 [LIFE-0001] ..... P1',
    styles: {
      highlights: [
        { text: '✗', color: 'var(--red)' },
        { text: '[LIFE-0001]', color: 'var(--blue)' },
        { text: 'P1', color: 'var(--severity-p1)' },
      ],
    },
  },
  {
    text: '  ✗ 拖延症 [LIFE-0042] .......... P2',
    styles: {
      highlights: [
        { text: '✗', color: 'var(--red)' },
        { text: '[LIFE-0042]', color: 'var(--blue)' },
        { text: 'P2', color: 'var(--severity-p2)' },
      ],
    },
  },
  {
    text: '  ✗ 情绪内耗 [LIFE-0512] ......... P3',
    styles: {
      highlights: [
        { text: '✗', color: 'var(--red)' },
        { text: '[LIFE-0512]', color: 'var(--blue)' },
        { text: 'P3', color: 'var(--severity-p3)' },
      ],
    },
  },
  {
    text: '  ✗ 周末404 [LIFE-0888] .......... P4',
    styles: {
      highlights: [
        { text: '✗', color: 'var(--yellow)' },
        { text: '[LIFE-0888]', color: 'var(--blue)' },
        { text: 'P4', color: 'var(--severity-p4)' },
      ],
    },
  },
  {
    text: '> 共 5 个Bug待修复',
    styles: { prefix: '> ', prefixColor: 'var(--green)' },
  },
  {
    text: '> 输入 life-debug start',
    styles: { prefix: '> ', prefixColor: 'var(--green)' },
  },
];

export default function HeroSection() {
  const [typingComplete, setTypingComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const lines = isMobile ? MOBILE_LINES : DESKTOP_LINES;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 overflow-hidden">
      {/* Hero glow background */}
      <div
        className="absolute inset-0 pointer-events-none hero-glow"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(57,211,83,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Main content */}
      <div className="relative flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="font-mono text-3xl sm:text-5xl md:text-7xl font-bold text-[var(--text-primary)] tracking-tight">
          人生Debug器
          <span className="cursor-blink text-[var(--green)]">▋</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-lg sm:text-xl text-[var(--text-secondary)] font-sans">
          你的生活，也可以提Bug · 修Bug · 关Bug
        </p>

        {/* Terminal */}
        <div className="w-full max-w-2xl mt-10">
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-elevated)]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
              </div>
              <span className="ml-2 text-xs font-mono text-[var(--text-tertiary)]">
                life-debugger — bash
              </span>
            </div>
            <div className="p-4 sm:p-5">
              <TerminalTyping
                lines={lines}
                onComplete={() => setTypingComplete(true)}
                charDelay={25}
                lineDelay={400}
              />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div
          className={`mt-8 flex flex-col items-center gap-3 transition-all duration-500 ${
            typingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link
            href="/debug"
            className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-lg bg-[var(--green)] text-[var(--bg-primary)] font-mono font-bold text-base sm:text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(57,211,83,0.3)] w-full sm:w-auto"
          >
            <span>$ life-debug start</span>
            <span className="cursor-blink">_</span>
          </Link>
          <span className="text-sm text-[var(--text-secondary)]">
            描述你的烦恼，AI 帮你生成 Bug Report
          </span>
        </div>
      </div>
    </section>
  );
}
