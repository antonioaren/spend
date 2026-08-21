import { moneyFromMinorUnits, type Money } from './money';
import { normalizeName } from './name';
import { resolveOccurredAt, type OccurredAt } from './occurred-at';

export type Expense = {
  id: string;
  name: string;
  amount: Money;
  cardId: string;
  categoryId: string;
  occurredOn: string;
  occurredTime?: string;
  createdAt: string;
};

export function createExpense(input: {
  id: string;
  name: string;
  minorUnits: number;
  currency?: string;
  cardId: string;
  categoryId: string;
  date?: string;
  time?: string;
  createdAt: string;
  now: Date;
}): Expense {
  const occurred: OccurredAt = resolveOccurredAt(
    { date: input.date, time: input.time },
    input.now,
  );
  return {
    id: input.id,
    name: normalizeName(input.name, 80),
    amount: moneyFromMinorUnits(input.minorUnits, input.currency ?? 'EUR'),
    cardId: input.cardId,
    categoryId: input.categoryId,
    occurredOn: occurred.occurredOn,
    occurredTime: occurred.occurredTime,
    createdAt: input.createdAt,
  };
}
