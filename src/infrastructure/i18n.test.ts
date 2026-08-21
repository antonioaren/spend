import { t } from './i18n';

describe('i18n', () => {
  test('returns English and Spanish copy for the same key', () => {
    expect(t('en', 'expenses.today')).toBe('Today');
    expect(t('es', 'expenses.today')).toBe('Hoy');
  });

  test('interpolates chart summaries', () => {
    expect(t('en', 'charts.monthSummary', { label: '2026-08', amount: '€10' })).toBe(
      '2026-08: €10',
    );
  });
});
