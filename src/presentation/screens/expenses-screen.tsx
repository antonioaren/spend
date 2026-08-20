import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSpend } from '@/presentation/spend-context';
import { Body, CheckField, Field, GhostButton, PrimaryButton, Row, Screen, SelectField, Title } from '@/presentation/components/ui';
import { formatMoney } from '@/domain/money';
import { spacing, type } from '@/theme';
import { DomainError } from '@/domain/errors';

export function ExpensesScreen() {
  const { state, palette, tx, app, reload, showToday, shiftMonth, setFilter } = useSpend();
  const [form, setForm] = useState({
    name: '',
    amount: '',
    cardId: '',
    categoryId: '',
    date: '',
    time: '',
  });
  const [filters, setFilters] = useState({ from: '', to: '', min: '', max: '', name: '', categoryId: '' });
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [customDate, setCustomDate] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const title =
    state.view === 'today' ? tx('expenses.today') : `${state.month.year}-${String(state.month.month).padStart(2, '0')}`;

  async function save() {
    try {
      setError(undefined);
      await app.expenses.create({
        name: form.name,
        amount: form.amount,
        cardId: form.cardId || state.cards[0]?.id || '',
        categoryId: form.categoryId || state.categories[0]?.id || '',
        date: customDate ? form.date || undefined : undefined,
        time: customDate ? form.time || undefined : undefined,
      });
      setForm({ name: '', amount: '', cardId: '', categoryId: '', date: '', time: '' });
      setCustomDate(false);
      setShowForm(false);
      await reload();
    } catch (caught) {
      setError(caught instanceof DomainError ? tx(`errors.${caught.code}`) : tx('errors.INVALID_AMOUNT'));
    }
  }

  return (
    <Screen palette={palette}>
      <ScrollView contentContainerStyle={{ gap: spacing.md, paddingBottom: 48 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Pressable accessibilityRole="button" accessibilityLabel={tx('expenses.previousMonth')} onPress={() => shiftMonth(-1)}>
            <Text style={[type.title, { color: palette.text }]}>‹</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={showToday}>
            <Title palette={palette}>{title}</Title>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={tx('expenses.nextMonth')} onPress={() => shiftMonth(1)}>
            <Text style={[type.title, { color: palette.text }]}>›</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <GhostButton palette={palette} label={tx('expenses.filters')} onPress={() => setShowFilters((v) => !v)} />
          <PrimaryButton
            palette={palette}
            label={tx('expenses.add')}
            onPress={() => {
              setShowForm((open) => {
                const next = !open;
                if (next) {
                  setForm((current) => ({
                    ...current,
                    cardId: current.cardId || state.cards[0]?.id || '',
                    categoryId: current.categoryId || state.categories[0]?.id || '',
                  }));
                }
                return next;
              });
            }}
          />
        </View>
        {showFilters ? (
          <View style={{ gap: spacing.sm }}>
            <Field palette={palette} label={tx('expenses.from')} value={filters.from} onChangeText={(from) => setFilters((f) => ({ ...f, from }))} />
            <Field palette={palette} label={tx('expenses.to')} value={filters.to} onChangeText={(to) => setFilters((f) => ({ ...f, to }))} />
            <Field palette={palette} label={tx('expenses.min')} value={filters.min} onChangeText={(min) => setFilters((f) => ({ ...f, min }))} keyboardType="decimal-pad" />
            <Field palette={palette} label={tx('expenses.max')} value={filters.max} onChangeText={(max) => setFilters((f) => ({ ...f, max }))} keyboardType="decimal-pad" />
            <Field palette={palette} label={tx('expenses.name')} value={filters.name} onChangeText={(name) => setFilters((f) => ({ ...f, name }))} />
            <SelectField
              palette={palette}
              label={tx('expenses.category')}
              placeholder={tx('expenses.chooseCategory')}
              emptyText={tx('expenses.noCategoriesYet')}
              value={filters.categoryId}
              options={state.categories.map((category) => ({ id: category.id, label: category.name }))}
              onChange={(categoryId) => setFilters((f) => ({ ...f, categoryId }))}
            />
            <PrimaryButton
              palette={palette}
              label={tx('expenses.apply')}
              onPress={() =>
                setFilter({
                  from: filters.from || undefined,
                  to: filters.to || undefined,
                  minMinor: filters.min ? Math.round(Number(filters.min.replace(',', '.')) * 100) : undefined,
                  maxMinor: filters.max ? Math.round(Number(filters.max.replace(',', '.')) * 100) : undefined,
                  name: filters.name || undefined,
                  categoryId: filters.categoryId || undefined,
                })
              }
            />
            <GhostButton palette={palette} label={tx('expenses.clearFilters')} onPress={() => { setFilters({ from: '', to: '', min: '', max: '', name: '', categoryId: '' }); showToday(); }} />
          </View>
        ) : null}
        {showForm ? (
          <View style={{ gap: spacing.sm }}>
            <Field palette={palette} label={tx('expenses.name')} value={form.name} onChangeText={(name) => setForm((f) => ({ ...f, name }))} />
            <Field palette={palette} label={tx('expenses.amount')} value={form.amount} onChangeText={(amount) => setForm((f) => ({ ...f, amount }))} keyboardType="decimal-pad" />
            <SelectField
              palette={palette}
              label={tx('expenses.card')}
              placeholder={tx('expenses.chooseCard')}
              emptyText={tx('expenses.noCardsYet')}
              value={form.cardId}
              options={state.cards.map((card) => ({ id: card.id, label: card.name }))}
              onChange={(cardId) => setForm((f) => ({ ...f, cardId }))}
            />
            <SelectField
              palette={palette}
              label={tx('expenses.category')}
              placeholder={tx('expenses.chooseCategory')}
              emptyText={tx('expenses.noCategoriesYet')}
              value={form.categoryId}
              options={state.categories.map((category) => ({ id: category.id, label: category.name }))}
              onChange={(categoryId) => setForm((f) => ({ ...f, categoryId }))}
            />
            <CheckField
              palette={palette}
              label={tx('expenses.customDate')}
              checked={customDate}
              onChange={(checked) => {
                setCustomDate(checked);
                if (!checked) setForm((current) => ({ ...current, date: '', time: '' }));
              }}
            />
            {customDate ? (
              <>
                <Field palette={palette} label={tx('expenses.date')} value={form.date} onChangeText={(date) => setForm((f) => ({ ...f, date }))} placeholder="YYYY-MM-DD" />
                <Field palette={palette} label={tx('expenses.time')} value={form.time} onChangeText={(time) => setForm((f) => ({ ...f, time }))} placeholder="HH:mm" />
              </>
            ) : null}
            {error ? <Text style={[type.caption, { color: palette.danger }]}>{error}</Text> : null}
            <PrimaryButton palette={palette} label={tx('expenses.save')} onPress={() => void save()} />
            <GhostButton palette={palette} label={tx('expenses.cancel')} onPress={() => setShowForm(false)} />
          </View>
        ) : null}
        {state.expenses.length === 0 ? (
          <Body palette={palette}>{tx('expenses.empty')}</Body>
        ) : (
          state.expenses.map((expense) => (
            <Row
              key={expense.id}
              palette={palette}
              title={expense.name}
              subtitle={`${formatMoney(expense.amount, state.settings.locale)} · ${expense.occurredOn}${expense.occurredTime ? ` ${expense.occurredTime}` : ''}`}
            />
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
