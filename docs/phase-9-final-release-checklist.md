# Phase 9 Final Release Checklist

Last updated: 2026-08-15

## Release Gate

`npm run verify` must pass before a production deploy. It now includes:

- Content truth validation.
- Repository hygiene validation.
- Project story validation.
- Security header/raw HTML validation.
- Dependency audit at moderate-or-higher severity.
- Portfolio-owned external link check.
- ESLint.
- TypeScript and production build.
- Media, font, and bundle performance budgets.
- SEO/social metadata validation.
- Recruiter information-architecture smoke test.
- Accessibility and motion smoke test.
- Final release artifact checklist.

## Manual Release Notes

- Sano remains the live flagship project.
- CarbonShift remains a case study until the backend is restored.
- CarbonShift Render is not exposed as a live CTA.
- Resume file is present and linked through the canonical profile module.
- Security headers are defined for Vercel and static hosts.
- `public/sitemap.xml` and `public/robots.txt` are aligned.

Latest local result: passed on 2026-08-15.
