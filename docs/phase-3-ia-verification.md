# Phase 3 Recruiter IA Verification

Last updated: 2026-08-14

Phase 3 changes are validated against the production build with `npm run verify:ia`.

## Acceptance Checks

- Desktop navigation is visible on initial load and exposes `Work`, `Resume`, `GitHub`, and `Contact`.
- First-screen calls to action route to selected work, the canonical resume asset, GitHub, and contact.
- Homepage section order starts with landing, selected work, then capabilities.
- Sano is the first selected work item.
- The Sano case study exposes the working live deployment.
- The CarbonShift case study clearly states that the backend is currently offline.
- The broken CarbonShift Render deployment is not exposed as a live call to action.
- Mobile navigation fits within a 390px viewport and exposes the priority links.

## Regression Gate

`npm run verify` now includes this IA smoke test after the production build, so content, repository hygiene, lint, typecheck, build, and recruiter-path verification run as one local release gate.

Latest local result: passed on 2026-08-14.
