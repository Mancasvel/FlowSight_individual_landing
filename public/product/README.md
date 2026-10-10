# Product capture provenance

`flowsight-today.png` and `flowsight-summary.png` are real FlowSight desktop
renderer screenshots, captured from `FlowSight.AI/apps/agent/src/renderer/index.html`
by `scripts/capture-real-product.mjs` in the sibling `FlowSight_landing`
repository and copied here.
They contain deterministic example activity, not a user's data. The capture
uses local-only entitlements: sync, cloud AI, and integrations are disabled.
Its clock is fixed to 23 August 2026 so Today and Insights are consistent.

The site statically imports these PNGs so Next.js emits content-hashed image URLs;
this avoids an older optimized image being served after a capture is replaced.
The current app labels the second screen “Insights.” To regenerate, start the agent renderer described
in `FlowSight_landing/public/product/README.md`, run the capture script in
the main landing repository, inspect both images, and copy them to this folder.
