import { exportMonthCsv, groupExpensesByCard } from './export';
import { createExpense } from './expense';
import { createCard } from './card';
import { createCategory } from './category';

const now = new Date(2026, 7, 20, 12, 0, 0);

describe('Month export', () => {
  const cards = [
    createCard({ id: 'visa', name: 'Visa', createdAt: now.toISOString() }),
    createCard({ id: 'cash', name: 'Cash', createdAt: now.toISOString() }),
  ];
  const categories = [createCategory({ id: 'food', name: 'Food', createdAt: now.toISOString() })];
  const expenses = [
    createExpense({
      id: '1',
      name: 'Coffee',
      minorUnits: 250,
      cardId: 'visa',
      categoryId: 'food',
      date: '2026-08-02',
      createdAt: now.toISOString(),
      now,
    }),
    createExpense({
      id: '2',
      name: 'Market',
      minorUnits: 1000,
      cardId: 'cash',
      categoryId: 'food',
      date: '2026-08-03',
      createdAt: now.toISOString(),
      now,
    }),
  ];

  test('groups monthly expenses by card with totals', () => {
    const exported = groupExpensesByCard(expenses, cards, 2026, 8);
    expect(exported.grandTotalMinorUnits).toBe(1250);
    expect(exported.cards.map((c) => c.cardName)).toEqual(['Visa', 'Cash']);
    expect(exported.cards[0]?.totalMinorUnits).toBe(250);
  });

  test('renders CSV grouped by card', () => {
    const csv = exportMonthCsv(groupExpensesByCard(expenses, cards, 2026, 8), categories, 'en');
    expect(csv).toContain('Visa,Coffee');
    expect(csv).toContain('Cash,Market');
    expect(csv).toContain('Grand total');
  });
});
