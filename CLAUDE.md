# Claude Code — Spend

You are working on **Spend**, a personal React Native (Expo) expense app.

## Before coding

- Read `AGENTS.md`, `PRD.md`, `requirements.md`, `task.md`.
- Load `.agents/skills/test-driven-development/SKILL.md`.
- For Expo work, start at `.agents/skills/expo-overview/SKILL.md`, then `expo-project-structure`, `expo-router`, `expo-design-system`, `expo-native-ui`.

## Non-negotiable

1. TDD: write a failing test, watch it fail, implement, watch it pass, refactor.
2. DDD layers stay clean (`domain` has zero UI/persistence imports).
3. Every user-visible string is translated (`en` and `es`).
4. Date/time: time cannot exist without date; omitted date+time uses creation clock.
5. Do not mark `task.md` items done unless tests covering them are green.

## Implementation notes

- Prefer small use-case functions over fat services.
- Repository ports live in `src/application/ports`.
- Realm schema lives in infrastructure only.
- Charts must expose a localized text summary for tests and accessibility.

## Done means

`npm test`, `npm run typecheck`, and e2e for touched features are green, and the app boots.
