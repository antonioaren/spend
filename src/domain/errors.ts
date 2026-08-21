export class DomainError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
  }
}

export const ErrorCodes = {
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  TIME_WITHOUT_DATE: 'TIME_WITHOUT_DATE',
  INVALID_DATE: 'INVALID_DATE',
  INVALID_TIME: 'INVALID_TIME',
  INVALID_NAME: 'INVALID_NAME',
  DUPLICATE_NAME: 'DUPLICATE_NAME',
  INVALID_LAST_FOUR: 'INVALID_LAST_FOUR',
  CARD_IN_USE: 'CARD_IN_USE',
  CATEGORY_IN_USE: 'CATEGORY_IN_USE',
  UNKNOWN_CARD: 'UNKNOWN_CARD',
  UNKNOWN_CATEGORY: 'UNKNOWN_CATEGORY',
  UNKNOWN_EXPENSE: 'UNKNOWN_EXPENSE',
  ICLOUD_UNAVAILABLE: 'ICLOUD_UNAVAILABLE',
  INVALID_SHORTCUT: 'INVALID_SHORTCUT',
} as const;
