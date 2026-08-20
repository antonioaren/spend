import { DomainError, ErrorCodes } from './errors';

export function normalizeName(raw: string, max: number): string {
  const name = raw.trim().replace(/\s+/g, ' ');
  if (name.length < 1 || name.length > max) {
    throw new DomainError(ErrorCodes.INVALID_NAME, `Name must be 1 to ${max} characters`);
  }
  return name;
}

export function sameName(left: string, right: string): boolean {
  return left.trim().toLocaleLowerCase() === right.trim().toLocaleLowerCase();
}
