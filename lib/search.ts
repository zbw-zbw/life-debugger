import { StoredBug } from '@/hooks/useBugStore';

export function searchBugs(
  bugs: StoredBug[],
  query: string,
  statusFilter: string,
  severityFilter: string,
): StoredBug[] {
  let result = bugs;

  // Status filter
  if (statusFilter !== 'ALL') {
    result = result.filter(b => b.status === statusFilter);
  }

  // Severity filter
  if (severityFilter !== 'ALL') {
    result = result.filter(b => b.severity === severityFilter);
  }

  // Text search (fuzzy match across multiple fields)
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    result = result.filter(b => {
      const fields = [
        b.title,
        b.userInput,
        b.id,
        ...b.impactAreas,
        ...b.reproSteps,
        ...b.rootCauses,
      ];
      return fields.some(f => f?.toLowerCase().includes(q));
    });
  }

  return result;
}
