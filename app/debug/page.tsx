'use client';

import { useState, useCallback } from 'react';
import { useBugDiagnosis } from '@/hooks/useBugDiagnosis';
import { QUICK_TEMPLATES } from '@/lib/mockGenerator';
import AnalysisProcess from '@/components/debug/AnalysisProcess';
import BugReportCard from '@/components/bug/BugReportCard';
import { shareBugReport } from '@/components/bug/ShareCard';
import Toast, { ToastData } from '@/components/ui/Toast';
import ErrorState from '@/components/ui/ErrorState';
import { useBugStore } from '@/hooks/useBugStore';
import { useToastId } from '@/hooks/useToastId';
import { AlertIcon } from '@/components/ui/Icon';

export default function DebugPage() {
  const {
    phase,
    bugReport,
    errorType,
    streamingText,
    isDemoMode,
    startDiagnosis,
    reset,
    retry,
  } = useBugDiagnosis();

  const [input, setInput] = useState('');
  const [toast, setToast] = useState<ToastData | null>(null);
  const [saved, setSaved] = useState(false);
  const { saveBug } = useBugStore();
  const nextToastId = useToastId();

  const showToast = useCallback((type: ToastData['type'], message: string) => {
    setToast({ id: nextToastId(), type, message });
  }, [nextToastId]);

  const minLength = 10;
  const isValid = input.trim().length >= minLength;

  const handleSubmit = () => {
    if (!isValid) return;
    startDiagnosis(input);
  };

  const handleReset = () => {
    setInput('');
    setSaved(false);
    reset();
  };

  const handleSave = () => {
    if (!bugReport || saved) return;
    saveBug(bugReport, input);
    setSaved(true);
    showToast('success', 'Bug Report 已保存，前往 ~/history 查看');
  };

  const handleShare = async () => {
    if (!bugReport) return;
    const result = await shareBugReport(bugReport);
    if (result === 'shared') {
      showToast('success', '分享面板已打开');
    } else if (result === 'copied') {
      showToast('success', '链接已复制到剪贴板');
    } else {
      showToast('error', '复制失败，请手动复制');
    }
  };

  const handleSelectTemplate = (text: string) => {
    setInput(text);
  };

  const getLineCount = () => {
    return input.split('\n').length;
  };

  const getColCount = () => {
    const lines = input.split('\n');
    return lines[lines.length - 1].length + 1;
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Toast */}
        {toast && (
          <Toast toast={toast} onClose={() => setToast(null)} />
        )}

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--green)] font-mono">
            $ life-debug analyze
          </h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            描述你遇到的生活Bug，AI将为你生成诊断报告
          </p>
        </div>

        {/* Input Phase */}
        {phase === 'input' && (
          <div className="animate-fade-in-up space-y-6">
            {/* Terminal Input */}
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-elevated)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
                </div>
                <span className="ml-2 text-xs font-mono text-[var(--text-tertiary)]">
                  bug-description.txt
                </span>
              </div>

              <div className="relative">
                <div className="flex">
                  <div className="flex-shrink-0 w-10 sm:w-12 py-4 text-right pr-2 sm:pr-3 select-none">
                    {Array.from({ length: Math.max(5, getLineCount()) }, (_, i) => (
                      <div
                        key={i}
                        className="text-xs font-mono text-[var(--text-tertiary)] leading-[1.625rem]"
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={"> 在这里描述你的烦恼...\n> 例如：我每次写报告都拖到截止日期前一天晚上，但提前开始就是做不到"}
                    rows={5}
                    className="flex-1 py-4 pr-4 bg-transparent font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] resize-none input-focus-glow leading-[1.625rem]"
                    style={{ minHeight: '8rem', maxHeight: '16rem' }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-1.5 bg-[var(--blue)]/10 text-[10px] font-mono text-[var(--text-tertiary)]">
                <div className="flex items-center gap-3">
                  <span>Ln {getLineCount()}, Col {getColCount()}</span>
                  <span>{input.length} chars</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>UTF-8</span>
                  <span>Markdown</span>
                </div>
              </div>
            </div>

            {!isValid && input.length > 0 && (
              <div className="font-mono text-xs text-[var(--red)]">
                {'>'} Error: 描述太短，至少需要{minLength}个字符才能分析
              </div>
            )}

            <div className="flex items-center justify-end">
              <button
                onClick={handleSubmit}
                disabled={!isValid}
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--green)] text-[var(--bg-primary)] font-mono font-bold text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(57,211,83,0.3)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none w-full sm:w-auto justify-center"
              >
                <span>$ run diagnostic</span>
                <span className="cursor-blink">_</span>
              </button>
            </div>

            <div>
              <p className="text-xs font-mono text-[var(--text-tertiary)] mb-3">
                {'>'} 常见 Bug 模板（点击快速填入）：
              </p>
              <div className="template-scroll flex gap-2 overflow-x-auto pb-2 pl-0">
                {QUICK_TEMPLATES.map((template) => (
                  <button
                    key={template.label}
                    onClick={() => handleSelectTemplate(template.text)}
                    className="flex-shrink-0 ml-0 first:ml-0 px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-secondary)] text-xs text-[var(--text-secondary)] font-mono transition-all duration-200 hover:border-[var(--green-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analyzing Phase */}
        {phase === 'analyzing' && (
          <div className="animate-fade-in-up">
            <AnalysisProcess streamingText={streamingText} />
          </div>
        )}

        {/* Result Phase */}
        {phase === 'result' && bugReport && (
          <div className="animate-fade-in-up space-y-6">
            <div className="space-y-2">
              <div className="font-mono text-sm text-[var(--green)]">
                {'>'} Bug Report 生成成功 ✓
              </div>
              <div className="font-mono text-xs text-[var(--text-secondary)] truncate">
                {'>'} 原始描述: &quot;{input}&quot;
              </div>
            </div>

            <BugReportCard bug={bugReport} interactive={false} />

            {isDemoMode && (
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-mono text-[var(--text-tertiary)] border border-[var(--border-default)] bg-[var(--bg-tertiary)]">
                  <AlertIcon className="text-xs" />
                  <span>Demo 模式 - 使用预设诊断数据</span>
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleReset}
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] font-mono text-sm transition-all duration-300 hover:border-[var(--green)] hover:text-[var(--green)]"
              >
                <span>{'<-'}</span>
                <span>$ debug --new</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saved}
                className={`btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono font-bold text-sm transition-all duration-300 ${
                  saved
                    ? 'border border-[var(--green)] text-[var(--green)] opacity-50 cursor-default'
                    : 'bg-[var(--green)] text-[var(--bg-primary)] hover:shadow-[0_0_20px_rgba(57,211,83,0.3)]'
                }`}
              >
                <span>{saved ? '✓ saved' : '$ save'}</span>
              </button>
              <button
                onClick={handleShare}
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] font-mono text-sm transition-all duration-300 hover:border-[var(--purple)] hover:text-[var(--purple)]"
              >
                <span>$ share</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Phase */}
        {phase === 'error' && errorType && (
          <div className="animate-fade-in-up">
            <ErrorState
              type={errorType}
              onRetry={retry}
              onBack={handleReset}
            />
          </div>
        )}
      </div>
    </div>
  );
}
