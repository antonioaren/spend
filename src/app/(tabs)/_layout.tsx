import { Tabs } from 'expo-router';
import { useSpend } from '@/presentation/spend-context';

export default function TabsLayout() {
  const { tx, palette } = useSpend();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.accent,
        tabBarStyle: { backgroundColor: palette.surface, borderTopColor: palette.line },
      }}
    >
      <Tabs.Screen name="index" options={{ title: tx('tabs.expenses') }} />
      <Tabs.Screen name="insights" options={{ title: tx('tabs.insights') }} />
      <Tabs.Screen name="library" options={{ title: tx('tabs.library') }} />
      <Tabs.Screen name="settings" options={{ title: tx('tabs.settings') }} />
    </Tabs>
  );
}
