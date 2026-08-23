# FlowSight Individual landing

Independent product landing page for the individual edition of FlowSight. It keeps the visual language of the Teams site while making the desktop download the primary journey.

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
