# Baseline Audit

Last updated: 2026-08-14

## Verification Baseline

| Check | Result |
| --- | --- |
| Package manager | npm |
| Lockfile | `package-lock.json` |
| Alternate lockfiles | `pnpm-lock.yaml` removed |
| Tracked pnpm store | `.pnpm-store/v11/index.db` removed |
| Root debug screenshots | `blog-*.png` files removed |
| Unused router dependency | `wouter` removed; React Router remains active |
| Content validation | `npm run verify:content` passes |
| Repository validation | `npm run verify:repo` added |
| Lint | `npm run lint` passes |
| Production build | `npm run build` passes with Node 22-compatible runtime |
| Full local verification | `npm run verify` passes |

## GitHub Actions Baseline

`.github/workflows/verify.yml` runs on pushes to `main` and on pull requests:

1. Checkout
2. Setup Node `22.13.0`
3. `npm ci`
4. `npm run verify:content`
5. `npm run verify:repo`
6. `npm run lint`
7. `npm run build`

## Dependency Audit Baseline

`npm audit --json` was run on 2026-08-14 against the current `package-lock.json`.

| Severity | Count |
| --- | ---: |
| Critical | 0 |
| High | 8 |
| Moderate | 0 |
| Low | 1 |
| Total | 9 |

Direct packages represented in the audit output include:

- `playwright`
- `react-router-dom`
- `vite`

Transitive packages represented in the audit output include:

- `@babel/core`
- `brace-expansion`
- `js-yaml`
- `nanoid`
- `postcss`
- `react-router`

Do not auto-fix these inside the hygiene phase. Dependency upgrades belong to the security-hardening phase because they can change route behavior, build behavior, and test tooling.

## Local Environment Note

The existing local `node_modules` directory was created in a pnpm-shaped layout. Vite may need permission to write temporary config files under `node_modules/.vite-temp` in this local checkout. CI uses a clean `npm ci` install and should not inherit that local filesystem quirk.

