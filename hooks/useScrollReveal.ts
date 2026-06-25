'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options?: ScrollRevealOptions) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  const threshold = options?.threshold ?? 0.1;
  const once = options?.once ?? true;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, once]);

  return { ref, isVisible };
}

// 获取可见时的过渡样式（从隐藏到显示）
export function getScrollRevealStyle(options?: ScrollRevealOptions, index?: number) {
  const {
    delay = 0,
    duration = 600,
    distance = 30,
    direction = 'up',
  } = options || {};

  const delayMs = index !== undefined ? delay + index * 100 : delay;

  const translateMap = {
    up: `translateY(${distance}px)`,
    down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`,
  };

  return {
    transform: translateMap[direction],
    transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delayMs}ms, transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delayMs}ms`,
  };
}
