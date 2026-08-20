import { filterExpenses } from './filters';
import { createExpense, type Expense } from './expense';

const now = new Date(2026, 7, 20, 12, 0, 0);

function expense(overrides: Partial<Parameters<typeof createExpense>[0]>): Expense {
  return createExpense({
    id: overrides.id ?? 'e',
    name: 'Coffee',
    minorUnits: 300,
    cardId: 'card-1',
    categoryId: 'food',
    date: '2026-08-20',
    createdAt: now.toISOString(),
    now,
    ...overrides,
  });
}

describe('Expense filters', () => {
  const items = [
    expense({ id: 'a', name: 'Coffee', minorUnits: 250, date: '2026-08-20', categoryId: 'food' }),
    expense({ id: 'b', name: 'Metro', minorUnits: 150, date: '2026-08-02', categoryId: 'transport' }),
    expense({ id: 'c', name: 'Rent', minorUnits: 80_000, date: '2026-07-01', categoryId: 'home' }),
  ];

  test('filters by inclusive date range', () => {
    const found = filterExpenses(items, { from: '2026-08-01', to: '2026-08-31' });
    expect(found.map((e) => e.id)).toEqual(['a', 'b']);
  });

  test('filters by min and max amount', () => {
    const found = filterExpenses(items, { minMinor: 200, maxMinor: 400 });
    expect(found.map((e) => e.id)).toEqual(['a']);
  });

  test('filters by name case-insensitively', () => {
    const found = filterExpenses(items, { name: 'cof' });
    expect(found.map((e) => e.id)).toEqual(['a']);
  });

  test('filters by category', () => {
    const found = filterExpenses(items, { categoryId: 'transport' });
    expect(found.map((e) => e.id)).toEqual(['b']);
  });

  test('combines filters with AND', () => {
    const found = filterExpenses(items, { from: '2026-08-01', name: 'e', minMinor: 100 });
    expect(found.map((e) => e.id)).toEqual(['a', 'b']);
  });
});
