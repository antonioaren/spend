import { createCard } from './card';
import { ErrorCodes } from './errors';

describe('Card', () => {
  test('trims and stores a valid name', () => {
    const card = createCard({
      id: 'c1',
      name: '  Visa Gold  ',
      createdAt: '2026-08-20T21:00:00.000Z',
    });
    expect(card.name).toBe('Visa Gold');
  });

  test('accepts optional last four digits', () => {
    const card = createCard({
      id: 'c1',
      name: 'Visa',
      lastFour: '4242',
      createdAt: '2026-08-20T21:00:00.000Z',
    });
    expect(card.lastFour).toBe('4242');
  });

  test('rejects a last four that is not four digits', () => {
    expect(() =>
      createCard({
        id: 'c1',
        name: 'Visa',
        lastFour: '42',
        createdAt: '2026-08-20T21:00:00.000Z',
      }),
    ).toThrow(expect.objectContaining({ code: ErrorCodes.INVALID_LAST_FOUR }));
  });

  test('rejects an empty name', () => {
    expect(() =>
      createCard({ id: 'c1', name: '  ', createdAt: '2026-08-20T21:00:00.000Z' }),
    ).toThrow(expect.objectContaining({ code: ErrorCodes.INVALID_NAME }));
  });
});
