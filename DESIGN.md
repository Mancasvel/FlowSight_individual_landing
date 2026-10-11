---
name: FlowSight Solo
description: Private work intelligence on a white technical grid, with navy typography and teal signals.
colors:
  solo-bg: "#fbfcfb"
  solo-panel: "#f1f5f9"
  solo-card: "#ffffff"
  solo-ink: "#0f172a"
  solo-muted: "#526176"
  solo-line: "#e2e8f0"
  solo-accent: "#00776f"
  solo-brand: "#00b8a9"
  solo-tint: "#ecfeff"
  solo-on-accent: "#ffffff"
  image-surround: "#e9f5f5"
  grid-line: "rgb(15 23 42 / .042)"
  calendar-review: "#e5f5f2"
  example-deep-teal: "#075e58"
  report-other: "#dbe6e9"
  report-suggestion: "#edf8f5"
typography:
  display:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(4rem, 6.7vw, 5.7rem)"
    fontWeight: 550
    lineHeight: 1.015
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(2.5rem, 4.2vw, 3.6rem)"
    fontWeight: 560
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "15px"
    lineHeight: 1.8
  control:
    fontFamily: "Geist, sans-serif"
    fontSize: "13px"
    fontWeight: 550
  example-title:
    fontFamily: "Geist, sans-serif"
    fontSize: "14px"
    fontWeight: 550
    letterSpacing: "-0.02em"
  report-metric:
    fontFamily: "Geist, sans-serif"
    fontSize: "27px"
    fontWeight: 500
    letterSpacing: "-0.035em"
  example-body:
    fontFamily: "Geist, sans-serif"
    fontSize: "12px"
    lineHeight: 1.6
  example-label:
    fontFamily: "Geist, sans-serif"
    fontSize: "10px"
  duration:
    fontFamily: "Geist Mono, monospace"
    fontSize: "9px"
rounded:
  control: "5px"
  event: "6px"
  strip: "7px"
  inset: "8px"
  surface: "12px"
  example: "14px"
  image-surround: "16px"
  chart-top: "4px 4px 0 0"
  dot: "50%"
spacing:
  inset-xs: "4px"
  gap-xs: "8px"
  gap-sm: "12px"
  gap-md: "20px"
  inset-md: "24px"
  inset-lg: "25px"
  inset-xl: "30px"
  grid-cell: "56px"
  column: "112px"
components:
  button-primary:
    backgroundColor: "{colors.solo-ink}"
    textColor: "{colors.solo-bg}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "13px 20px"
  button-primary-hover:
    backgroundColor: "{colors.solo-accent}"
    textColor: "{colors.solo-on-accent}"
  button-offer:
    backgroundColor: "{colors.solo-ink}"
    textColor: "{colors.solo-on-accent}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "13px 20px"
    width: "100%"
  button-offer-hover:
    backgroundColor: "{colors.solo-ink}"
    textColor: "{colors.solo-bg}"
  button-outlined:
    backgroundColor: "{colors.solo-card}"
    textColor: "{colors.solo-ink}"
    rounded: "{rounded.inset}"
    padding: "10px 15px"
  button-outlined-hover:
    backgroundColor: "{colors.solo-tint}"
  card:
    backgroundColor: "{colors.solo-card}"
    textColor: "{colors.solo-ink}"
    rounded: "{rounded.surface}"
  image-surround:
    backgroundColor: "{colors.image-surround}"
    textColor: "{colors.solo-muted}"
    rounded: "{rounded.image-surround}"
  example-card:
    backgroundColor: "{colors.solo-card}"
    textColor: "{colors.solo-ink}"
    rounded: "{rounded.example}"
    padding: "25px"
  calendar-focus:
    backgroundColor: "{colors.solo-accent}"
    textColor: "{colors.solo-on-accent}"
    rounded: "{rounded.event}"
    padding: "9px 13px"
  calendar-review:
    backgroundColor: "{colors.calendar-review}"
    textColor: "{colors.example-deep-teal}"
    rounded: "{rounded.event}"
    padding: "9px 13px"
  calendar-existing:
    backgroundColor: "{colors.solo-panel}"
    textColor: "{colors.solo-muted}"
    rounded: "{rounded.event}"
    padding: "9px 13px"
  report-suggestion:
    backgroundColor: "{colors.report-suggestion}"
    rounded: "{rounded.inset}"
    padding: "14px"
---

# Design System: FlowSight Solo

## Overview

**Creative North Star: "Private work intelligence, made clear"**

FlowSight Solo uses the white, navy and teal identity of the user-pinned FlowSight website. A faint technical grid holds the page together; generous space, direct Geist headlines and clear state changes keep the product explanation readable. White surfaces give the interactive example, calendar and report a quiet place within the grid. Actual app captures retain their own appearance.

This system covers the shared landing at `/` and `/offer-preview`. White appearance is deliberate under either OS theme. The landing CSS module, its demonstration, capability and example components, and the local fonts define the implemented system; unrelated legacy global styles and other application routes do not. Page sequence, offer behaviour and evidence belong in the [surface brief](.impeccable/surfaces/src-app-offer-preview-page-tsx.md). The established north star is retained for this documentation refresh.

**Key Characteristics:**

- Cool white ground with a faint, content-aligned technical grid.
- Navy Geist headlines, accessible teal states and restrained brand teal.
- Open section spacing, with outlines reserved for controls and contained examples.
- Distinct framing for actual app captures and illustrative website components.
- Visible keyboard focus, native interactions and reduced-motion support.

## Colors

The palette uses cool white and slate neutrals, with two distinct teal roles. Frontmatter is normative: the `solo-*` entries match the landing's scoped CSS custom properties; the remaining entries record the image stage, grid and example treatments.

### Primary

- **Accessible teal** (`solo-accent`) marks the highlighted hero word, selected controls, active diagram dots, icons, focus outlines, suggested calendar work and sustained-focus bars.
- **Brand teal** (`solo-brand`) preserves the FlowSight identity colour separately from the darker text accent.
- **Teal tint** (`solo-tint`) supports the comparison column and outlined-action hover.
- **White on accent** (`solo-on-accent`) supplies text on filled actions and the suggested focus block.
- **Calendar review tint** (`calendar-review`) distinguishes a suggested review block from focus work and existing events.
- **Deep example teal** (`example-deep-teal`) carries text on the review block and the report suggestion heading.
- **Report suggestion tint** (`report-suggestion`) groups the report's proposed next step.

### Neutral

- **White ground** (`solo-bg`) carries the grid across the page.
- **White card** (`solo-card`) makes demonstration, calendar, report and offer panels legible above the grid.
- **Slate panel** (`solo-panel`) groups the context result, view switch, existing calendar event and optional-plan note.
- **Navy ink** (`solo-ink`) carries headlines, primary text, filled actions and the selected calendar date.
- **Slate copy** (`solo-muted`) carries supporting explanations and captions.
- **Fine outline** (`solo-line`) defines contained surfaces, control edges and calendar hour rules. It is not a section or table-row separator.
- **Image surround** (`image-surround`) provides a pale teal stage for product evidence.
- **Other recorded time** (`report-other`) is the neutral portion of each report bar, paired with teal sustained focus.
- **Grid line** (`grid-line`) gives the canvas its quiet technical structure.

**The White Ground Rule.** Keep the landing white under either OS theme. The technical grid is part of the confirmed identity.

**The Signal Rule.** Use accessible teal for text, focus and selected states. Brand teal supports the identity; it does not replace the darker text accent. Product captures retain the application's original colours.

## Typography

**Display and body:** Geist, with a sans-serif fallback. **Compact durations and chart scale:** Geist Mono, with a monospace fallback. Both families are local variable WOFF2 files, loaded through `next/font/local` with weights 100–900 and `display: swap`.

The hierarchy is a substantial medium-weight headline over compact, generously led supporting text. The planning and weekly-report headings use the same headline role as the other large sections. There is no separate feature-headline scale in the current implementation.

- **Display:** the main promise; use the frontmatter display role. At widths up to 1100px it becomes 70px, up to 800px `clamp(60px, 10vw, 78px)`, and up to 600px `clamp(54px, 14.6vw, 76px)`.
- **Headline:** section headings, including planning and reports. Responsive values are 37px up to 800px and 39px up to 600px. Tools and FAQ use their own smaller heading sizes.
- **Body:** section introductions use the frontmatter body role. Feature explanations use 14px with 1.9 leading, becoming 13px on mobile. Detailed explanations use 12–14px with 1.8–1.9 leading. Most split-column explanations stay within roughly 35–48 characters.
- **Controls:** main actions use the control role. Navigation, tabs and disclosures use component-specific sizes.
- **Example title and metrics:** calendar/report headers use the example-title role, becoming 12px on mobile. Report totals use the report-metric role, becoming 23px on mobile, with tabular numerals. Calendar dates use 20px at weight 500.
- **Example body and labels:** intentions and report insights use the example-body role. Insight headings use weight 550; supporting lines use 11px. Metadata and day labels use the example-label role. Calendar event titles use 13px at weight 550; times and example captions use 9px. Calendar hour labels use 10px Geist Mono; the chart scale and context durations use the duration role.

**The Brand Rule.** Spell the visible name FlowSight, with this exact capitalization, including examples and captions.

## Layout

The centred content width is `min(1120px, calc(100vw - 112px))`. At its maximum this spans twenty grid cells. Primary desktop pairs use two equal 504px columns with a 112px gap: nine cells, two cells, nine cells. The hero, app, feature stories, section introductions and offer share this split. The background uses two perpendicular one-pixel lines on a 56px square repeat. Its horizontal origin tracks the content's left edge through `calc((100vw - var(--solo-width)) / 2)`; the vertical origin is the page top.

At 1100px the content width becomes `calc(100vw - 64px)`, with 32px gutters and narrower component-specific gaps. At 600px it becomes `calc(100vw - 40px)`, with 20px gutters. Hero, planning and report stories stack at 800px; the app and offer stack at 600px. The report places its example left and copy right on desktop, then restores copy-first DOM order when stacked. Calendar and report figures are capped at 504px when stacked.

Capabilities use three columns with a one-cell gap, then two columns at 800px and one at 600px. Optional connections pair icon, title/eligibility and description; at 800px the description moves beneath the title. Section introductions and FAQ also stack at 800px. The semantic comparison remains three columns with tighter mobile cell padding.

The app section uses 112px vertical padding; planning, reports, tools and connections use 95px. Those feature sections reduce to 65px at 800px and 58px at 600px. Other major sections use their observed 92–97px desktop padding and roughly 60–70px on mobile. Do not imply every vertical space is a grid multiple. Calendar and report use 25px insets, reducing to 20px on mobile; context and offer panels retain their own responsive insets.

**The Open Section Rule.** Let the grid and whitespace separate sections and rows. Do not reintroduce divider rules across the header, principles, sections, product tabs, comparison rows, tools, connections, FAQ, closing or footer. Preserve control outlines, selected-state markers and calendar hour rules.

## Elevation & Depth

The technical field is flat. Opaque white cards and pale tonal surfaces provide most separation. Only the complete Today/Insights app window receives the ambient product shadow (`0 16px 45px rgb(22 44 31 / .10)`). The native calendar and report remain flat, with fine container outlines and tonal events or data marks. Their content has no hover lift. The sidecar records the shadow and canvas geometry.

**The Product Depth Rule.** Use the ambient shadow for the full app window. Organise the surrounding interface through spacing, contained outlines and tonal surfaces.

## Shapes

The form language is gently squared. Primary actions use the control radius; the outlined header action, selected calendar date and report suggestion use the inset radius. Context and price panels use the surface radius. Calendar and report figures use the example radius; the product surround is rounder. App-window clipping and calendar events use the event radius. Report bars round only their top corners and clip the teal portion inside the total bar. The comparison column and optional-plan strip use the strip radius. Circular dots belong to the context diagram. Outlines are thin and local to a container or control.

## Components

**Actions.** Primary actions start navy with white-ground text, turn accessible teal on hover, and move down 1px when pressed. The full-width offer action remains navy on hover; its current availability label is part of the prelaunch state. The outlined header action uses a white fill and fine rule, then a teal tint and accent border on hover. Text actions pair a clear label with an inline SVG arrow. Main actions are at least 51px high on desktop; the primary action becomes 49px on mobile. Header and text actions are at least 44px high. Focus is a teal outline (2px, offset 5px); colour transitions take 160ms.

**Navigation.** A normal-flow header places the FlowSight icon, exact wordmark and Solo qualifier opposite compact anchor links, including Reports. The header action disappears at 800px. At 600px only “Why FlowSight” remains beside the brand. The footer wraps its text links. There is no mobile menu overlay.

**Context example.** A white bordered card contains two pressed-state view controls, three selectable work blocks, a dot diagram and a polite live result. The selected view uses navy fill; selected work blocks and active dots use accessible teal. The result sits on a slate panel. Keep the visible illustrative-data label with this component.

**Product explorer.** A vertical tab list switches explanatory text and actual Today/Insights captures. Selected tabs use accessible teal and a trailing SVG arrow, with no row rules. Arrow keys, Home and End move through tabs; the associated labelled panel is keyboard focusable. The pale image surround carries the actual app version, Windows attribution and example-activity caption.

**Calendar example.** A static figure shows five weekday dates and a selected day, an example intention and an hourly timeline. The timeline maps a minute to 2px, uses 120px hour intervals within 376px, and leaves a 50px time gutter before events. Event height is duration × 2px minus 4px, with a 1px top offset. Teal suggested focus, pale-teal review and slate existing events remain distinct. The summary and illustrative caption sit below. Dates and events are informational elements, with no simulated controls or write actions.

**Weekly report example.** A static figure begins with three metrics in a 1.2:1:0.9 grid, then five daily bars and a legend. The chart is 195px high; bar tracks are 145px high and at most 44px wide. Total time uses the neutral bar and sustained focus fills its lower portion. Desktop column gaps are 20px, reducing to 14px on mobile. Text supplies values and a complete chart description. Two observations and a pale-green suggestion follow, with 22px between insight rows and a 30px lead-in. Preserve the illustrative caption and the distinction between recorded time and sustained focus.

**Capability and connection rows.** Local tools are open articles with accent icons and no top rules. Relevant details use native disclosures. Connection rows keep eligibility text next to the name and preserve a clear link between the condition and feature.

**Offer and comparison.** The price sits in a white outlined panel. The optional cloud plan is a separate slate strip. The comparison highlights FlowSight's column with a quiet teal tint; headers and row relationships remain semantic without horizontal row rules.

**Disclosures.** Native FAQ rows have a visible question and generously led answer text. Phosphor Plus SVG icons appear in FAQ and tool disclosures and rotate 45 degrees when open; FAQ rotation transitions over 160ms. Preserve native keyboard behaviour and visible focus. This landing has no text-input or chip primitive to standardise.

Hero copy arrives with a small vertical movement (14px over 650ms); the context card uses 850ms. Selected dots resolve over 380ms with a small stagger. Colour and selected-tab cues are brief and state-driven. The calendar and report are static; no continuous animation runs. Reduced motion disables animations and transitions and restores immediate anchor scrolling; exact motion values are in the sidecar.

## Do's and Don'ts

### Do:

- Do keep the exact visible spelling FlowSight in page copy, captions, metadata and component specimens.
- Do retain the white appearance and content-aligned technical grid under either OS theme.
- Do use accessible teal for meaningful states and preserve visible keyboard focus.
- Do distinguish authentic app captures from illustrative website calendars and reports.
- Do preserve native semantics, responsive reading order and reduced-motion support.
- Do retain local control outlines, selected-state markers and calendar hour rules.

### Don't:

- Don't introduce an automatic dark palette into this landing.
- Don't replace the requested grid with a plain field or another decorative texture.
- Don't add divider rules to the open page sections and rows.
- Don't recolour or reconstruct the actual product UI to match the landing palette.
- Don't imply an illustrative interaction, calendar, report or fixture-backed capture is a live AI session or a measured customer result.
- Don't make the static calendar dates, events or report marks look actionable.
- Don't use compact example annotations or screenshot captions as the default size for explanatory copy.
