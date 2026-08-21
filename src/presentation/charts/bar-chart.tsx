import { Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import type { Slice } from '@/domain/insights';
import { formatMoney } from '@/domain/money';
import { spacing, type } from '@/theme';
import type { Palette } from '@/theme';

export function BarChart({
  bars,
  palette,
  locale,
  summary,
}: {
  bars: Slice[];
  palette: Palette;
  locale: string;
  summary: string;
}) {
  const max = Math.max(...bars.map((bar) => bar.minorUnits), 1);
  const width = 280;
  const height = 120;
  const gap = 8;
  const barWidth = bars.length ? (width - gap * (bars.length - 1)) / bars.length : width;
  return (
    <View accessibilityLabel={summary} style={{ gap: spacing.sm }}>
      <Svg width={width} height={height}>
        {bars.map((bar, index) => {
          const h = (bar.minorUnits / max) * (height - 4);
          return (
            <Rect
              key={bar.id}
              x={index * (barWidth + gap)}
              y={height - h}
              width={barWidth}
              height={h}
              rx={4}
              fill={palette.chart[index % palette.chart.length]}
            />
          );
        })}
      </Svg>
      {bars.map((bar) => (
        <Text key={bar.id} style={[type.caption, { color: palette.text }]}>
          {bar.label} {formatMoney({ minorUnits: bar.minorUnits, currency: 'EUR' }, locale)}
        </Text>
      ))}
    </View>
  );
}
