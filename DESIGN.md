---
name: Midnight Rose
description: A calm intro, then the spectacle. Deep-space visuals with clean structure; every claim on the page has a receipt.
colors:
  surface: "#0d0d0d"
  surface-raised: "#141414"
  text: "#f5f0e8"
  text-secondary: "#b8b0a8"
  text-muted: "#9c9690"
  rule: "rgba(255, 255, 255, 0.08)"
  action: "#d4849a"
  action-light: "#e8a8b8"
  verified: "#4ade80"
  paper: "#f5f0e8"
  ink: "#1a1714"
  star-sano: "#4ade80"
  star-code4kidz: "#ffb86b"
  star-tripcanvas: "#7cc7ff"
  star-ruvia: "#c3a0e1"
  star-elite-global: "#d4849a"
  star-van-alen: "#f5c97a"
  star-jt: "#7ee0d0"
  nebula-rose: "#d4849a"
  nebula-lilac: "#5b3f9e"
  nebula-teal: "#2fae7a"
  galaxy-outer: "#7b6cff"
typography:
  display:
    fontFamily: Cormorant Garamond
    fontWeight: 400
  body:
    fontFamily: Inter
    fontWeight: 400
    fontSize: 1.0625rem
    lineHeight: 1.6
  data:
    fontFamily: DM Mono
    fontWeight: 400
  scale: [0.875rem, 1.0625rem, 1.25rem, 1.75rem, 2.75rem, 4.5rem]
---

# Midnight Rose

The design system for nicolerodriguez.dev. Source of truth for color, type, motion and layout rules. Tokens live in `src/index.css`; 3D and canvas code reads them through `src/lib/themeColors.ts`. No other file may contain a color literal.

## Direction

Deep space at night, with cleanliness in the midst of the chaos. The page opens on a soft, centered intro over a drifting starfield. The spectacle comes after it: a three.js galaxy where every star is a project. Everything else (case studies, Stack, Experience, About, Contact) stays quiet and readable so the visuals have room.

Audience: recruiters and hiring managers scanning for 5 to 30 seconds, often on a phone, and engineers who go deep on a case study. Dark by design: this is a night-sky identity, not a theme toggle.

## Color

- `surface` near-black is the sky; `surface-raised` is for panels and cards that are interactions (project panel, receipt, hobby deck).
- `action` rose marks everything you can act on: buttons, links, focus rings.
- `verified` green marks only checked evidence and "Live" status. Never a button fill.
- Star colors identify a project everywhere it appears (map, panel, More-work dot). One color per project.
- Receipts are `paper` slips with `ink` text: the one light surface on the page.
- No gradient text. Glow is allowed only on stars and on the selected star.

## Typography

- Display (`Cormorant Garamond`): names, section mood lines, project titles. Italic only for mood lines and taglines.
- Body (`Inter`): everything people read. 17px, line height 1.6.
- Data (`DM Mono`): numbers, statuses, receipts, code. Not for decoration.
- Six sizes only: 14, 17, 20, 28, 44, 72px. Nothing readable under 14px (CI enforces it).
- Every section has a plain label (Projects, Case studies, Stack, Experience, About, Contact) and at most one mood line in display type.

## Motion

- One dominant moving element per viewport. Allowed: intro starfield, galaxy and fly-in (user-triggered), Engine Room skill marquee, globe spin, hobby deck, closing signature marquee, the "Case studies" letter reveal.
- Not allowed: shimmer sweeps, rotating washes, bobbing icons, parallax screenshots, typewriter text.
- Reduced motion or "Pause motion" (toggle in the nav and footer) stops all autonomous motion, camera tilt on scroll, springs and smooth scrolling; marquees become wrapping lists; 3D draws one still frame.
- Everything is readable before and without motion.

## Calm reading zones

Text never sits on busy imagery. The intro thins stars to about 20% inside a soft oval behind the text, and shooting stars stay outside it. The map's left column sits on a dark scrim. Any text over a canvas passes 4.5:1 even against a white star behind it; `verify:design` checks rendered pixels.

## Layout

- Intro: centered, `min-height: 100svh`.
- Projects: full-bleed galaxy behind a 500px left column on desktop; label block then a 68svh map on phones. Selecting a star frames it in the open space beside its panel (desktop) or above the sheet (phone).
- Case studies: three deep dives (screenshot, one outcome line, at most four tools, receipt, case study link), then a compact More-work list.
- Phone homepage stays under 9,500px at 390x844 (CI enforces it).
- Every tap target is at least 44x44px, except links inside running text.

## Components

- **Star label:** a real button with the project name, status and one short claim. Tab order follows screen order; arrow keys move between stars.
- **Project panel:** side panel on desktop, a dialog sheet on phones (focus trapped, page locked, closes from Esc, "Back to map" or the handle).
- **Receipt:** dashed button that opens a paper slip with label/value rows, method, scope and a stamp. Present only where real evidence exists.
- **Constellation list:** the designed fallback when 3D can't run, loads too slowly, or labels can't fit.
- **Status:** Live, Prototype, Open source, Client data work, Archived.

## Do and don't

- Do put the scope beside every claim ("0 axe violations on 5 tested routes").
- Do keep one home per kind of content: the map indexes, case studies go deep, Experience lists roles.
- Don't add cards that aren't interactions. Don't repeat a project's numbers outside its receipt and case study.
- Don't remove the space visuals to "clean up". Calm the structure around them instead.

## Decisions log

| Date | Decision | Why |
|------|----------|-----|
| 2026-11-21 | Space direction adopted; "The Public Record" (light, civic, no motion; branch `design-system`) rejected | Nicole wants ambitious visuals with a calm intro and clean structure |
| 2026-11-21 | Soft intro first, star map second | The map is the signature piece; the first screen stays calm |
| 2026-11-21 | Motion budget and Pause motion in the nav | Spectacle needs room; motion-sensitive visitors need a reachable off switch |
| 2026-11-21 | One color source (`index.css` + `themeColors.ts`) | Canvas and WebGL colors drifted from CSS tokens |
