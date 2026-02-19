# Communications Data (Private)

This folder stores subscriber communications data used for product updates.

## Files

- `subscribers-active.json`: active contacts eligible for updates.
- `subscribers-archive.json`: contacts removed from active delivery lists.
- `unsubscribed.json`: opt-out registry.
- `send-queue.json`: generated delivery list for the next campaign.
- `subscribers.sample.json`: tracked example format (no real data).

## Subscriber shape

```json
{
  "id": "sub_...",
  "email": "name@example.com",
  "created_at": "2026-02-19T00:00:00.000Z",
  "locale": "es-ES",
  "wants_updates": true,
  "source": "orientia-web",
  "last_notified_at": null,
  "status": "active"
}
```

## Recommended flow

1. Migrate legacy list once:
   - `npm run comm:migrate`
2. Generate delivery queue before each campaign:
   - `npm run comm:prepare-send`
3. Register opt-out requests:
   - `npm run comm:unsubscribe -- --email user@example.com --reason "request"`

## Notes

- Real JSON data in this folder is ignored by git.
- Keep this data private and do not expose it in frontend bundles.
