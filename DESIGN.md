# JJ Architects — Design System

This document describes the visual language and UI conventions used across the JJ Architects marketing site (Jatan Joshi Architects, Bhuj). It reflects the design as actually implemented in code, so it stays in sync with `src/app/globals.css` and the component tree.

## Brand

- **Studio**: Jatan Joshi Architects ("JJ Architects")
- **Tagline**: "Designing Dreams, Building Reality"
- **Tone**: quiet, editorial, gallery-like. Long serif-free type, generous whitespace, thin rules instead of boxes, restrained motion. Architecture-brochure aesthetic, not a typical SaaS/marketing site.

## Color Palette

Defined as CSS custom properties in a Tailwind v4 `@theme` block (`src/app/globals.css`). Three palettes, each with a 100–900 scale plus a bare/DEFAULT alias at `-500`.

| Role | Token | Hex | Usage |
|---|---|---|---|
| Ink / text | `carbon` (`carbon-500`) | `#1b1b1b` | Default body/heading text color (`:root { color: var(--color-carbon) }`) |
| Ink scale | `carbon-100…900` | `#d2d2d2 → #060606` | Muted text (`carbon-300/400`), borders (`carbon-200/300`), dark surfaces (`carbon-700+`) |
| Neutral surface | `taupe` (`taupe-500`) | `#dad6cb` | Navbar background, footer gradient base |
| Neutral scale | `taupe-100…900` | `#f8f7f5 → #322e23` | Section backgrounds (`taupe-100`), footer surfaces |
| Accent | `copper` (`copper-500`) | `#a55838` | The single accent color: CTAs, active nav state, underlines, hover states, section eyebrows, icons |
| Accent scale | `copper-100…900` | `#f0dcd4 → #21120b` | Hover states (`copper-600`), tints for glows/borders (`copper/10`, `copper/30`) |

Neutral grays outside the theme (`zinc-*`, `gray-*`) are also used directly in a few sections (360° tour section, testimonials) for secondary surfaces — treat `zinc` as an acceptable neutral alongside `carbon`/`taupe`, but **copper is the only brand accent**; do not introduce a second accent color.

There's also a `--breakpoint-xlg: 1600px` custom breakpoint for ultra-wide layouts.

`color-code-scheme.pdf` at the repo root is the original brand color reference — consult it if new palette values are ever needed instead of guessing hex values.

## Typography

- **Font**: [Geist](https://vercel.com/font) (sans) + Geist Mono, loaded via `next/font/google` in `src/app/layout.tsx` and exposed as CSS vars `--font-geist-sans` / `--font-geist-mono`.
- **Weight**: The site leans almost entirely on `font-light` / `font-extralight` for headings — bold weight is reserved for emphasis states (e.g. active nav links, hovered philosophy text).
- **Headings**: large, tight tracking (`tracking-tight`), e.g. `text-4xl md:text-6xl font-extralight`. Hero titles go up to `text-6xl`–`text-8xl`.
- **Eyebrows/labels**: small uppercase text with wide letter-spacing — the recurring pattern is a short horizontal rule (`w-8 h-px bg-copper` or a gradient line) next to `text-sm tracking-widest text-copper uppercase`. Used above nearly every section heading ("OUR APPROACH", "RECOGNITION & PRAISE", "Immersive Experience").
- **Body copy**: `font-light`, `leading-relaxed`, often `text-justify` in the philosophy section.

## Layout & Spacing

- Global content width: `max-w-7xl mx-auto`, with horizontal padding `px-4 md:px-8` (or `w-11/12` for nav/footer/projects grid).
- Vertical section rhythm is large: `py-16` to `py-40` depending on section weight.
- Two-tone split backgrounds: several sections use a `grid grid-cols-1 md:grid-cols-2` absolute background layer with one half `taupe-100`/`gray-50` and the other `white`, to create an asymmetric editorial backdrop behind centered/offset content (Philosophy section, Contact CTA section).
- Asymmetric grids: content commonly splits `md:col-span-5` / `md:col-span-7` (not 6/6), reinforcing the editorial, non-centered layout.
- Project/image grids use CSS columns (`columns-1 sm:columns-2 md:columns-3`) for a masonry effect rather than a strict grid.

## Motion

Framer Motion is the animation system throughout (`framer-motion`). Conventions:

- **Entrance pattern**: `initial="hidden"` / `whileInView="visible"` with `viewport={{ once: true, amount: 0.3 }}` — content animates in once as it scrolls into view, never re-triggers.
- **Stagger containers**: a `staggerContainerVariants` (`staggerChildren: 0.1–0.12`, `delayChildren: 0.2`) wraps a set of `slideUpVariants`/`fadeIn*Variants` children — used for nav links, philosophy images, footer links, project cards.
- **Standard easing**: `easeInOut` from `framer-motion`, duration 0.6–1s for content, faster (0.3–0.4s) for hover/tap micro-interactions.
- **Directional fades**: `fadeInLeftVariants` / `fadeInRightVariants` (x ±50) pair opposite-facing content in two-column sections (text left, imagery/contact right).
- **Scroll-linked scenes**: the homepage "Step Inside" 360° section drives width/scale/opacity/borderRadius/y off `useScroll` + `useTransform` against a tall (`160vh`) sticky container — this is the most complex animation in the codebase and is a deliberate "editorial scrollytelling" moment, not a pattern to overuse elsewhere.
- **Hover micro-interactions**: `whileHover={{ scale: 1.02–1.1 }}` + `whileTap={{ scale: 0.95–0.98 }}` on buttons/icons; image tiles get `hover:scale-105` + `hover:grayscale-0` (project thumbnails are grayscale by default, full color on hover).
- **Custom cursor**: `src/utility/CustomCursor.tsx` replaces the native cursor site-wide (`cursor: none !important` in `globals.css`); any new interactive element must remain usable with this custom cursor.
- Raw CSS keyframes (`animate-fadeInUp`, `animation-delay-*`, `animate-pulse-slow`) are used sparingly inside `<style jsx global>` blocks for staggered hero text that doesn't need Framer Motion's JS-driven timing.

## Recurring UI Patterns

- **Section eyebrow**: short line + small uppercase copper label before every major heading (see Typography).
- **Copper accent bar**: `w-16 h-1 bg-copper` or `w-20 h-1 bg-copper` under CTA headings, and `w-1 h-1 rounded-full bg-copper` as a bullet before metadata (location, filters).
- **Buttons**: solid copper fill, white text, no border-radius (sharp corners) — e.g. `bg-copper hover:bg-copper-600 text-white px-8 py-4`. Icon (`ArrowRight`/`ExternalLink`) always trails the label with a hover-translate.
- **Cards/borders**: thin 1–2px borders (`border-carbon-300`, `border-gray-200`) rather than shadows or rounded corners; hover state swaps border color to copper (`hover:border-copper`) or adds a shadow.
- **Glassmorphism controls**: carousel/tour controls use `backdrop-blur-sm bg-white/20` with a `border-2 border-copper/30` for floating icon buttons over imagery.
- **Grayscale-to-color reveal**: project thumbnails render desaturated and snap to full color on hover — a consistent way of directing attention without extra chrome.
- **Decorative corner brackets**: `border-t-2 border-l-2 border-copper` (and rotations thereof) at 25–30% opacity, used to frame the 360° viewer and project cards — a recurring "blueprint corner mark" motif that reinforces the architecture theme.
- **Marquee testimonials**: infinite horizontal scroll (`x: ["0%", "-50%"]`, duration 60s, linear, list rendered twice) rather than a paginated carousel.

## Navigation & Structure

Site routes (`src/app/`):

| Route | Purpose |
|---|---|
| `/` | Home — hero carousel, 360° virtual tour, design philosophy, testimonials marquee, contact CTA |
| `/projects` | Filterable project index (`All / Architecture / Interior / 3D`, from `src/app/constants.ts`), masonry grid, client-side shuffle on load |
| `/projects/[id]` | Individual project detail page |
| `/about` | About the studio |
| `/contact` | Contact form (EmailJS) + business details |

Global chrome (`src/app/layout.tsx`): fixed translucent `Navbar` (taupe background, blurs/shrinks on scroll), page content, `Footer`, floating `WhatsAppButton`, and the site-wide `CustomCursor`.

The Navbar's "Projects" item has a hover dropdown listing the same filters used on `/projects`, linking directly to `/projects?filter=<name>`.

## Content/Data Model

Static JSON drives content instead of a CMS (`src/data/`):

- `projectsData.json` — array of `Project` (see `types.d.ts`): `id, title, description, thumbnail, images[], aboutProject, location, year, type, featured, tour360Link, vrTourLink, area`. Images are hosted on Cloudinary (`res.cloudinary.com/jj-architects/...`); `next.config.ts` whitelists that remote pattern for `next/image`.
- `testimonialsData.json` — `{ id, name, title, testimonial }[]`.
- `businessData.json` — single object: `contactDetails` (email, phone, address, Google Maps links), `socialMedia` (Instagram, LinkedIn, Facebook — Twitter present in data but hidden in UI), `businessDetails` (name, tagline, description).
- `filters` (`src/app/constants.ts`) — the canonical project-type filter list; keep the Navbar dropdown, `/projects` filter bar, and this constant in sync if filters ever change.

## Tech Stack Notes Relevant to Design

- Next.js App Router (v16), React 19, Tailwind CSS v4 (theme defined via `@theme` in CSS, not `tailwind.config.js`).
- `lucide-react` for line icons in content/UI chrome; `react-icons` (`Lu*`, `Fa*`, `Hi*`) for nav/footer/social icons — both are in use, pick whichever family the surrounding component already uses rather than mixing icon sets within one component.
- `swiper` for the hero carousel (fade effect, autoplay, custom pagination/nav elements).
- `react-hook-form` + `@emailjs/browser` for the contact form (client-side send, no backend).
- Images loaded via a mix of `next/image` (local `/assets/*`, decorative/local imagery) and plain `<img>` (Cloudinary thumbnails, logo) — the ESLint `next/no-img-element` rule is deliberately disabled project-wide for this reason.
