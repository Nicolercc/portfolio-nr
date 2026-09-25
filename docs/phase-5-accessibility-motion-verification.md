# Phase 5 Accessibility And Motion Verification

Last updated: 2026-08-14

Phase 5 turns accessibility into a repeatable gate for the portfolio review path.

## Implemented Checks

- Skip link is the first keyboard target and moves focus to `main`.
- Route changes focus the new page heading.
- Direct navigation exposes a focusable route heading on representative routes.
- Reduced-motion mode disables decorative continuous animation paths.
- Forced-colors mode keeps keyboard focus reachable.
- 320px mobile viewports do not horizontally overflow on the homepage and flagship case-study routes.

## Implementation Notes

- `RouteFocusManager` handles route-heading focus for SPA navigation.
- Hash navigation and manual scroll controls respect `prefers-reduced-motion`.
- Motion-heavy sections now branch on reduced-motion preferences.
- Global CSS adds reduced-motion and forced-colors fallbacks.

## Regression Gate

`npm run verify:a11y` runs against `dist/` with Playwright, after the production build.

It also runs axe-core (WCAG 2.0/2.1/2.2 A and AA rule tags) on the homepage, projects
index, all three case studies, the blog index, a blog post, and the 404 route, at 1440px and
390px, with reduced motion emulated so reveal animations are measured in their settled state.
Elements marked `data-a11y-decorative` (the 3%-opacity word marquee, the bento "NR"
watermark, and the case-study footer ghost title) are excluded; they are decorative text,
which WCAG 1.4.3 exempts from contrast. No axe rules are disabled.

Two additional regressions are guarded:

- Experience entries must stay visible after they scroll out of view.
- The phone navigation must expose Work, About, Resume, and Contact.

## What automated testing does not prove

axe and these scripts check machine-verifiable rules. They do not prove:

- that the page makes sense in a screen reader (reading order, announcements, verbosity);
- that alt text is meaningful rather than merely present;
- 200%/400% zoom and text-spacing reflow;
- comprehension, cognitive load, or motion comfort for real users;
- behavior on real devices, browsers, and assistive technology combinations.

Those require manual passes (VoiceOver on macOS/iOS at minimum) before claiming more than
"designed and tested against relevant WCAG 2.2 AA criteria."

Latest local result: passed on 2026-09-25.
