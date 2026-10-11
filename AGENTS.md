# FlowSight Individual landing guide

## Commands

```bash
corepack pnpm dev
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm build
corepack pnpm run audit
```

Use pnpm only. The app uses Next.js App Router, Tailwind CSS v4, Motion, and Phosphor icons.

## Product rules

- The owner confirmed the new landing's planned EUR 25 one-time offer. Keep its checkout closed while the purchase service still uses the previous EUR 20 price. The existing service is for companies and self-employed professionals in any country; preserve its buyer fields, delivery and license handling. Never claim this buyer policy exempts the seller from IRPF.
- Verify the actual Stripe price, buyer fields, delivery and license storage before enabling checkout. Existing releases and updates remain available to existing users.
- Use real product captures in `public/product`.
- Never fabricate product metrics, customer logos, testimonials, or capabilities.
- Raw screen context is processed locally. Cloud features are optional and paid.
- Keep `prefers-reduced-motion` and keyboard navigation working. The Solo landing uses the owner's explicitly requested white appearance in either OS theme.
- Keep all release URLs resolved through `src/lib/releases.server.ts`.
