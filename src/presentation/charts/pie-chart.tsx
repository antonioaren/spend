import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { Slice } from '@/domain/insights';
import { formatMoney } from '@/domain/money';
import { type } from '@/theme';
import type { Palette } from '@/theme';

const SIZE = 180;
const STROKE = 28;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

export function PieChart({
  slices,
  palette,
  locale,
  summary,
}: {
  slices: Slice[];
  palette: Palette;
  locale: string;
  summary: string;
}) {
  const total = slices.reduce((sum, slice) => sum + slice.minorUnits, 0) || 1;
  let offset = 0;
  return (
    <View accessibilityLabel={summary} style={{ alignItems: 'center', gap: 12 }}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke={palette.line}
          strokeWidth={STROKE}
          fill="none"
        />
        {slices.map((slice, index) => {
          const length = (slice.minorUnits / total) * C;
          const circle = (
            <Circle
              key={slice.id}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              stroke={palette.chart[index % palette.chart.length]}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={`${length} ${C - length}`}
              strokeDashoffset={-offset}
              rotation={-90}
              origin={`${SIZE / 2}, ${SIZE / 2}`}
            />
          );
          offset += length;
          return circle;
        })}
      </Svg>
      {slices.map((slice, index) => (
        <Text key={slice.id} style={[type.caption, { color: palette.text }]}>
          {slice.label} {formatMoney({ minorUnits: slice.minorUnits, currency: 'EUR' }, locale)}
        </Text>
      ))}
    </View>
  );
}
