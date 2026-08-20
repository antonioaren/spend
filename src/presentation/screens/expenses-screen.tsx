import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSpend } from '@/presentation/spend-context';
import { Body, Field, GhostButton, PrimaryButton, Row, Screen, Title } from '@/presentation/components/ui';
import { Choice, ChoiceRow } from '@/presentation/components/choice';
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
        date: form.date || undefined,
        time: form.time || undefined,
      });
      setForm({ name: '', amount: '', cardId: '', categoryId: '', date: '', time: '' });
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
          <PrimaryButton palette={palette} label={tx('expenses.add')} onPress={() => setShowForm((v) => !v)} />
        </View>
        {showFilters ? (
          <View style={{ gap: spacing.sm }}>
            <Field palette={palette} label={tx('expenses.from')} value={filters.from} onChangeText={(from) => setFilters((f) => ({ ...f, from }))} />
            <Field palette={palette} label={tx('expenses.to')} value={filters.to} onChangeText={(to) => setFilters((f) => ({ ...f, to }))} />
            <Field palette={palette} label={tx('expenses.min')} value={filters.min} onChangeText={(min) => setFilters((f) => ({ ...f, min }))} keyboardType="decimal-pad" />
            <Field palette={palette} label={tx('expenses.max')} value={filters.max} onChangeText={(max) => setFilters((f) => ({ ...f, max }))} keyboardType="decimal-pad" />
            <Field palette={palette} label={tx('expenses.name')} value={filters.name} onChangeText={(name) => setFilters((f) => ({ ...f, name }))} />
            <ChoiceRow>
              {state.categories.map((category) => (
                <Choice
                  key={category.id}
                  palette={palette}
                  label={category.name}
                  selected={filters.categoryId === category.id}
                  onPress={() => setFilters((f) => ({ ...f, categoryId: category.id }))}
                />
              ))}
            </ChoiceRow>
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
            <ChoiceRow>
              {state.cards.map((card) => (
                <Choice
                  key={card.id}
                  palette={palette}
                  label={card.name}
                  selected={form.cardId === card.id}
                  onPress={() => setForm((f) => ({ ...f, cardId: card.id }))}
                />
              ))}
            </ChoiceRow>
            <ChoiceRow>
              {state.categories.map((category) => (
                <Choice
                  key={category.id}
                  palette={palette}
                  label={category.name}
                  selected={form.categoryId === category.id}
                  onPress={() => setForm((f) => ({ ...f, categoryId: category.id }))}
                />
              ))}
            </ChoiceRow>
            <Field palette={palette} label={tx('expenses.date')} value={form.date} onChangeText={(date) => setForm((f) => ({ ...f, date }))} placeholder="YYYY-MM-DD" />
            <Field palette={palette} label={tx('expenses.time')} value={form.time} onChangeText={(time) => setForm((f) => ({ ...f, time }))} placeholder="HH:mm" />
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
