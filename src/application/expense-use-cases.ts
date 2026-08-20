import { createExpense } from '../domain/expense';
import { DomainError, ErrorCodes } from '../domain/errors';
import { filterExpenses, type ExpenseFilter } from '../domain/filters';
import { inDay, inMonth, shiftMonth, type YearMonth } from '../domain/occurred-at';
import { moneyFromMajor } from '../domain/money';
import { sameName } from '../domain/name';
import type { AppPorts } from './ports';

export function expenseUseCases(ports: AppPorts) {
  return {
    async create(input: {
      name: string;
      amount: string | number;
      cardId: string;
      categoryId: string;
      date?: string;
      time?: string;
    }) {
      const card = await ports.cards.get(input.cardId);
      if (!card) throw new DomainError(ErrorCodes.UNKNOWN_CARD, 'Card not found');
      const category = await ports.categories.get(input.categoryId);
      if (!category) throw new DomainError(ErrorCodes.UNKNOWN_CATEGORY, 'Category not found');
      const amount = moneyFromMajor(input.amount);
      const now = ports.clock.now();
      const expense = createExpense({
        id: ports.ids.next(),
        name: input.name,
        minorUnits: amount.minorUnits,
        currency: amount.currency,
        cardId: input.cardId,
        categoryId: input.categoryId,
        date: input.date,
        time: input.time,
        createdAt: now.toISOString(),
        now,
      });
      await ports.expenses.save(expense);
      return expense;
    },
    async listToday() {
      const today = isoDate(ports.clock.now());
      const expenses = await ports.expenses.list();
      return sortExpenses(expenses.filter((expense) => inDay(expense.occurredOn, today)));
    },
    async listMonth(ym: YearMonth) {
      const expenses = await ports.expenses.list();
      return sortExpenses(expenses.filter((expense) => inMonth(expense.occurredOn, ym)));
    },
    async currentMonth(): Promise<YearMonth> {
      const now = ports.clock.now();
      return { year: now.getFullYear(), month: now.getMonth() + 1 };
    },
    shiftMonth,
    async filter(filter: ExpenseFilter) {
      return sortExpenses(filterExpenses(await ports.expenses.list(), filter));
    },
    async createFromNames(input: {
      name: string;
      amount: string | number;
      cardName: string;
      categoryName: string;
      date?: string;
      time?: string;
    }) {
      const cards = await ports.cards.list();
      const card = cards.find((item) => sameName(item.name, input.cardName));
      if (!card) throw new DomainError(ErrorCodes.UNKNOWN_CARD, 'Card not found');
      const categories = await ports.categories.list();
      const category = categories.find((item) => sameName(item.name, input.categoryName));
      if (!category) throw new DomainError(ErrorCodes.UNKNOWN_CATEGORY, 'Category not found');
      return this.create({
        name: input.name,
        amount: input.amount,
        cardId: card.id,
        categoryId: category.id,
        date: input.date,
        time: input.time,
      });
    },
  };
}

function isoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function sortExpenses<T extends { occurredOn: string; createdAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.occurredOn !== b.occurredOn) return b.occurredOn.localeCompare(a.occurredOn);
    return b.createdAt.localeCompare(a.createdAt);
  });
}
