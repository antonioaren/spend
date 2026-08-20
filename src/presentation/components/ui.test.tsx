import { render, screen, userEvent } from '@testing-library/react-native';
import { Field, SelectField } from '@/presentation/components/ui';
import { palettes } from '@/theme';

const palette = palettes.light;

describe('Field', () => {
  test('shows a clear control that empties the value', async () => {
    const onChangeText = jest.fn();
    const user = userEvent.setup();
    render(
      <Field palette={palette} label="Name" value="Coffee" onChangeText={onChangeText} />,
    );
    await user.press(screen.getByRole('button', { name: 'Clear Name' }));
    expect(onChangeText).toHaveBeenCalledWith('');
  });

  test('hides the clear control when the field is empty', () => {
    render(<Field palette={palette} label="Name" value="" onChangeText={jest.fn()} />);
    expect(screen.queryByRole('button', { name: 'Clear Name' })).toBeNull();
  });
});

describe('SelectField', () => {
  test('keeps options collapsed until the dropdown is opened', async () => {
    const user = userEvent.setup();
    render(
      <SelectField
        palette={palette}
        label="Card"
        placeholder="Choose a card"
        emptyText="No cards yet"
        value=""
        options={[{ id: 'c1', label: 'Visa' }]}
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByRole('combobox', { name: 'Card' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Card: Visa' })).toBeNull();
    await user.press(screen.getByRole('combobox', { name: 'Card' }));
    expect(screen.getByRole('button', { name: 'Card: Visa' })).toBeTruthy();
  });

  test('selecting an option closes the dropdown', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(
      <SelectField
        palette={palette}
        label="Card"
        placeholder="Choose a card"
        emptyText="No cards yet"
        value=""
        options={[{ id: 'c1', label: 'Visa' }]}
        onChange={onChange}
      />,
    );
    await user.press(screen.getByRole('combobox', { name: 'Card' }));
    await user.press(screen.getByRole('button', { name: 'Card: Visa' }));
    expect(onChange).toHaveBeenCalledWith('c1');
    expect(screen.queryByRole('button', { name: 'Card: Visa' })).toBeNull();
  });

  test('shows empty copy when there are no options', () => {
    render(
      <SelectField
        palette={palette}
        label="Card"
        placeholder="Choose a card"
        emptyText="No cards yet. Add one in Library."
        value=""
        options={[]}
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByText('No cards yet. Add one in Library.')).toBeTruthy();
  });
});
