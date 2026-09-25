# Portfolio Claim Inventory

Last updated: 2026-09-23

## Canonical Profile

| Field | Canonical value | Notes |
| --- | --- | --- |
| Name | Nicole Rodriguez | Use full name in metadata and resume-facing surfaces. |
| Display name | Nicole R. | Acceptable for the cinematic hero only. |
| Positioning | Software Engineer - Full-Stack, Applied AI, and Data Systems | Use consistently across hero, metadata, and structured data. |
| Email | nicolerodriguezcab@gmail.com | Visible email and `mailto:` must match. |
| GitHub | https://github.com/Nicolercc | From `PROFILE.github`. |
| LinkedIn | https://www.linkedin.com/in/nicolerodriguezz/ | From `PROFILE.linkedin`. |
| Resume path | /Nicole_Rodriguez_Resume.pdf | Asset must exist in `public/`. |
| Pursuit period | 2026 - Present | Corrects previous unsupported `2024 - Present` copy. |
| Structured profile | `Person` JSON-LD on homepage | Uses canonical profile fields. |

## Claim Review

| Claim | Current action | Evidence status |
| --- | --- | --- |
| Pursuit dates | Corrected to 2026 - Present | User confirmed June 2026 start in audit context. |
| 9% Pursuit acceptance rate | Removed from public copy | Needs official source before restoring. |
| Open Source Contributor since 2026 | Removed from public copy until there are merged PR/source links | User corrected start year to 2026; needs merged PR links before restoring publicly. |
| WCAG compliant | Avoid as public claim | Needs axe and manual accessibility review. |
| Sub-second load times | Avoid as absolute claim | Needs production Lighthouse/Web Vitals evidence. |
| BlackRock capstone demo | Narrowed in experience copy | Add evidence or clarify wording in project case study. |

## Resume Review

| Check | Result |
| --- | --- |
| Public file | `public/Nicole_Rodriguez_Resume.pdf` |
| Source file | `/Users/nicolerodriguez/Documents/Resumes/NicoleR_TechResume.pdf` |
| Size | 82 KB |
| Pages | 1 |
| PDF metadata | Google Docs renderer, no custom metadata stream found in lightweight check |
| JavaScript/forms | None reported by `pdfinfo` |
| Email alignment | PDF links to `nicolerodriguezcab@gmail.com`, matching canonical profile |
| Remaining action | Human review recommended before production for phone/address preferences |

## Deployment Checks

| Project | URL | Check result | Portfolio treatment |
| --- | --- | --- | --- |
| Sano | https://sano-nine.vercel.app/ | HTTP 200 on 2026-08-14 | Stable live data-project candidate after privacy/content review. |
| Sano repo | https://github.com/Nicolercc/sano | HTTP 200 on 2026-08-14 | Public source link candidate. |
| Code4Kidz | https://code4kidz-six.vercel.app/ | Production deployed on 2026-09-25; smoke checked `/`, `/onboarding`, and fallback route | Live CTA is valid. Keep claims scoped to automated axe/test evidence until by-ear screen-reader and learner testing are done. |
| TripCanvas repo | https://github.com/Nicolercc/travel-agent | Public source link added on 2026-09-23; live deployment not claimed | Case-study prototype only: mock travel data, browser-local persistence, no booking/live-provider claims. |
| CarbonShift | https://carbonshift.onrender.com | Timed out on latest check on 2026-08-14; previous check returned HTTP 503 | Removed from public selected work on 2026-09-23 at user request. |
| CarbonShift repo | https://github.com/Nicolercc/carbonshift | HTTP 200 on 2026-08-14 | Parked for future restoration; not published as selected work right now. |

## Project Positioning Decision

The public selected-work set is now Sano, Code4Kidz, and TripCanvas. Sano leads as the stable live data-heavy project if the app works end to end. User confirmed on 2026-08-14 that Sano currently uses only public NYC inspection data and no private user data or sensitive stored inputs. Code4Kidz is now a live quality/audit signal. TripCanvas carries product-systems judgment and must remain framed as a prototype unless a real deployment, data source, and test report are added. CarbonShift is intentionally removed from the public route set for now.
