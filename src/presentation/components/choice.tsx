import { Pressable, Text, View } from 'react-native';
import { radius, spacing, type } from '@/theme';
import type { Palette } from '@/theme';

export function Choice({
  palette,
  label,
  selected,
  onPress,
}: {
  palette: Palette;
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={{
        borderRadius: radius.lg,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: selected ? palette.accent : palette.surface,
        borderWidth: 1,
        borderColor: selected ? palette.accent : palette.line,
      }}
    >
      <Text style={[type.caption, { color: selected ? '#fff' : palette.text }]}>{label}</Text>
    </Pressable>
  );
}

export function ChoiceRow({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>{children}</View>;
}
