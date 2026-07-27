import { DateDiffResult, DateMathInput } from '../types';

/**
 * Format a date with options
 */
export function formatDate(date: Date, formatStyle: 'full' | 'long' | 'medium' | 'short' | 'time' = 'full'): string {
  if (isNaN(date.getTime())) return 'Invalid Date';

  switch (formatStyle) {
    case 'full':
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(date);
    case 'long':
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    case 'medium':
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    case 'short':
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(date);
    case 'time':
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(date);
    default:
      return date.toLocaleString();
  }
}

/**
 * Calculate year progress percentage and details
 */
export function getYearProgress(now: Date = new Date()) {
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
  const totalMs = endOfYear.getTime() - startOfYear.getTime();
  const elapsedMs = now.getTime() - startOfYear.getTime();
  const percentage = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));

  const dayOfYear = Math.floor(elapsedMs / (1000 * 60 * 60 * 24)) + 1;
  const isLeap = (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || now.getFullYear() % 400 === 0;
  const totalDaysInYear = isLeap ? 366 : 365;

  return {
    percentage: Number(percentage.toFixed(2)),
    dayOfYear,
    totalDaysInYear,
    daysRemaining: totalDaysInYear - dayOfYear,
  };
}

/**
 * Calculate month progress
 */
export function getMonthProgress(now: Date = new Date()) {
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const totalMs = nextMonth.getTime() - startOfMonth.getTime();
  const elapsedMs = now.getTime() - startOfMonth.getTime();
  const percentage = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));

  const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();

  return {
    percentage: Number(percentage.toFixed(2)),
    currentDay,
    totalDaysInMonth,
    daysRemaining: totalDaysInMonth - currentDay,
  };
}

/**
 * Get ISO week number
 */
export function getWeekNumber(date: Date = new Date()): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Add or subtract time to a date
 */
export function calculateDateShift(input: DateMathInput): Date {
  const base = new Date(input.startDate || new Date());
  if (isNaN(base.getTime())) return new Date();

  const factor = input.operation === 'add' ? 1 : -1;
  const result = new Date(base);

  if (input.years) result.setFullYear(result.getFullYear() + input.years * factor);
  if (input.months) result.setMonth(result.getMonth() + input.months * factor);
  if (input.weeks) result.setDate(result.getDate() + input.weeks * 7 * factor);
  if (input.days) result.setDate(result.getDate() + input.days * factor);
  if (input.hours) result.setHours(result.getHours() + input.hours * factor);
  if (input.minutes) result.setMinutes(result.getMinutes() + input.minutes * factor);

  return result;
}

/**
 * Calculate exact difference between two dates
 */
export function calculateDateDifference(d1: Date, d2: Date): DateDiffResult {
  const start = d1 < d2 ? new Date(d1) : new Date(d2);
  const end = d1 < d2 ? new Date(d2) : new Date(d1);

  const diffMs = Math.abs(end.getTime() - start.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  // Business vs Weekend days
  let businessDays = 0;
  let weekendDays = 0;
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const endCopy = new Date(end);
  endCopy.setHours(0, 0, 0, 0);

  while (cur < endCopy) {
    const day = cur.getDay();
    if (day === 0 || day === 6) {
      weekendDays++;
    } else {
      businessDays++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  // Weeks & days
  const weeks = Math.floor(totalDays / 7);
  const remDaysFromWeeks = totalDays % 7;

  // Years, Months, Days breakdown
  let y = end.getFullYear() - start.getFullYear();
  let m = end.getMonth() - start.getMonth();
  let d = end.getDate() - start.getDate();

  if (d < 0) {
    m--;
    const prevMonthLastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    d += prevMonthLastDay;
  }
  if (m < 0) {
    y--;
    m += 12;
  }

  // Months & days breakdown
  const totalMonthsExact = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  let remDaysForMonth = end.getDate() - start.getDate();
  let finalMonths = totalMonthsExact;
  if (remDaysForMonth < 0) {
    finalMonths--;
    const prevMonthDays = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    remDaysForMonth += prevMonthDays;
  }

  return {
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    businessDays,
    weekendDays,
    weeksAndDays: { weeks, days: remDaysFromWeeks },
    monthsAndDays: { months: Math.max(0, finalMonths), days: Math.max(0, remDaysForMonth) },
    yearsMonthsDays: { years: Math.max(0, y), months: Math.max(0, m), days: Math.max(0, d) },
  };
}

/**
 * Breakdown countdown for target ISO date from current time
 */
export function getCountdownBreakdown(targetISO: string, now: Date = new Date()) {
  const target = new Date(targetISO);
  if (isNaN(target.getTime())) {
    return { isPast: false, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, isToday: false };
  }

  const diffMs = target.getTime() - now.getTime();
  const isPast = diffMs < 0;
  const absMs = Math.abs(diffMs);

  const seconds = Math.floor((absMs / 1000) % 60);
  const minutes = Math.floor((absMs / (1000 * 60)) % 60);
  const hours = Math.floor((absMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(absMs / (1000 * 60 * 60 * 24));

  const isToday =
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate();

  return {
    isPast,
    isToday,
    days,
    hours,
    minutes,
    seconds,
    totalMs: absMs,
  };
}

/**
 * Multi-format date string generator for developers / managers
 */
export function generateFormatObject(date: Date) {
  if (isNaN(date.getTime())) return {};

  return {
    'ISO 8601': date.toISOString(),
    'UTC String': date.toUTCString(),
    'Unix Timestamp (sec)': Math.floor(date.getTime() / 1000).toString(),
    'Unix Timestamp (ms)': date.getTime().toString(),
    'Full Human Date': formatDate(date, 'full'),
    'Standard US (MM/DD/YYYY)': `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`,
    'Standard EU (DD/MM/YYYY)': `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`,
    'SQL Date (YYYY-MM-DD)': `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
    'SQL Time (HH:MM:SS)': `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`,
    'Month Name & Day': `${date.toLocaleString('en-US', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`,
  };
}
