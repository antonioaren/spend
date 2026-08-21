# Spend

Personal expense tracker for iOS (Expo / React Native). Add what you just spent, attach a card and category, review today and each month, filter, export, and see simple insights.

## Docs

- [PRD.md](./PRD.md)
- [requirements.md](./requirements.md)
- [task.md](./task.md)
- [AGENTS.md](./AGENTS.md)

## Run

```sh
npm install
npm start          # Expo (choose web / iOS)
npm run start:web
```

## Test

```sh
npm test
npm run test:e2e
npm run typecheck
npm run lint
```

## Apple Shortcut

```
spend://add-expense?amount=12.50&name=Coffee&category=Food&card=Visa
```

Optional `date=YYYY-MM-DD` and `time=HH:mm`. Time is rejected without a date.
