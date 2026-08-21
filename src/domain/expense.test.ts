import { createExpense } from './expense';
import { ErrorCodes } from './errors';

const now = new Date(2026, 7, 20, 9, 30, 0);

function build(overrides: Partial<Parameters<typeof createExpense>[0]> = {}) {
  return createExpense({
    id: 'e1',
    name: 'Coffee',
    minorUnits: 250,
    cardId: 'card-1',
    categoryId: 'cat-1',
    createdAt: now.toISOString(),
    now,
    ...overrides,
  });
}

describe('Expense', () => {
  test('stamps creation date and time when omitted', () => {
    const expense = build();
    expect(expense.occurredOn).toBe('2026-08-20');
    expect(expense.occurredTime).toBe('09:30');
  });

  test('keeps a date without recording a time', () => {
    const expense = build({ date: '2026-08-01' });
    expect(expense.occurredOn).toBe('2026-08-01');
    expect(expense.occurredTime).toBeUndefined();
  });

  test('rejects time without date', () => {
    expect(() => build({ time: '10:00' })).toThrow(
      expect.objectContaining({ code: ErrorCodes.TIME_WITHOUT_DATE }),
    );
  });
});
