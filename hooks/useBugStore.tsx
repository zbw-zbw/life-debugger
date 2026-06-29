'use client';

import { useReducer, useCallback, useMemo, createContext, useContext, ReactNode, useSyncExternalStore } from 'react';
import { BugReport } from '@/types/bug';
import { computeStreak } from '@/lib/checkIn';

export interface StoredBug extends BugReport {
  userInput: string;
  selectedPatchId: string | null;
  selectedPatchName: string | null;
  resolvedAt: string | null;
  checkInDates: string[];
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

function checkAchievements(bugs: StoredBug[]): UnlockedAchievement[] {
  const today = formatDate(new Date());
  const newAchievements: UnlockedAchievement[] = [];
  const seen = new Set<string>();

  function tryUnlock(id: string) {
    if (!seen.has(id)) {
      seen.add(id);
      newAchievements.push({ id, unlockedAt: today });
    }
  }

  const totalBugs = bugs.length;
  const resolvedBugs = bugs.filter(b => b.status === 'RESOLVED');
  const bugsWithPatch = bugs.filter(b => b.selectedPatchId !== null);
  const maxStreak = bugs.reduce((max, b) => Math.max(max, computeStreak(b.checkInDates ?? [])), 0);
  const totalCheckIns = bugs.reduce((sum, b) => sum + (b.checkInDates?.length ?? 0), 0);

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
  if (maxStreak >= 7) tryUnlock('week-streak');
  if (totalCheckIns >= 21) tryUnlock('month-streak');

  return newAchievements;
}

function mergeAchievements(
  existing: UnlockedAchievement[],
  detected: UnlockedAchievement[]
): { achievements: UnlockedAchievement[]; newOnes: UnlockedAchievement[] } {
  const map = new Map(existing.map(a => [a.id, a]));
  const newOnes: UnlockedAchievement[] = [];
  detected.forEach(a => {
    if (!map.has(a.id)) {
      map.set(a.id, a);
      newOnes.push(a);
    }
  });
  return { achievements: Array.from(map.values()), newOnes };
}

function initializeStore(): BugStoreData {
  const stored = loadStore();
  // Migrate old bugs that lack checkInDates
  const migrated = {
    ...stored,
    bugs: stored.bugs.map(b => b.checkInDates ? b : { ...b, checkInDates: [] }),
  };
  const detected = checkAchievements(migrated.bugs);
  const merged = mergeAchievements(migrated.unlockedAchievements, detected);
  const initialized = { ...migrated, unlockedAchievements: merged.achievements };
  if (merged.newOnes.length > 0 || stored.bugs !== migrated.bugs) {
    saveStore(initialized);
  }
  return initialized;
}

type Action =
  | { type: 'SAVE_BUG'; bug: BugReport; userInput: string }
  | { type: 'DELETE_BUG'; bugId: string }
  | { type: 'SELECT_PATCH'; bugId: string; patchId: string; patchName: string }
  | { type: 'RESOLVE_BUG'; bugId: string }
  | { type: 'CHECK_IN'; bugId: string }
  | { type: 'SHIFT_NEWLY_UNLOCKED' };

interface State extends BugStoreData {
  newlyUnlocked: string[];
}

function computeNextState(prev: State, nextData: BugStoreData): State {
  const detected = checkAchievements(nextData.bugs);
  const merged = mergeAchievements(nextData.unlockedAchievements, detected);
  const updated: BugStoreData = { ...nextData, unlockedAchievements: merged.achievements };
  saveStore(updated);
  return {
    ...updated,
    newlyUnlocked: merged.newOnes.length > 0
      ? [...prev.newlyUnlocked, ...merged.newOnes.map(a => a.id)]
      : prev.newlyUnlocked,
  };
}

function reducer(prev: State, action: Action): State {
  const today = formatDate(new Date());

  switch (action.type) {
    case 'SAVE_BUG': {
      if (prev.bugs.some(b => b.id === action.bug.id)) return prev;
      const stored: StoredBug = {
        ...action.bug,
        userInput: action.userInput,
        selectedPatchId: null,
        selectedPatchName: null,
        resolvedAt: null,
        createdAt: today,
        checkInDates: [],
      };
      return computeNextState(prev, { ...prev, bugs: [stored, ...prev.bugs] });
    }
    case 'DELETE_BUG':
      return computeNextState(prev, { ...prev, bugs: prev.bugs.filter(b => b.id !== action.bugId) });
    case 'SELECT_PATCH':
      return computeNextState(prev, {
        ...prev,
        bugs: prev.bugs.map(b =>
          b.id === action.bugId
            ? { ...b, selectedPatchId: action.patchId, selectedPatchName: action.patchName, status: 'FIXING' as const }
            : b
        ),
      });
    case 'RESOLVE_BUG':
      return computeNextState(prev, {
        ...prev,
        bugs: prev.bugs.map(b =>
          b.id === action.bugId
            ? { ...b, status: 'RESOLVED' as const, resolvedAt: today }
            : b
        ),
      });
    case 'CHECK_IN': {
      if (prev.bugs.find(b => b.id === action.bugId)?.checkInDates.includes(today)) return prev;
      return computeNextState(prev, {
        ...prev,
        bugs: prev.bugs.map(b =>
          b.id === action.bugId
            ? { ...b, checkInDates: [...b.checkInDates, today] }
            : b
        ),
      });
    }
    case 'SHIFT_NEWLY_UNLOCKED':
      return { ...prev, newlyUnlocked: prev.newlyUnlocked.slice(1) };
    default:
      return prev;
  }
}

interface BugStoreContextValue {
  bugs: StoredBug[];
  unlockedAchievements: UnlockedAchievement[];
  newlyUnlocked: string[];
  shiftNewlyUnlocked: () => void;
  stats: { total: number; open: number; fixing: number; resolved: number };
  severityStats: { severity: string; count: number }[];
  impactAreaStats: { area: string; count: number }[];
  loaded: boolean;
  saveBug: (bug: BugReport, userInput: string) => void;
  deleteBug: (bugId: string) => void;
  selectPatch: (bugId: string, patchId: string, patchName: string) => void;
  resolveBug: (bugId: string) => void;
  checkIn: (bugId: string) => void;
  getBugById: (bugId: string) => StoredBug | undefined;
}

const BugStoreContext = createContext<BugStoreContextValue | null>(null);

export function BugStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const initialized = initializeStore();
    return { ...initialized, newlyUnlocked: [] };
  });

  const loaded = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const shiftNewlyUnlocked = useCallback(() => {
    dispatch({ type: 'SHIFT_NEWLY_UNLOCKED' });
  }, []);

  const saveBug = useCallback((bug: BugReport, userInput: string) => {
    dispatch({ type: 'SAVE_BUG', bug, userInput });
  }, []);

  const deleteBug = useCallback((bugId: string) => {
    dispatch({ type: 'DELETE_BUG', bugId });
  }, []);

  const selectPatch = useCallback((bugId: string, patchId: string, patchName: string) => {
    dispatch({ type: 'SELECT_PATCH', bugId, patchId, patchName });
  }, []);

  const resolveBug = useCallback((bugId: string) => {
    dispatch({ type: 'RESOLVE_BUG', bugId });
  }, []);

  const checkIn = useCallback((bugId: string) => {
    dispatch({ type: 'CHECK_IN', bugId });
  }, []);

  const getBugById = useCallback((bugId: string): StoredBug | undefined => {
    return state.bugs.find(b => b.id === bugId);
  }, [state.bugs]);

  const stats = useMemo(() => ({
    total: state.bugs.length,
    open: state.bugs.filter(b => b.status === 'OPEN').length,
    fixing: state.bugs.filter(b => b.status === 'FIXING').length,
    resolved: state.bugs.filter(b => b.status === 'RESOLVED').length,
  }), [state.bugs]);

  const severityStats = useMemo(() => {
    const order = ['P0', 'P1', 'P2', 'P3', 'P4'];
    const map = new Map<string, number>();
    state.bugs.forEach(b => map.set(b.severity, (map.get(b.severity) || 0) + 1));
    return order.filter(s => map.has(s)).map(s => ({ severity: s, count: map.get(s)! }));
  }, [state.bugs]);

  const impactAreaStats = useMemo(() => {
    const map = new Map<string, number>();
    state.bugs.forEach(b => b.impactAreas.forEach(a => map.set(a, (map.get(a) || 0) + 1)));
    return Array.from(map.entries())
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count);
  }, [state.bugs]);

  const value: BugStoreContextValue = {
    bugs: state.bugs,
    unlockedAchievements: state.unlockedAchievements,
    newlyUnlocked: state.newlyUnlocked,
    shiftNewlyUnlocked,
    stats,
    severityStats,
    impactAreaStats,
    loaded,
    saveBug,
    deleteBug,
    selectPatch,
    resolveBug,
    checkIn,
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
