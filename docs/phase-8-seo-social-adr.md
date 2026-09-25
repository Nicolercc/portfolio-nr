# Phase 8 SEO And Social Metadata ADR

Last updated: 2026-08-15

## Decision

Keep the portfolio on the current Vite SPA architecture for this release, and harden known finite routes with:

- Runtime route-specific metadata.
- Canonical URLs.
- Open Graph and Twitter metadata.
- Post-build route metadata shells for direct project and blog URLs.
- JSON-LD for `Person`, `CollectionPage`, `CreativeWork`, `Blog`, and `BlogPosting`.
- A generated static sitemap.
- Correct `robots.txt` sitemap discovery.

## Rationale

The site is already built, visually validated, and now has release gates through PR 7. A framework migration to Astro/SSG would be larger than the remaining review window warrants. The finite route set can still be discoverable through `sitemap.xml`, and the build now emits route-specific HTML shells so direct links such as `/projects/sano` and `/blog/i-was-taught-to-build` expose the correct preview metadata before React runs.

## Known Trade-Off

Because this remains a client-rendered SPA, static shells are limited to known finite routes. A future SSG migration can make this more general, but it should happen as a separate architecture change after the portfolio review.

## Regression Gate

`npm run verify:seo` validates static sitemap/robots/index metadata, built direct-route metadata shells for Sano and the representative blog post, and runtime metadata for representative routes from the production build.

Latest local result: passed on 2026-08-15 after direct-route metadata shell hardening.
