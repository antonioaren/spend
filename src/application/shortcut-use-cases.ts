import { DomainError, ErrorCodes } from '../domain/errors';
import type { AppPorts } from './ports';
import { expenseUseCases } from './expense-use-cases';

export type ShortcutResult = {
  ok: boolean;
  expenseId?: string;
  errorCode?: string;
  successUrl?: string;
  errorUrl?: string;
};

export function parseShortcutUrl(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new DomainError(ErrorCodes.INVALID_SHORTCUT, 'Shortcut URL is invalid');
  }
  const isSpend = url.protocol === 'spend:' || url.protocol === 'https:';
  const isAdd =
    url.hostname === 'add-expense' ||
    url.pathname === '/add-expense' ||
    url.pathname === 'add-expense' ||
    url.host === 'add-expense';
  if (!isSpend || !isAdd) {
    throw new DomainError(ErrorCodes.INVALID_SHORTCUT, 'Shortcut URL must be spend://add-expense');
  }
  return url;
}

export function shortcutUseCases(ports: AppPorts) {
  const expenses = expenseUseCases(ports);
  return {
    async addExpense(rawUrl: string): Promise<ShortcutResult> {
      let url: URL;
      try {
        url = parseShortcutUrl(rawUrl);
      } catch (error) {
        const code = error instanceof DomainError ? error.code : ErrorCodes.INVALID_SHORTCUT;
        return { ok: false, errorCode: code };
      }
      const successUrl = url.searchParams.get('x-success') ?? undefined;
      const errorUrl = url.searchParams.get('x-error') ?? undefined;
      try {
        const expense = await expenses.createFromNames({
          name: url.searchParams.get('name') ?? '',
          amount: url.searchParams.get('amount') ?? '',
          cardName: url.searchParams.get('card') ?? '',
          categoryName: url.searchParams.get('category') ?? '',
          date: url.searchParams.get('date') ?? undefined,
          time: url.searchParams.get('time') ?? undefined,
        });
        return { ok: true, expenseId: expense.id, successUrl, errorUrl };
      } catch (error) {
        const code = error instanceof DomainError ? error.code : ErrorCodes.INVALID_SHORTCUT;
        return { ok: false, errorCode: code, successUrl, errorUrl };
      }
    },
  };
}
