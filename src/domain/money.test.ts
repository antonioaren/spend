import { moneyFromMajor, moneyFromMinorUnits, addMoney, formatMoney } from './money';
import { ErrorCodes } from './errors';

describe('Money', () => {
  test('parses a major-unit decimal into cents', () => {
    expect(moneyFromMajor('12.50')).toEqual({ minorUnits: 1250, currency: 'EUR' });
  });

  test('accepts a comma decimal separator', () => {
    expect(moneyFromMajor('12,5').minorUnits).toBe(1250);
  });

  test('rejects zero and negative amounts', () => {
    expect(() => moneyFromMajor('0')).toThrow(expect.objectContaining({ code: ErrorCodes.INVALID_AMOUNT }));
    expect(() => moneyFromMinorUnits(-1)).toThrow(expect.objectContaining({ code: ErrorCodes.INVALID_AMOUNT }));
  });

  test('rejects more than two decimal places', () => {
    expect(() => moneyFromMajor('1.234')).toThrow(expect.objectContaining({ code: ErrorCodes.INVALID_AMOUNT }));
  });

  test('adds amounts of the same currency', () => {
    const total = addMoney(moneyFromMajor('10'), moneyFromMajor('2.50'));
    expect(total.minorUnits).toBe(1250);
  });

  test('formats for the active locale', () => {
    const formatted = formatMoney(moneyFromMajor('12.5'), 'es');
    expect(formatted).toMatch(/12/);
  });
});
