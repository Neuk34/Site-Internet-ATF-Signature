"use client";
/* eslint-disable @next/next/no-html-link-for-pages */
import { Fragment, useEffect, useRef, useState } from "react";
import { siteConfig } from "./config";
import { buildWhatsappUrl, findService, getBeforeAfterMedia, pad2 } from "./config/helpers";
import type { MediaSlot, ServiceDefinition } from "./config/types";

type Project = string;

const aboutKey = siteConfig.nav.aboutPath.replace(/^\//, "");

const nav = [
  { label: siteConfig.nav.homeLabel, key: "accueil", href: "/" },
  ...siteConfig.services.map((service) => ({ label: service.navLabel, key: service.key, href: `/${service.key}` })),
  { label: siteConfig.nav.aboutLabel, key: aboutKey, href: siteConfig.nav.aboutPath },
];

function Logo() {
  const { logo } = siteConfig.media;
  return (
    <img
      src={logo.src}
      alt={logo.alt}
      width={1536}
      height={1024}
      loading="eager"
      style={{ aspectRatio: logo.aspectRatio, objectPosition: logo.objectPosition ?? "top" }}
    />
  );
}

function ContactButton() {
  return (
    <a
      className="site-contact-button"
      href={siteConfig.contact.phoneHref}
      aria-label={`Nous contacter au ${siteConfig.contact.phoneDisplay}`}
    >
      <img src="/media/contact-button.png" alt="" width={1832} height={858} />
    </a>
  );
}

/** Bande discrète au-dessus du header (jamais dans le header lui-même) : aucune
 *  superposition possible avec le logo, le menu ou les CTA quelle que soit la largeur. */
function SocialBar() {
  const social = siteConfig.social;
  if (!social) return null;
  return (
    <div className="social-bar">
      <span className="social-bar-label">Rejoignez-nous sur :</span>
      {social.facebook && (
        <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="social-icon social-icon--facebook" aria-label="ATF Signature sur Facebook">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.87.24-1.46 1.49-1.46H16.5V4.36C16.24 4.32 15.32 4.25 14.24 4.25c-2.24 0-3.78 1.37-3.78 3.88V10.5H8v3h2.46V21h3.04Z" />
          </svg>
        </a>
      )}
      {social.instagram && (
        <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="social-icon social-icon--instagram" aria-label="ATF Signature sur Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>
      )}
      {social.tiktok && (
        <a href={social.tiktok} target="_blank" rel="noopener noreferrer" className="social-icon social-icon--tiktok" aria-label="ATF Signature sur TikTok">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z" />
          </svg>
        </a>
      )}
    </div>
  );
}

type MediaOverlay = "hero" | "avant" | "apres" | "portrait";

function Media({ slot, overlay }: { slot: MediaSlot; overlay: MediaOverlay }) {
  const className = ["media", `media--${overlay}`, slot.isPlaceholder && "is-placeholder"].filter(Boolean).join(" ");
  return (
    <div
      className={className}
      role="img"
      aria-label={slot.alt}
      style={{ "--media-src": `url(${slot.src})` } as React.CSSProperties}
    >
      {slot.isPlaceholder && (
        <>
          <small>PROTOTYPE</small>
          <strong>{slot.placeholderLabel ?? slot.alt}</strong>
        </>
      )}
    </div>
  );
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function BeforeAfter({ subject, mediaKey }: { subject: string; mediaKey: string }) {
  const [view, setView] = useState<"avant" | "apres">("apres");
  const stock = getBeforeAfterMedia(siteConfig, mediaKey)[view];
  const slot: MediaSlot = {
    src: stock.src,
    alt: `${subject} — photo ${view}`,
    isPlaceholder: stock.isPlaceholder,
    placeholderLabel: `${subject} — photo ${view} à insérer`,
    stockCredit: stock.stockCredit,
  };
  return (
    <div className="comparison">
      <div className="tabs" aria-label={`Comparer ${subject}`}>
        <button aria-pressed={view === "avant"} onClick={() => setView("avant")}>
          Avant
        </button>
        <button aria-pressed={view === "apres"} onClick={() => setView("apres")}>
          Après
        </button>
      </div>
      <div key={view} className="fade">
        <Media slot={slot} overlay={view} />
      </div>
    </div>
  );
}

function Process() {
  const { process } = siteConfig;
  return (
    <section className="section process">
      <div className="process-intro">
        <p className="eyebrow">{process.eyebrow}</p>
        <h2>
          {process.title.split("\n").map((line, index) => (
            <Fragment key={line}>
              {index > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </h2>
        <p>{process.text}</p>
      </div>
      <ol>
        {process.steps.map((step, index) => (
          <li key={step.title}>
            <span>{pad2(index + 1)}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function CommercialSelector({ quote }: { quote: (project?: Project) => void }) {
  const { selector } = siteConfig.business;
  const { services } = siteConfig;
  return (
    <section className="quick-project">
      <div className="before-showcase">
        <p className="eyebrow">{selector.eyebrow}</p>
        <h2>{selector.title}</h2>
        <div className="before-grid">
          {services.map((service) => (
            <article key={service.key}>
              <h3>{service.comparatorLabel}</h3>
              <BeforeAfter subject={service.comparatorLabel} mediaKey={service.mediaKey} />
            </article>
          ))}
        </div>
      </div>
      <div className="quick-intro">
        <p className="eyebrow">{selector.intro.eyebrow}</p>
        <h2>{selector.intro.title}</h2>
        <p>{selector.intro.text}</p>
      </div>
      <div className="quick-choices">
        {services.map((service, index) => (
          <button key={service.key} onClick={() => quote(service.projectLabel)}>
            <span>{pad2(index + 1)}</span>
            <b>{service.quickChoice.title}</b>
            <small>{service.quickChoice.subtitle}</small>
          </button>
        ))}
        <button onClick={() => quote()}>
          <span>{pad2(services.length + 1)}</span>
          <b>{selector.fallbackChoice.title}</b>
          <small>{selector.fallbackChoice.subtitle}</small>
        </button>
      </div>
      <p className="quick-note">{selector.note}</p>
    </section>
  );
}

function Guarantees() {
  const { guarantees } = siteConfig.business;
  return (
    <section className="section guarantees">
      <div>
        <p className="eyebrow">{guarantees.eyebrow}</p>
        <h2>{guarantees.title}</h2>
      </div>
      <div className="guarantee-grid">
        {guarantees.items.map((item, index) => (
          <article key={item.title}>
            <span>{pad2(index + 1)}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Philosophy({ quote: _quote }: { quote: (project?: Project) => void }) {
  const { philosophy } = siteConfig.business;
  return (
    <section className="section philosophy">
      <p className="eyebrow">{philosophy.eyebrow}</p>
      <h2>{philosophy.title}</h2>
      <p className="lede">{philosophy.text}</p>
    </section>
  );
}

export function Prototype({ initialPage }: { initialPage: string }) {
  const [menu, setMenu] = useState(false);
  const [step, setStep] = useState(1);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [project, setProject] = useState<Project | "">("");
  const [commune, setCommune] = useState("");
  const [periode, setPeriode] = useState("");
  const [budget, setBudget] = useState("");
  const [besoin, setBesoin] = useState("");
  const formRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const requested = new URLSearchParams(location.search).get("projet");
    if (requested && siteConfig.services.some((service) => service.projectLabel === requested)) {
      // Synchronisation volontaire avec le contexte transmis par le CTA de la page précédente.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProject(requested);
    }
    if (location.hash === "#devis") setQuoteOpen(true);
  }, []);

  useEffect(() => {
    if (!quoteOpen) return;
    const modal = modalRef.current;
    const focusable = () =>
      Array.from(
        modal?.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])') ?? [],
      ).filter((element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true");
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setQuoteOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const elements = focusable();
      if (!elements.length) {
        event.preventDefault();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const focusFrame = requestAnimationFrame(() => modal?.querySelector<HTMLElement>(".quote-modal-close")?.focus());
    document.addEventListener("keydown", handleKey);
    document.body.classList.add("modal-open");
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKey);
      document.body.classList.remove("modal-open");
      triggerRef.current?.focus();
    };
  }, [quoteOpen]);

  const quote = (selected?: Project) => {
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (selected) setProject(selected);
    setStep(1);
    if (initialPage === "accueil") {
      setQuoteOpen(true);
    } else {
      location.href = `/?projet=${encodeURIComponent(selected || project)}#devis`;
    }
  };

  const currentService = siteConfig.services.find((service) => service.key === initialPage);
  const preset = currentService?.projectLabel;

  return (
    <div>
      <SocialBar />
      <header>
        <div className="wordmark">
          <Logo />
        </div>
        <ContactButton />
        <button className="menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>
          {menu ? "Fermer" : "Menu"}
        </button>
        <nav className={menu ? "open" : ""}>
          {nav.map((item) => (
            <a key={item.key} href={item.href} aria-current={initialPage === item.key ? "page" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
      </header>
      <main>
        {initialPage === "accueil" ? (
          <Home quote={quote} />
        ) : initialPage === aboutKey ? (
          <About quote={quote} />
        ) : (
          <Universe service={findService(siteConfig, initialPage)} quote={quote} />
        )}
      </main>
      {quoteOpen && (
        <div
          className="quote-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setQuoteOpen(false);
          }}
        >
          <div ref={modalRef} className="quote-modal-panel">
            <button className="quote-modal-close" type="button" onClick={() => setQuoteOpen(false)} aria-label="Fermer le formulaire">
              ×
            </button>
            <Form
              ref={formRef}
              project={project}
              setProject={setProject}
              commune={commune}
              setCommune={setCommune}
              periode={periode}
              setPeriode={setPeriode}
              budget={budget}
              setBudget={setBudget}
              besoin={besoin}
              setBesoin={setBesoin}
              step={step}
              setStep={setStep}
            />
          </div>
        </div>
      )}
      <LegalFooter />
      <div className="sticky">
        <a
          href="#devis"
          onClick={(event) => {
            event.preventDefault();
            quote(preset);
          }}
        >
          Mon projet
        </a>
        <button
          onClick={() => quote(preset)}
          style={
            {
              "--quote-badge-line1": `"${siteConfig.cta.stickyQuoteBadge.line1}"`,
              "--quote-badge-line2": `"${siteConfig.cta.stickyQuoteBadge.line2}"`,
            } as React.CSSProperties
          }
        >
          Demander un devis
        </button>
      </div>
    </div>
  );
}

function Home({ quote }: { quote: (project?: Project) => void }) {
  const { hero } = siteConfig.business;
  return (
    <>
      <section className="hero commercial-hero">
        <div>
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>
            {hero.headlineLead}
            <br />
            <em>{hero.headlineEmphasis}</em>
          </h1>
          <p className="lede">{hero.text}</p>
          <div className="hero-benefits">
            {hero.benefits.map((benefit) => (
              <span key={benefit}>✓ {benefit}</span>
            ))}
          </div>
          <small>{hero.footnote}</small>
        </div>
        <Media slot={siteConfig.media.heroImage} overlay="hero" />
      </section>
      <CommercialSelector quote={quote} />
      <Process />
      <Philosophy quote={quote} />
    </>
  );
}

function Universe({ service, quote }: { service: ServiceDefinition; quote: (project?: Project) => void }) {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.eyebrow,
    description: service.heroText,
    areaServed: siteConfig.serviceArea.label,
    provider: { "@type": "LocalBusiness", name: siteConfig.business.name },
  };
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <section className="pagehero">
        <p className="eyebrow">
          {service.eyebrow} · {siteConfig.serviceArea.city}
        </p>
        <h1>{service.heroTitle}</h1>
        <p className="lede">{service.heroText}</p>
        <button className="primary" onClick={() => quote(service.projectLabel)}>
          {service.ctaLabel}
        </button>
      </section>
      {service.groups.map((group) => (
        <section className="section" key={group.title}>
          <p className="eyebrow">{group.title}</p>
          <div className="chips">
            {group.items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>
      ))}
      {service.crossSell && (
        <section className="section">
          <p className="lede">
            {service.crossSell.textBefore}
            {service.crossSell.links.map((link, index) => (
              <Fragment key={link.serviceKey}>
                {index > 0 && (service.crossSell?.joiner ?? ", ")}
                <a href={`/${link.serviceKey}`}>{link.label}</a>
              </Fragment>
            ))}
            {service.crossSell.textAfter}
          </p>
        </section>
      )}
      {service.faq.length > 0 && (
        <section className="section">
          <p className="eyebrow">Questions fréquentes</p>
          <h2>Ce qu’il faut savoir</h2>
          {service.faq.map((entry) => (
            <div key={entry.question}>
              <h3>{entry.question}</h3>
              <p>{entry.answer}</p>
            </div>
          ))}
        </section>
      )}
      <section className="section quote">
        <p className="eyebrow">{siteConfig.leader.quoteEyebrow}</p>
        <blockquote>« {siteConfig.leader.quote} »</blockquote>
        {siteConfig.leader.quoteNote && <small>{siteConfig.leader.quoteNote}</small>}
      </section>
      <Guarantees />
      <section className="section reassurance">
        <p className="eyebrow">Vos repères</p>
        <div className="chips">
          {siteConfig.business.reassuranceChips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
      </section>
    </>
  );
}

function About({ quote: _quote }: { quote: (project?: Project) => void }) {
  const { leader, about, team } = siteConfig;
  const leaderJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: leader.name,
    jobTitle: leader.role,
    worksFor: { "@type": "LocalBusiness", name: siteConfig.business.name },
  };
  return (
    <>
      <JsonLd data={leaderJsonLd} />
      <section className="pagehero">
        <p className="eyebrow">{about.eyebrow}</p>
        <h1>{about.title}</h1>
        <p className="lede">{about.lede}</p>
      </section>
      {team.specialties.length > 0 && (
        <section className="section dark">
          <p className="eyebrow">{about.teamEyebrow}</p>
          <h2>{about.teamTitle}</h2>
          <div className="chips">
            {team.specialties.map((specialty, index) => (
              <span key={`${specialty}-${index}`}>{specialty}</span>
            ))}
          </div>
        </section>
      )}
      <section className="section split">
        <Media slot={siteConfig.media.leaderPortrait} overlay="portrait" />
        <div>
          <p className="eyebrow">{leader.shortEyebrow}</p>
          <h2>{leader.sectionTitle}</h2>
          {leader.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {leader.bioNote && <small>{leader.bioNote}</small>}
        </div>
      </section>
      <section className="section">
        <p className="eyebrow">{siteConfig.business.scope.eyebrow}</p>
        <h2>{siteConfig.business.scope.title}</h2>
        <p className="lede">{siteConfig.business.scope.text}</p>
      </section>
    </>
  );
}

const Form = ({
  project,
  setProject,
  commune,
  setCommune,
  periode,
  setPeriode,
  budget,
  setBudget,
  besoin,
  setBesoin,
  step,
  setStep,
  ref,
}: {
  project: Project | "";
  setProject: (value: Project) => void;
  commune: string;
  setCommune: (value: string) => void;
  periode: string;
  setPeriode: (value: string) => void;
  budget: string;
  setBudget: (value: string) => void;
  besoin: string;
  setBesoin: (value: string) => void;
  step: number;
  setStep: (value: number) => void;
  ref: React.Ref<HTMLElement>;
}) => {
  const { form } = siteConfig;
  return (
    <section id="devis" ref={ref} className="section form">
      <div>
        <p className="eyebrow">{form.eyebrow}</p>
        <h2>{form.title}</h2>
        <p>{form.intro}</p>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (step === 1) setStep(2);
        }}
      >
        {step === 1 ? (
          <fieldset>
            <legend>{form.step1Legend}</legend>
            <label>
              {form.projectLabel}
              <select value={project} onChange={(event) => setProject(event.target.value)} required>
                <option value="" disabled hidden>
                  {form.projectPlaceholder}
                </option>
                {siteConfig.services.map((service) => (
                  <option key={service.key} value={service.projectLabel}>
                    {service.projectLabel}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {form.communeLabel}
              <input value={commune} onChange={(event) => setCommune(event.target.value)} placeholder={form.communePlaceholder} required />
            </label>
            <label>
              {form.periodLabel}
              <input value={periode} onChange={(event) => setPeriode(event.target.value)} placeholder={form.periodPlaceholder} />
            </label>
            <label>
              {form.budgetLabel}
              <input value={budget} onChange={(event) => setBudget(event.target.value)} placeholder={form.budgetPlaceholder} />
            </label>
            <label>
              {form.needsLabel}
              <textarea value={besoin} onChange={(event) => setBesoin(event.target.value)} rows={3} placeholder={form.needsPlaceholder} />
            </label>
            <button className="primary" type="submit">
              {form.continueLabel}
            </button>
          </fieldset>
        ) : (
          <fieldset>
            <legend>{form.step2Legend}</legend>
            <label>
              {form.nameLabel}
              <input autoComplete="name" required />
            </label>
            <label>
              {form.phoneLabel}
              <input type="tel" autoComplete="tel" required />
            </label>
            <label>
              {form.emailLabel}
              <input type="email" autoComplete="email" required />
            </label>
            <label>
              {form.contactPreferenceLabel}
              <select>
                {form.contactPreferenceOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              {form.mediaUploadLabel}
              <input type="file" multiple accept="image/*,video/*" />
            </label>
            <label className="consent">
              <input type="checkbox" required />
              <span>
                {form.consentText} <a href="#confidentialite">{form.consentLinkLabel}</a>.
              </span>
            </label>
            <div className="actions">
              <button className="secondary" type="button" onClick={() => setStep(1)}>
                {form.backLabel}
              </button>
              <button className="primary">{form.submitLabel}</button>
            </div>
          </fieldset>
        )}
      </form>
    </section>
  );
};

function LegalFooter() {
  const { footer, legal, serviceArea, contact } = siteConfig;
  return (
    <footer>
      <div className="footer-main">
        <div>
          <div className="wordmark">
            <Logo />
          </div>
          <p>
            {footer.tagline}
            <br />
            {serviceArea.label}
          </p>
        </div>
        <div>
          <b>{footer.projectColumnTitle}</b>
          <a href="/#devis">{footer.quoteLinkLabel}</a>
          <a href={buildWhatsappUrl(contact)} target="_blank" rel="noreferrer">
            {footer.whatsappLinkLabel}
          </a>
        </div>
        <div>
          <b>{footer.infoColumnTitle}</b>
          <a href="#mentions-legales">{footer.legalLinkLabel}</a>
          <a href="#confidentialite">{footer.privacyLinkLabel}</a>
          <span>{footer.cookiesNote}</span>
        </div>
      </div>
      <div className="legal-panels">
        <details id="mentions-legales">
          <summary>{footer.legalLinkLabel}</summary>
          <p>
            <b>Éditeur :</b> {legal.editorLine}
          </p>
          <p>
            <b>Direction de la publication :</b> {legal.publicationDirectorLine}
          </p>
          <p>
            <b>Hébergement :</b> {legal.hostingLine}
          </p>
          <p>
            <b>Assurances et médiation :</b> {legal.insuranceLine}
          </p>
        </details>
        <details id="confidentialite">
          <summary>{footer.privacyPanelTitle}</summary>
          <p>{legal.privacyIntro}</p>
          <p>{legal.privacyPrototypeNote}</p>
        </details>
      </div>
      <small>{footer.disclaimer}</small>
    </footer>
  );
}
