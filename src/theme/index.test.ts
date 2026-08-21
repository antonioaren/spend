import { paletteFor } from './index';

describe('theme', () => {
  test('exposes distinct light and dark backgrounds', () => {
    expect(paletteFor('light').background).not.toBe(paletteFor('dark').background);
  });
});
