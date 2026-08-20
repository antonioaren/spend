# Agent instructions — Spend

This repository is a personal expense app. Follow these rules whether you are Cursor, Claude Code, or another coding agent.

## Read first

1. `PRD.md` — product intent
2. `requirements.md` — normative rules
3. `task.md` — work breakdown
4. This file and `CLAUDE.md`

## Architecture (DDD)

```
src/domain          pure TypeScript, no React / Realm / Expo
src/application     use cases + ports
src/infrastructure  adapters (Realm store, iCloud, i18n, clock)
src/presentation    UI, theme, screens
src/app             Expo Router routes only
```

Dependencies point inward. Do not import React from `domain` or `application`.

## TDD is mandatory

Red → green → refactor. No production behavior without a failing test first.

- Domain and use cases: Jest unit tests.
- Adapters: integration tests against in-memory and file-backed stores.
- Screens: React Native Testing Library.
- Flows: Playwright e2e against Expo web (`e2e/`).

Skills: `.agents/skills/test-driven-development/SKILL.md` and Expo skills under `.agents/skills/`.

## Style

- DRY and KISS. No extra frameworks (no Redux, no generic DI container).
- User-visible strings: i18n keys only (`en` + `es`).
- Visual values: `src/theme` tokens only.
- Commits: one logical feature or test slice per commit. Imperative subject, English.

## Commands

```sh
npm test
npm run test:e2e
npm run typecheck
npm run lint
npm run start:web
```

## Persistence

- Default: local Realm-shaped store.
- Optional: iCloud, only if `ICloudAccountPort.isAvailable()` is true.
- Tests fake iCloud; never call real CloudKit from CI.

## Shortcuts

Handle `spend://add-expense?...` through `AddExpenseFromShortcut` — the same use case as the form.
