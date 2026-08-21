# Spend — Requirements

Normative. If this file and the UI disagree, this file wins until the PRD is updated.

## R1 Domain

### R1.1 Money

- Amounts are stored as integer **minor units** (cents) plus ISO currency (`EUR` default).
- Amount must be `> 0`.
- Display uses the active locale (`en` / `es`).

### R1.2 OccurredAt

- `occurredOn` is a calendar date `YYYY-MM-DD` in the user's local timezone.
- `occurredTime` is `HH:mm` or absent.
- Invariant: `occurredTime` requires `occurredOn`.
- If both omitted at creation, both are taken from `clock.now()` in local time.
- Time without date is a domain error: `TIME_WITHOUT_DATE`.

### R1.3 Card

- `name` trimmed, 1–40 characters, unique (case-insensitive).
- Optional `lastFour`: exactly 4 digits, or empty.

### R1.4 Category

- `name` trimmed, 1–40 characters, unique (case-insensitive).

### R1.5 Expense

- `name` trimmed, 1–80 characters.
- Must reference an existing card and category.
- Immutable id (UUID v4).

### R1.6 Referential integrity

- Cannot delete a card or category that still has expenses (`CARD_IN_USE`, `CATEGORY_IN_USE`).

## R2 Use cases

| ID | Use case | Rules |
| --- | --- | --- |
| UC1 | Create card | R1.3 |
| UC2 | Rename card | Unique name still holds |
| UC3 | Delete card | R1.6 |
| UC4 | Create category | R1.4 |
| UC5 | Rename category | Unique name still holds |
| UC6 | Delete category | R1.6 |
| UC7 | Create expense | R1.1, R1.2, R1.5 |
| UC8 | List expenses for day | Local calendar day |
| UC9 | List expenses for month | Local calendar month; previous/next month |
| UC10 | Filter expenses | AND of: date from/to, amount min/max (minor units), name contains, category id |
| UC11 | Export month by card | Group expenses of that month by card; include card name, expense rows, card total, grand total |
| UC12 | Insights | Pie by card; bars by month; per-month top category. Default range: current year |
| UC13 | Change locale | `en` \| `es` |
| UC14 | Change theme | `light` \| `dark` \| `system` |
| UC15 | Change storage | `local` \| `icloud`; iCloud requires signed-in account |
| UC16 | Add expense from Shortcut | Same validation as UC7; parse URL query |

## R3 Persistence

### R3.1 Local

- Realm object schema (or a Realm-compatible document store with the same schema on web/tests).
- Survives process restart.

### R3.2 iCloud

- Preference stored locally.
- Before enabling, `ICloudAccountPort.isAvailable()` must be true.
- When enabled, repositories read/write the iCloud-backed store.
- If iCloud becomes unavailable, the app reports `ICLOUD_UNAVAILABLE` and does not silently drop data.

### R3.3 Seed

- No mandatory seed data. Empty states are valid.
- Tests may seed cards/categories.

## R4 Presentation

### R4.1 Tabs

1. **Expenses** — today / month + filters + add.
2. **Insights** — charts.
3. **Library** — cards and categories.
4. **Settings** — language, theme, storage.

### R4.2 Accessibility

- Interactive controls have accessibility labels (localized).
- Charts expose a text summary (localized) in addition to graphics.

### R4.3 Visual

- Minimalist: system fonts, 8pt spacing grid, one accent, hairline separators.
- Light and dark palettes defined in `src/theme`.

## R5 Internationalization

- All user-visible strings go through i18n keys. No hardcoded copy in screens.
- Date/number formats follow the active locale.

## R6 Shortcuts

- Custom URL scheme: `spend`.
- Path: `/add-expense` or host `add-expense`.
- Query: `amount` (decimal string), `name`, `category` (name), `card` (name), optional `date`, optional `time`, optional `x-success`, `x-error`.
- Category and card are resolved by name (case-insensitive). Missing records → `x-error` with code `UNKNOWN_CARD` / `UNKNOWN_CATEGORY`.
- Amount is a decimal in major units; converted to minor units using currency scale 2.

## R7 Testing

- Unit tests for every domain invariant and use case.
- Integration tests for persistence adapters and Shortcut URL parsing against the real use-case stack (in-memory or file Realm).
- E2E per feature: add card, add category, add expense, list today, month nav, filters, export, insights, theme, language, storage preference, shortcut URL.

## R8 Architecture

- DDD layers: `domain` → `application` → `infrastructure` → `presentation`.
- Dependencies point inward. React and Realm stay outside `domain`.
- DRY: shared money/date/filter logic lives in domain once.
- KISS: no generic event bus, no extra DI framework.
