# FlowSight Individual landing

Independent product landing page for FlowSight Solo. The new white/grid landing presents the owner's planned EUR 25 one-time offer, current app captures, a calendar example and a weekly report example. Its checkout remains closed while the existing purchase service uses EUR 20. The existing business purchase, recovery and licensing services are preserved.

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
corepack pnpm test:offer
corepack pnpm build
corepack pnpm run audit
```

With the local server on port 3020, `corepack pnpm capture` writes desktop, mobile, and dark-mode review images to the ignored `artifacts/` directory.

Run `BASE_URL=<local server> corepack pnpm run audit` for the Solo landing checks. The landing shares its implementation with the noindex `/offer-preview` route. `src/lib/solo-offer.ts` keeps the new offer closed even when the previous EUR 20 service is configured. Opening sales at EUR 25 requires the backend catalogue, Stripe price and business purchase flow to agree; the existing server configuration checks still apply.

## Release downloads

The page resolves stable release artifacts at request time from:

- Windows: `Mancasvel/FlowSight.AI`
- macOS: `Mancasvel/FlowSight_Mac`
- Linux: `Mancasvel/FlowSight_linux`

GitHub responses use the Next.js data cache for one hour. Set `GITHUB_TOKEN` in production to increase the API rate limit. Optional release pins are documented in `.env.example`.

## Deployment

Set `NEXT_PUBLIC_SITE_URL` to the final canonical origin. Legal, account, and Teams links intentionally point to the existing FlowSight marketing and app origins, configurable through `.env.example`.

See `PURCHASE_RUNBOOK.md` for the protected purchase service, Stripe webhook, license storage, recovery, and rollout settings. Server credentials remain in Vercel. Update the service deployment URL in the Solo project when publishing purchase-server changes.
