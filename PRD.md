# Spend — Product Requirements Document

## 1. Overview

Spend is a personal expense tracker for iOS (Expo / React Native). Capture what you just spent, attach it to a payment card and a category, review recent activity, filter history, export monthly totals by card, and see simple insights.

The product is for a single owner. There is no multi-user product surface. Data stays on the device by default, with an optional iCloud sync preference.

## 2. Goals

- Add an expense in a few taps, including from Apple Shortcuts.
- Keep cards, categories, and expenses as first-class records.
- Make history easy to scan (today, month arrows) and easy to filter.
- Show spending insights with three charts: by card, by month, and top category per month.
- Support English and Spanish, light and dark themes, and a minimal visual language.
- Persist locally (Realm-shaped store) or sync with the user's iCloud account.

## 3. Non-goals

- Shared households, budgets, or bank connections.
- Receipt OCR, GPS, or merchant lookup.
- Android-first distribution (Android may run via Expo, but iCloud and Shortcuts are iOS).
- Server-side accounts other than Apple iCloud.

## 4. Users and context

Single personal user on their iPhone. Typical flow: pay for something, open Spend (or run a Shortcut), enter amount + name, confirm. Later, browse the month, filter, export, or check insights.

## 5. Information architecture

| Record | Fields |
| --- | --- |
| Card | id, name, lastFour (optional), createdAt |
| Category | id, name, createdAt |
| Expense | id, name, amount (minor units + currency), cardId, categoryId, occurredOn (date required), occurredAt (time optional, only if date is set), createdAt |
| Settings | locale (`en` \| `es`), theme (`light` \| `dark` \| `system`), storage (`local` \| `icloud`) |

## 6. Functional product

### 6.1 Cards

- Create, rename, and delete a card.
- Deleting a card is blocked while expenses still reference it.
- Expenses always belong to one card.

### 6.2 Categories

- Create, rename, and delete a category.
- Deleting a category is blocked while expenses still reference it.
- Expenses always belong to one category.

### 6.3 Add expense

Required: name, price, category, card.

Date and time:

- If the user omits date and time, both default to creation instant.
- Date may be set without time (time stays empty / start of that local day is not implied as a recorded time).
- Time cannot be set without a date. The domain rejects `time without date`.

### 6.4 Expense list

- Default view: **Today**.
- Month navigation with previous / next arrows (calendar month).
- Filters combinable: date range, amount min/max, name (contains, case-insensitive), category.

### 6.5 Export

- Export one calendar month, grouped by card.
- Formats: CSV (share sheet / file) and JSON (same grouping, for tests and Shortcuts).

### 6.6 Insights

Tab with three charts for the selected month range (default: current year):

1. Pie: spend per card.
2. Bar: spend per month.
3. Grouped/stacked or labeled bars: for each month, the category with the highest spend.

### 6.7 Localization

- UI strings in English and Spanish.
- User can switch language in Settings; default follows device locale when `en` or `es`, otherwise English.

### 6.8 Persistence preference

- **Local:** Realm-shaped object database on device.
- **iCloud:** requires an iCloud account. If the account is unavailable, the app stays on local storage and explains why.
- Switching to iCloud copies local records into the iCloud-backed store when the account is signed in.

### 6.9 Theme

Settings: Light, Dark, or System. Minimalist surfaces, generous whitespace, one accent color, no decorative illustration.

### 6.10 Apple Shortcuts

URL scheme `spend` with:

`spend://add-expense?amount=12.50&name=Coffee&category=Food&card=Visa&date=2026-08-20&time=21:15`

Missing date/time uses creation instant. The app validates the same domain rules as the in-app form. Success can return via `x-success` when provided (x-callback-url).

## 7. UX principles

- Minimal, simple, calm.
- Primary action: **Add expense**.
- One-handed list + filters; insights are read-only.
- Empty states explain the next action in one sentence.

## 8. Technical product

- Expo (React Native) with Expo Router.
- Domain-Driven Design: domain model has no React/Realm imports.
- TDD (red → green → refactor) for domain, application, infrastructure, and screens.
- Unit, integration, and e2e tests per feature.
- DRY and KISS.

## 9. Success

- All tasks in `task.md` done.
- Test suites green.
- App boots (Expo web in this environment; native via Expo Go / dev client on device).
- A Shortcut URL can create a valid expense through the same use case as the UI.

## 10. Out of scope for v1 polish

App Store listing, widgets, Watch app, recurring expenses.
