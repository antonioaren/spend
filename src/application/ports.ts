import type { Card } from '../domain/card';
import type { Category } from '../domain/category';
import type { Expense } from '../domain/expense';
import type { Settings } from '../domain/settings';

export type ClockPort = {
  now: () => Date;
};

export type IdPort = {
  next: () => string;
};

export type CardRepository = {
  list: () => Promise<Card[]>;
  get: (id: string) => Promise<Card | undefined>;
  save: (card: Card) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export type CategoryRepository = {
  list: () => Promise<Category[]>;
  get: (id: string) => Promise<Category | undefined>;
  save: (category: Category) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export type ExpenseRepository = {
  list: () => Promise<Expense[]>;
  get: (id: string) => Promise<Expense | undefined>;
  save: (expense: Expense) => Promise<void>;
};

export type SettingsRepository = {
  get: () => Promise<Settings>;
  save: (settings: Settings) => Promise<void>;
};

export type ICloudAccountPort = {
  isAvailable: () => Promise<boolean>;
};

export type AppPorts = {
  clock: ClockPort;
  ids: IdPort;
  cards: CardRepository;
  categories: CategoryRepository;
  expenses: ExpenseRepository;
  settings: SettingsRepository;
  iCloud: ICloudAccountPort;
};
