import { createSpendApp } from './spend-app';
import { createMemoryPorts } from '../infrastructure/memory-ports';
import { ErrorCodes } from '../domain/errors';

const now = new Date(2026, 7, 20, 18, 45, 0);

function app(iCloudAvailable = false) {
  const ports = createMemoryPorts({ now, iCloudAvailable });
  return { app: createSpendApp(ports), ports };
}

describe('Card use cases', () => {
  test('creates a unique card', async () => {
    const { app: spend } = app();
    const card = await spend.cards.create({ name: 'Visa', lastFour: '4242' });
    expect(card.name).toBe('Visa');
    await expect(spend.cards.create({ name: 'visa' })).rejects.toMatchObject({
      code: ErrorCodes.DUPLICATE_NAME,
    });
  });

  test('blocks deleting a card that has expenses', async () => {
    const { app: spend } = app();
    const card = await spend.cards.create({ name: 'Visa' });
    const category = await spend.categories.create({ name: 'Food' });
    await spend.expenses.create({
      name: 'Coffee',
      amount: '2.50',
      cardId: card.id,
      categoryId: category.id,
    });
    await expect(spend.cards.remove(card.id)).rejects.toMatchObject({
      code: ErrorCodes.CARD_IN_USE,
    });
  });
});

describe('Category use cases', () => {
  test('renames a category', async () => {
    const { app: spend } = app();
    const category = await spend.categories.create({ name: 'Food' });
    const renamed = await spend.categories.rename(category.id, 'Groceries');
    expect(renamed.name).toBe('Groceries');
  });
});

describe('Expense use cases', () => {
  test('lists today using the clock', async () => {
    const { app: spend } = app();
    const card = await spend.cards.create({ name: 'Visa' });
    const category = await spend.categories.create({ name: 'Food' });
    await spend.expenses.create({
      name: 'Coffee',
      amount: '2.50',
      cardId: card.id,
      categoryId: category.id,
    });
    await spend.expenses.create({
      name: 'Old',
      amount: '1.00',
      cardId: card.id,
      categoryId: category.id,
      date: '2026-08-01',
    });
    const today = await spend.expenses.listToday();
    expect(today.map((e) => e.name)).toEqual(['Coffee']);
    expect(today[0]?.occurredTime).toBe('18:45');
  });

  test('moves between months', async () => {
    const { app: spend } = app();
    const current = await spend.expenses.currentMonth();
    expect(current).toEqual({ year: 2026, month: 8 });
    expect(spend.expenses.shiftMonth(current, -1)).toEqual({ year: 2026, month: 7 });
  });
});

describe('Reports', () => {
  test('exports a month grouped by card', async () => {
    const { app: spend } = app();
    const visa = await spend.cards.create({ name: 'Visa' });
    const cash = await spend.cards.create({ name: 'Cash' });
    const food = await spend.categories.create({ name: 'Food' });
    await spend.expenses.create({
      name: 'Coffee',
      amount: '2.50',
      cardId: visa.id,
      categoryId: food.id,
    });
    await spend.expenses.create({
      name: 'Market',
      amount: '10',
      cardId: cash.id,
      categoryId: food.id,
    });
    const exported = await spend.reports.exportMonth(2026, 8, 'en');
    expect(exported.grouped.grandTotalMinorUnits).toBe(1250);
    expect(exported.csv).toContain('Visa,Coffee');
  });

  test('computes insight slices', async () => {
    const { app: spend } = app();
    const visa = await spend.cards.create({ name: 'Visa' });
    const food = await spend.categories.create({ name: 'Food' });
    await spend.expenses.create({
      name: 'Coffee',
      amount: '5',
      cardId: visa.id,
      categoryId: food.id,
    });
    const insights = await spend.reports.insights(2026);
    expect(insights.byCard[0]?.label).toBe('Visa');
    expect(insights.topCategoryByMonth[0]?.categoryName).toBe('Food');
  });
});

describe('Settings', () => {
  test('switches language and theme', async () => {
    const { app: spend } = app();
    await spend.settings.setLocale('es');
    await spend.settings.setTheme('dark');
    const settings = await spend.settings.get();
    expect(settings.locale).toBe('es');
    expect(settings.theme).toBe('dark');
  });

  test('rejects iCloud when the account is missing', async () => {
    const { app: spend } = app(false);
    await expect(spend.settings.setStorage('icloud')).rejects.toMatchObject({
      code: ErrorCodes.ICLOUD_UNAVAILABLE,
    });
  });

  test('enables iCloud when the account is available', async () => {
    const { app: spend } = app(true);
    await spend.settings.setStorage('icloud');
    expect((await spend.settings.get()).storage).toBe('icloud');
  });
});

describe('Apple Shortcut', () => {
  test('creates an expense from a spend URL', async () => {
    const { app: spend } = app();
    await spend.cards.create({ name: 'Visa' });
    await spend.categories.create({ name: 'Food' });
    const result = await spend.shortcuts.addExpense(
      'spend://add-expense?amount=12.50&name=Coffee&category=Food&card=Visa',
    );
    expect(result.ok).toBe(true);
    const today = await spend.expenses.listToday();
    expect(today[0]?.name).toBe('Coffee');
    expect(today[0]?.amount.minorUnits).toBe(1250);
  });

  test('rejects time without date from a shortcut', async () => {
    const { app: spend } = app();
    await spend.cards.create({ name: 'Visa' });
    await spend.categories.create({ name: 'Food' });
    const result = await spend.shortcuts.addExpense(
      'spend://add-expense?amount=1&name=X&category=Food&card=Visa&time=09:00',
    );
    expect(result).toMatchObject({ ok: false, errorCode: ErrorCodes.TIME_WITHOUT_DATE });
  });
});
