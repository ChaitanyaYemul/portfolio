# Product Requirements Document
## Personal Portfolio Website — Chaitanya Yemul

---

### 1. Overview

| Field | Detail |
|---|---|
| **Owner** | Chaitanya Yemul |
| **Purpose** | A personal portfolio website to establish an online professional presence while targeting placements as an Aspiring SDE |
| **Style** | Premium, editorial, human-designed feel — not a generic AI-template look (full detail in companion **DESIGN.md**) |
| **Hosting** | Vercel / Netlify (free tier) |
| **Build method** | Manus AI (end-to-end generation) |
| **Type** | Static site — no backend/database/login required; contact form uses a free third-party form service (Formspree/Web3Forms/Netlify Forms) |

> This PRD covers content and structure. Visual/interaction direction lives in **DESIGN.md**; a content-only summary for quick reference lives in **PRODUCT.md**. Give Manus all three documents together.

---

### 2. Goals

- Present a clean, recruiter-friendly first impression
- Highlight current skills and learning direction (backend development)
- Leave clear room to grow — a "Projects" section that can be filled in later without a redesign
- Keep it lightweight and free to host

---

### 3. Target Audience

- Recruiters / HR at service-based companies (placement season)
- Peers, seniors, and CESAC members
- Anyone Chaitanya shares the link with (LinkedIn, resume, GitHub bio)

---

### 4. Site Structure & Content

#### 4.1 Header / Hero Section
- **Name:** Chaitanya Yemul
- **Title/Tagline:** Aspiring SDE
- **Photo:** Personal photo, displayed at half size (not a full-width banner)
- Optional short one-line intro under the name (e.g. "Tech enthusiast | Backend Developer in the making")

#### 4.2 About Me
> I am a tech enthusiast with a strong interest in Python and FastAPI-based backend development. I'm currently focused on strengthening my backend development skills, and in the future, I plan to explore Applied AI and Agentic AI.

#### 4.3 Skills
Grouped for clarity:
- **Languages:** Python, C++
- **Backend:** FastAPI (currently learning)
- **Database:** SQL, MySQL
- **Frontend:** HTML, CSS, JavaScript

#### 4.4 Experience / Journey
A timeline-style or card-style section instead of a formal work-experience list:
- **Second-Year BTech CSE Student** — Vishwakarma Institute of Technology (VIT), Pune
- **Head, Technical Team** — CESAC (Computer Engineering Student Association Committee), CSE Department

#### 4.5 Projects (Placeholder)
- No projects listed yet by design
- Show a placeholder card/message: *"Projects in progress — new work will be added here soon."*
- Structure the section so new project cards can be dropped in later without rebuilding the page

#### 4.6 Resume
- "Download Resume" button
- Placeholder for now — link can be wired up later once the PDF is ready (button can be disabled or show "Coming soon")

#### 4.7 Contact Section
A "Get in Touch" section with two parts:
- **Contact form** — Name, Email, Message fields with a Send button. Since this is a static site, wire it to a form backend such as Formspree, Web3Forms, or Netlify Forms (all free tiers) so submissions land directly in the inbox below without needing custom backend code.
- **Direct details / social links** (shown alongside the form):
  - **Email:** chaitanyayemul39@gmail.com
  - **Location:** Pune, Maharashtra
  - **GitHub:** https://github.com/ChaitanyaYemul
  - **LinkedIn:** https://www.linkedin.com/in/chaitanya-yemul-831b15330
  - **LeetCode:** https://leetcode.com/u/Chaitanya1410/
  - **Instagram:** https://www.instagram.com/chaitanya_yemul/

#### 4.8 Footer
- Simple copyright line + repeat of key social icons

---

### 5. Explicitly Out of Scope
- No achievements/certificates section
- No blog
- No e-commerce, login, or database features
- No project listings at launch (placeholder only)

---

### 6. Non-Functional Requirements
- Fully responsive (mobile, tablet, desktop)
- Fast-loading, minimal animations
- Accessible color contrast (professional palette — neutrals with one accent color)
- Free hosting compatible (static export from Manus, deployed via Vercel/Netlify)
- Codebase should be exportable/owned by Chaitanya (not locked into a proprietary platform)

---

### 7. Success Criteria
- Site is live on a free hosting URL
- All sections above are present and content-accurate
- Placeholder sections (Projects, Resume) are clearly marked as "coming soon" rather than left broken or empty-looking
- Site looks credible enough to share with recruiters/placement cell
