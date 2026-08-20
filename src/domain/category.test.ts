import { createCategory } from './category';
import { ErrorCodes } from './errors';

describe('Category', () => {
  test('trims a valid name', () => {
    expect(
      createCategory({ id: 'g1', name: ' Food ', createdAt: '2026-08-20T21:00:00.000Z' }).name,
    ).toBe('Food');
  });

  test('rejects a name longer than 40 characters', () => {
    expect(() =>
      createCategory({
        id: 'g1',
        name: 'x'.repeat(41),
        createdAt: '2026-08-20T21:00:00.000Z',
      }),
    ).toThrow(expect.objectContaining({ code: ErrorCodes.INVALID_NAME }));
  });
});
