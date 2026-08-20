import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { radius, spacing, type } from '@/theme';
import type { Palette } from '@/theme';

export function Screen({ palette, children }: { palette: Palette; children: React.ReactNode }) {
  return <View style={[styles.screen, { backgroundColor: palette.background }]}>{children}</View>;
}

export function Title({ palette, children }: { palette: Palette; children: React.ReactNode }) {
  return <Text style={[type.title, { color: palette.text }]}>{children}</Text>;
}

export function Body({ palette, children }: { palette: Palette; children: React.ReactNode }) {
  return <Text style={[type.body, { color: palette.muted }]}>{children}</Text>;
}

export function PrimaryButton({
  palette,
  label,
  onPress,
  accessibilityLabel,
}: {
  palette: Palette;
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={[styles.button, { backgroundColor: palette.accent }]}
    >
      <Text style={[type.subtitle, { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

export function GhostButton({
  palette,
  label,
  onPress,
  accessibilityLabel,
}: {
  palette: Palette;
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={[styles.ghost, { borderColor: palette.line }]}
    >
      <Text style={[type.subtitle, { color: palette.text }]}>{label}</Text>
    </Pressable>
  );
}

export function Field({
  palette,
  label,
  ...input
}: { palette: Palette; label: string } & TextInputProps) {
  return (
    <View style={styles.field}>
      <Text style={[type.caption, { color: palette.muted }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={palette.muted}
        style={[styles.input, { color: palette.text, borderColor: palette.line, backgroundColor: palette.surface }]}
        {...input}
      />
    </View>
  );
}

export function Row({
  palette,
  title,
  subtitle,
  onPress,
  trailing,
}: {
  palette: Palette;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
}) {
  const inner = (
    <View style={[styles.row, { backgroundColor: palette.surface, borderColor: palette.line }]}>
      <View style={{ flex: 1 }}>
        <Text style={[type.body, { color: palette.text }]}>{title}</Text>
        {subtitle ? <Text style={[type.caption, { color: palette.muted }]}>{subtitle}</Text> : null}
      </View>
      {trailing}
    </View>
  );
  if (!onPress) return inner;
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {inner}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: spacing.lg, gap: spacing.md },
  button: { borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: spacing.md, alignItems: 'center' },
  ghost: {
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  field: { gap: spacing.xs },
  input: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 16,
  },
  row: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
