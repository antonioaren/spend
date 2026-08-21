import { exportMonthCsv, groupExpensesByCard } from '../domain/export';
import { inMonth } from '../domain/occurred-at';
import { spendByCard, spendByMonth, topCategoryByMonth } from '../domain/insights';
import type { AppPorts } from './ports';

export function reportUseCases(ports: AppPorts) {
  return {
    async exportMonth(year: number, month: number, locale: string) {
      const [expenses, cards, categories] = await Promise.all([
        ports.expenses.list(),
        ports.cards.list(),
        ports.categories.list(),
      ]);
      const monthExpenses = expenses.filter((expense) => inMonth(expense.occurredOn, { year, month }));
      const grouped = groupExpensesByCard(monthExpenses, cards, year, month);
      return {
        grouped,
        csv: exportMonthCsv(grouped, categories, locale),
        json: JSON.stringify(grouped),
      };
    },
    async insights(year: number) {
      const [expenses, cards, categories] = await Promise.all([
        ports.expenses.list(),
        ports.cards.list(),
        ports.categories.list(),
      ]);
      const inYear = expenses.filter((expense) => expense.occurredOn.startsWith(`${year}-`));
      return {
        byCard: spendByCard(inYear, cards),
        byMonth: spendByMonth(inYear),
        topCategoryByMonth: topCategoryByMonth(inYear, categories),
      };
    },
  };
}
