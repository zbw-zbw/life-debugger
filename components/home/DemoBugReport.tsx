'use client';

import { useMemo } from 'react';
import { DEMO_BUG_REPORTS } from '@/lib/constants';
import BugReportCard from '@/components/bug/BugReportCard';

function getStableIndex(): number {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dayOfYear % DEMO_BUG_REPORTS.length;
}

export default function DemoBugReport() {
  const demoReport = useMemo(() => {
    return DEMO_BUG_REPORTS[getStableIndex()];
  }, []);

  return (
    <BugReportCard bug={demoReport} interactive={false} />
  );
}
