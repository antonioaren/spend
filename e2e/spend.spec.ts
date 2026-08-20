import { test, expect } from '@playwright/test';

test.describe.serial('Spend e2e', () => {
  test('adds card, category and expense', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /library|biblioteca/i }).click();
    await page.getByLabel('Card name').fill('Visa');
    await page.getByRole('button', { name: 'Add card' }).click();
    await page.getByLabel('Category name').fill('Food');
    await page.getByRole('button', { name: 'Add category' }).click();
    await expect(page.getByText('Visa')).toBeVisible();

    await page.getByRole('tab', { name: /expenses|gastos/i }).click();
    await page.getByRole('button', { name: 'Add expense' }).click();
    await page.getByLabel('Name').fill('Coffee');
    await page.getByLabel('Amount').fill('2.50');
    await page.getByRole('button', { name: 'Visa' }).click();
    await page.getByRole('button', { name: 'Food' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Coffee')).toBeVisible();
  });

  test('navigates months and filters', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Previous month' }).click();
    await expect(page.getByText(/\d{4}-\d{2}/)).toBeVisible();
    await page.getByRole('button', { name: 'Filters' }).click();
    await page.getByLabel('From').fill('2026-08-01');
    await page.getByLabel('To').fill('2026-08-31');
    await page.getByRole('button', { name: 'Apply' }).click();
  });

  test('switches language and theme', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /settings|ajustes/i }).click();
    await page.getByRole('button', { name: 'Spanish' }).click();
    await expect(page.getByText('Ajustes')).toBeVisible();
    await page.getByRole('button', { name: 'Oscuro' }).click();
    await page.getByRole('button', { name: 'Inglés' }).click();
    await page.getByRole('button', { name: 'Light' }).click();
  });

  test('shows iCloud unavailable and insights empty or chart', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /settings|ajustes/i }).click();
    await page.getByRole('button', { name: 'iCloud' }).click();
    await expect(page.getByText(/iCloud is not available/i)).toBeVisible();
    await page.getByRole('tab', { name: /insights|resumen/i }).click();
  });

  test('shortcut query creates an expense after library setup', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /library|biblioteca/i }).click();
    await page.getByLabel('Card name').fill('Cash');
    await page.getByRole('button', { name: 'Add card' }).click();
    await page.getByLabel('Category name').fill('Transport');
    await page.getByRole('button', { name: 'Add category' }).click();
    await page.goto('/?shortcut=spend://add-expense?amount=3&name=Metro&category=Transport&card=Cash');
    await page.getByRole('tab', { name: /expenses|gastos/i }).click();
    await expect(page.getByText('Metro')).toBeVisible();
  });
});
