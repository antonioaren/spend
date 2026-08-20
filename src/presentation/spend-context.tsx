import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { createSpendApp, type SpendApp } from '@/application/spend-app';
import type { AppPorts } from '@/application/ports';
import type { Card } from '@/domain/card';
import type { Category } from '@/domain/category';
import type { Expense } from '@/domain/expense';
import type { ExpenseFilter } from '@/domain/filters';
import type { Settings } from '@/domain/settings';
import type { YearMonth } from '@/domain/occurred-at';
import { defaultSettings } from '@/domain/settings';
import { t, type MessageLocale } from '@/infrastructure/i18n';
import { palettes, type Palette } from '@/theme';
import type { MonthExport } from '@/domain/export';
import type { Slice, TopCategoryMonth } from '@/domain/insights';

export type SpendViewState = {
  cards: Card[];
  categories: Category[];
  expenses: Expense[];
  settings: Settings;
  month: YearMonth;
  view: 'today' | 'month';
  filter: ExpenseFilter;
  insights: {
    byCard: Slice[];
    byMonth: Slice[];
    topCategoryByMonth: TopCategoryMonth[];
  };
  exportPreview?: { csv: string; grouped: MonthExport };
};

type SpendContextValue = {
  app: SpendApp;
  state: SpendViewState;
  palette: Palette;
  themeName: 'light' | 'dark';
  tx: (key: string, vars?: Record<string, string | number>) => string;
  reload: () => Promise<void>;
  showToday: () => void;
  shiftMonth: (delta: number) => void;
  setFilter: (filter: ExpenseFilter) => void;
};

const SpendContext = createContext<SpendContextValue | null>(null);

export function SpendProvider({
  ports,
  children,
  initialUrl,
}: {
  ports: AppPorts;
  children: ReactNode;
  initialUrl?: string | null;
}) {
  const app = useMemo(() => createSpendApp(ports), [ports]);
  const system = useColorScheme();
  const initialMonth = {
    year: ports.clock.now().getFullYear(),
    month: ports.clock.now().getMonth() + 1,
  };
  const [view, setView] = useState<'today' | 'month'>('today');
  const [month, setMonth] = useState<YearMonth>(initialMonth);
  const [filter, setFilter] = useState<ExpenseFilter>({});
  const [data, setData] = useState<Omit<SpendViewState, 'month' | 'view' | 'filter'>>({
    cards: [],
    categories: [],
    expenses: [],
    settings: defaultSettings(),
    insights: { byCard: [], byMonth: [], topCategoryByMonth: [] },
  });

  const reload = useCallback(async () => {
    const settings = await app.settings.get();
    const [cards, categories, clockMonth] = await Promise.all([
      app.cards.list(),
      app.categories.list(),
      app.expenses.currentMonth(),
    ]);
    const filterActive = Object.values(filter).some((value) => value !== undefined && value !== '');
    const expenses = filterActive
      ? await app.expenses.filter(filter)
      : view === 'today'
        ? await app.expenses.listToday()
        : await app.expenses.listMonth(month);
    const insights = await app.reports.insights(view === 'today' ? clockMonth.year : month.year);
    const exported = await app.reports.exportMonth(
      view === 'today' ? clockMonth.year : month.year,
      view === 'today' ? clockMonth.month : month.month,
      settings.locale,
    );
    setData({
      cards,
      categories,
      expenses,
      settings,
      insights,
      exportPreview: exported,
    });
  }, [app, filter, month, view]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    if (!initialUrl) return;
    void app.shortcuts.addExpense(initialUrl).then(() => reload());
  }, [app, initialUrl, reload]);

  const settings = data.settings;
  const themeName: 'light' | 'dark' =
    settings.theme === 'system' ? (system === 'dark' ? 'dark' : 'light') : settings.theme;
  const palette = palettes[themeName];
  const locale = settings.locale as MessageLocale;
  const tx = useCallback((key: string, vars?: Record<string, string | number>) => t(locale, key, vars), [locale]);

  const value: SpendContextValue = {
    app,
    state: { ...data, month, view, filter },
    palette,
    themeName,
    tx,
    reload,
    showToday: () => {
      setView('today');
      setFilter({});
    },
    shiftMonth: (delta) => {
      setView('month');
      setMonth((current) => app.expenses.shiftMonth(current, delta));
      setFilter({});
    },
    setFilter: (next) => {
      setView('month');
      setFilter(next);
    },
  };

  return <SpendContext.Provider value={value}>{children}</SpendContext.Provider>;
}

export function useSpend() {
  const value = useContext(SpendContext);
  if (!value) throw new Error('SpendProvider is required');
  return value;
}
