'use client';

import { useEffect, useReducer } from 'react';

interface TerminalLine {
  text: string;
  styles?: { prefix?: string; prefixColor?: string; highlights?: Array<{ text: string; color: string }> };
}

interface TerminalTypingProps {
  lines: TerminalLine[];
  onComplete?: () => void;
  charDelay?: number;
  lineDelay?: number;
  skip?: boolean;
}

interface State {
  displayedLines: string[];
  currentLineIndex: number;
  currentCharIndex: number;
  isComplete: boolean;
}

type Action =
  | { type: 'NEXT_CHAR' }
  | { type: 'NEXT_LINE'; fullText: string }
  | { type: 'COMPLETE' }
  | { type: 'SKIP_ALL'; lines: TerminalLine[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'NEXT_CHAR':
      return { ...state, currentCharIndex: state.currentCharIndex + 1 };
    case 'NEXT_LINE':
      return {
        ...state,
        displayedLines: [...state.displayedLines, action.fullText],
        currentLineIndex: state.currentLineIndex + 1,
        currentCharIndex: 0,
      };
    case 'COMPLETE':
      return { ...state, isComplete: true };
    case 'SKIP_ALL':
      return {
        displayedLines: action.lines.map(l => l.text),
        currentLineIndex: action.lines.length,
        currentCharIndex: 0,
        isComplete: true,
      };
    default:
      return state;
  }
}

export default function TerminalTyping({
  lines,
  onComplete,
  charDelay = 30,
  lineDelay = 500,
  skip = false,
}: TerminalTypingProps) {
  const [state, dispatch] = useReducer(reducer, {
    displayedLines: [],
    currentLineIndex: 0,
    currentCharIndex: 0,
    isComplete: false,
  });

  const { displayedLines, currentLineIndex, currentCharIndex, isComplete } = state;

  // Skip animation: show all lines instantly
  useEffect(() => {
    if (skip && !isComplete) {
      dispatch({ type: 'SKIP_ALL', lines });
    }
  }, [skip, isComplete, lines]);

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
        dispatch({ type: 'COMPLETE' });
      }
      return;
    }

    if (skip) return; // Don't schedule timers when skipping

    const line = lines[currentLineIndex];
    const fullText = line.text;

    if (currentCharIndex < fullText.length) {
      const timer = setTimeout(() => {
        dispatch({ type: 'NEXT_CHAR' });
      }, charDelay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        dispatch({ type: 'NEXT_LINE', fullText });
      }, lineDelay);
      return () => clearTimeout(timer);
    }
  }, [currentLineIndex, currentCharIndex, lines, charDelay, lineDelay, isComplete, skip]);

  useEffect(() => {
    if (isComplete) {
      onComplete?.();
    }
  }, [isComplete, onComplete]);

  return (
    <div className="font-mono text-xs sm:text-sm leading-relaxed space-y-1 overflow-x-auto">
      {displayedLines.map((line, i) => (
        <div key={i} className="terminal-line" style={{ animationDelay: `${i * 0.05}s` }}>
          {getLinePrefix(lines[i])}
          {renderLine(lines[i], line)}
        </div>
      ))}
      {currentLineIndex < lines.length && !skip && (
        <div>
          {getLinePrefix(lines[currentLineIndex])}
          {renderLine(lines[currentLineIndex], lines[currentLineIndex].text.slice(0, currentCharIndex))}
          <span className="cursor-blink">▋</span>
        </div>
      )}
    </div>
  );
}
