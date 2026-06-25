'use client';

import { useState, useEffect } from 'react';
import { ANALYSIS_STEPS } from '@/lib/mockGenerator';

interface AnalysisProcessProps {
  streamingText?: string;
}

export default function AnalysisProcess({ streamingText = '' }: AnalysisProcessProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedSteps, setDisplayedSteps] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const [cpuUsage, setCpuUsage] = useState(72);
  const [memUsage, setMemUsage] = useState(2.1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 到 +3 波动
        return Math.max(55, Math.min(95, prev + delta));
      });
      setMemUsage(prev => {
        const delta = (Math.random() * 0.4) - 0.2; // -0.2 到 +0.2 波动
        return Math.max(1.5, Math.min(3.2, parseFloat((prev + delta).toFixed(1))));
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentStep >= ANALYSIS_STEPS.length) {
      setProgress(100);
      setAnimationDone(true);
      return;
    }

    const step = ANALYSIS_STEPS[currentStep];
    const timer = setTimeout(() => {
      setDisplayedSteps(prev => [...prev, step.text]);
      setCurrentStep(prev => prev + 1);
      setProgress(Math.round(((currentStep + 1) / ANALYSIS_STEPS.length) * 100));
    }, step.delay);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const renderLine = (text: string) => {
    if (text.includes('[██████████]')) {
      const parts = text.split(/(\[.*?\])/);
      return (
        <div className="flex items-center gap-2 flex-wrap">
          {parts.map((part, i) => {
            if (part.startsWith('[') && part.endsWith(']')) {
              return (
                <span key={i} className="text-[var(--green)] font-mono">
                  {part}
                </span>
              );
            }
            if (part.includes('完成 ✓')) {
              return (
                <span key={i} className="text-[var(--green)]">
                  {part}
                </span>
              );
            }
            return <span key={i} className="text-[var(--text-secondary)]">{part}</span>;
          })}
        </div>
      );
    }

    return (
      <span className="text-[var(--text-secondary)]">{text.replace('> ', '')}</span>
    );
  };

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden animate-fade-in-up">
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-elevated)] border-b border-[var(--border-default)]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[var(--red)]" />
          <div className="w-3 h-3 rounded-full bg-[var(--yellow)]" />
          <div className="w-3 h-3 rounded-full bg-[var(--green)]" />
        </div>
        <span className="ml-2 text-xs font-mono text-[var(--text-tertiary)]">
          AI Diagnostic Engine
        </span>
      </div>
      <div className="p-4 sm:p-6 font-mono text-sm space-y-2 min-h-[280px]">
        {displayedSteps.map((step, i) => (
          <div
            key={i}
            className="terminal-line flex items-start gap-2"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <span className="text-[var(--green)] flex-shrink-0">{'>'}</span>
            {renderLine(step)}
          </div>
        ))}
        {currentStep < ANALYSIS_STEPS.length && (
          <div className="flex items-start gap-2">
            <span className="text-[var(--green)] flex-shrink-0">{'>'}</span>
            {renderLine(ANALYSIS_STEPS[currentStep].text)}
            <span className="cursor-blink">▋</span>
          </div>
        )}
        {animationDone && (
          <div className="flex items-start gap-2 pt-2">
            <span className="text-[var(--green)] flex-shrink-0">{'>'}</span>
            <span className="text-[var(--text-tertiary)]">AI 引擎深度分析中...</span>
            <span className="cursor-blink">▋</span>
          </div>
        )}

        {/* Streaming text preview */}
        {animationDone && streamingText && (
          <div className="mt-4 pt-4 border-t border-[var(--border-default)]/50">
            <div className="relative">
              <pre className="font-mono text-xs text-[var(--text-tertiary)] whitespace-pre-wrap break-all max-h-40 overflow-hidden">
                {streamingText.slice(-300)}
              </pre>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-secondary)]" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom status bar */}
      <div className="px-4 py-2 bg-[var(--bg-elevated)] border-t border-[var(--border-default)] flex items-center justify-between text-[10px] font-mono text-[var(--text-tertiary)]">
        <div className="flex items-center gap-3">
          <span>CPU: {cpuUsage}%</span>
          <span>MEM: {memUsage.toFixed(1)}GB</span>
          <span>AI Engine: DeepSeek</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--green)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
