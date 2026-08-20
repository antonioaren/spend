# Spend — Task list

Status: in progress. Checkboxes move to `[x]` only when tests for that item are green.

## 0. Foundation

- [ ] 0.1 Product docs (`PRD.md`, `requirements.md`, `task.md`)
- [ ] 0.2 AI setup (`AGENTS.md`, `CLAUDE.md`, Cursor rules, TDD + Expo skills)
- [ ] 0.3 Expo app scaffold (Router tabs, TypeScript, Jest, Testing Library)
- [ ] 0.4 Theme tokens (light/dark) and i18n (`en`, `es`)

## 1. Domain (TDD)

- [ ] 1.1 Money value object
- [ ] 1.2 OccurredAt policy (date/time invariants)
- [ ] 1.3 Card entity
- [ ] 1.4 Category entity
- [ ] 1.5 Expense entity
- [ ] 1.6 Expense filters
- [ ] 1.7 Insights calculators
- [ ] 1.8 Month export grouping

## 2. Application (TDD)

- [ ] 2.1 Ports (repositories, clock, iCloud account, id)
- [ ] 2.2 Card use cases
- [ ] 2.3 Category use cases
- [ ] 2.4 Create / list / filter expense use cases
- [ ] 2.5 Export month use case
- [ ] 2.6 Insights use case
- [ ] 2.7 Settings use cases (locale, theme, storage)
- [ ] 2.8 Shortcut add-expense use case

## 3. Infrastructure (TDD + integration)

- [ ] 3.1 In-memory repositories (unit/integration)
- [ ] 3.2 Realm-shaped local store (file-backed, restart-safe)
- [ ] 3.3 iCloud store + availability port
- [ ] 3.4 Storage preference switch
- [ ] 3.5 Deep link / Shortcut URL parser
- [ ] 3.6 Localization resources wired to i18n

## 4. Presentation (TDD + component tests)

- [ ] 4.1 Design system primitives (screen, button, field, list row)
- [ ] 4.2 Expenses tab: today, month arrows, add form
- [ ] 4.3 Filters sheet
- [ ] 4.4 Library: cards and categories
- [ ] 4.5 Insights charts (pie, monthly bars, top category)
- [ ] 4.6 Settings: language, theme, storage
- [ ] 4.7 Empty states and error copy (i18n)

## 5. E2E

- [ ] 5.1 Add card + category + expense
- [ ] 5.2 Today list and month navigation
- [ ] 5.3 Filters (date, amount, name, category)
- [ ] 5.4 Export grouped by card
- [ ] 5.5 Insights charts summaries
- [ ] 5.6 Language switch EN/ES
- [ ] 5.7 Theme light/dark
- [ ] 5.8 Storage preference + iCloud unavailable
- [ ] 5.9 Shortcut URL creates expense

## 6. Quality gate

- [ ] 6.1 `npm test` green
- [ ] 6.2 `npm run typecheck` green
- [ ] 6.3 `npm run lint` green
- [ ] 6.4 App boots on Expo web
- [ ] 6.5 README with run, test, Shortcut URL
