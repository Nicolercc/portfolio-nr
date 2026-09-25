# Phase 4 Project Story Verification

Last updated: 2026-08-14

Phase 4 makes the selected-work section recruiter-proof by treating project stories as structured evidence, not decorative cards.

## Implemented Decisions

- Sano remains the first selected project and stable live flagship.
- CarbonShift remains selected work, but as a case study while the Render backend is offline.
- CarbonShift does not expose the broken Render URL as a live call to action.
- CarbonShift now has an architecture walkthrough and evidence panel instead of a generic “coming soon” visual.
- Every selected project must keep role, status, stack, thesis, problem, solution, architecture, decisions, impact, lessons, and case-study links populated.

## Regression Gate

`npm run verify:projects` parses `src/data/projects.ts` with the TypeScript compiler API and fails if selected projects lose required story structure, expose a known broken live URL, or drift from the intended Sano-first reviewer order.

Latest local result: passed on 2026-08-14.
