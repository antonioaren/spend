import { DomainError, ErrorCodes } from './errors';

export type Money = {
  minorUnits: number;
  currency: string;
};

const DEFAULT_CURRENCY = 'EUR';
const SCALE = 2;

export function moneyFromMinorUnits(
  minorUnits: number,
  currency: string = DEFAULT_CURRENCY,
): Money {
  if (!Number.isInteger(minorUnits) || minorUnits <= 0) {
    throw new DomainError(ErrorCodes.INVALID_AMOUNT, 'Amount must be a positive integer of minor units');
  }
  return { minorUnits, currency };
}

export function moneyFromMajor(
  major: string | number,
  currency: string = DEFAULT_CURRENCY,
): Money {
  const normalized = String(major).trim().replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw new DomainError(ErrorCodes.INVALID_AMOUNT, 'Amount must be a positive decimal with up to 2 places');
  }
  const [whole, fraction = ''] = normalized.split('.');
  const minorUnits = Number(whole) * 10 ** SCALE + Number(fraction.padEnd(SCALE, '0'));
  return moneyFromMinorUnits(minorUnits, currency);
}

export function addMoney(left: Money, right: Money): Money {
  if (left.currency !== right.currency) {
    throw new DomainError(ErrorCodes.INVALID_AMOUNT, 'Cannot add different currencies');
  }
  return { minorUnits: left.minorUnits + right.minorUnits, currency: left.currency };
}

export function formatMoney(money: Money, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
  }).format(money.minorUnits / 100);
}

export function moneyZero(currency: string = DEFAULT_CURRENCY): Money {
  return { minorUnits: 0, currency };
}
