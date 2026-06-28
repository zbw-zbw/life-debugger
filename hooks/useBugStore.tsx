'use client';

import { useState, useEffect, useCallback, useMemo, createContext, useContext, ReactNode } from 'react';
import { BugReport } from '@/types/bug';

export interface StoredBug extends BugReport {
  userInput: string;
  selectedPatchId: string | null;
  selectedPatchName: string | null;
  resolvedAt: string | null;
}

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

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function checkAchievements(data: BugStoreData): UnlockedAchievement[] {
  const { bugs, unlockedAchievements } = data;
  const newAchievements = [...unlockedAchievements];
  const today = formatDate(new Date());

  function tryUnlock(id: string) {
    if (!newAchievements.find(a => a.id === id)) {
      newAchievements.push({ id, unlockedAt: today });
    }
  }

  const totalBugs = bugs.length;
  const resolvedBugs = bugs.filter(b => b.status === 'RESOLVED');
  const bugsWithPatch = bugs.filter(b => b.selectedPatchId !== null);

  if (totalBugs >= 1) tryUnlock('first-bug');
  if (totalBugs >= 3) tryUnlock('debugger');
  if (totalBugs >= 10) tryUnlock('senior-debugger');
  if (bugsWithPatch.length >= 1) tryUnlock('first-patch');
  if (bugsWithPatch.length >= 10) tryUnlock('patch-master');
  if (resolvedBugs.some(b => b.severity === 'P0' || b.severity === 'P1')) tryUnlock('bug-hunter');
  if (resolvedBugs.some(b =>
    b.title.includes('睡眠') || b.title.includes('熬夜') || b.title.includes('刷屏') || b.title.includes('刷手机') ||
    b.impactAreas.some(a => a.includes('睡眠'))
  )) tryUnlock('night-owl');
  if (resolvedBugs.some(b =>
    b.title.includes('饮食') || b.title.includes('糖') || b.title.includes('奶茶') || b.title.includes('外卖') ||
    b.impactAreas.some(a => a.includes('饮食') || a.includes('健康'))
  )) tryUnlock('sugar-free');
  if (resolvedBugs.some(b => b.fixDays >= 21)) tryUnlock('marathon');
  if (totalBugs >= 3 && totalBugs === resolvedBugs.length) tryUnlock('legend');

  return newAchievements;
}

interface BugStoreContextValue {
  bugs: StoredBug[];
  unlockedAchievements: UnlockedAchievement[];
  newlyUnlocked: string[];
  clearNewlyUnlocked: () => void;
  stats: { total: number; open: number; fixing: number; resolved: number };
  severityStats: { severity: string; count: number }[];
  impactAreaStats: { area: string; count: number }[];
  loaded: boolean;
  saveBug: (bug: BugReport, userInput: string) => void;
  deleteBug: (bugId: string) => void;
  selectPatch: (bugId: string, patchId: string, patchName: string) => void;
  resolveBug: (bugId: string) => void;
  getBugById: (bugId: string) => StoredBug | undefined;
}

const BugStoreContext = createContext<BugStoreContextValue | null>(null);

export function BugStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<BugStoreData>({ bugs: [], unlockedAchievements: [] });
  const [loaded, setLoaded] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);

  useEffect(() => {
    const stored = loadStore();
    setData(stored);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const updatedAchievements = checkAchievements(data);
    const newOnes = updatedAchievements.filter(
      a => !data.unlockedAchievements.find(ea => ea.id === a.id)
    );
    if (newOnes.length > 0) {
      setNewlyUnlocked(newOnes.map(a => a.id));
      const updated = { ...data, unlockedAchievements: updatedAchievements };
      setData(updated);
      saveStore(updated);
    } else {
      saveStore(data);
    }
  }, [data.bugs, loaded]);

  const clearNewlyUnlocked = useCallback(() => {
    setNewlyUnlocked([]);
  }, []);

  const saveBug = useCallback((bug: BugReport, userInput: string) => {
    setData(prev => {
      if (prev.bugs.some(b => b.id === bug.id)) return prev;
      const stored: StoredBug = {
        ...bug,
        userInput,
        selectedPatchId: null,
        selectedPatchName: null,
        resolvedAt: null,
        createdAt: formatDate(new Date()),
      };
      return { ...prev, bugs: [stored, ...prev.bugs] };
    });
  }, []);

  const deleteBug = useCallback((bugId: string) => {
    setData(prev => ({
      ...prev,
      bugs: prev.bugs.filter(b => b.id !== bugId),
    }));
  }, []);

  const selectPatch = useCallback((bugId: string, patchId: string, patchName: string) => {
    setData(prev => ({
      ...prev,
      bugs: prev.bugs.map(b =>
        b.id === bugId
          ? { ...b, selectedPatchId: patchId, selectedPatchName: patchName, status: 'FIXING' as const }
          : b
      ),
    }));
  }, []);

  const resolveBug = useCallback((bugId: string) => {
    setData(prev => ({
      ...prev,
      bugs: prev.bugs.map(b =>
        b.id === bugId
          ? { ...b, status: 'RESOLVED' as const, resolvedAt: formatDate(new Date()) }
          : b
      ),
    }));
  }, []);

  const getBugById = useCallback((bugId: string): StoredBug | undefined => {
    return data.bugs.find(b => b.id === bugId);
  }, [data.bugs]);

  const stats = useMemo(() => ({
    total: data.bugs.length,
    open: data.bugs.filter(b => b.status === 'OPEN').length,
    fixing: data.bugs.filter(b => b.status === 'FIXING').length,
    resolved: data.bugs.filter(b => b.status === 'RESOLVED').length,
  }), [data.bugs]);

  const severityStats = useMemo(() => {
    const order = ['P0', 'P1', 'P2', 'P3', 'P4'];
    const map = new Map<string, number>();
    data.bugs.forEach(b => map.set(b.severity, (map.get(b.severity) || 0) + 1));
    return order.filter(s => map.has(s)).map(s => ({ severity: s, count: map.get(s)! }));
  }, [data.bugs]);

  const impactAreaStats = useMemo(() => {
    const map = new Map<string, number>();
    data.bugs.forEach(b => b.impactAreas.forEach(a => map.set(a, (map.get(a) || 0) + 1)));
    return Array.from(map.entries())
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count);
  }, [data.bugs]);

  const value: BugStoreContextValue = {
    bugs: data.bugs,
    unlockedAchievements: data.unlockedAchievements,
    newlyUnlocked,
    clearNewlyUnlocked,
    stats,
    severityStats,
    impactAreaStats,
    loaded,
    saveBug,
    deleteBug,
    selectPatch,
    resolveBug,
    getBugById,
  };

  return <BugStoreContext.Provider value={value}>{children}</BugStoreContext.Provider>;
}

export function useBugStore() {
  const ctx = useContext(BugStoreContext);
  if (!ctx) {
    throw new Error('useBugStore must be used within BugStoreProvider');
  }
  return ctx;
}
