import { normalizeName } from './name';

export type Category = {
  id: string;
  name: string;
  createdAt: string;
};

export function createCategory(input: { id: string; name: string; createdAt: string }): Category {
  return {
    id: input.id,
    name: normalizeName(input.name, 40),
    createdAt: input.createdAt,
  };
}
