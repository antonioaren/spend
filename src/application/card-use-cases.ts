import { createCard } from '../domain/card';
import { DomainError, ErrorCodes } from '../domain/errors';
import type { AppPorts } from './ports';
import { requireUniqueName } from './unique-name';

export function cardUseCases(ports: AppPorts) {
  return {
    async create(input: { name: string; lastFour?: string }) {
      const cards = await ports.cards.list();
      requireUniqueName(cards, input.name);
      const card = createCard({
        id: ports.ids.next(),
        name: input.name,
        lastFour: input.lastFour,
        createdAt: ports.clock.now().toISOString(),
      });
      await ports.cards.save(card);
      return card;
    },
    async rename(id: string, name: string) {
      const card = await ports.cards.get(id);
      if (!card) throw new DomainError(ErrorCodes.UNKNOWN_CARD, 'Card not found');
      const cards = await ports.cards.list();
      requireUniqueName(cards, name, id);
      const next = createCard({ ...card, name });
      await ports.cards.save(next);
      return next;
    },
    async remove(id: string) {
      const card = await ports.cards.get(id);
      if (!card) throw new DomainError(ErrorCodes.UNKNOWN_CARD, 'Card not found');
      const expenses = await ports.expenses.list();
      if (expenses.some((expense) => expense.cardId === id)) {
        throw new DomainError(ErrorCodes.CARD_IN_USE, 'Card still has expenses');
      }
      await ports.cards.remove(id);
    },
    list: () => ports.cards.list(),
  };
}
