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

- Download is the primary conversion path.
- Use real product captures in `public/product`.
- Never fabricate product metrics, customer logos, testimonials, or capabilities.
- Raw screen context is processed locally. Cloud features are optional and paid.
- Keep `prefers-reduced-motion`, keyboard navigation, and system dark mode working.
- Keep all release URLs resolved through `src/lib/releases.server.ts`.
