'use client';

import Link from 'next/link';
import HeroSection from '@/components/home/HeroSection';
import DemoBugReport from '@/components/home/DemoBugReport';
import FeatureCards from '@/components/home/FeatureCards';
import { useScrollReveal, getScrollRevealStyle } from '@/hooks/useScrollReveal';

function ConceptSection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: cardRef, isVisible: cardVisible } = useScrollReveal<HTMLDivElement>();

  const concepts = [
    { text: '代码有Bug', sub: '条件不变，错误反复触发' },
    { text: '人生也有Bug', sub: '触发条件没解决，坏习惯反复出现' },
    { text: '传统方法', sub: '只喊"我要改"，从不分析"为什么改不了"' },
    { text: '人生Debug器', sub: '帮你找到根因，给出可执行的 Patch', highlight: true },
  ];

  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text */}
          <div
            ref={titleRef}
            className={`transition-all duration-600 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}
            style={getScrollRevealStyle({ direction: 'up' })}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-[var(--green)] rounded-full" />
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                为什么生活烦恼 = Bug
              </h2>
            </div>
            <div className="space-y-5">
              {concepts.map((item, i) => (
                <div
                  key={i}
                  className={`transition-all duration-500 ${
                    titleVisible
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-4'
                  } ${item.highlight ? 'rounded-lg bg-[var(--green)]/5 border border-[var(--green)]/20 p-3 -ml-3' : ''}`}
                  style={{ transitionDelay: `${titleVisible ? 200 + i * 150 : 0}ms` }}
                >
                  <div className={`font-mono text-sm mb-1 ${item.highlight ? 'text-[var(--green)] font-bold' : 'text-[var(--text-tertiary)]'}`}>
                    {'// '}{item.text}
                  </div>
                  <p className={`pl-4 ${item.highlight ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Demo Card */}
          <div
            ref={cardRef}
            className={`transition-all duration-600 ${cardVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[30px]'}`}
            style={getScrollRevealStyle({ direction: 'right', delay: 200 })}
          >
            <DemoBugReport />
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-16 sm:py-20 px-4">
      <div
        ref={ref}
        className={`transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}
        style={getScrollRevealStyle({ direction: 'up' })}
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-6 sm:p-8">
            <div className="font-mono text-sm text-[var(--text-secondary)] space-y-2 mb-8">
              <div>
                <span className="text-[var(--green)]">{'>'}</span> 你的人生系统检测到未处理的异常
              </div>
              <div>
                <span className="text-[var(--green)]">{'>'}</span> 是否启动 Debug 模式？ [Y/n] Y
              </div>
              <div>
                <span className="text-[var(--green)]">{'>'}</span> 正在启动人生Debug器...
                <span className="cursor-blink">▋</span>
              </div>
            </div>

            <Link
              href="/debug"
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-[var(--green)] text-[var(--bg-primary)] font-mono font-bold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(57,211,83,0.3)] w-full sm:w-auto"
            >
              <span>$ life-debug start</span>
              <span className="cursor-blink">_</span>
            </Link>

            <p className="mt-6 text-sm text-[var(--text-secondary)]">
              不是所有 Bug 都能立刻修复，但每个 Bug 都值得一份好的报告
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ConceptSection />
      <FeatureCards />
      <CTASection />
    </div>
  );
}
