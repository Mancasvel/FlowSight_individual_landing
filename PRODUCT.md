# FlowSight Individual product record

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Individual knowledge workers, freelancers, and developers who want to understand their own focus and work patterns without an employer-facing surveillance tool. This audience is described in the existing landing and application metadata; its priority within the group has not been confirmed by the owner.

## Product Purpose

FlowSight is a desktop application that turns local activity and screen context into a personal view of focus, work categories, and daily progress. The user should be able to review their own work without sending raw screen context to a cloud service.

## Positioning

The bundled local AI processes sensitive context on the user's machine. The product favors meaningful work units and private summaries over keystroke counting or team surveillance.

## Operating Context

The desktop agent runs while the user works. Its Today and Insights views show a daily goal, focus time, categories, and highlights. The public website explains the product and presents the planned €25 one-time official installer offer; the authenticated dashboard sells optional cloud capabilities separately.

## Capabilities and Constraints

- The desktop source is public under AGPL-3.0. Anyone may use, modify, build, and redistribute it subject to that license; charging for an official distribution must not be described as closing the source.
- The current website shows a prelaunch one-time offer and no direct installer CTA. Previously published GitHub release installers remain accessible during migration. The existing dashboard checkout sells Individual Pro at €12/month and is a subscription flow, separate from the local-edition purchase.
- Local mode does not require an account or cloud connection. Optional cloud functionality has separate licensing and infrastructure.
- The owner confirmed a planned €25 one-time offer for the landing. Its local capabilities do not change, and no account is required for local use. Individual Pro (€12/month) and all other monthly plans remain unchanged. This does not include the optional cloud services.
- The owner confirmed that the payment should be required for official installers while the AGPL source remains public and buildable. Existing public releases remain accessible during migration; the source and copies made under the AGPL cannot be made exclusive.
- Existing users and historical €10 purchasers keep local updates without paying again. The updater migration is not implemented; the current app cannot prove when a public installer was first used.
- The owner confirmed that one €25 final payment, including applicable tax, covers the official Windows, macOS, and Linux installers and local updates. Each purchase issues separate local-edition license codes with one activation slot for each operating system (not one slot per installer variant). This is distinct from Individual Pro cloud licensing. The checkout must not open until activation, delivery, updater migration, legacy access, and recovery have been proven on all three platforms.
- Existing site guidance requires real product captures, accessibility, keyboard navigation, reduced-motion support, and release URLs resolved through `src/lib/releases.server.ts`. The owner's latest direction explicitly fixes the Solo landing in white mode, including under a dark OS preference.

The new landing uses `isSoloOfferCheckoutConfigured()` in `src/lib/solo-offer.ts`. It stays closed while the existing purchase catalogue is EUR 20, even when that previous service is configured. The EUR 20 business purchase, recovery, proxy and licensing implementation is preserved; this design push does not migrate Stripe or activate the EUR 25 offer.

## Brand Commitments

Spell the brand **FlowSight**, with this exact capitalization in every visible occurrence. The owner explicitly requested white mode, the technical background grid and navy/teal visual identity of https://flowsight.site/. This overrides the earlier system-dark guidance for the Solo landing. The comparison uses "Competitors" and describes common approaches with an explicit note that features vary by product. Do not name a competitor in that section or make universal unsupported limitations.

## Current application coverage (6.1.0)

Source of truth: the Windows application worktree at `C:/Users/manue/codex_sessions/flowsight_total_focus_fix_20261007/worktree`, commit `1773d97`. The Desktop FlowSight.AI checkout is stale at 4.1.7 and must not supply current captures. macOS and Linux have independent release schedules; do not imply feature parity has been verified.

- Local session proposals use intention, availability, tasks, saved preferences and recorded task time. Review, revise and confirm before calendar writes. Current `local_agent/session_plan.rs` includes eligible connected calendar destinations; FlowSight's local calendar remains the default. Some README/PRODUCT statements in the app repository predate this implementation.
- Normal and Pomodoro timers, manual task context, daily goals and recorded-time controls.
- Total focus with selected site patterns, exceptions and duration through paired Browser Controls; linked clock pause/resume/end. Windows notification banner silence is optional. No cloud plan or running model is needed for website protection.
- Optional local focus reminders, separate contextual names setting, Daily Flow streaks and milestones.
- Today/7-day/30-day local work reports, observed attention detours, PDF export and optional scheduled seven-day PDFs while the app runs. Reports identify AI/rules origin and data coverage.
- Private work-review choices, review dates, outcomes and deletion. Local retention applies; choices are excluded from PDF, MCP and sync, and included in explicit personal export.
- Local agent tasks, calendar blocks, preferences, drafts, PR descriptions and routines. Proposed changes require confirmation; message sending and project publishing are disabled.
- Optional MCP shares requested reports with an external AI client, with descriptions/tickets excluded by default.
- Paid eligible calendar connections and separate recap consent; Jira/Linear/Notion require their integration permissions. Leagues use their own sign-in and consent and share limited focus points, not work details. Individual Pro remains separate at €12/month.

Two current renderer captures (Today and Insights) use labelled, coherent example data. The owner requested native website examples for the session calendar and weekly report, explicitly labelled illustrative. The old planning and saved-choice captures are no longer used. Native Tauri and live AI execution were not exercised to create these website assets.

## Evidence on Hand

- Real app captures: `public/product/flowsight-today.png` and `public/product/flowsight-summary.png`.
- Product source and AGPL license: `../FlowSight.AI/README.md` and `../FlowSight.AI/LICENSE`.
- Current commercial plan definitions and Stripe subscription checkout: `../FlowSight_dashboard/src/lib/plans.ts` and `../FlowSight_dashboard/src/app/api/checkout/route.ts`.
- No verified customer testimonials, conversion benchmarks, or results are available for this offer.

## Product Principles

1. Demonstrate the real product before asking for money.
2. Distinguish an official paid offering from rights the AGPL already grants.
3. Explain local privacy precisely; do not imply cloud processing is required.
4. Keep the purchase path and its terms unambiguous when enabled.
5. Do not present the one-time purchase as a subscription or change existing monthly offers.

## Accessibility & Inclusion

The public site must remain navigable by keyboard, readable at mobile widths, and usable with reduced motion. The Solo landing retains its white appearance under either OS theme, as requested by the owner.

## Solo presentation direction

The latest revision removes the introductory "From intention to your next decision" block, the saved-choice story "Turn an insight into a choice", and the standalone "Your work. Your device" section. These are presentation decisions, not removal of app capabilities. Keep the planning explanation, illustrate it with a calendar, and show a simple weekly report with supported insights and clearly labelled example values. Use the background grid for page structure without extra section divider rules.
