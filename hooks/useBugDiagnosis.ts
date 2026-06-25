'use client';

import { useState, useRef, useCallback } from 'react';
import { BugReport } from '@/types/bug';
import { generateBugReport } from '@/lib/mockGenerator';

export type DiagnosticPhase = 'input' | 'analyzing' | 'result' | 'error';

interface UseBugDiagnosisReturn {
  phase: DiagnosticPhase;
  bugReport: BugReport | null;
  error: string | null;
  errorType: 'network' | 'api' | 'timeout' | 'parse' | null;
  streamingText: string;
  isDemoMode: boolean;
  startDiagnosis: (description: string) => void;
  reset: () => void;
  retry: () => void;
}

export function useBugDiagnosis(): UseBugDiagnosisReturn {
  const [phase, setPhase] = useState<DiagnosticPhase>('input');
  const [bugReport, setBugReport] = useState<BugReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'network' | 'api' | 'timeout' | 'parse' | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const lastDescriptionRef = useRef('');

  const reset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setPhase('input');
    setBugReport(null);
    setError(null);
    setErrorType(null);
    setStreamingText('');
    setIsDemoMode(false);
    lastDescriptionRef.current = '';
  }, []);

  const retry = useCallback(() => {
    if (lastDescriptionRef.current) {
      setError(null);
      setErrorType(null);
      setBugReport(null);
      setStreamingText('');
      setIsDemoMode(false);
      startDiagnosisInternal(lastDescriptionRef.current);
    }
  }, []);

  const startDiagnosis = useCallback((description: string) => {
    lastDescriptionRef.current = description;
    startDiagnosisInternal(description);
  }, []);

  const startDiagnosisInternal = async (description: string) => {
    setPhase('analyzing');
    setStreamingText('');
    setError(null);
    setErrorType(null);
    setIsDemoMode(false);

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
        signal: abortController.signal,
      });

      const demoMode = response.headers.get('X-Demo-Mode') === 'true';
      setIsDemoMode(demoMode);

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: 'Unknown error' }));
        setErrorType('api');
        setError(data.error || 'AI 引擎繁忙，请稍后重试');
        setPhase('error');
        return;
      }

      if (!response.body) {
        setErrorType('network');
        setError('诊断引擎返回空响应');
        setPhase('error');
        return;
      }

      // Read the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;

            const dataStr = trimmed.slice(5).trim();
            if (dataStr === '[DONE]') continue;

            try {
              const data = JSON.parse(dataStr);
              const content = data.choices?.[0]?.delta?.content;
              if (content) {
                accumulated += content;
                setStreamingText(accumulated);
              }
            } catch {
              // Skip malformed lines
              continue;
            }
          }
        }
      } catch (streamErr) {
        if ((streamErr as Error).name === 'AbortError') {
          setErrorType('timeout');
          setError('分析已取消');
          setPhase('error');
          return;
        }
        throw streamErr;
      }

      // Try to parse the accumulated text as JSON
      const cleaned = accumulated
        .replace(/^```json\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      let parsed: Partial<BugReport>;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        // Try to extract JSON from mixed content
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch {
            // JSON 解析失败，降级到 mock
            console.warn('JSON parse failed, falling back to mock');
            const mockReport = generateBugReport(lastDescriptionRef.current);
            setBugReport(mockReport);
            setIsDemoMode(true);
            setPhase('result');
            return;
          }
        } else {
          // 无法提取 JSON，降级到 mock
          console.warn('No JSON found in response, falling back to mock');
          const mockReport = generateBugReport(lastDescriptionRef.current);
          setBugReport(mockReport);
          setIsDemoMode(true);
          setPhase('result');
          return;
        }
      }

      // Validate required fields
      if (!parsed.title || !parsed.severity) {
        setErrorType('parse');
        setError('AI 返回数据不完整');
        setPhase('error');
        return;
      }

      const fullReport: BugReport = {
        id: parsed.id || `LIFE-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
        title: parsed.title,
        severity: parsed.severity as BugReport['severity'],
        status: 'OPEN',
        triggerCount: parsed.triggerCount || Math.floor(Math.random() * 500) + 50,
        impactAreas: parsed.impactAreas || ['日常生活'],
        reproSteps: parsed.reproSteps || ['步骤1', '步骤2', '步骤3', '步骤4'],
        rootCauses: parsed.rootCauses || ['根因1', '根因2', '根因3'],
        patches: parsed.patches || [
          { id: 'patch-a', name: '方案A', difficulty: '低难度', description: '描述A' },
          { id: 'patch-b', name: '方案B', difficulty: '中难度', description: '描述B' },
          { id: 'patch-c', name: '方案C', difficulty: '高难度', description: '描述C' },
        ],
        fixDays: parsed.fixDays || 21,
        confidence: parsed.confidence || 70,
        createdAt: new Date().toISOString(),
      };

      setBugReport(fullReport);
      setPhase('result');
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setErrorType('timeout');
        setError('分析已取消或超时');
        setPhase('error');
      } else {
        // 网络错误或 API 失败时自动降级到 mock
        console.warn('API call failed, falling back to mock:', err);
        const mockReport = generateBugReport(lastDescriptionRef.current);
        setBugReport(mockReport);
        setIsDemoMode(true);
        setPhase('result');
      }
    } finally {
      abortRef.current = null;
    }
  };

  return {
    phase,
    bugReport,
    error,
    errorType,
    streamingText,
    isDemoMode,
    startDiagnosis,
    reset,
    retry,
  };
}
