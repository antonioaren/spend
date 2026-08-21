import { resolveOccurredAt, shiftMonth, inMonth } from './occurred-at';
import { ErrorCodes } from './errors';

describe('OccurredAt', () => {
  const now = new Date(2026, 7, 20, 21, 15, 0);

  test('uses creation date and time when both are omitted', () => {
    expect(resolveOccurredAt({}, now)).toEqual({
      occurredOn: '2026-08-20',
      occurredTime: '21:15',
    });
  });

  test('allows a date without a time', () => {
    expect(resolveOccurredAt({ date: '2026-08-01' }, now)).toEqual({
      occurredOn: '2026-08-01',
    });
  });

  test('rejects a time without a date', () => {
    expect(() => resolveOccurredAt({ time: '09:00' }, now)).toThrow(
      expect.objectContaining({ code: ErrorCodes.TIME_WITHOUT_DATE }),
    );
  });

  test('rejects an impossible calendar date', () => {
    expect(() => resolveOccurredAt({ date: '2026-02-31' }, now)).toThrow(
      expect.objectContaining({ code: ErrorCodes.INVALID_DATE }),
    );
  });

  test('shifts calendar months across year boundaries', () => {
    expect(shiftMonth({ year: 2026, month: 1 }, -1)).toEqual({ year: 2025, month: 12 });
  });

  test('detects expenses in a month', () => {
    expect(inMonth('2026-08-20', { year: 2026, month: 8 })).toBe(true);
    expect(inMonth('2026-09-01', { year: 2026, month: 8 })).toBe(false);
  });
});
