import { createSpendApp } from '../application/spend-app';
import { createFileRealmPorts } from './realm-ports';
import { createPersistentPorts } from './persistent-ports';

describe('Realm-shaped local store', () => {
  test('survives a reload from the same file', async () => {
    let file: string | null = null;
    const io = {
      read: () => file,
      write: (value: string) => {
        file = value;
      },
    };
    const now = new Date(2026, 7, 20, 10, 0, 0);
    const first = createSpendApp(createFileRealmPorts(io, { now }));
    const card = await first.cards.create({ name: 'Visa' });
    const category = await first.categories.create({ name: 'Food' });
    await first.expenses.create({
      name: 'Coffee',
      amount: '3',
      cardId: card.id,
      categoryId: category.id,
    });

    const reloaded = createSpendApp(createFileRealmPorts(io, { now }));
    const today = await reloaded.expenses.listToday();
    expect(today).toHaveLength(1);
    expect(today[0]?.name).toBe('Coffee');
  });
});

describe('iCloud storage preference', () => {
  test('copies local records into iCloud when enabled', async () => {
    const kv = new Map<string, string>();
    const ports = createPersistentPorts({
      kv: {
        getItem: (key) => kv.get(key) ?? null,
        setItem: (key, value) => {
          kv.set(key, value);
        },
      },
      now: new Date(2026, 7, 20, 10, 0, 0),
      iCloudAvailable: () => true,
    });
    const app = createSpendApp(ports);
    const card = await app.cards.create({ name: 'Visa' });
    const category = await app.categories.create({ name: 'Food' });
    await app.expenses.create({
      name: 'Coffee',
      amount: '4',
      cardId: card.id,
      categoryId: category.id,
    });
    await app.settings.setStorage('icloud');
    const cloud = JSON.parse(kv.get('spend.realm.icloud') ?? '{}');
    expect(cloud.expenses).toHaveLength(1);
    expect(cloud.settings.storage).toBe('icloud');
  });
});
