# Supported by update — 2026-10-01

## Scope and source

Align the Solo Supported by section with the six confirmed partners and real assets used by the main FlowSight site: Xiji Incubator, Universidad de Sevilla, Barner Brand, MongoDB, Microsoft, Xiaomi. Main reference: `FlowSight_landing/src/components/redesign/PartnersBar.tsx` and `public/logos`.

The isolated worktree starts at `0123c932afa183d0dc1b6129100bde2fe9baf09f`, confirmed by the Vercel production deployment's `gitSource.sha`. Prior uncommitted Solo checkout work is excluded.

## Implementation

- Add the visible Universidad de Sevilla, MongoDB and Microsoft labels and exact partner names.
- Keep six real logos, with original image pixels. PNG/JPEG files carry source provenance metadata.
- Use the existing fonts and theme tokens, with two mobile columns, three tablet columns and six desktop columns.
- Adapt transparent and opaque logos to system dark mode; honor reduced motion.
- Render an accessible list with `role="list"`; images next to visible labels have empty alt text to avoid repeating names.

## Verification

- `corepack pnpm lint`, `corepack pnpm typecheck`, and production build pass.
- `scripts/verify-supported-by.mjs` verifies the exact six names/order, every loaded logo, contained image boxes, HTTP 200, no page errors and no horizontal overflow at 1440px, 390px and 320px in light/dark modes.
- Impeccable detector returned no findings on the changed component and stylesheet.
- Independent scoped visual review found no material visual defects. Its one accessibility fix, explicit list role for Safari VoiceOver, was applied and scored resolved; final disposition `ship`.
- Local captures and reports are saved in `.impeccable/review/solo-supported-by-*`. Production evidence is saved under `artifacts/supported-by-production/` after rollout.

## Production target

Project: `flowsight-individual`, `prj_fL0paIPYA6kaWCpFl5unWyw2s44Z`.

Public target: <https://solo.flowsight.site>. Deployment result will be recorded after production verification.
