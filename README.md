# portfolio-nr

Nicole Rodriguez’s portfolio website.

- **Live**: `https://nicolerodriguez.dev/`

## Tech stack

- **Framework**: React + TypeScript
- **Build tool**: Vite
- **Styling**: Tailwind CSS v4 (CSS-first, no `tailwind.config.js`)
- **Motion**: Framer Motion
- **Routing**: Wouter
- **Icons**: Lucide
- **Interactive globe**: COBE

## Local development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project structure

- **Pages**: `src/pages/`
- **Sections / UI**: `src/components/sections/`, `src/components/ui/`, `src/components/layouts/`
- **Global styles + theme tokens**: `src/index.css`

## Design notes

- **Theme**: “Midnight Rose” canvas with rose + green accents.
- **Continuity**: a fixed global background layer keeps sections visually seamless while cards provide depth.

## Scripts

- **dev**: run Vite in development mode
- **build**: typecheck + production bundle
- **preview**: serve the production build locally
- **lint**: run ESLint
