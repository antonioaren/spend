import type { Card } from './card';
import type { Category } from './category';
import type { Expense } from './expense';
import { formatMoney } from './money';

export type CardExport = {
  cardId: string;
  cardName: string;
  expenses: Expense[];
  totalMinorUnits: number;
};

export type MonthExport = {
  year: number;
  month: number;
  cards: CardExport[];
  grandTotalMinorUnits: number;
};

export function groupExpensesByCard(
  expenses: Expense[],
  cards: Card[],
  year: number,
  month: number,
): MonthExport {
  const grouped = cards
    .map((card) => {
      const rows = expenses.filter((expense) => expense.cardId === card.id);
      return {
        cardId: card.id,
        cardName: card.name,
        expenses: rows,
        totalMinorUnits: rows.reduce((sum, expense) => sum + expense.amount.minorUnits, 0),
      };
    })
    .filter((group) => group.expenses.length > 0);

  return {
    year,
    month,
    cards: grouped,
    grandTotalMinorUnits: grouped.reduce((sum, group) => sum + group.totalMinorUnits, 0),
  };
}

export function exportMonthCsv(
  exported: MonthExport,
  categories: Category[],
  locale: string,
): string {
  const names = new Map(categories.map((category) => [category.id, category.name]));
  const lines = ['Card,Name,Amount,Category,Date,Time'];
  for (const group of exported.cards) {
    for (const expense of group.expenses) {
      lines.push(
        [
          csv(group.cardName),
          csv(expense.name),
          csv(formatMoney(expense.amount, locale)),
          csv(names.get(expense.categoryId) ?? expense.categoryId),
          expense.occurredOn,
          expense.occurredTime ?? '',
        ].join(','),
      );
    }
  }
  lines.push('');
  for (const group of exported.cards) {
    lines.push(
      [
        csv(group.cardName),
        'total',
        csv(formatMoney({ minorUnits: group.totalMinorUnits, currency: 'EUR' }, locale)),
        '',
        '',
        '',
      ].join(','),
    );
  }
  lines.push(
    [
      'Grand total',
      '',
      csv(formatMoney({ minorUnits: exported.grandTotalMinorUnits, currency: 'EUR' }, locale)),
      '',
      '',
      '',
    ].join(','),
  );
  return lines.join('\n');
}

function csv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}
