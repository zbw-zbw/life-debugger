export type Severity = 'P0' | 'P1' | 'P2' | 'P3' | 'P4';

export type BugStatus = 'OPEN' | 'FIXING' | 'RESOLVED';

export interface Patch {
  id: string;
  name: string;
  difficulty: '低难度' | '中难度' | '高难度';
  description: string;
}

export interface SeverityInfo {
  level: Severity;
  label: string;
  englishLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface BugReport {
  id: string;
  title: string;
  severity: Severity;
  status: BugStatus;
  triggerCount: number;
  impactAreas: string[];
  reproSteps: string[];
  rootCauses: string[];
  patches: Patch[];
  fixDays: number;
  confidence: number;
  createdAt: string;
  checkInDates?: string[];
}
