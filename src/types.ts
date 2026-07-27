export type EventCategory = 'work' | 'personal' | 'holiday' | 'milestone' | 'deadline';

export interface DateEvent {
  id: string;
  title: string;
  targetDate: string; // ISO string
  category: EventCategory;
  description?: string;
  color?: string;
  createdAt: string;
}

export interface TimezoneInfo {
  id: string;
  city: string;
  country: string;
  timeZone: string;
  flag: string;
}

export type ActiveTab = 'live' | 'calculator' | 'events' | 'timezones' | 'converter';

export interface DateMathInput {
  startDate: string;
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  operation: 'add' | 'subtract';
}

export interface DateDiffResult {
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  businessDays: number;
  weekendDays: number;
  weeksAndDays: { weeks: number; days: number };
  monthsAndDays: { months: number; days: number };
  yearsMonthsDays: { years: number; months: number; days: number };
}
