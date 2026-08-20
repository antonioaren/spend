import type { Card } from './card';
import type { Category } from './category';
import type { Expense } from './expense';
import { monthKey, yearMonthFromDate } from './occurred-at';

export type Slice = { id: string; label: string; minorUnits: number };

export function spendByCard(expenses: Expense[], cards: Card[]): Slice[] {
  const totals = new Map<string, number>();
  for (const expense of expenses) {
    totals.set(expense.cardId, (totals.get(expense.cardId) ?? 0) + expense.amount.minorUnits);
  }
  return cards
    .map((card) => ({
      id: card.id,
      label: card.name,
      minorUnits: totals.get(card.id) ?? 0,
    }))
    .filter((slice) => slice.minorUnits > 0)
    .sort((a, b) => b.minorUnits - a.minorUnits);
}

export function spendByMonth(expenses: Expense[]): Slice[] {
  const totals = new Map<string, number>();
  for (const expense of expenses) {
    const key = monthKey(yearMonthFromDate(expense.occurredOn));
    totals.set(key, (totals.get(key) ?? 0) + expense.amount.minorUnits);
  }
  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, minorUnits]) => ({ id: label, label, minorUnits }));
}

export type TopCategoryMonth = {
  month: string;
  categoryId: string;
  categoryName: string;
  minorUnits: number;
};

export function topCategoryByMonth(
  expenses: Expense[],
  categories: Category[],
): TopCategoryMonth[] {
  const names = new Map(categories.map((category) => [category.id, category.name]));
  const byMonth = new Map<string, Map<string, number>>();
  for (const expense of expenses) {
    const month = monthKey(yearMonthFromDate(expense.occurredOn));
    const inner = byMonth.get(month) ?? new Map<string, number>();
    inner.set(expense.categoryId, (inner.get(expense.categoryId) ?? 0) + expense.amount.minorUnits);
    byMonth.set(month, inner);
  }
  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, inner]) => {
      let winner = { categoryId: '', minorUnits: -1 };
      for (const [categoryId, minorUnits] of inner) {
        if (minorUnits > winner.minorUnits) winner = { categoryId, minorUnits };
      }
      return {
        month,
        categoryId: winner.categoryId,
        categoryName: names.get(winner.categoryId) ?? winner.categoryId,
        minorUnits: winner.minorUnits,
      };
    });
}
