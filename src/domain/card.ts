import { DomainError, ErrorCodes } from './errors';
import { normalizeName } from './name';

export type Card = {
  id: string;
  name: string;
  lastFour?: string;
  createdAt: string;
};

export function createCard(input: {
  id: string;
  name: string;
  lastFour?: string;
  createdAt: string;
}): Card {
  const lastFour = input.lastFour?.trim();
  if (lastFour) {
    if (!/^\d{4}$/.test(lastFour)) {
      throw new DomainError(ErrorCodes.INVALID_LAST_FOUR, 'lastFour must be exactly 4 digits');
    }
  }
  return {
    id: input.id,
    name: normalizeName(input.name, 40),
    lastFour: lastFour || undefined,
    createdAt: input.createdAt,
  };
}
