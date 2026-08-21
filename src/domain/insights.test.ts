import { spendByCard, spendByMonth, topCategoryByMonth } from './insights';
import { createExpense, type Expense } from './expense';
import { createCard } from './card';
import { createCategory } from './category';

const now = new Date(2026, 7, 20, 12, 0, 0);

function expense(overrides: Partial<Parameters<typeof createExpense>[0]>): Expense {
  return createExpense({
    id: 'e',
    name: 'Item',
    minorUnits: 100,
    cardId: 'visa',
    categoryId: 'food',
    date: '2026-08-20',
    createdAt: now.toISOString(),
    now,
    ...overrides,
  });
}

describe('Insights', () => {
  const cards = [
    createCard({ id: 'visa', name: 'Visa', createdAt: now.toISOString() }),
    createCard({ id: 'cash', name: 'Cash', createdAt: now.toISOString() }),
  ];
  const categories = [
    createCategory({ id: 'food', name: 'Food', createdAt: now.toISOString() }),
    createCategory({ id: 'home', name: 'Home', createdAt: now.toISOString() }),
  ];
  const expenses = [
    expense({ id: '1', cardId: 'visa', categoryId: 'food', minorUnits: 500, date: '2026-01-10' }),
    expense({ id: '2', cardId: 'cash', categoryId: 'home', minorUnits: 900, date: '2026-01-12' }),
    expense({ id: '3', cardId: 'visa', categoryId: 'food', minorUnits: 200, date: '2026-02-01' }),
  ];

  test('builds a pie breakdown by card', () => {
    expect(spendByCard(expenses, cards)).toEqual([
      { id: 'cash', label: 'Cash', minorUnits: 900 },
      { id: 'visa', label: 'Visa', minorUnits: 700 },
    ]);
  });

  test('builds monthly spend bars', () => {
    expect(spendByMonth(expenses)).toEqual([
      { id: '2026-01', label: '2026-01', minorUnits: 1400 },
      { id: '2026-02', label: '2026-02', minorUnits: 200 },
    ]);
  });

  test('picks the top category for each month', () => {
    expect(topCategoryByMonth(expenses, categories)).toEqual([
      { month: '2026-01', categoryId: 'home', categoryName: 'Home', minorUnits: 900 },
      { month: '2026-02', categoryId: 'food', categoryName: 'Food', minorUnits: 200 },
    ]);
  });
});
