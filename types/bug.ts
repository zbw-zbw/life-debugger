// 严重等级
export type Severity = 'P0' | 'P1' | 'P2' | 'P3' | 'P4';

export interface SeverityInfo {
  level: Severity;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

// 修复方案
export interface Patch {
  id: string;
  name: string;
  difficulty: '低难度' | '中难度' | '高难度';
  description: string;
}

// Bug Report 完整结构
export interface BugReport {
  id: string;
  title: string;
  severity: Severity;
  status: 'OPEN' | 'FIXING' | 'RESOLVED';
  triggerCount: number;
  impactAreas: string[];
  reproSteps: string[];
  rootCauses: string[];
  patches: Patch[];
  fixDays: number;
  confidence: number;
  createdAt: string;
}
