# Spend — Task list

Status: complete. Checkboxes are `[x]` only when tests for that item are green.

## 0. Foundation

- [x] 0.1 Product docs (`PRD.md`, `requirements.md`, `task.md`)
- [x] 0.2 AI setup (`AGENTS.md`, `CLAUDE.md`, Cursor rules, TDD + Expo skills)
- [x] 0.3 Expo app scaffold (Router tabs, TypeScript, Jest, Testing Library)
- [x] 0.4 Theme tokens (light/dark) and i18n (`en`, `es`)

## 1. Domain (TDD)

- [x] 1.1 Money value object
- [x] 1.2 OccurredAt policy (date/time invariants)
- [x] 1.3 Card entity
- [x] 1.4 Category entity
- [x] 1.5 Expense entity
- [x] 1.6 Expense filters
- [x] 1.7 Insights calculators
- [x] 1.8 Month export grouping

## 2. Application (TDD)

- [x] 2.1 Ports (repositories, clock, iCloud account, id)
- [x] 2.2 Card use cases
- [x] 2.3 Category use cases
- [x] 2.4 Create / list / filter expense use cases
- [x] 2.5 Export month use case
- [x] 2.6 Insights use case
- [x] 2.7 Settings use cases (locale, theme, storage)
- [x] 2.8 Shortcut add-expense use case

## 3. Infrastructure (TDD + integration)

- [x] 3.1 In-memory repositories (unit/integration)
- [x] 3.2 Realm-shaped local store (file-backed, restart-safe)
- [x] 3.3 iCloud store + availability port
- [x] 3.4 Storage preference switch
- [x] 3.5 Deep link / Shortcut URL parser
- [x] 3.6 Localization resources wired to i18n

## 4. Presentation (TDD + component tests)

- [x] 4.1 Design system primitives (screen, button, field, list row)
- [x] 4.2 Expenses tab: today, month arrows, add form
- [x] 4.3 Filters sheet
- [x] 4.4 Library: cards and categories
- [x] 4.5 Insights charts (pie, monthly bars, top category)
- [x] 4.6 Settings: language, theme, storage
- [x] 4.7 Empty states and error copy (i18n)

## 5. E2E

- [x] 5.1 Add card + category + expense
- [x] 5.2 Today list and month navigation
- [x] 5.3 Filters (date, amount, name, category)
- [x] 5.4 Export grouped by card
- [x] 5.5 Insights charts summaries
- [x] 5.6 Language switch EN/ES
- [x] 5.7 Theme light/dark
- [x] 5.8 Storage preference + iCloud unavailable
- [x] 5.9 Shortcut URL creates expense

## 6. Quality gate

- [x] 6.1 `npm test` green
- [x] 6.2 `npm run typecheck` green
- [x] 6.3 `npm run lint` green
- [x] 6.4 App boots on Expo web
- [x] 6.5 README with run, test, Shortcut URL
