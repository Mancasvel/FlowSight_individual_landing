# Product capture provenance

`flowsight-complete-guide.jpg` is the FlowSight guide's locally rebuilt 1920x1080 thumbnail. It uses the original FlowSight 6.1.0 Insights renderer capture with fictional demonstration records, Manrope typography and the guide's teal/off-white/gold palette. The language/duration badge was removed at the owner's request. The source is `growth/video/build-thumbnail.py` in the existing E: project; the current 90-second video has locally synthesized neural English narration, original chill music and embedded captions. It is not a live native/cloud/model recording.

These two images capture the unmodified **FlowSight 6.1.0 Windows renderer**
at commit `1773d97`, from
`C:/Users/manue/codex_sessions/flowsight_total_focus_fix_20261007/worktree/apps/agent/src/renderer`.

- `flowsight-today.png`: actual Clock/Today view.
- `flowsight-summary.png`: actual Insights view.

The Playwright capture uses a synthetic Tauri bridge with deterministic example
data. It is evidence of the actual current renderer, not a native desktop run or
a live model session. No user activity, account or private record is used.
Cloud entitlements, sync and cloud AI are off. Product captions identify examples.

The fixed local date is 9 October 2026, 13:25 Europe/Madrid. Recorded time is
200 minutes: Coding 100, Research 50, Planning 30 and Communication 20.
The entries and category totals both sum to 12,000 seconds. Two 50-minute
coding blocks yield 100 minutes / 50% sustained focus. The daily goal is four
hours. No fabricated ticket identifiers are mixed with category totals.

Reproduce from the project folder using `renderer-server.mjs` and
`capture-current.mjs`. They read the application source in place and create
assets and temporary Vite cache under this E: project. The capture log is
`../review/capture-current.json` relative to the repository root.

The site statically imports PNGs to emit content-hashed URLs, preventing a
previously optimized screenshot from surviving an asset update. Origin metadata
is embedded in each shipping PNG. The old 4.1.7/August captures are superseded.

## Website examples

The calendar and weekly report are native website components in
`src/components/product-examples.tsx`, requested in place of additional app
captures. They are labelled illustrations with deterministic example data.
They do not represent a live AI response, customer results or the app's exact UI.

The calendar illustrates Tuesday, 13 October 2026: proposal work 09:00–09:50,
a ten-minute break, review 10:00–10:30 and an existing 11:00–11:30 meeting.
The suggested work totals 80 minutes and remains a proposal for review.

The report illustrates 5–9 October 2026. Recorded daily minutes are
300, 330, 240, 330 and 270: 1,470 minutes / 24h 30m in total.
Sustained-focus minutes are 120, 150, 60, 180 and 90: 600 minutes / 10h.
Thursday has the most sustained focus at three hours. Five hours of research
and four of planning account for nine recorded hours. The recommendation is
an illustrative next step, not an assertion of improved work quality.
This weekly example is separate from the single-day renderer capture dataset.
