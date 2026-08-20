import { useState } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import { useSpend } from '@/presentation/spend-context';
import { Body, Field, PrimaryButton, Row, Screen, Title } from '@/presentation/components/ui';
import { spacing, type } from '@/theme';
import { DomainError } from '@/domain/errors';

export function LibraryScreen() {
  const { state, palette, tx, app, reload } = useSpend();
  const [cardName, setCardName] = useState('');
  const [lastFour, setLastFour] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState<string | undefined>();

  async function run(action: () => Promise<unknown>) {
    try {
      setError(undefined);
      await action();
      await reload();
    } catch (caught) {
      setError(caught instanceof DomainError ? tx(`errors.${caught.code}`) : tx('errors.INVALID_NAME'));
    }
  }

  return (
    <Screen palette={palette}>
      <ScrollView contentContainerStyle={{ gap: spacing.md, paddingBottom: 48 }}>
        <Title palette={palette}>{tx('library.cards')}</Title>
        <Field palette={palette} label={tx('library.cardName')} value={cardName} onChangeText={setCardName} />
        <Field palette={palette} label={tx('library.lastFour')} value={lastFour} onChangeText={setLastFour} keyboardType="number-pad" />
        <PrimaryButton
          palette={palette}
          label={tx('library.addCard')}
          onPress={() =>
            void run(async () => {
              await app.cards.create({ name: cardName, lastFour });
              setCardName('');
              setLastFour('');
            })
          }
        />
        {state.cards.length === 0 ? <Body palette={palette}>{tx('library.emptyCards')}</Body> : null}
        {state.cards.map((card) => (
          <Row
            key={card.id}
            palette={palette}
            title={card.name}
            subtitle={card.lastFour ? `•••• ${card.lastFour}` : card.id}
            trailing={
              <Pressable accessibilityRole="button" accessibilityLabel={`${tx('library.delete')} ${card.name}`} onPress={() => void run(() => app.cards.remove(card.id))}>
                <Text style={[type.caption, { color: palette.danger }]}>{tx('library.delete')}</Text>
              </Pressable>
            }
          />
        ))}
        <Title palette={palette}>{tx('library.categories')}</Title>
        <Field palette={palette} label={tx('library.categoryName')} value={categoryName} onChangeText={setCategoryName} />
        <PrimaryButton
          palette={palette}
          label={tx('library.addCategory')}
          onPress={() =>
            void run(async () => {
              await app.categories.create({ name: categoryName });
              setCategoryName('');
            })
          }
        />
        {state.categories.length === 0 ? <Body palette={palette}>{tx('library.emptyCategories')}</Body> : null}
        {state.categories.map((category) => (
          <Row
            key={category.id}
            palette={palette}
            title={category.name}
            trailing={
              <Pressable accessibilityRole="button" accessibilityLabel={`${tx('library.delete')} ${category.name}`} onPress={() => void run(() => app.categories.remove(category.id))}>
                <Text style={[type.caption, { color: palette.danger }]}>{tx('library.delete')}</Text>
              </Pressable>
            }
          />
        ))}
        {error ? <Text style={[type.caption, { color: palette.danger }]}>{error}</Text> : null}
      </ScrollView>
    </Screen>
  );
}
