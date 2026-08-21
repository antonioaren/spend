import { test, expect } from '@playwright/test';

test.describe.serial('Spend e2e', () => {
  test('adds card, category and expense', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /library|biblioteca/i }).click();
    await page.getByRole('textbox', { name: 'Card name', exact: true }).fill('Visa');
    await page.getByRole('button', { name: 'Add card' }).click();
    await page.getByRole('textbox', { name: 'Category name', exact: true }).fill('Food');
    await page.getByRole('button', { name: 'Add category' }).click();
    await expect(page.getByText('Visa', { exact: true })).toBeVisible();

    await page.getByRole('tab', { name: /expenses|gastos/i }).click();
    await page.getByRole('button', { name: 'Add expense' }).click();
    await expect(page.getByRole('combobox', { name: 'Card' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Date' })).toHaveCount(0);
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Coffee');
    await page.getByRole('textbox', { name: 'Amount', exact: true }).fill('2.50');
    await page.getByRole('button', { name: 'Clear Amount' }).click();
    await expect(page.getByRole('textbox', { name: 'Amount', exact: true })).toHaveValue('');
    await page.getByRole('textbox', { name: 'Amount', exact: true }).fill('2.50');
    await page.getByRole('combobox', { name: 'Card' }).click();
    await page.getByRole('button', { name: 'Card: Visa' }).click();
    await page.getByRole('combobox', { name: 'Category' }).click();
    await page.getByRole('button', { name: 'Category: Food' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByText('Coffee')).toBeVisible();
  });

  test('navigates months and filters', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Previous month' }).click();
    await expect(page.getByText(/\d{4}-\d{2}/)).toBeVisible();
    await page.getByRole('button', { name: 'Filters' }).click();
    await page.getByRole('textbox', { name: 'From', exact: true }).fill('2026-08-01');
    await page.getByRole('textbox', { name: 'To', exact: true }).fill('2026-08-31');
    await page.getByRole('button', { name: 'Apply' }).click();
  });

  test('switches language and theme', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /settings|ajustes/i }).click();
    await page.getByRole('button', { name: 'Spanish' }).click();
    await expect(page.getByText('Ajustes').first()).toBeVisible();
    await page.getByRole('button', { name: 'Oscuro' }).click();
    await page.getByRole('button', { name: 'Inglés' }).click();
    await page.getByRole('button', { name: 'Light' }).click();
  });

  test('shows iCloud unavailable and insights empty or chart', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /settings|ajustes/i }).click();
    await page.getByRole('button', { name: 'iCloud' }).click();
    await expect(page.getByText(/iCloud is not available/i)).toBeVisible();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export this month' }).click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/spend-.*\.csv/);
    await page.getByRole('tab', { name: /insights|resumen/i }).click();
    await expect(page.getByText(/Add expenses to see charts|Añade gastos/i)).toBeVisible();
  });

  test('shortcut query creates an expense after library setup', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: /library|biblioteca/i }).click();
    await page.getByRole('textbox', { name: 'Card name', exact: true }).fill('Cash');
    await page.getByRole('button', { name: 'Add card' }).click();
    await page.getByRole('textbox', { name: 'Category name', exact: true }).fill('Transport');
    await page.getByRole('button', { name: 'Add category' }).click();
    const shortcut = encodeURIComponent(
      'spend://add-expense?amount=3&name=Metro&category=Transport&card=Cash',
    );
    await page.goto(`/?shortcut=${shortcut}`);
    await page.getByRole('tab', { name: /expenses|gastos/i }).click();
    await expect(page.getByText('Metro')).toBeVisible();
  });
});
