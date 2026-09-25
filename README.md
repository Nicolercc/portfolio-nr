# portfolio-nr

a **Midnight Rose** canvas with **rose** nuance and **green** energy, built for seamless visual continuity.

> **Live**: `https://nicolerodriguez.dev/`

## What’s inside

- **Design system**: dark “continuous canvas” background + elevated card surfaces
- **Motion**: Framer Motion micro-interactions and section reveals
- **Interactive globe**: NYC marker + drag-to-rotate
- **Responsive**: optimized layouts from mobile → desktop

## Tech stack

### Core

- **React** + **TypeScript**
- **Vite**

### UI

- **Tailwind CSS v4** (CSS-first, no `tailwind.config.js`)
- **Framer Motion**
- **Lucide** (icons)
- **COBE** (interactive globe)

### Routing

- **React Router**

## Local development

```bash
# install
npm install

# run locally
npm run dev

# production build
npm run build

# preview build
npm run preview
```

## Project structure

```text
src/
  components/
    layouts/      # nav, global canvas, layout primitives
    sections/     # page sections (Hero, Projects, Bento/About, Experience, Contact)
    ui/           # reusable UI bits (cursor, etc.)
  pages/          # route-level pages
  index.css       # global theme tokens + utilities
```

## Scripts

| Command           | What it does                  |
| ----------------- | ----------------------------- |
| `npm run dev`     | start dev server              |
| `npm run build`   | typecheck + production bundle |
| `npm run preview` | preview production build      |
| `npm run lint`    | run ESLint                    |
| `npm run generate:sitemap` | regenerate `public/sitemap.xml` for finite public routes |
| `npm run verify:content` | validate canonical profile, resume asset, and stale public strings |
| `npm run verify:repo` | validate package-manager hygiene and route registry consistency |
| `npm run verify:projects` | validate selected-work order and case-study completeness |
| `npm run verify:security` | validate raw HTML, CSP/header, and external-link security rules |
| `npm run verify:audit` | run npm audit at moderate-or-higher severity |
| `npm run verify:links` | validate portfolio-owned external links |
| `npm run verify:performance` | validate media, font, and bundle budgets after build |
| `npm run verify:seo` | validate sitemap, robots, canonical, OG/Twitter, and JSON-LD metadata |
| `npm run verify:ia` | smoke test production information architecture with Playwright |
| `npm run verify:a11y` | smoke test keyboard focus, reduced motion, forced colors, and small viewports |
| `npm run verify:release` | validate required release artifacts and gate wiring |
| `npm run verify`  | run all release gates |

## License

This project is licensed under the MIT License. See `LICENSE`.
