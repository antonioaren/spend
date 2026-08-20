import { parseShortcutUrl } from './shortcut-use-cases';
import { ErrorCodes } from '../domain/errors';

describe('Shortcut URL parser', () => {
  test('accepts spend://add-expense', () => {
    const url = parseShortcutUrl('spend://add-expense?amount=1&name=A&card=Visa&category=Food');
    expect(url.searchParams.get('amount')).toBe('1');
  });

  test('rejects a different scheme path', () => {
    expect(() => parseShortcutUrl('spend://nope')).toThrow(
      expect.objectContaining({ code: ErrorCodes.INVALID_SHORTCUT }),
    );
  });
});
