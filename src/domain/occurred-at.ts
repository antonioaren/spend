import { DomainError, ErrorCodes } from './errors';

export type OccurredAt = {
  occurredOn: string;
  occurredTime?: string;
};

const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME = /^(\d{2}):(\d{2})$/;

export function localDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function localTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${min}`;
}

export function assertDate(value: string): string {
  const match = DATE.exec(value);
  if (!match) {
    throw new DomainError(ErrorCodes.INVALID_DATE, 'Date must be YYYY-MM-DD');
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    throw new DomainError(ErrorCodes.INVALID_DATE, 'Date is not a real calendar day');
  }
  return value;
}

export function assertTime(value: string): string {
  const match = TIME.exec(value);
  if (!match) {
    throw new DomainError(ErrorCodes.INVALID_TIME, 'Time must be HH:mm');
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) {
    throw new DomainError(ErrorCodes.INVALID_TIME, 'Time is out of range');
  }
  return value;
}

export function resolveOccurredAt(
  input: { date?: string; time?: string },
  now: Date,
): OccurredAt {
  const date = input.date?.trim() || undefined;
  const time = input.time?.trim() || undefined;

  if (time && !date) {
    throw new DomainError(ErrorCodes.TIME_WITHOUT_DATE, 'Time cannot be set without a date');
  }

  if (!date && !time) {
    return { occurredOn: localDate(now), occurredTime: localTime(now) };
  }

  const occurredOn = assertDate(date!);
  if (!time) {
    return { occurredOn };
  }
  return { occurredOn, occurredTime: assertTime(time) };
}

export type YearMonth = { year: number; month: number };

export function yearMonthFromDate(date: string): YearMonth {
  const safe = assertDate(date);
  const [year, month] = safe.split('-').map(Number) as [number, number];
  return { year, month };
}

export function shiftMonth({ year, month }: YearMonth, delta: number): YearMonth {
  const index = year * 12 + (month - 1) + delta;
  const nextYear = Math.floor(index / 12);
  const nextMonth = (index % 12) + 1;
  return { year: nextYear, month: nextMonth };
}

export function monthKey({ year, month }: YearMonth): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export function inDay(occurredOn: string, day: string): boolean {
  return occurredOn === assertDate(day);
}

export function inMonth(occurredOn: string, ym: YearMonth): boolean {
  const actual = yearMonthFromDate(occurredOn);
  return actual.year === ym.year && actual.month === ym.month;
}

export function inRange(occurredOn: string, from?: string, to?: string): boolean {
  if (from && occurredOn < assertDate(from)) return false;
  if (to && occurredOn > assertDate(to)) return false;
  return true;
}
