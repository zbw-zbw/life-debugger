import { StoredBug } from '@/hooks/useBugStore';

interface DayData {
  date: string; // YYYY-MM-DD
  count: number;
  bugs: string[]; // bug IDs
}

interface HeatmapData {
  days: DayData[];
  maxCount: number;
  totalDays: number;
  currentStreak: number;
  longestStreak: number;
}

// Aggregate check-in dates from all bugs into a daily count map
function aggregateCheckIns(bugs: StoredBug[]): Map<string, DayData> {
  const map = new Map<string, DayData>();

  for (const bug of bugs) {
    const dates = bug.checkInDates ?? [];
    for (const dateStr of dates) {
      const existing = map.get(dateStr);
      if (existing) {
        existing.count++;
        existing.bugs.push(bug.id);
      } else {
        map.set(dateStr, { date: dateStr, count: 1, bugs: [bug.id] });
      }
    }
  }

  return map;
}

// Calculate streak from a sorted array of date strings
function calcStreak(sortedDates: string[]): number {
  if (sortedDates.length === 0) return 0;
  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last = new Date(sortedDates[sortedDates.length - 1]);
  last.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - last.getTime()) / 86400000);
  if (diffDays > 1) return 0; // streak broken

  for (let i = sortedDates.length - 1; i > 0; i--) {
    const curr = new Date(sortedDates[i]);
    const prev = new Date(sortedDates[i - 1]);
    curr.setHours(0, 0, 0, 0);
    prev.setHours(0, 0, 0, 0);
    const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function buildHeatmapData(bugs: StoredBug[], weeks: number = 16): HeatmapData {
  const rawMap = aggregateCheckIns(bugs);
  const allDates = Array.from(rawMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  const dateKeys = allDates.map(d => d.date);

  // Generate date grid (weeks * 7 days, ending today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: DayData[] = [];

  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const data = rawMap.get(key);
    days.push(data ?? { date: key, count: 0, bugs: [] });
  }

  const maxCount = Math.max(...days.map(d => d.count), 1);
  const totalDays = days.filter(d => d.count > 0).length;
  const currentStreak = calcStreak(dateKeys);

  // Longest streak
  let longestStreak = currentStreak;
  let run = 1;
  for (let i = 1; i < dateKeys.length; i++) {
    const curr = new Date(dateKeys[i]);
    const prev = new Date(dateKeys[i - 1]);
    curr.setHours(0, 0, 0, 0);
    prev.setHours(0, 0, 0, 0);
    if (Math.round((curr.getTime() - prev.getTime()) / 86400000) === 1) {
      run++;
      longestStreak = Math.max(longestStreak, run);
    } else {
      run = 1;
    }
  }

  return { days, maxCount, totalDays, currentStreak, longestStreak };
}

// Color scale for heatmap cells
export function getHeatColor(count: number, max: number): string {
  if (count === 0) return 'var(--bg-tertiary)';
  const ratio = count / Math.max(max, 1);
  if (ratio <= 0.25) return 'rgba(57,211,83,0.25)';
  if (ratio <= 0.5) return 'rgba(57,211,83,0.5)';
  if (ratio <= 0.75) return 'rgba(57,211,83,0.75)';
  return 'rgba(57,211,83,1)';
}

// Month labels for the heatmap
export function getMonthLabels(days: DayData[]): { label: string; colIndex: number }[] {
  const labels: { label: string; colIndex: number }[] = [];
  let lastMonth = -1;
  for (let i = 0; i < days.length; i++) {
    const month = new Date(days[i].date).getMonth();
    if (month !== lastMonth) {
      labels.push({ label: `${month + 1}月`, colIndex: Math.floor(i / 7) });
      lastMonth = month;
    }
  }
  return labels;
}
