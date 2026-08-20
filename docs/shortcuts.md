# Apple Shortcuts

Spend accepts a custom URL so a Shortcut can add an expense without opening the form.

## URL

```
spend://add-expense?amount=12.50&name=Coffee&category=Food&card=Visa
```

| Query | Required | Notes |
| --- | --- | --- |
| `amount` | yes | Major units, e.g. `12.50` |
| `name` | yes | Expense name |
| `category` | yes | Existing category **name** |
| `card` | yes | Existing card **name** |
| `date` | no | `YYYY-MM-DD`. If omitted with `time`, both default to now |
| `time` | no | `HH:mm`. Invalid without `date` |
| `x-success` | no | x-callback-url on success |
| `x-error` | no | x-callback-url on failure |

Create the card and category in the app first. The Shortcut only writes expenses.

## Example Shortcut

1. Add **URL** action: the template above (use Shortcut variables for amount/name).
2. Add **Open URLs**.
3. Optional: run after paying with Apple Pay or after a confirmation prompt.

On Expo web during development you can also open:

```
http://localhost:8081/?shortcut=spend://add-expense?amount=3&name=Metro&category=Transport&card=Cash
```
