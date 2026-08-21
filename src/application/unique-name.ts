import { DomainError, ErrorCodes } from '../domain/errors';
import { sameName } from '../domain/name';

export function requireUniqueName<T extends { id: string; name: string }>(
  items: T[],
  name: string,
  ignoreId?: string,
): void {
  const taken = items.some((item) => item.id !== ignoreId && sameName(item.name, name));
  if (taken) {
    throw new DomainError(ErrorCodes.DUPLICATE_NAME, 'Name already exists');
  }
}
