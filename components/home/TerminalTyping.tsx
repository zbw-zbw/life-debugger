'use client';

import { useState, useEffect, useCallback } from 'react';

interface TerminalLine {
  text: string;
  styles?: { prefix?: string; prefixColor?: string; highlights?: Array<{ text: string; color: string }> };
}

interface TerminalTypingProps {
  lines: TerminalLine[];
  onComplete?: () => void;
  charDelay?: number;
  lineDelay?: number;
}

export default function TerminalTyping({
  lines,
  onComplete,
  charDelay = 30,
  lineDelay = 500,
}: TerminalTypingProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const getLinePrefix = (line: TerminalLine) => {
    if (line.styles?.prefix) {
      return (
        <span style={{ color: line.styles.prefixColor || 'var(--green)' }}>
          {line.styles.prefix}
        </span>
      );
    }
    return null;
  };

  const renderLine = (line: TerminalLine, displayText: string) => {
    const parts: React.ReactNode[] = [];
    let remaining = displayText;

    if (line.styles?.prefix) {
      remaining = remaining.replace(line.styles.prefix, '');
    }

    if (line.styles?.highlights) {
      const regex = new RegExp(
        `(${line.styles.highlights.map(h => h.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
        'g'
      );
      const split = remaining.split(regex);
      let key = 0;
      split.forEach((part) => {
        const highlight = line.styles?.highlights?.find(h => h.text === part);
        if (highlight) {
          parts.push(
            <span key={key++} style={{ color: highlight.color }}>{part}</span>
          );
        } else {
          parts.push(<span key={key++}>{part}</span>);
        }
      });
    } else {
      parts.push(remaining);
    }

    return parts;
  };

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      if (!isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
      return;
    }

    const line = lines[currentLineIndex];
    const fullText = line.text;

    if (currentCharIndex < fullText.length) {
      const timer = setTimeout(() => {
        setCurrentCharIndex(prev => prev + 1);
      }, charDelay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => [...prev, fullText]);
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, lineDelay);
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, currentCharIndex, lines, charDelay, lineDelay, isComplete, onComplete]);

  return (
    <div className="font-mono text-sm leading-relaxed space-y-1">
      {displayedLines.map((line, i) => (
        <div key={i} className="terminal-line" style={{ animationDelay: `${i * 0.05}s` }}>
          {getLinePrefix(lines[i])}
          {renderLine(lines[i], line)}
        </div>
      ))}
      {currentLineIndex < lines.length && (
        <div>
          {getLinePrefix(lines[currentLineIndex])}
          {renderLine(lines[currentLineIndex], lines[currentLineIndex].text.slice(0, currentCharIndex))}
          <span className="cursor-blink">▋</span>
        </div>
      )}
    </div>
  );
}
