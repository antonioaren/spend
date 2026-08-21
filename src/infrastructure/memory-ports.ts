import { defaultSettings, type Settings } from '../domain/settings';
import type { Card } from '../domain/card';
import type { Category } from '../domain/category';
import type { Expense } from '../domain/expense';
import type {
  AppPorts,
  CardRepository,
  CategoryRepository,
  ClockPort,
  ExpenseRepository,
  ICloudAccountPort,
  IdPort,
  SettingsRepository,
} from '../application/ports';

export type SpendSnapshot = {
  cards: Card[];
  categories: Category[];
  expenses: Expense[];
  settings: Settings;
};

export function emptySnapshot(): SpendSnapshot {
  return { cards: [], categories: [], expenses: [], settings: defaultSettings() };
}

export function createMemoryPorts(options?: {
  now?: Date;
  iCloudAvailable?: boolean;
  snapshot?: SpendSnapshot;
}): AppPorts & { snapshot: SpendSnapshot } {
  const snapshot = options?.snapshot ?? emptySnapshot();
  let seq = 0;
  const clock: ClockPort = { now: () => options?.now ?? new Date() };
  const ids: IdPort = {
    next: () => {
      seq += 1;
      return `id-${seq}`;
    },
  };
  const cards: CardRepository = {
    list: async () => [...snapshot.cards],
    get: async (id) => snapshot.cards.find((card) => card.id === id),
    save: async (card) => {
      snapshot.cards = upsert(snapshot.cards, card);
    },
    remove: async (id) => {
      snapshot.cards = snapshot.cards.filter((card) => card.id !== id);
    },
  };
  const categories: CategoryRepository = {
    list: async () => [...snapshot.categories],
    get: async (id) => snapshot.categories.find((category) => category.id === id),
    save: async (category) => {
      snapshot.categories = upsert(snapshot.categories, category);
    },
    remove: async (id) => {
      snapshot.categories = snapshot.categories.filter((category) => category.id !== id);
    },
  };
  const expenses: ExpenseRepository = {
    list: async () => [...snapshot.expenses],
    get: async (id) => snapshot.expenses.find((expense) => expense.id === id),
    save: async (expense) => {
      snapshot.expenses = upsert(snapshot.expenses, expense);
    },
  };
  const settings: SettingsRepository = {
    get: async () => ({ ...snapshot.settings }),
    save: async (next) => {
      snapshot.settings = { ...next };
    },
  };
  const iCloud: ICloudAccountPort = {
    isAvailable: async () => options?.iCloudAvailable ?? false,
  };
  return { clock, ids, cards, categories, expenses, settings, iCloud, snapshot };
}

function upsert<T extends { id: string }>(items: T[], item: T): T[] {
  const index = items.findIndex((current) => current.id === item.id);
  if (index === -1) return [...items, item];
  const next = [...items];
  next[index] = item;
  return next;
}
