'use client';

import { useRef } from 'react';

export function useToastId() {
  const counterRef = useRef(0);
  return () => {
    counterRef.current += 1;
    return `toast-${counterRef.current}`;
  };
}
