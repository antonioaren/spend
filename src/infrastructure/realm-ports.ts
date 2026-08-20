import type { AppPorts } from '../application/ports';
import { defaultSettings } from '../domain/settings';
import { FileBackedRealmStore, LocalRealmStore } from './local-realm-store';
import { createMemoryPorts } from './memory-ports';

export function portsFromRealm(
  store: LocalRealmStore,
  options?: { now?: Date; iCloudAvailable?: boolean; id?: () => string },
): AppPorts {
  let seq = 0;
  const snapshot = () => store.read();
  return {
    clock: { now: () => options?.now ?? new Date() },
    ids: {
      next: () => (options?.id ? options.id() : `id-${(seq += 1)}`),
    },
    cards: {
      list: async () => snapshot().cards,
      get: async (id) => snapshot().cards.find((card) => card.id === id),
      save: async (card) => {
        store.write((doc) => {
          const index = doc.cards.findIndex((item) => item.id === card.id);
          if (index === -1) doc.cards.push(card);
          else doc.cards[index] = card;
        });
      },
      remove: async (id) => {
        store.write((doc) => {
          doc.cards = doc.cards.filter((card) => card.id !== id);
        });
      },
    },
    categories: {
      list: async () => snapshot().categories,
      get: async (id) => snapshot().categories.find((category) => category.id === id),
      save: async (category) => {
        store.write((doc) => {
          const index = doc.categories.findIndex((item) => item.id === category.id);
          if (index === -1) doc.categories.push(category);
          else doc.categories[index] = category;
        });
      },
      remove: async (id) => {
        store.write((doc) => {
          doc.categories = doc.categories.filter((category) => category.id !== id);
        });
      },
    },
    expenses: {
      list: async () => snapshot().expenses,
      get: async (id) => snapshot().expenses.find((expense) => expense.id === id),
      save: async (expense) => {
        store.write((doc) => {
          const index = doc.expenses.findIndex((item) => item.id === expense.id);
          if (index === -1) doc.expenses.push(expense);
          else doc.expenses[index] = expense;
        });
      },
    },
    settings: {
      get: async () => snapshot().settings ?? defaultSettings(),
      save: async (settings) => {
        store.write((doc) => {
          doc.settings = settings;
        });
      },
    },
    iCloud: {
      isAvailable: async () => options?.iCloudAvailable ?? false,
    },
  };
}

export function createFileRealmPorts(
  io: { read: () => string | null; write: (value: string) => void },
  options?: { now?: Date; iCloudAvailable?: boolean },
): AppPorts {
  return portsFromRealm(new FileBackedRealmStore(io), options);
}

export { createMemoryPorts };
