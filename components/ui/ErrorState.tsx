'use client';

interface ErrorStateProps {
  type: 'network' | 'api' | 'timeout' | 'parse';
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
}

const ERROR_CONFIG = {
  network: {
    title: 'Connection Failed',
    icon: '📡',
    description: '诊断引擎连接失败，请检查网络',
  },
  api: {
    title: 'AI Engine Busy',
    icon: '⚙️',
    description: 'AI 引擎繁忙，请稍后重试',
  },
  timeout: {
    title: 'Request Timeout',
    icon: '⏱️',
    description: '分析超时，诊断引擎响应过慢',
  },
  parse: {
    title: 'Parse Error',
    icon: '🔧',
    description: 'AI 输出异常，已使用预设诊断数据',
  },
};

export default function ErrorState({ type, message, onRetry, onBack }: ErrorStateProps) {
  const config = ERROR_CONFIG[type];

  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] overflow-hidden animate-fade-in-up">
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-elevated)] border-b border-[var(--border-default)]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[var(--red)]" />
          <div className="w-3 h-3 rounded-full bg-[var(--yellow)]" />
          <div className="w-3 h-3 rounded-full bg-[var(--green)]" />
        </div>
        <span className="ml-2 text-xs font-mono text-[var(--text-tertiary)]">
          error.log
        </span>
      </div>
      <div className="p-6 text-center">
        <div className="text-3xl mb-3">{config.icon}</div>
        <div className="font-mono text-sm text-[var(--red)] mb-2">
          {'>'} Error: {config.title}
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          {message || config.description}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--red)]/50 text-[var(--red)] font-mono text-sm transition-all duration-300 hover:bg-[var(--red)]/10 hover:border-[var(--red)]"
            >
              <span>$ retry</span>
            </button>
          )}
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] font-mono text-sm transition-all duration-300 hover:border-[var(--green)] hover:text-[var(--green)]"
            >
              <span>{'<-'}</span>
              <span>$ back</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
