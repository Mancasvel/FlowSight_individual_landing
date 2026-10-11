---
version: 1
slug: "src-app-offer-preview-page-tsx"
primary_target: "src/app/offer-preview/page.tsx"
related_targets: ["src/app/page.tsx", "src/app/offer-preview/preview.module.css", "src/components/solo-demo.tsx", "src/components/product-capabilities.tsx", "src/components/product-examples.tsx", "src/app/layout.tsx", "src/app/opengraph-image.tsx", "public/product/README.md", "route:/", "route:/offer-preview"]
---

# FlowSight Solo landing

Mode: **Persuade**. Scope: the shared landing at `/` and `/offer-preview`; the latter is a noindex preview. Product truth comes from [PRODUCT.md](../../PRODUCT.md), and the implemented visual system is in [DESIGN.md](../../DESIGN.md). The purchase system, organization dashboard and desktop application are outside this design scope.

## Direction

The latest explicit direction uses the white mode, technical grid, navy and teal of [FlowSight](https://flowsight.site/). Keep the visible spelling **FlowSight** everywhere. White appearance is fixed even under a dark OS preference. Seed `cbb42e24` is the corroborated original seed retained in the source contract. This revision is code-led and uses no new seed or approved generated composition.

- **Thesis:** demonstrate private work intelligence through context.
- **World:** cool white technical field, navy Geist typography, accessible teal signals, white contained examples and a pale teal stage for actual app captures.
- **Story:** explore context, inspect the current app, plan a session, review an illustrative week, scan local tools, connect when useful, compare common approaches and assess the offer.
- **First viewport:** a large left-aligned promise and actions beside a labelled interactive context diagram. The diagram follows the copy on narrow screens.

The grid repeats every 56px with navy lines at .042 alpha over the white ground. Its presence is an explicit user decision, including in the face of a generic detector advisory. The content reaches 1120px: twenty grid cells. Primary desktop splits are 504px + 112px + 504px, or nine + two + nine cells. The grid starts at the content's left edge horizontally. Responsive gutters and stacking follow [DESIGN.md](../../DESIGN.md).

The grid and whitespace supply structure without additional divider rules across the header, principles, sections, product tabs, table rows, tools, connections, FAQ, closing or footer. Control outlines, selected-state markers and calendar hour rules remain. The background, controls and captions stay in the white visual system; product imagery keeps the application's own appearance.

The owner removed the introductory “From intention to your next decision” block, the saved-choice story “Turn an insight into a choice”, and the whole standalone privacy section. Preserve that presentation decision. App privacy and private review capabilities still appear where relevant in the remaining product, offer and FAQ copy. The header uses Reports at `#reports`; the footer retains its external Privacy link.

## Narrative and interaction

1. **Promise and context.** “Understand your work.” introduces plan, focus and review. `ContextDemo` compares app activity with local-AI context through Building, Researching and Planning examples. Pressed states, selected dots and a polite live result explain the change. “Interactive example” and “Illustrative data, not a live AI session” remain visible. These durations are separate from the app-capture and weekly-report datasets.
2. **Current app.** `ProductExplorer` defaults to Insights and switches to Today through keyboard-operated tabs. It explains recorded time, work categories, sustained focus, Daily Flow, reporting periods, normal/Pomodoro modes, daily goals, session planning and total focus. The caption reads “FlowSight 6.1.0 · Windows” with “Example activity”.
3. **Planning.** The retained “A plan built around your actual day” explanation follows Describe → Adjust → Confirm. A native `CalendarExample` shows the intention, suggested work and an existing commitment. The fine print keeps local planning, FlowSight's default calendar and connected-calendar eligibility explicit. The figure is labelled “Illustrative calendar · example data”.
4. **Weekly report.** “Your week. With perspective.” pairs reporting copy with a native `WeeklyReportExample`: recorded time, sustained focus, observed-day coverage, five daily bars, two observations and an illustrative next step. The figure is labelled “Illustrative report · example data, not a live analysis”. The surrounding copy identifies report periods, local PDF options and the app's data-coverage/origin labels.
5. **Local tools.** Open articles cover timers and goals, total focus through paired Browser Controls, optional local reminders, Daily Flow and milestones, local reports/PDFs, and local-agent tasks, calendar, drafts and routines. Preserve the relevant conditions in visible copy or the attached native disclosure. All disclosure indicators are Phosphor Plus SVG icons.
6. **Optional connections.** Separate rows explain eligible Google/Microsoft calendars, Jira/Linear/Notion access, external AI through MCP, and private leagues. Eligibility and consent labels stay with each row. Local tracking and reporting do not require a cloud account.
7. **Comparison.** A semantic table uses the heading “Competitors” and the qualifier “Common approaches”. Its statements describe categories of approaches, with an explicit note that features, plans and platform availability vary by tool. It contains no named-competitor claims or direct competitor links.
8. **Offer and closing.** The planned one-time local-edition offer is followed by a separate optional Pro strip, native FAQ disclosures and the closing offer anchor.

On smaller screens, the story becomes one reading sequence. Planning and report stories stack at 800px with copy first; the report example sits on the left only on desktop. The capability inventory reduces from three columns to two, then one. Connection descriptions move beneath titles. Calendar dates, calendar events, report metrics and chart bars are static informational elements. Do not add nonfunctional controls or imply that these figures run a model or write to a calendar.

## Product evidence

Only two shipping PNGs show the unmodified **FlowSight 6.1.0 Windows renderer at commit `1773d97`**. They were captured with deterministic synthetic Tauri fixtures, not a native desktop run or a live AI session. Preserve the embedded origin metadata and visible labels.

| Asset | Current evidence | Visible framing |
| --- | --- | --- |
| [flowsight-summary.png](../../public/product/flowsight-summary.png) | Actual Insights view | App version, Windows and example activity |
| [flowsight-today.png](../../public/product/flowsight-today.png) | Actual Today/Clock view | App version, Windows and example activity |

The captured example day totals 200 minutes: Coding 100, Research 50, Planning 30 and Communication 20. Two 50-minute coding blocks produce 100 minutes of sustained focus, or 50%. The daily goal is four hours. The capture method and reproduction instructions are in [product provenance](../../public/product/README.md).

The calendar and report in [product-examples.tsx](../../src/components/product-examples.tsx) are custom website components. They do not show the app's exact UI, a live AI response or measured customer results. The obsolete planning and saved-choice PNGs were removed.

| Website figure | Illustrative data | Evidence boundary |
| --- | --- | --- |
| Calendar | Tuesday 13 October 2026; proposal 09:00–09:50, ten-minute break, review 10:00–10:30, existing meeting 11:00–11:30 | 80 minutes of suggested work, ready for review; no confirmed calendar write |
| Weekly report | 5–9 October 2026; daily recorded minutes 300, 330, 240, 330, 270 and sustained-focus minutes 120, 150, 60, 180, 90 | 24h 30m recorded, 10h sustained focus, five observed days; separate from the app-capture dataset |

The report's first observation follows the chart: Thursday has three hours of sustained focus across 5h 30m recorded. Its second observation states five hours of research plus four of planning in this example week. The suggestion proposes a 50-minute main-task block and a later review; it does not claim an improvement in work quality.

The capabilities note identifies product views and new features as Windows 6.1.0 and says macOS and Linux follow their own release schedules. It does not establish identical release timing across platforms. Keep claims aligned with [PRODUCT.md](../../PRODUCT.md), including confirmation before proposed changes, connected-calendar eligibility, Browser Controls dependencies and optional sharing. No verified testimonials, customer results or superiority benchmark supports this surface.

## Actions and commercial state

“Explore the app” goes to `#product`. The header action, “€25, once” and closing action go to `#offer`; the legacy `#download` anchor resolves to the same section. These are section anchors.

The local edition is a planned **€25 final one-time payment**, including applicable tax, covering official Windows, macOS and Linux installers, one active computer per operating system and local updates. “Ask about availability” is the current offer action while checkout remains closed. Existing users and historical purchasers retain local updates without paying again. Public source rights remain governed by AGPL-3.0.

The landing uses `isSoloOfferCheckoutConfigured()`, which requires its EUR 25 offer to match the backend catalogue as well as the existing server configuration gate. The current EUR 20 service cannot open the new offer. Root metadata and structured offers follow this same gate. The conditional form preserves the business identity and professional-use fields required by the existing service. Launch requirements remain in [PRODUCT.md](../../PRODUCT.md) and [PURCHASE_RUNBOOK.md](../../PURCHASE_RUNBOOK.md). This visual documentation does not authorize or activate checkout.

Individual Pro remains a separate optional **€12/month** cloud plan with its own pricing link. Keep its strip visually and commercially separate from the one-time local offer.

## Implementation and review record

Implementation authority: [landing](../../src/app/offer-preview/page.tsx), [CSS module](../../src/app/offer-preview/preview.module.css), [context and product explorer](../../src/components/solo-demo.tsx), [capabilities](../../src/components/product-capabilities.tsx), [calendar and report examples](../../src/components/product-examples.tsx), and [layout/font setup](../../src/app/layout.tsx). The shared root route renders the same landing.

Technical review captures and reports are local project evidence rather than shipped assets. Use `scripts/audit-solo.mjs` to reproduce viewport, interaction, accessibility and offer-gating checks. The design review resolved the disclosure-icon consistency finding; backend rollout remains a separate concern.
