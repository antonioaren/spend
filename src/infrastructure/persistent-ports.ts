import { LocalRealmStore } from './local-realm-store';
import { portsFromRealm } from './realm-ports';
import type { AppPorts } from '../application/ports';

const LOCAL_KEY = 'spend.realm.local';
const ICLOUD_KEY = 'spend.realm.icloud';

export type KeyValue = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

export function createICloudAccount(isAvailable: () => boolean) {
  return {
    isAvailable: async () => isAvailable(),
  };
}

export function createPersistentPorts(options: {
  kv: KeyValue;
  now?: Date;
  iCloudAvailable: () => boolean;
}): AppPorts {
  const local = new LocalRealmStore(read(options.kv, LOCAL_KEY));
  const cloud = new LocalRealmStore(read(options.kv, ICLOUD_KEY));

  const wrap = (store: LocalRealmStore, key: string): LocalRealmStore => {
    const original = store.write.bind(store);
    store.write = (mutator) => {
      const next = original(mutator);
      options.kv.setItem(key, JSON.stringify(next));
      return next;
    };
    return store;
  };

  wrap(local, LOCAL_KEY);
  wrap(cloud, ICLOUD_KEY);

  const active = (): LocalRealmStore => {
    const settings = local.read().settings;
    return settings.storage === 'icloud' && options.iCloudAvailable() ? cloud : local;
  };

  const ports = portsFromRealm(local, {
    now: options.now,
    iCloudAvailable: options.iCloudAvailable(),
  });

  return {
    ...ports,
    cards: {
      list: async () => active().read().cards,
      get: async (id) => active().read().cards.find((card) => card.id === id),
      save: async (card) => {
        active().write((doc) => {
          const index = doc.cards.findIndex((item) => item.id === card.id);
          if (index === -1) doc.cards.push(card);
          else doc.cards[index] = card;
        });
      },
      remove: async (id) => {
        active().write((doc) => {
          doc.cards = doc.cards.filter((card) => card.id !== id);
        });
      },
    },
    categories: {
      list: async () => active().read().categories,
      get: async (id) => active().read().categories.find((category) => category.id === id),
      save: async (category) => {
        active().write((doc) => {
          const index = doc.categories.findIndex((item) => item.id === category.id);
          if (index === -1) doc.categories.push(category);
          else doc.categories[index] = category;
        });
      },
      remove: async (id) => {
        active().write((doc) => {
          doc.categories = doc.categories.filter((category) => category.id !== id);
        });
      },
    },
    expenses: {
      list: async () => active().read().expenses,
      get: async (id) => active().read().expenses.find((expense) => expense.id === id),
      save: async (expense) => {
        active().write((doc) => {
          const index = doc.expenses.findIndex((item) => item.id === expense.id);
          if (index === -1) doc.expenses.push(expense);
          else doc.expenses[index] = expense;
        });
      },
    },
    iCloud: createICloudAccount(options.iCloudAvailable),
    settings: {
      get: async () => local.read().settings,
      save: async (settings) => {
        const previous = local.read().settings;
        local.write((doc) => {
          doc.settings = settings;
        });
        if (previous.storage === 'local' && settings.storage === 'icloud' && options.iCloudAvailable()) {
          const fromLocal = local.read();
          cloud.write((doc) => {
            doc.cards = fromLocal.cards;
            doc.categories = fromLocal.categories;
            doc.expenses = fromLocal.expenses;
            doc.settings = { ...settings };
          });
        }
      },
    },
  };
}

function read(kv: KeyValue, key: string) {
  const raw = kv.getItem(key);
  return raw ? JSON.parse(raw) : undefined;
}
