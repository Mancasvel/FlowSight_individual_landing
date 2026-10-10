# FlowSight Individual landing

Independent product landing page for FlowSight Solo. The official app costs EUR 20 once, including applicable tax, for companies and self-employed professionals. Hosted Stripe Checkout requires business identity and a professional-use declaration.

## Run locally

```bash
corepack pnpm install
corepack pnpm dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test:purchase
corepack pnpm build
corepack pnpm run audit
```

With the local server on port 3020, `corepack pnpm capture` writes desktop, mobile, and dark-mode review images to the ignored `artifacts/` directory.

## Release downloads

The page resolves stable release artifacts at request time from:

- Windows: `Mancasvel/FlowSight.AI`
- macOS: `Mancasvel/FlowSight_Mac`
- Linux: `Mancasvel/FlowSight_linux`

GitHub responses use the Next.js data cache for one hour. Set `GITHUB_TOKEN` in production to increase the API rate limit. Optional release pins are documented in `.env.example`.

## Deployment

Set `NEXT_PUBLIC_SITE_URL` to the final canonical origin. Legal, account, and Teams links intentionally point to the existing FlowSight marketing and app origins, configurable through `.env.example`.

See `PURCHASE_RUNBOOK.md` for the protected purchase service, Stripe webhook, license storage, recovery, and rollout settings. Server credentials remain in Vercel. Update the service deployment URL in the Solo project when publishing purchase-server changes.
