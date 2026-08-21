import { ScrollView } from 'react-native';
import { useSpend } from '@/presentation/spend-context';
import { Body, Screen, Title } from '@/presentation/components/ui';
import { PieChart } from '@/presentation/charts/pie-chart';
import { BarChart } from '@/presentation/charts/bar-chart';
import { formatMoney } from '@/domain/money';
import { spacing } from '@/theme';
import { t } from '@/infrastructure/i18n';

export function InsightsScreen() {
  const { state, palette, tx } = useSpend();
  const locale = state.settings.locale;
  const byCardSummary = state.insights.byCard
    .map((slice) => {
      const total = state.insights.byCard.reduce((sum, item) => sum + item.minorUnits, 0) || 1;
      return t(locale, 'charts.cardSummary', {
        label: slice.label,
        percent: Math.round((slice.minorUnits / total) * 100),
      });
    })
    .join(', ');
  const byMonthSummary = state.insights.byMonth
    .map((slice) =>
      t(locale, 'charts.monthSummary', {
        label: slice.label,
        amount: formatMoney({ minorUnits: slice.minorUnits, currency: 'EUR' }, locale),
      }),
    )
    .join(', ');
  const topSummary = state.insights.topCategoryByMonth
    .map((row) =>
      t(locale, 'charts.topCategorySummary', {
        month: row.month,
        category: row.categoryName,
        amount: formatMoney({ minorUnits: row.minorUnits, currency: 'EUR' }, locale),
      }),
    )
    .join(', ');

  return (
    <Screen palette={palette}>
      <ScrollView contentContainerStyle={{ gap: spacing.lg, paddingBottom: 48 }}>
        <Title palette={palette}>{tx('insights.title')}</Title>
        {state.insights.byCard.length === 0 ? (
          <Body palette={palette}>{tx('insights.empty')}</Body>
        ) : (
          <>
            <Title palette={palette}>{tx('insights.byCard')}</Title>
            <PieChart slices={state.insights.byCard} palette={palette} locale={locale} summary={byCardSummary} />
            <Title palette={palette}>{tx('insights.byMonth')}</Title>
            <BarChart bars={state.insights.byMonth} palette={palette} locale={locale} summary={byMonthSummary} />
            <Title palette={palette}>{tx('insights.topCategory')}</Title>
            <BarChart
              bars={state.insights.topCategoryByMonth.map((row) => ({
                id: row.month,
                label: `${row.month} ${row.categoryName}`,
                minorUnits: row.minorUnits,
              }))}
              palette={palette}
              locale={locale}
              summary={topSummary}
            />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
