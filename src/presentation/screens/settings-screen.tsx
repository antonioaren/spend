import { ScrollView, Share, Platform, Text } from 'react-native';
import { useSpend } from '@/presentation/spend-context';
import { Body, GhostButton, PrimaryButton, Screen, Title } from '@/presentation/components/ui';
import { spacing, type } from '@/theme';
import { DomainError } from '@/domain/errors';
import { useState } from 'react';

export function SettingsScreen() {
  const { state, palette, tx, app, reload } = useSpend();
  const [error, setError] = useState<string | undefined>();

  async function run(action: () => Promise<unknown>) {
    try {
      setError(undefined);
      await action();
      await reload();
    } catch (caught) {
      setError(caught instanceof DomainError ? tx(`errors.${caught.code}`) : tx('errors.ICLOUD_UNAVAILABLE'));
    }
  }

  async function exportMonth() {
    const exported = await app.reports.exportMonth(state.month.year, state.month.month, state.settings.locale);
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const blob = new Blob([exported.csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `spend-${state.month.year}-${state.month.month}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
      return;
    }
    await Share.share({ message: exported.csv });
  }

  return (
    <Screen palette={palette}>
      <ScrollView contentContainerStyle={{ gap: spacing.md, paddingBottom: 48 }}>
        <Title palette={palette}>{tx('settings.title')}</Title>
        <Body palette={palette}>{tx('settings.language')}</Body>
        <GhostButton palette={palette} label={tx('settings.english')} onPress={() => void run(() => app.settings.setLocale('en'))} />
        <GhostButton palette={palette} label={tx('settings.spanish')} onPress={() => void run(() => app.settings.setLocale('es'))} />
        <Body palette={palette}>{tx('settings.theme')}</Body>
        <GhostButton palette={palette} label={tx('settings.light')} onPress={() => void run(() => app.settings.setTheme('light'))} />
        <GhostButton palette={palette} label={tx('settings.dark')} onPress={() => void run(() => app.settings.setTheme('dark'))} />
        <GhostButton palette={palette} label={tx('settings.system')} onPress={() => void run(() => app.settings.setTheme('system'))} />
        <Body palette={palette}>{tx('settings.storage')}</Body>
        <GhostButton palette={palette} label={tx('settings.local')} onPress={() => void run(() => app.settings.setStorage('local'))} />
        <GhostButton palette={palette} label={tx('settings.icloud')} onPress={() => void run(() => app.settings.setStorage('icloud'))} />
        <Body palette={palette}>{tx('settings.icloudHint')}</Body>
        <PrimaryButton palette={palette} label={tx('settings.export')} onPress={() => void exportMonth()} />
        {error ? <Text style={[type.caption, { color: palette.danger }]}>{error}</Text> : null}
      </ScrollView>
    </Screen>
  );
}
