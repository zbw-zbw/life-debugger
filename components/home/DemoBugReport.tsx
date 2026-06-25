'use client';

import { DEMO_BUG_REPORT } from '@/lib/constants';
import BugReportCard from '@/components/bug/BugReportCard';

export default function DemoBugReport() {
  return (
    <BugReportCard bug={DEMO_BUG_REPORT} interactive={false} />
  );
}
