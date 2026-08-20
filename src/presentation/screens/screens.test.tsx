import { render, screen, userEvent, waitFor } from '@testing-library/react-native';
import { SpendProvider } from '@/presentation/spend-context';
import { ExpensesScreen } from '@/presentation/screens/expenses-screen';
import { LibraryScreen } from '@/presentation/screens/library-screen';
import { SettingsScreen } from '@/presentation/screens/settings-screen';
import { InsightsScreen } from '@/presentation/screens/insights-screen';
import { createMemoryPorts } from '@/infrastructure/memory-ports';
import { createSpendApp } from '@/application/spend-app';

const now = new Date(2026, 7, 20, 11, 0, 0);

function renderApp(ui: React.ReactElement, iCloudAvailable = false) {
  const ports = createMemoryPorts({ now, iCloudAvailable });
  const app = createSpendApp(ports);
  return {
    app,
    ports,
    ...render(<SpendProvider ports={ports}>{ui}</SpendProvider>),
  };
}

describe('Library and expenses screens', () => {
  test('adds a card, category and expense for today', async () => {
    const user = userEvent.setup();
    const { rerender, ports } = renderApp(<LibraryScreen />);
    await user.type(screen.getByLabelText('Card name'), 'Visa');
    await user.press(screen.getByRole('button', { name: 'Add card' }));
    await user.type(screen.getByLabelText('Category name'), 'Food');
    await user.press(screen.getByRole('button', { name: 'Add category' }));
    await waitFor(() => expect(screen.getByText('Visa')).toBeTruthy());

    rerender(
      <SpendProvider ports={ports}>
        <ExpensesScreen />
      </SpendProvider>,
    );
    await user.press(screen.getByRole('button', { name: 'Add expense' }));
    await waitFor(() => expect(screen.getByLabelText('Card')).toBeTruthy());
    await user.type(screen.getByLabelText('Name'), 'Coffee');
    await user.type(screen.getByLabelText('Amount'), '2.50');
    await user.press(screen.getByRole('button', { name: 'Card: Visa' }));
    await user.press(screen.getByRole('button', { name: 'Category: Food' }));
    await user.press(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(screen.getByText('Coffee')).toBeTruthy());
  });

  test('shows a Card field listing existing cards', async () => {
    const ports = createMemoryPorts({ now });
    const app = createSpendApp(ports);
    await app.cards.create({ name: 'Visa' });
    await app.categories.create({ name: 'Food' });
    const user = userEvent.setup();
    render(
      <SpendProvider ports={ports}>
        <ExpensesScreen />
      </SpendProvider>,
    );
    await user.press(await screen.findByRole('button', { name: 'Add expense' }));
    await waitFor(() => expect(screen.getByLabelText('Card')).toBeTruthy());
    expect(screen.getByRole('button', { name: 'Card: Visa' })).toBeTruthy();
    expect(screen.getByLabelText('Category')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Category: Food' })).toBeTruthy();
  });
});

describe('Settings screen', () => {
  test('switches the UI to Spanish', async () => {
    const user = userEvent.setup();
    renderApp(<SettingsScreen />);
    await user.press(await screen.findByRole('button', { name: 'Spanish' }));
    await waitFor(() => expect(screen.getByText('Ajustes')).toBeTruthy());
  });

  test('shows iCloud unavailable error', async () => {
    const user = userEvent.setup();
    renderApp(<SettingsScreen />, false);
    await user.press(await screen.findByRole('button', { name: 'iCloud' }));
    await waitFor(() => expect(screen.getByText('iCloud is not available.')).toBeTruthy());
  });
});

describe('Insights screen', () => {
  test('exposes a text summary of the pie chart', async () => {
    const ports = createMemoryPorts({ now, iCloudAvailable: true });
    const app = createSpendApp(ports);
    const card = await app.cards.create({ name: 'Visa' });
    const category = await app.categories.create({ name: 'Food' });
    await app.expenses.create({
      name: 'Coffee',
      amount: '10',
      cardId: card.id,
      categoryId: category.id,
    });
    render(
      <SpendProvider ports={ports}>
        <InsightsScreen />
      </SpendProvider>,
    );
    await waitFor(() => expect(screen.getByLabelText(/Visa 100%/)).toBeTruthy());
  });
});
