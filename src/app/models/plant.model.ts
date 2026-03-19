export type CareInterval = 'daily' | 'every-2-days' | 'every-3-days' | 'weekly' | 'every-2-weeks' | 'monthly' | 'seasonally' | 'yearly' | 'as-needed';

export interface CareTask {
  interval: CareInterval | '';
  lastDone: string | null; // ISO date string (YYYY-MM-DD)
}

export interface LinkEntry {
  url: string;
  title?: string;
  addedAt: string; // ISO date string (YYYY-MM-DD)
}

export interface Plant {
  id?: number;
  name: string;
  location?: string; // free-text grouping label, e.g. "terasse"
  photo?: string; // base64
  plantingLocation: 'sun' | 'partial-sun' | 'shade';
  careSchedule: {
    watering: CareTask;
    pruning: CareTask;
    fertilizing: CareTask;
  };
  links: LinkEntry[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CARE_INTERVALS: { value: CareInterval; label: string; days: number }[] = [
  { value: 'daily',         label: 'Daily',         days: 1   },
  { value: 'every-2-days',  label: 'Every 2 days',  days: 2   },
  { value: 'every-3-days',  label: 'Every 3 days',  days: 3   },
  { value: 'weekly',        label: 'Weekly',        days: 7   },
  { value: 'every-2-weeks', label: 'Every 2 weeks', days: 14  },
  { value: 'monthly',       label: 'Monthly',       days: 30  },
  { value: 'seasonally',    label: 'Seasonally',    days: 91  },
  { value: 'yearly',        label: 'Yearly',        days: 365 },
  { value: 'as-needed',     label: 'As needed',     days: 0   },
];

/** Returns days until next care action. Negative = overdue. Null = not configured / as-needed. */
export function daysUntilDue(task: CareTask): number | null {
  if (!task.interval || task.interval === 'as-needed') return null;
  const intervalDef = CARE_INTERVALS.find(i => i.value === task.interval);
  if (!intervalDef || intervalDef.days === 0) return null;
  if (!task.lastDone) return -1; // never done → treat as overdue

  const last = new Date(task.lastDone);
  const nextDue = new Date(last.getTime() + intervalDef.days * 86_400_000);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  nextDue.setHours(0, 0, 0, 0);
  return Math.round((nextDue.getTime() - today.getTime()) / 86_400_000);
}

export type DueStatus = 'overdue' | 'due-today' | 'due-soon' | 'ok' | null;

export function dueStatus(task: CareTask): DueStatus {
  const days = daysUntilDue(task);
  if (days === null) return null;
  if (days < 0) return 'overdue';
  if (days === 0) return 'due-today';
  if (days <= 2) return 'due-soon';
  return 'ok';
}

export function worstStatus(plant: Plant): DueStatus {
  const statuses: DueStatus[] = [
    dueStatus(plant.careSchedule.watering),
    dueStatus(plant.careSchedule.pruning),
    dueStatus(plant.careSchedule.fertilizing),
  ];
  if (statuses.includes('overdue')) return 'overdue';
  if (statuses.includes('due-today')) return 'due-today';
  if (statuses.includes('due-soon')) return 'due-soon';
  if (statuses.some(s => s === 'ok')) return 'ok';
  return null;
}
