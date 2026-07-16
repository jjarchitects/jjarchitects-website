# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Marketing site for **Jatan Joshi Architects (JJ Architects)**, an architecture/interior design studio in Bhuj, Gujarat. Next.js App Router site, statically content-driven (no CMS/backend) — see `README.md` for the stock `create-next-app` boilerplate notes.

**Read `DESIGN.md` before making any visual/UI change.** It documents the color palette, typography, motion conventions, and recurring patterns actually in use — treat it as the source of truth for styling decisions, not just a reference.

## Commands

```bash
npm run dev      # start dev server (Turbopack)
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint (next/core-web-vitals + next/typescript)
```

There is no test suite in this repo.

## Stack

- Next.js 16 (App Router), React 19, TypeScript (strict mode)
- Tailwind CSS v4 — theme tokens are defined in `src/app/globals.css` via an `@theme` block, **not** a `tailwind.config.js` (there isn't one). Add new design tokens there.
- Framer Motion for animation, Swiper for the hero carousel, `react-hook-form` + `@emailjs/browser` for the contact form, `next-cloudinary` / Cloudinary-hosted images for project photography.

## Structure

```
src/app/            routes (App Router): / , /projects , /projects/[id] , /about , /contact
src/components/     shared UI (Navbar, Footer, FrameView, SocialMedia, WhatsAppButton, Loader)
src/utility/         CustomCursor (site-wide custom cursor — see DESIGN.md)
src/data/            content as JSON: projectsData.json, testimonialsData.json, businessData.json
src/app/constants.ts the canonical `filters` list used by both the Navbar dropdown and /projects
types.d.ts           global `Project` type (ambient, no import needed)
```

`src/data/projectsData OLD.json` is a stale backup file, not imported anywhere — ignore it, don't edit it.

## Conventions

- Path alias `@/*` maps to `src/*` (see `tsconfig.json`).
- JSON content files are imported directly (`resolveJsonModule`) and typed against the ambient `Project` type in `types.d.ts` — update that type if the JSON shape changes, and update all three call sites (home, `/projects`, `/projects/[id]`) together.
- The ESLint rule `next/no-img-element` is intentionally disabled repo-wide (`eslint.config.mjs`) because Cloudinary-hosted thumbnails and the logo use plain `<img>` by design; `next/image` is still used for local `/assets/*` imagery. Don't "fix" this by converting Cloudinary `<img>` tags to `next/image` unless asked.
- `filters` in `src/app/constants.ts` is shared by the Navbar's Projects dropdown and the `/projects` filter bar — changing project categories means updating this one place, not each component.
- Motion: match the existing Framer Motion idioms (scroll-triggered `whileInView` + `viewport={{ once: true }}`, staggered children, `easeInOut`) rather than introducing a new animation library or one-off CSS transitions — see `DESIGN.md` § Motion for the exact variant patterns already in use.
- No test infrastructure exists — verify UI changes by running `npm run dev` and checking the affected page(s) in a browser, not by writing unit tests unless the user asks for a test setup.

## Env

`.env` holds EmailJS credentials (`NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`) consumed client-side by the `/contact` form. Never commit real values or print `.env` contents.
