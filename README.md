# Jean Marc Aguilar — Portfolio

A premium, modern, minimalist portfolio for an aspiring IT Professional and Full Stack Developer. Built with the same restraint you'd expect from a well-engineered product.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for fast dev/build
- **Tailwind CSS** for design tokens & utility styling
- **Framer Motion** for subtle entrance / interaction animations
- **GSAP** (minimal) for one-off micro-animations
- **React Router** for page-level routing
- **React Icons** for crisp, consistent iconography
- **EmailJS** for the contact form (env-configured)
- **react-helmet-async** for SEO meta

## Design Language

- Dark theme, soft glass surfaces, restrained color (Primary `#3B82F6`, Accent `#60A5FA`)
- Inter / Space Grotesk / Poppins typography
- Generous spacing, grid-aligned layouts, no gratuitous decoration
- Subtle Framer Motion animations — fade, slide, scale, blur reveal — used only where they earn their place
- Glow-on-hover micro-interactions, animated underlines, focus rings on all interactive elements
- Accessibility-first: reduced-motion, focus-visible, semantic markup, skip-to-content

## Folder Structure

```
src/
  animations/    Reusable motion variants
  components/    Generic, reusable UI (Button, SectionTitle, ProjectCard, …)
    layout/      Layout primitives (Navbar, Layout, LoadingScreen)
    sections/    Page sections (Hero, About, Skills, Projects, …)
  constants/     Single source of truth for content (personal, projects, …)
  hooks/         Custom hooks (useScrolled, useTypingEffect, useCountUp, useScrollSpy)
  pages/         Top-level route components
  styles/        Global Tailwind layer + utilities
  utils/         EmailJS sender, classnames helper, icon map
```

## Getting Started

```bash
# Install
npm install

# Develop (http://localhost:5173)
npm run dev

# Type-check + production build
npm run build

# Preview production build
npm run preview
```

## EmailJS Setup

The contact form reads three variables from `.env`. Until they're set, the
form still "succeeds" locally (the payload is logged) so the UX remains
demonstrable.

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Template variables expected: `name`, `email`, `subject`, `message`.

## Scripts

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Start Vite dev server                |
| `npm run build`      | Production build (with type-check)   |
| `npm run preview`    | Preview built app                    |
| `npm run type-check` | Run TypeScript without emit          |
| `npm run lint`       | Run ESLint                           |

## Performance Notes

- Route & component code-splitting via lazy-loading (`NotFound`)
- Manual vendor chunking in `vite.config.ts` for React / motion / email
- `loading="lazy"` semantics, SVG-only artwork → zero raster image weight
- Reduced-motion media query respected by all keyframes
- Google Fonts preconnect + `display=swap` to limit layout shift

## License

For personal portfolio use. © Jean Marc Aguilar.
