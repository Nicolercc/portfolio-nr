# Sano case study: Figma evidence handoff

Status: waiting on six exports from the Sano Figma file. The "Designing it in Figma"
section is intentionally absent from `src/data/projects.ts` until every image below
exists. The page, its components and its validators are already in place.

## Ground rules

- Export real frames from the Figma file only. Never substitute a screenshot of the
  live app, a mockup, or a generated image for a Figma frame.
- `sano-live-home.webp` is a screenshot of the live app. It appears only as the
  "live app" half of the comparison and must stay labelled that way.
- Keep the credit line exactly as written: "Built with Claude in Figma from my
  direction. I reviewed and edited every screen."
- Do not change any other Sano copy, the accessibility evidence table, or the
  research plan. Do not add WCAG claims.
- Sano only. Work in `~/Documents/Projects/portfolio-nr`, not the Sala repo
  (`~/Documents/ChatGPT/portfolio/sala`). Run the exporter with `--project sano`
  only; the script's `sala` entry points at a different Figma file
  (`mTrNMj9qBNuaMK88hOovGv`) and must not be used here. Never place Sala images,
  captions or findings in the Sano case study, or the reverse.
- Before using any image, confirm its source. An export from the Figma file
  above is Figma evidence; a browser capture of an app is a screenshot and must be
  labelled as one.
- Do not commit. Nicole reviews and commits.

## Source file

- File: https://www.figma.com/design/W5RrpfAu7TSxRSoA1cz25t
- File key: `W5RrpfAu7TSxRSoA1cz25t`
- Before linking publicly, confirm sharing is "Anyone with the link can view" and
  that pages 01 Components, 02 Screens and 03 Handoff are visible to viewers.

## Exports

All six go in `public/media/sano-case-study/` as WebP, at most 2000px wide
(the pipeline resizes a 2x PNG and recompresses to the 350 KB per-file budget;
220 KB for any filename containing `hero`).

| # | Frame (node) | Filename | Slot in section | Expected size | Claim it supports |
|---|---|---|---|---|---|
| 1 | `11:131` "S-03 Restaurant profile" (1440×1905) | `sano-figma-profile.webp` | `lead` | ~2000×2646 (tall, 0.76) | Official data leads; review context is separate and conditional |
| 2 | `10:5` "S-02 Search results" (1440×1671) | `sano-figma-results.webp` | `pair[0]` | ~2000×2321 | Every card reads name → official grade → reliability → reviews (matches `RestaurantCard.tsx`); the four results are `RestaurantCard` instances |
| 3 | `11:350` "S-03 Restaurant profile — annotated" (2093×2085) | `sano-figma-handoff.webp` | `pair[1]` | ~2000×1992 | Developer handoff with six numbered WCAG and data-rule annotations |
| 4 | `1:159` "RestaurantCard" component set (1994×307) | `sano-figma-card.webp` | `details[0]` | ~2000×308 (very wide) | One component with two variants: `Review=Matched`, `Review=Not attached` |
| 5 | `1:45` "GradeBadge" component set (402×94) | `sano-figma-grades.webp` | `details[1]` | ~804×188 | Five grade variants drawn from the app's MarkerGrade |
| 6 | `9:267` "S-01 Home — hero" (1440×1000) | `sano-figma-hero.webp` | `comparison.images[0]` | ~2000×1389 | Figma screen matches the shipped home page |

All six nodes were confirmed to exist on Sept 30, 2026 (read-only Figma metadata).
The file's pages: `00 Cover` (0:1), `01 Components` (1:2), plus the screens and
annotated-handoff frames. `01 Components` holds five component sets: GradeBadge,
ReliabilityScore (`Score` / `Low signal`), ReviewContext (`Matched` /
`Not attached`), Button (Primary / Secondary / Search) and RestaurantCard. Only the
six frames above are in scope; adding others (for example ReliabilityScore `1:71`)
is Nicole's decision, not Codex's.

Alt text for each file is already written in `scripts/export-figma-frames.mjs` and is
copied into the manifest automatically. Keep it; it describes what each frame shows.

| Filename | Alt text |
|---|---|
| `sano-figma-hero.webp` | Sano home screen in Figma: the headline "The grade is on the door. The story isn't." with a search bar and a preview card for Lucky Chix showing grade A, a volatile inspection timeline, and reliability 60. |
| `sano-figma-results.webp` | Sano search results in Figma: a borough coverage snapshot, then restaurant cards showing each official grade, a reliability score, and Google review context only when a source is matched. |
| `sano-figma-profile.webp` | Sano restaurant profile for Lucky Chix in Figma: official inspection data first with grade A, then consumer review context kept separate, a plain-language summary, reliability 60, and the inspection timeline. |
| `sano-figma-handoff.webp` | Annotated Sano profile screen with numbered developer notes covering WCAG 2.2 focus visibility, target size, the timeline's text alternative, and data rules. |
| `sano-figma-card.webp` | The RestaurantCard component in two states: review matched, and review source not attached. |
| `sano-figma-grades.webp` | Hand-drawn red grade stamps for A, B, C, Pending, and Not yet graded. |

## How to export

Preferred (writes the WebP files, the manifest entries with alt text and
dimensions, and regenerates `src/data/caseStudyMedia.generated.ts`):

```sh
FIGMA_TOKEN=<read-only "File content" token> npm run assets:figma -- --project sano
```

The script exits non-zero if any frame fails. It merges into
`public/media/sano-case-study/manifest.json` by filename, so the existing
`sano-live-home.webp` and `sano-live-profile.webp` entries are preserved.

Manual fallback: export each frame from Figma as PNG at 2x, convert to WebP at
2000px max width, place it in `public/media/sano-case-study/`, add an entry to
`manifest.json` with `file`, `width`, `height`, `source: { "type": "figma",
"fileKey": "W5RrpfAu7TSxRSoA1cz25t", "nodeId": "<node>" }` and the alt text above,
then regenerate `src/data/caseStudyMedia.generated.ts` (running the export script
once with no failures does this; do not hand-edit the generated file).

Look at every exported image before continuing. If a frame renders blank,
cropped, or with missing fonts, stop and tell Nicole; do not ship it.

## Add the section

In `src/data/projects.ts`, inside the `sano` entry's `caseStudy`, paste this block
between `accessibilityEvidence: { ... },` and `researchPlan: {`. It is the approved
copy; only the grades caption was corrected, because the code's MarkerGrade renders
A, B, C and Pending while the Figma set adds a fifth "Not yet graded" state.

```ts
			designSection: {
				heading: "Designing it in Figma",
				intro:
					"I directed a Figma rebuild of Sano's key screens so the design could be handed off in a client's format: a small component set, the home, search and profile screens, and an annotated developer handoff page. Colors and type match the code's tokens (tailwind.config.ts and app/globals.css). The annotations cover focus visibility, target size, the timeline's text alternative, and the data rules: official record first, reviews only when a source is matched, limits as visible text.",
				lead: {
					src: "/media/sano-case-study/sano-figma-profile.webp",
					caption:
						"Official inspection data leads. Review context stays separate and appears only when matched.",
				},
				pair: [
					{
						src: "/media/sano-case-study/sano-figma-results.webp",
						caption: "Every card reads in the same order: name, official grade, reliability, reviews.",
					},
					{
						src: "/media/sano-case-study/sano-figma-handoff.webp",
						caption: "Handoff notes for developers: WCAG 2.2, text alternatives, and data rules.",
					},
				],
				details: [
					{
						src: "/media/sano-case-study/sano-figma-card.webp",
						caption: "One component, two honest states: review matched, or not attached.",
					},
					{
						src: "/media/sano-case-study/sano-figma-grades.webp",
						caption:
							"Grade stamps drawn from the app's MarkerGrade component. The Figma set adds a \"Not yet graded\" state that the app currently shows as Pending.",
					},
				],
				comparison: {
					images: [
						"/media/sano-case-study/sano-figma-hero.webp",
						"/media/sano-case-study/sano-live-home.webp",
					],
					caption: "Figma file vs. the live app.",
				},
				fileUrl: "https://www.figma.com/design/W5RrpfAu7TSxRSoA1cz25t",
				fileLabel: "Open the Figma file",
				credit: "Built with Claude in Figma from my direction. I reviewed and edited every screen.",
			},
```

The section renders automatically (`DesignSection` in `src/pages/CaseStudy.tsx`,
between Accessibility evidence and the research plan). No component changes are
needed.

## Files Codex may change

- `public/media/sano-case-study/` (six new `.webp` files, `manifest.json`)
- `src/data/caseStudyMedia.generated.ts` (regenerated by the script only)
- `src/data/projects.ts` (paste the block above, nothing else)

- `scripts/validate-performance.mjs`: only if `verify:performance` fails on the
  total media budget (`totalPublicMedia`, currently 1.5 MB; public/media was 1.41 MB
  before these exports). Raise it to the smallest round value that fits the measured
  new total, and state that total in the change. Never raise the per-file budgets;
  recompress or re-export an image that exceeds them.

Everything else is out of scope, in particular `src/pages/CaseStudy.tsx`,
`scripts/`, `docs/` (except ticking this file's checklist),
`public/sano-usability-test-plan.pdf`, and every other project's data.

## Acceptance checks

Run from the repo root on Node 22:

```sh
npm run verify
```

It must pass end to end. `verify:content` and `verify:projects` fail if any
referenced image is missing from `public/` or from the manifest;
`verify:performance` fails if an image breaks its size budget.

Then check `/projects/sano` in a browser at 390, 768, 1024 and 1440px: all six images
load, nothing overflows horizontally, captions sit under the right images, and the
comparison shows the Figma hero beside the live screenshot.

## Checklist

- [ ] Figma sharing set to view-by-link; pages 01–03 visible
- [ ] 1 `sano-figma-profile.webp` (11:131)
- [ ] 2 `sano-figma-results.webp` (10:5)
- [ ] 3 `sano-figma-handoff.webp` (11:350)
- [ ] 4 `sano-figma-card.webp` (1:159)
- [ ] 5 `sano-figma-grades.webp` (1:45)
- [ ] 6 `sano-figma-hero.webp` (9:267)
- [ ] Every image inspected by eye
- [ ] Block pasted into `src/data/projects.ts`
- [ ] `npm run verify` passes
- [ ] Browser check at 390 / 768 / 1024 / 1440
