---
# gstack: design-md-format=spec
name: The Public Record
description: Plain, exact and verifiable; ink on paper, every claim footnoted, proof as the only ornament.
colors:
  surface: "#F5F6F3"
  surface-raised: "#FFFFFF"
  text: "#15171A"
  text-muted: "#545A60"
  rule: "#C9CCC6"
  primary: "#A8345A"
  on-primary: "#FFFFFF"
  primary-tint: "#F6E3E9"
  verified: "#1D7346"
  verified-tint: "#E2F0E7"
  error: "#B42318"
  grade-blue: "#1F4FA8"
  dark-surface: "#0F1113"
  dark-surface-raised: "#171A1D"
  dark-text: "#EDEDEA"
  dark-text-muted: "#A3A8AD"
  dark-rule: "#3A3F44"
  dark-primary: "#E58FA8"
  dark-on-primary: "#0F1113"
  dark-primary-tint: "#3A1F28"
  dark-verified: "#5BD08A"
  dark-verified-tint: "#15301F"
  dark-error: "#FF8A7A"
  dark-grade-blue: "#8FB3FF"
typography:
  hero:
    fontFamily: Public Sans
    fontWeight: 800
    fontSize: clamp(2.75rem, 6vw, 4.5rem)
    lineHeight: 1
    letterSpacing: -0.03em
  title:
    fontFamily: Public Sans
    fontWeight: 800
    fontSize: 2.75rem
    lineHeight: 1.1
    letterSpacing: -0.02em
  section:
    fontFamily: Public Sans
    fontWeight: 700
    fontSize: 1.75rem
    lineHeight: 1.25
    letterSpacing: -0.01em
  lead:
    fontFamily: Source Sans 3
    fontWeight: 400
    fontSize: 1.25rem
    lineHeight: 1.5
  body:
    fontFamily: Source Sans 3
    fontWeight: 400
    fontSize: 1.0625rem
    lineHeight: 1.6
  caption:
    fontFamily: Source Sans 3
    fontWeight: 400
    fontSize: 0.875rem
    lineHeight: 1.45
  label:
    fontFamily: Source Sans 3
    fontWeight: 600
    fontSize: 0.875rem
    lineHeight: 1.45
  mono:
    fontFamily: JetBrains Mono
    fontWeight: 400
    fontSize: 0.875rem
    lineHeight: 1.6
    fontFeature: tnum
rounded:
  sm: 4px
  md: 6px
  lg: 8px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 72px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    height: 44px
    padding: 0 20px
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "color-mix(in srgb, {colors.primary} 85%, {colors.text})"
  button-secondary:
    backgroundColor: transparent
    textColor: "{colors.text}"
    borderColor: "{colors.rule}"
    rounded: "{rounded.md}"
    height: 44px
  button-secondary-hover:
    borderColor: "{colors.primary}"
    textColor: "{colors.primary}"
  receipt-button:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    borderColor: "{colors.rule}"
    borderStyle: dashed
    rounded: "{rounded.sm}"
    height: 44px
    typography: "{typography.mono}"
  receipt-button-open:
    borderColor: "{colors.primary}"
    borderStyle: solid
  receipt-slip:
    backgroundColor: "{colors.surface-raised}"
    borderColor: "{colors.rule}"
    rounded: "{rounded.sm}"
    padding: 16px 20px 20px
    typography: "{typography.mono}"
  verified-stamp:
    backgroundColor: "{colors.verified-tint}"
    textColor: "{colors.verified}"
    borderColor: "{colors.verified}"
    rounded: "{rounded.sm}"
    typography: "{typography.mono}"
  artifact:
    backgroundColor: "{colors.surface-raised}"
    borderColor: "{colors.rule}"
    rounded: "{rounded.lg}"
    padding: 24px
  nav-link:
    textColor: "{colors.text-muted}"
    height: 44px
    typography: "{typography.label}"
  nav-link-hover:
    textColor: "{colors.primary}"
---

# The Public Record

## Overview

**Creative North Star:** The site reads like a well-made public record: plain, exact and checkable, because the one thing a visitor should remember is "everything she says, she can prove."

**Product context:** nicolerodriguez.dev, the portfolio of Nicole Rodriguez, a NYC full-stack product engineer with product-design and accessibility strengths. Readers are recruiters and hiring managers deciding in 5 to 30 seconds, often on a phone, and engineers who go deep on a case study. The signature idea is Receipts: every factual claim opens its evidence.

**Mode per surface:**
- Homepage hero: Persuade. Name, role, one real product artifact, three claims with receipts, two actions.
- Work rows and /projects: Experience. The product screenshots carry the page.
- Case studies and writing: Read. One column of 65 to 75 characters, a brief first, the full report on demand.
- Receipts: Operate. Small, exact, data-dense slips.

**Reference sites:** none; built from first principles and the brief, without competitive research.

**Key characteristics:**
- Ink on cool paper, high contrast, no atmosphere effects.
- Civic typography: Public Sans and Source Sans 3, the U.S. Web Design System faces.
- Monospace appears only where something is data.
- Green appears only when something was verified.
- One real product artifact in the first screen instead of decoration.

## Colors

**Strategy:** Restrained. Paper and ink neutrals, one action color, one status color. Color is rare, so it always means something.

**Light or dark:** Light by default. The main reading scene is a hiring manager on a laptop during work hours in a bright office, or a phone in daylight, and receipts read as paper slips on a light surface. Dark tokens apply when the visitor's system asks for dark (`prefers-color-scheme: dark`); there is no in-page toggle on the live site.

- `primary` (rose) marks everything you can act on: buttons, links, receipt buttons, focus rings and the brand. It is the existing brand rose deepened so it passes as text on the light surface.
- `verified` (green) marks only a checked receipt, a "Live" status or a passing check. It is never a button or decoration.
- `text-muted` is a solid color, never text at reduced opacity.
- `grade-blue` exists only to render NYC's official letter-grade mark inside the Sano artifact.
- `rule` is decorative (borders, dividers) and never carries meaning on its own.
- Dark surfaces keep the same hierarchy by lightening the raised surface and softening the accents, not by inverting.

Every text color passes WCAG AA against `surface` and `surface-raised` in both themes; `verify:design` enforces it on every route.

## Typography

The display and body faces come from the world of public information: Public Sans and Source Sans 3 are the U.S. Web Design System typefaces, built so that everyone can read government data. That is the register of this work: civic data, accessibility, verification. JetBrains Mono is the voice of evidence and appears only on receipts, numbers, file names and code.

- Display roles (hero, title, section): Public Sans, upright, 700 to 800, tight tracking. No italic display.
- Reading roles (lead, body, caption, label): Source Sans 3. Body is 17px at 1.6 line height.
- Data role: JetBrains Mono with tabular figures.
- Six sizes only: 14, 17, 20, 28, 44, 72px. Nothing readable is smaller than 14px. Display stays under 6rem.
- No uppercase letterspaced labels. A heading carries its own weight; no kicker above it.
- Loading: one Google Fonts request with `display=swap` for Public Sans 400/600/700/800, Source Sans 3 400/600/400-italic and JetBrains Mono 400/500, preconnected. All three are OFL licensed.

## Layout

- 12-column grid, 24px gutters, max width 1200px, 24px side padding (16px under 390px).
- Homepage hero is the one asymmetric composition: copy in columns 1 to 6, the Sano artifact in columns 8 to 12. On phones the copy, three proof rows and both buttons sit in the first 844px; the artifact follows.
- Case studies: a brief in columns 1 to 7 with a facts list in columns 9 to 12, then three decisions in equal columns, then the full report as one reading column of 65 to 75 characters with an anchor table of contents.
- Rhythm: 72px between sections, 24 to 32px inside them, 8px base unit. More space above a heading than below it.
- Rows and rules organize content; boxes are reserved for the artifact and receipt slips.

## Elevation & Depth

Flat by default. Two raised things only: the product artifact and an open receipt slip. Each uses an offset shadow (`0 1px 2px` plus `0 8px 24px -12px`, ink at low alpha) and a 1px `rule` border. No zero-offset colored halos, no glows, no frosted glass except the nav bar's light backdrop blur over scrolling content.

## Shapes

- `sm` 4px: receipt buttons, receipt slips, verified stamps.
- `md` 6px: buttons.
- `lg` 8px: the product artifact.
- No pill shapes. Nested elements use the outer radius minus the gap.

## Components

- **Primary button:** rose fill, white text (dark: rose fill, near-black text), 44px tall. Hover mixes 15% ink into the rose. Focus-visible: 2px rose outline, 3px offset. Label names the outcome ("See the work", "Open live site").
- **Secondary button:** transparent with a `rule` border; hover turns border and text rose.
- **Receipt button:** mono label "Receipt", dashed `rule` border, rose text, 44px target. `aria-expanded` and `aria-controls`; when open the border turns solid rose. Always next to the claim it proves.
- **Receipt slip:** opens inline under its claim for short evidence (a test result, a count, a query); tables, screenshots and runnable demos open in a labelled side sheet on desktop and a bottom sheet on phones. Mono rows of label and value, dashed separators, a verified stamp and the verification date at the bottom. A failed or stale receipt shows its state plainly and drops the site-wide counter.
- **Verified stamp:** green text on green tint with a 1px green border and a check mark. Only on receipts that passed.
- **Receipt counter:** one caption line in the hero, "N of N claims on this site have a receipt", with the count in mono green. Generated at build time.
- **Product artifact:** raised surface, `lg` radius, real product content only (the Sano profile with the official grade first).
- **Nav:** name as the mark, Work, Resume, Contact always visible; About from 640px. 44px targets.
- **Links:** rose, 1px underline offset 0.2em; visited links mix toward ink so they stay distinguishable.
- **States:** every component specifies hover, focus-visible, active and disabled; loading uses page-shaped skeletons; images reserve their size and fail to a captioned box.

## Do's and Don'ts

- Do put a receipt next to every factual claim, or remove the claim.
- Do use mono only for data, and green only for verified status.
- Do keep the official source first whenever showing derived data.
- Do keep every readable text at 14px or larger and above WCAG AA contrast.
- Do show real product screens and real numbers; never placeholders.
- Don't use gradient text, glows, starfields, radial halos or decorative blobs.
- Don't use italic display type, uppercase letterspaced labels or kickers above headings.
- Don't use equal card grids for content of unequal weight, or nest cards.
- Don't use emoji as design elements.
- Don't animate anything except the one authored moment and quick state feedback.

## Motion

- **Approach:** minimal-functional.
- **Easing:** enter ease-out `cubic-bezier(0.16, 1, 0.3, 1)`, exit ease-out, move ease-in-out.
- **Duration:** micro 100ms, short 150ms (hover, focus, receipt open), medium 300ms, long 600ms (the authored moment only).
- **The one authored moment:** the Sano exhibit traces one NYC inspection record from its source row, through Nicole's interpretation, into the live interface, once, on first view. Everything is readable before and without it, and it is skipped under `prefers-reduced-motion`.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-11-21 | Initial design system created: "The Public Record" | Created by /design-consultation from the product context, the Receipts signature idea and the memorable thing "Everything she says, she can prove"; design knowledge only, no competitive research; HTML preview approved. |
| 2026-11-21 | Light by default, dark on system request | Use scene: hiring managers on bright laptops and phones in daylight; receipts read as paper. |
| 2026-11-21 | Public Sans + Source Sans 3 + JetBrains Mono replace Cormorant Garamond + Inter + DM Mono | Civic, accessibility-first typefaces match the work; the previous faces sat in the overused and italic-serif defaults. |
| 2026-11-21 | Rose deepened to #A8345A for light surfaces | Keeps the brand hue while passing WCAG AA as link text (5.9:1). |
