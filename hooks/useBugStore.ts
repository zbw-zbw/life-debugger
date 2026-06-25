'use client';

import { useState, useEffect, useCallback } from 'react';
import { BugReport } from '@/types/bug';

// 存储的 Bug
export interface StoredBug extends BugReport {
  userInput: string;
  selectedPatchId: string | null;
  resolvedAt: string | null;
}

// 成就定义
export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

interface BugStoreData {
  bugs: StoredBug[];
  unlockedAchievements: UnlockedAchievement[];
}

const STORAGE_KEY = 'life-debugger-store';

function loadStore(): BugStoreData {
  if (typeof window === 'undefined') return { bugs: [], unlockedAchievements: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { bugs: [], unlockedAchievements: [] };
    return JSON.parse(raw);
  } catch {
    return { bugs: [], unlockedAchievements: [] };
  }
}

function saveStore(data: BugStoreData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn('localStorage write failed');
  }
}

export function useBugStore() {
  const [data, setData] = useState<BugStoreData>({ bugs: [], unlockedAchievements: [] });
  const [loaded, setLoaded] = useState(false);

  // 初始加载
  useEffect(() => {
    setData(loadStore());
    setLoaded(true);
  }, []);

  // 数据变化时写入 localStorage
  useEffect(() => {
    if (loaded) {
      saveStore(data);
    }
  }, [data, loaded]);

  const saveBug = useCallback((bug: BugReport, userInput: string) => {
    setData(prev => {
      // 去重：相同 id 不重复添加
      if (prev.bugs.some(b => b.id === bug.id)) return prev;
      const stored: StoredBug = {
        ...bug,
        userInput,
        selectedPatchId: null,
        resolvedAt: null,
      };
      const newBugs = [stored, ...prev.bugs];

      // 检查成就：初识 Bug
      const achievements = [...prev.unlockedAchievements];
      if (!achievements.find(a => a.id === 'first-bug')) {
        achievements.push({ id: 'first-bug', unlockedAt: new Date().toISOString().split('T')[0] });
      }
      // 调试新手：3个
      if (newBugs.length >= 3 && !achievements.find(a => a.id === 'debugger')) {
        achievements.push({ id: 'debugger', unlockedAt: new Date().toISOString().split('T')[0] });
      }
      // 资深调试员：10个
      if (newBugs.length >= 10 && !achievements.find(a => a.id === 'senior-debugger')) {
        achievements.push({ id: 'senior-debugger', unlockedAt: new Date().toISOString().split('T')[0] });
      }

      return { bugs: newBugs, unlockedAchievements: achievements };
    });
  }, []);

  const deleteBug = useCallback((bugId: string) => {
    setData(prev => ({
      ...prev,
      bugs: prev.bugs.filter(b => b.id !== bugId),
    }));
  }, []);

  const selectPatch = useCallback((bugId: string, patchId: string) => {
    setData(prev => {
      const bugs = prev.bugs.map(b =>
        b.id === bugId ? { ...b, selectedPatchId: patchId, status: 'FIXING' as const } : b
      );
      const achievements = [...prev.unlockedAchievements];
      if (!achievements.find(a => a.id === 'first-patch')) {
        achievements.push({ id: 'first-patch', unlockedAt: new Date().toISOString().split('T')[0] });
      }
      return { bugs, unlockedAchievements: achievements };
    });
  }, []);

  const resolveBug = useCallback((bugId: string) => {
    setData(prev => {
      const bugs = prev.bugs.map(b =>
        b.id === bugId ? { ...b, status: 'RESOLVED' as const, resolvedAt: new Date().toISOString().split('T')[0] } : b
      );
      const achievements = [...prev.unlockedAchievements];
      if (!achievements.find(a => a.id === 'first-resolve')) {
        achievements.push({ id: 'first-resolve', unlockedAt: new Date().toISOString().split('T')[0] });
      }
      return { bugs, unlockedAchievements: achievements };
    });
  }, []);

  const stats = {
    total: data.bugs.length,
    open: data.bugs.filter(b => b.status === 'OPEN').length,
    fixing: data.bugs.filter(b => b.status === 'FIXING').length,
    resolved: data.bugs.filter(b => b.status === 'RESOLVED').length,
  };

  return {
    bugs: data.bugs,
    unlockedAchievements: data.unlockedAchievements,
    stats,
    loaded,
    saveBug,
    deleteBug,
    selectPatch,
    resolveBug,
  };
}
