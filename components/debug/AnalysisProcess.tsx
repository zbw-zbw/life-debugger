'use client';

import { useEffect, useReducer, useRef } from 'react';
import { ANALYSIS_STEPS } from '@/lib/mockGenerator';

interface AnalysisProcessProps {
  streamingText?: string;
}

interface State {
  currentStep: number;
  displayedSteps: string[];
  progress: number;
  animationDone: boolean;
  cpuUsage: number;
  memUsage: number;
}

type Action =
  | { type: 'NEXT_STEP'; text: string; progress: number }
  | { type: 'COMPLETE' }
  | { type: 'UPDATE_METRICS'; cpu: number; mem: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        displayedSteps: [...state.displayedSteps, action.text],
        currentStep: state.currentStep + 1,
        progress: action.progress,
      };
    case 'COMPLETE':
      return { ...state, progress: 100, animationDone: true };
    case 'UPDATE_METRICS':
      return { ...state, cpuUsage: action.cpu, memUsage: action.mem };
    default:
      return state;
  }
}

export default function AnalysisProcess({ streamingText = '' }: AnalysisProcessProps) {
  const [state, dispatch] = useReducer(reducer, {
    currentStep: 0,
    displayedSteps: [],
    progress: 0,
    animationDone: false,
    cpuUsage: 72,
    memUsage: 2.1,
  });

  const { currentStep, displayedSteps, progress, animationDone, cpuUsage, memUsage } = state;
  const stepRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const cpuDelta = Math.floor(Math.random() * 7) - 3;
      const memDelta = (Math.random() * 0.4) - 0.2;
      dispatch({
        type: 'UPDATE_METRICS',
        cpu: clamp(state.cpuUsage + cpuDelta, 55, 95),
        mem: clamp(parseFloat((state.memUsage + memDelta).toFixed(1)), 1.5, 3.2),
      });
    }, 500);

    return () => clearInterval(interval);
  }, [state.cpuUsage, state.memUsage]);

  useEffect(() => {
    if (currentStep >= ANALYSIS_STEPS.length) {
      if (!animationDone) {
        dispatch({ type: 'COMPLETE' });
      }
      return;
    }

    const step = ANALYSIS_STEPS[currentStep];
    const timer = setTimeout(() => {
      stepRef.current = currentStep + 1;
      dispatch({
        type: 'NEXT_STEP',
        text: step.text,
        progress: Math.round(((currentStep + 1) / ANALYSIS_STEPS.length) * 100),
      });
    }, step.delay);

    return () => clearTimeout(timer);
  }, [currentStep, animationDone]);

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
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-elevated)]">
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
          <div className="mt-4 pt-4">
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
      <div className="px-4 py-2 bg-[var(--bg-elevated)] flex items-center justify-between text-[10px] font-mono text-[var(--text-tertiary)]">
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
