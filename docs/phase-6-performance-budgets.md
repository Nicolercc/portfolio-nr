# Phase 6 Media, Fonts, And Performance Budgets

Last updated: 2026-08-14

## Changes

- Replaced the 5.7 MB Nightfall hero PNG with a 184 KB JPEG.
- Replaced the 236 KB Sano hero with a 156 KB optimized JPEG.
- Removed the 19 MB Impactify MOV from the shipped media path and use its poster/screenshot instead.
- Removed the unreferenced 137 MB Nightfall demo MOV from `public/media`.
- Removed duplicate CSS Google Font imports.
- Removed inline font `onload` loading from `index.html`.
- Reduced the loaded font families to Cormorant Garamond, DM Mono, and Inter.

## Budgets

- Total `public/media`: 1.5 MB maximum.
- Individual public media file: 350 KB maximum.
- Referenced hero/poster image: 220 KB maximum.
- Referenced supporting image: 330 KB maximum.
- Video asset: 5 MB maximum.
- Total production JS gzip: 220 KB maximum.
- Main entry JS raw: 500 KB maximum.
- Production CSS gzip: 22 KB maximum.

## Regression Gate

`npm run verify:performance` validates media, font loading, and production bundle budgets after `npm run build`.

Latest local result: passed on 2026-08-15.
