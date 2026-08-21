import type { Expense } from './expense';
import { inRange } from './occurred-at';

export type ExpenseFilter = {
  from?: string;
  to?: string;
  minMinor?: number;
  maxMinor?: number;
  name?: string;
  categoryId?: string;
};

export function matchesFilter(expense: Expense, filter: ExpenseFilter): boolean {
  if (!inRange(expense.occurredOn, filter.from, filter.to)) return false;
  if (filter.minMinor !== undefined && expense.amount.minorUnits < filter.minMinor) return false;
  if (filter.maxMinor !== undefined && expense.amount.minorUnits > filter.maxMinor) return false;
  if (filter.name && !expense.name.toLocaleLowerCase().includes(filter.name.trim().toLocaleLowerCase())) {
    return false;
  }
  if (filter.categoryId && expense.categoryId !== filter.categoryId) return false;
  return true;
}

export function filterExpenses(expenses: Expense[], filter: ExpenseFilter): Expense[] {
  return expenses.filter((expense) => matchesFilter(expense, filter));
}
