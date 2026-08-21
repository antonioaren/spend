import type { AppPorts } from './ports';
import { cardUseCases } from './card-use-cases';
import { categoryUseCases } from './category-use-cases';
import { expenseUseCases } from './expense-use-cases';
import { reportUseCases } from './report-use-cases';
import { settingsUseCases } from './settings-use-cases';
import { shortcutUseCases } from './shortcut-use-cases';

export function createSpendApp(ports: AppPorts) {
  return {
    cards: cardUseCases(ports),
    categories: categoryUseCases(ports),
    expenses: expenseUseCases(ports),
    reports: reportUseCases(ports),
    settings: settingsUseCases(ports),
    shortcuts: shortcutUseCases(ports),
  };
}

export type SpendApp = ReturnType<typeof createSpendApp>;
