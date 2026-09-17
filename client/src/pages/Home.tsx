import { FormEvent, useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Send,
  X,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const links = [
  ["About", "about"],
  ["Skills", "skills"],
  ["Journey", "journey"],
  ["Projects", "projects"],
  ["Resume", "resume"],
  ["Contact", "contact"],
] as const;

const socials = [
  { label: "GitHub", href: "https://github.com/ChaitanyaYemul", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/chaitanya-yemul-831b15330", icon: Linkedin },
  { label: "LeetCode", href: "https://leetcode.com/u/Chaitanya1410/", icon: ArrowUpRight },
  { label: "Instagram", href: "https://www.instagram.com/chaitanya_yemul/", icon: Instagram },
];
const MAX_MESSAGE_LENGTH = 500;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [messageLength, setMessageLength] = useState(0);
  const [activeSection, setActiveSection] = useState("top");
  const modalRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setMenuOpen(false);
  const aboutReveal = useScrollReveal<HTMLDivElement>();
  const skillsReveal = useScrollReveal<HTMLDivElement>();
  const journeyReveal = useScrollReveal<HTMLDivElement>();
  const projectsReveal = useScrollReveal<HTMLDivElement>();
  const resumeReveal = useScrollReveal<HTMLDivElement>();
  const contactReveal = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    const sections = ["top", ...links.map(([, id]) => id)]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-24% 0px -24% 0px", threshold: [0.05, 0.2, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
        setActiveSection("contact");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (formState !== "success") return;
    const modal = modalRef.current;
    if (!modal) return;
    const focusable = () => Array.from(modal.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'));
    focusable()[0]?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSuccessModal();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [formState]);

  function closeSuccessModal() {
    setFormState("idle");
    window.requestAnimationFrame(() => submitButtonRef.current?.focus());
  }

  function scrollToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setActiveSection(id);
    closeMenu();
  }

  function validateField(name: string, value: string) {
    if (!value.trim()) return "This field is required.";
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
    return "";
  }

  function handleFieldChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.currentTarget;
    if (name === "message") setMessageLength(value.length);
    setFieldErrors((current) => ({ ...current, [name]: validateField(name, value) }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const nextErrors = ["name", "email", "message"].reduce<Record<string, string>>((errors, name) => {
      const message = validateField(name, String(values.get(name) ?? ""));
      if (message) errors[name] = message;
      return errors;
    }, {});
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setFormState("submitting");
    setErrorMessage("");

    try {
      const formData = new FormData(form);
      if (String(formData.get("_gotcha") ?? "").trim()) {
        setFormState("idle");
        return;
      }
      const response = await fetch("https://formspree.io/f/mzezbgpy", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("The message could not be sent.");
      form.reset();
      setMessageLength(0);
      setFormState("success");
    } catch {
      setFormState("error");
      setErrorMessage("Something went wrong while sending your message. Please email me directly instead.");
    }
  }

  return (
    <main className="site-shell">
      <header className="site-header" style={{backgroundColor: '#ffffff'}}>
        <a className="wordmark" href="#top" onClick={closeMenu} aria-label="Chaitanya Yemul home">
          CY<span>.</span>
        </a>
        <nav className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label="Main navigation">
          {links.map(([label, id], index) => (
            <a key={id} className={activeSection === id ? "is-active" : undefined} href={`#${id}`} onClick={(event) => scrollToSection(event, id)} aria-current={activeSection === id ? "page" : undefined}>
              <span>{String(index + 1).padStart(2, "0")}</span>{label}
            </a>
          ))}
        </nav>
        <a className="header-contact" href="#contact" onClick={(event) => scrollToSection(event, "contact")}>Let's Talk <ArrowUpRight size={14} /></a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <section className="hero section-rule" id="top">
        <div className="hero-copy reveal-up">
          <p className="eyebrow">Portfolio / 01</p>
          <h1>Chaitanya<br /><em>Yemul.</em></h1>
          <div className="hero-meta">
            <p>Aspiring SDE</p>
            <p>Tech enthusiast <span>|</span> Backend Developer in the making</p>
          </div>
          <a className="circle-link" href="#about" aria-label="Scroll to About"><ArrowDown size={23} /></a>
        </div>
        <div className="hero-art reveal-image">
          <div className="portrait-frame"><img src="/chaitanya.png" alt="Chaitanya Yemul" fetchPriority="high" /></div>
          <div className="hero-japanese" aria-hidden="true"><b>まだまだ、</b><b>これからだ。</b><span>STILL A LONG<br />WAY TO GO.</span></div>
          <span className="portrait-note">Based in Pune, Maharashtra</span>
        </div>
        <div className="hero-index" aria-hidden="true">01 <span>/</span> 06</div>
      </section>

      <section className="about-skill section-rule" id="about">
        <div className="split-panel about-panel scroll-reveal" ref={aboutReveal}>
          <div className="section-number">01</div>
          <div className="about-content">
            <p className="lead-copy">I am a tech enthusiast with a strong interest in <span>Python</span> and <span>FastAPI-based backend development.</span></p>
            <p className="body-copy">I'm currently focused on strengthening my backend development skills, and in the future, I plan to explore Applied AI and Agentic AI.</p>
          </div>
        </div>
        <div className="split-panel skill-panel scroll-reveal" id="skills" ref={skillsReveal}>
          <div className="section-number">02</div>
          <div className="skills-content">
            <h2 className="skills-heading">Tech<br /><em>Stack</em></h2>
            <div className="skill-list">
              <div className="skill-row"><span>01</span><div><small>Languages</small><p>Python <i>·</i> C++</p></div></div>
              <div className="skill-row"><span>02</span><div><small>Backend</small><p>FastAPI <b>currently learning</b></p></div></div>
              <div className="skill-row"><span>03</span><div><small>Database</small><p>SQL <i>·</i> MySQL</p></div></div>
              <div className="skill-row"><span>04</span><div><small>Frontend</small><p>HTML <i>·</i> CSS <i>·</i> JavaScript</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="journey section-rule scroll-reveal" id="journey" ref={journeyReveal}>
        <div className="section-number">03</div>
        <div className="journey-content">
          <h2 className="journey-heading">Journey</h2>
          <div className="journey-track">
            <div className="journey-line" />
            <article><span>Student</span><h3>Second-Year BTech CSE Student</h3><p>Vishwakarma Institute of Technology (VIT), Pune</p></article>
            <article><span>Role</span><h3>Head, Technical Team</h3><p>CESAC (Computer Engineering Student Association Committee), CSE Department</p></article>
          </div>
        </div>
      </section>

      <section className="projects section-rule scroll-reveal" id="projects" ref={projectsReveal}>
        <div className="section-number">04</div>
        <div className="projects-content">
          <h2 className="projects-heading">Projects</h2>
          <div className="project-card">
            <span className="card-index">04 / 06</span>
            <ArrowUpRight className="card-arrow" size={18} />
            <p>Projects in progress — new work will be added here soon.</p>
            <div className="card-stripe" />
          </div>
        </div>
      </section>

      <section className="resume section-rule scroll-reveal" id="resume" ref={resumeReveal}>
        <div className="section-number">05</div>
        <div className="resume-content">
          <div><p className="resume-kicker">A work in progress</p><h2>Download<br /><em>Resume.</em></h2></div>
          <div className="resume-action"><span>Resume PDF</span><button type="button" disabled>Coming soon <ArrowUpRight size={16} /></button></div>
        </div>
      </section>

      <section className="contact section-rule scroll-reveal" id="contact" ref={contactReveal}>
        <div className="section-number">06</div>
        <div className="contact-content">
          <div className="contact-details">
            <h2>Get in<br /><em>touch.</em></h2>
            <div className="direct-details">
              <a href="mailto:chaitanyayemul39@gmail.com"><Mail size={17} />chaitanyayemul39@gmail.com</a>
              <span><MapPin size={17} />Pune, Maharashtra</span>
            </div>
            <div className="social-links">{socials.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer">{label}<Icon size={15} /></a>)}</div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input className="honeypot" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="form-row">
              <label><span>Name</span><input name="name" required placeholder="Your name" onChange={handleFieldChange} aria-invalid={Boolean(fieldErrors.name)} aria-describedby={fieldErrors.name ? "name-error" : undefined} />{fieldErrors.name && <small id="name-error" className="field-error">{fieldErrors.name}</small>}</label>
              <label><span>Email</span><input name="email" type="email" required placeholder="you@example.com" onChange={handleFieldChange} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "email-error" : undefined} />{fieldErrors.email && <small id="email-error" className="field-error">{fieldErrors.email}</small>}</label>
            </div>
            <label><span>Message</span><textarea name="message" required maxLength={MAX_MESSAGE_LENGTH} placeholder="Tell me a little about it..." rows={4} onChange={handleFieldChange} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? "message-error message-count" : "message-count"} />{fieldErrors.message && <small id="message-error" className="field-error">{fieldErrors.message}</small>}<small id="message-count" className={messageLength >= MAX_MESSAGE_LENGTH ? "message-counter is-full" : "message-counter"}>{messageLength}/{MAX_MESSAGE_LENGTH}</small></label>
            <button ref={submitButtonRef} className="send-button" type="submit" disabled={formState === "submitting"}>{formState === "submitting" ? <><span className="submit-spinner" aria-hidden="true" />Sending…</> : <>Send Message <Send size={16} /></>}</button>
            <p className={formState === "error" ? "form-note form-note-error" : "form-note"}>{formState === "error" ? errorMessage : "Your message will be sent securely via Formspree."}</p>
          </form>
        </div>
      </section>

      {formState === "success" && (
        <div className="success-modal-backdrop" role="presentation" onClick={closeSuccessModal}>
          <div ref={modalRef} className="success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title" onClick={(event) => event.stopPropagation()}>
            <div className="success-mark"><Check size={20} /></div>
            <p className="resume-kicker">Message received</p>
            <h2 id="success-title">Thanks for<br /><em>reaching out.</em></h2>
            <p className="success-copy">Your message is on its way. I’ll get back to you as soon as I can.</p>
            <button className="send-button success-close" type="button" onClick={closeSuccessModal}>Close <ArrowUpRight size={16} /></button>
          </div>
        </div>
      )}

      <footer className="site-footer">
        <a className="wordmark" href="#top">CY<span>.</span></a>
        <span>© Chaitanya Yemul</span>
        <span>Portfolio</span>
        <div className="footer-socials" aria-label="Social links">
          {socials.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}><Icon size={14} /></a>)}
        </div>
        <a className="back-to-top" href="#top">Back to top <ArrowUpRight size={14} /></a>
      </footer>
    </main>
  );
}
