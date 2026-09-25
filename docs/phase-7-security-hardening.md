# Phase 7 Security And Dependency Risk

Last updated: 2026-08-14

## Changes

- Updated dependencies within declared semver ranges.
- Confirmed `npm audit --json` reports zero vulnerabilities.
- Removed `marked`.
- Replaced raw Markdown-to-HTML rendering with a limited React Markdown renderer.
- Kept the only `dangerouslySetInnerHTML` usage constrained to homepage JSON-LD.
- Added Vercel and static `_headers` security headers.
- Added CSP without `unsafe-eval`; `unsafe-inline` remains limited to styles because the app currently uses React style attributes and generated style behavior.
- Added HSTS without `includeSubDomains` or preload.
- Added `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.

## Regression Gate

- `npm run verify:security` validates raw HTML restrictions, security headers, CSP directives, and external-link `rel` protections.
- `npm run verify:audit` runs `npm audit --audit-level=moderate`.

Latest local result: passed on 2026-08-15. `npm audit --audit-level=moderate` reported zero vulnerabilities.
