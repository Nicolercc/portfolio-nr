# portfolio-nr

Nicole Rodriguez’s portfolio website — a **Midnight Rose** canvas with **rose** nuance and **green** energy, built for crisp motion and seamless visual continuity.

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

- **Wouter**

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

| Command | What it does |
| --- | --- |
| `npm run dev` | start dev server |
| `npm run build` | typecheck + production bundle |
| `npm run preview` | preview production build |
| `npm run lint` | run ESLint |
