import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { useState } from 'react';
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
  value,
  onChangeText,
  ...input
}: { palette: Palette; label: string } & TextInputProps) {
  const hasValue = String(value ?? '').length > 0;
  return (
    <View style={styles.field}>
      <Text style={[type.caption, { color: palette.muted }]}>{label}</Text>
      <View style={[styles.inputRow, { borderColor: palette.line, backgroundColor: palette.surface }]}>
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={palette.muted}
          style={[styles.input, { color: palette.text }]}
          {...input}
          value={value}
          onChangeText={onChangeText}
        />
        {hasValue ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Clear ${label}`}
            onPress={() => onChangeText?.('')}
            hitSlop={8}
            style={styles.clear}
          >
            <Text style={[type.body, { color: palette.muted }]}>×</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export function SelectField({
  palette,
  label,
  placeholder,
  emptyText,
  value,
  options,
  onChange,
}: {
  palette: Palette;
  label: string;
  placeholder: string;
  emptyText: string;
  value: string;
  options: { id: string; label: string }[];
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.id === value);

  if (options.length === 0) {
    return (
      <View style={styles.field}>
        <Text style={[type.caption, { color: palette.muted }]}>{label}</Text>
        <Text style={[type.body, { color: palette.muted }]}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.field}>
      <Text style={[type.caption, { color: palette.muted }]}>{label}</Text>
      <Pressable
        accessibilityRole="combobox"
        accessibilityLabel={label}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen((current) => !current)}
        style={[styles.dropdown, { borderColor: palette.line, backgroundColor: palette.surface }]}
      >
        <Text style={[type.body, { color: selected ? palette.text : palette.muted, flex: 1 }]}>
          {selected?.label ?? placeholder}
        </Text>
        <Text style={[type.body, { color: palette.muted }]}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open
        ? options.map((option) => {
            const isSelected = value === option.id;
            return (
              <Pressable
                key={option.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`${label}: ${option.label}`}
                onPress={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                style={[
                  styles.selectOption,
                  {
                    borderColor: isSelected ? palette.accent : palette.line,
                    backgroundColor: isSelected ? palette.accent : palette.surface,
                  },
                ]}
              >
                <Text style={[type.body, { color: isSelected ? '#fff' : palette.text }]}>{option.label}</Text>
              </Pressable>
            );
          })
        : null}
    </View>
  );
}

export function CheckField({
  palette,
  label,
  checked,
  onChange,
}: {
  palette: Palette;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={styles.checkRow}
    >
      <View
        style={[
          styles.checkbox,
          {
            borderColor: checked ? palette.accent : palette.line,
            backgroundColor: checked ? palette.accent : 'transparent',
          },
        ]}
      >
        {checked ? <Text style={[type.caption, { color: '#fff' }]}>✓</Text> : null}
      </View>
      <Text style={[type.body, { color: palette.text }]}>{label}</Text>
    </Pressable>
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
  inputRow: {
    borderWidth: 1,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.xs,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 16,
  },
  clear: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectOption: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
