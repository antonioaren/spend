import { createCategory } from '../domain/category';
import { DomainError, ErrorCodes } from '../domain/errors';
import type { AppPorts } from './ports';
import { requireUniqueName } from './unique-name';

export function categoryUseCases(ports: AppPorts) {
  return {
    async create(input: { name: string }) {
      const categories = await ports.categories.list();
      requireUniqueName(categories, input.name);
      const category = createCategory({
        id: ports.ids.next(),
        name: input.name,
        createdAt: ports.clock.now().toISOString(),
      });
      await ports.categories.save(category);
      return category;
    },
    async rename(id: string, name: string) {
      const category = await ports.categories.get(id);
      if (!category) throw new DomainError(ErrorCodes.UNKNOWN_CATEGORY, 'Category not found');
      const categories = await ports.categories.list();
      requireUniqueName(categories, name, id);
      const next = createCategory({ ...category, name });
      await ports.categories.save(next);
      return next;
    },
    async remove(id: string) {
      const category = await ports.categories.get(id);
      if (!category) throw new DomainError(ErrorCodes.UNKNOWN_CATEGORY, 'Category not found');
      const expenses = await ports.expenses.list();
      if (expenses.some((expense) => expense.categoryId === id)) {
        throw new DomainError(ErrorCodes.CATEGORY_IN_USE, 'Category still has expenses');
      }
      await ports.categories.remove(id);
    },
    list: () => ports.categories.list(),
  };
}
