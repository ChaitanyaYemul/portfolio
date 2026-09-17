# DESIGN.md
## Visual & Interaction Direction — Chaitanya Yemul Portfolio

This is the design source of truth. Any visual or motion decision should be checked against this document.

---

### 1. Core Intent

The portfolio must feel **human-designed, editorial, and intentionally crafted** — not like a generated AI-portfolio template. It should read as the work of a frontend engineer with a designer's eye, not a demo reel of every effect available on the web.

"Premium" here means restraint and precision, not maximal visual spectacle.

---

### 2. Explicitly Avoid

- Generic purple/blue "AI-SaaS" gradient aesthetic
- Excessive rounded cards or floating-card-everything layouts
- Gradients added just because they look "modern"
- Animation on everything, with no purpose
- Repetitive 3-column project/card grids as the primary layout
- Copied startup/Framer-portfolio templates
- Overused glassmorphism
- Visual effects with no clear storytelling purpose
- Oversized typography used only for shock value

---

### 3. What to Build Instead

- A coherent visual language: strong typography, intentional spacing, clear hierarchy, real contrast, subtle texture
- Choreographed motion with **hierarchy** — major transitions (page/section changes) can be expressive; micro-interactions (buttons, hovers) stay restrained
- Scroll-driven reveals, meaningful hover states, smooth section transitions, subtle parallax — used where they support storytelling, not decoration for its own sake

---

### 4. Frontend Stack

| Layer | Choice | Usage rule |
|---|---|---|
| Framework | **React** | Primary framework for the whole site |
| 3D | **React Three Fiber (R3F)** | Use selectively — one meaningful hero/spatial moment, not decoration throughout |
| Shader backgrounds | **ShaderGradient** | Only where it reinforces the visual identity (e.g. hero background) |
| Glass/refraction | **Liquid Glass JS** | Use for a genuine refraction interaction (e.g. one nav element or card), not blanket glassmorphism |
| Motion | **motion.dev** (Motion library) and **anime.js** | Primary animation engines — scroll reveals, transitions, hover choreography |

**Note on workflow tools:** Tools like *Agentation* (browser-based UI annotation for AI coding agents) are development-time aids for iterating with Manus/an agent — they are not runtime dependencies shipped in the final site. Don't have Manus install them as app dependencies; they're for the build process only, if used at all.

---

### 5. Performance Requirements (non-negotiable)

The animation/visual layer must never come at the cost of a smooth, fast site. Specifically:

- **No jank or freezing** — animations must hold close to 60fps; if a 3D/shader effect can't maintain smooth performance on mid-range devices, simplify it or drop it
- **Respect `prefers-reduced-motion`** — provide a reduced/no-motion fallback for every non-trivial animation
- **Lazy-load heavy components** — R3F scenes, shader canvases, and any large visual bundle should load only when needed (e.g. on scroll into view), not blocking initial page load
- **Prefer CSS over JS** for effects that CSS can handle natively (transitions, simple hovers) — reserve JS animation libraries for choreography CSS can't express
- **Code-split** — don't bundle 3D/shader libraries into the initial JS payload if they're only used in one section
- **Optimize images** — compress and serve the profile photo and any visual assets in modern formats (WebP/AVIF) with appropriate sizing
- **Cache static output** — since this is a static export, ensure hosting (Vercel/Netlify) serves it with proper caching headers by default (their defaults are fine here — no extra config needed for a static site)

---

### 6. Engineering Requirements

- Fully responsive: desktop, tablet, mobile — verify at multiple viewport sizes
- Semantic HTML and full keyboard accessibility
- Modular, maintainable component architecture
- Animations must never block content readability or interfere with usability
- Accessible color contrast throughout

---

### 7. Section-Specific Notes

- **Hero:** This is the one place a bigger visual moment (R3F or ShaderGradient) is justified — it's the first impression. Keep it purposeful, not busy.
- **Projects (placeholder):** Since there's nothing to show yet, avoid an empty-grid look — a single well-designed "more coming soon" statement is better than a hollow 3-card template.
- **Contact form:** Motion here should be minimal and functional (field focus states, submit confirmation) — this is a utility moment, not a showcase moment.
