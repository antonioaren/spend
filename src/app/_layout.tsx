import 'expo-sqlite/localStorage/install';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useURL } from 'expo-linking';
import { SpendProvider } from '@/presentation/spend-context';
import { createDefaultPorts } from '@/infrastructure/composition';
import { useMemo } from 'react';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

function shortcutFromWeb(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('shortcut');
}

export default function RootLayout() {
  const url = useURL();
  const ports = useMemo(() => createDefaultPorts(), []);
  const initialUrl = shortcutFromWeb() ?? url;
  return (
    <SpendProvider ports={ports} initialUrl={initialUrl}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SpendProvider>
  );
}
