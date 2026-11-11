import { FormEvent, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Link, NavLink, Outlet, ScrollRestoration, useLocation, useParams } from "react-router";

type Lang = "fr" | "en";
type Copy = { fr: string; en: string };
const t = (copy: Copy, lang: Lang) => copy[lang];

const img = {
  hero: "https://images.unsplash.com/photo-1793603368713-c74882aff201?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=88&w=1800",
  stadium:
    "https://images.unsplash.com/photo-1590412010786-bfd04240bbd0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1600",
  academy:
    "https://images.unsplash.com/photo-1652665314612-c48e10a01598?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
  children:
    "https://images.unsplash.com/photo-1631405234894-f3224573c864?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
  event:
    "https://images.unsplash.com/photo-1702569801740-478e819df85f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
  field:
    "https://images.unsplash.com/photo-1613332738142-c79288f25e09?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
  match:
    "https://images.unsplash.com/photo-1787532799664-d1717430da70?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
  media:
    "https://images.unsplash.com/photo-1707370531796-90bbe5bfeb4a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400",
};

const services = [
  {
    slug: "agence",
    num: "01",
    title: { fr: "Agence", en: "Agency" },
    subtitle: {
      fr: "Stratégie, sponsoring & connexions",
      en: "Strategy, sponsorship & connections",
    },
    text: {
      fr: "Nous imaginons et pilotons des stratégies de sponsoring qui connectent les bons acteurs et transforment les opportunités en résultats.",
      en: "We design and manage sponsorship strategies that connect the right stakeholders and turn opportunities into results.",
    },
    bullets: [
      { fr: "Conseil & stratégie", en: "Consulting & strategy" },
      { fr: "Partenariats sportifs", en: "Sports partnerships" },
      { fr: "Médias & visibilité", en: "Media & visibility" },
    ],
    image: img.stadium,
  },
  {
    slug: "marque",
    num: "02",
    title: { fr: "Marque", en: "Brand" },
    subtitle: {
      fr: "Image, crédibilité & impact commercial",
      en: "Image, credibility & business impact",
    },
    text: {
      fr: "Nous positionnons votre marque dans le sport avec des ambassadeurs et des activations capables de créer préférence, confiance et croissance.",
      en: "We position your brand in sports through ambassadors and activations that build preference, trust and growth.",
    },
    bullets: [
      { fr: "Plateforme de marque", en: "Brand platform" },
      { fr: "Ambassadeurs", en: "Ambassadors" },
      { fr: "Activation commerciale", en: "Business activation" },
    ],
    image: img.match,
  },
  {
    slug: "ecole-football",
    num: "03",
    title: { fr: "École de football", en: "Football academy" },
    subtitle: {
      fr: "Formation, détection & opportunités",
      en: "Training, scouting & opportunities",
    },
    text: {
      fr: "Nous offrons aux jeunes talents un cadre exigeant et humain, des stages internationaux et des passerelles vers clubs et institutions.",
      en: "We give young talent a demanding, supportive environment, international camps and pathways to clubs and institutions.",
    },
    bullets: [
      { fr: "Formation technique", en: "Technical training" },
      { fr: "Campus & stages", en: "Camps & clinics" },
      { fr: "Suivi individuel", en: "Individual monitoring" },
    ],
    image: img.academy,
  },
  {
    slug: "evenements",
    num: "04",
    title: { fr: "Événements", en: "Events" },
    subtitle: { fr: "Du concept au succès", en: "From concept to success" },
    text: {
      fr: "Nous concevons des expériences sportives mémorables et coordonnons sponsors, production, logistique et amplification média.",
      en: "We create memorable sports experiences and coordinate sponsors, production, logistics and media amplification.",
    },
    bullets: [
      { fr: "Concept & production", en: "Concept & production" },
      { fr: "Activation sponsors", en: "Sponsor activation" },
      { fr: "Audience & médias", en: "Audience & media" },
    ],
    image: img.event,
  },
];

const LangContext = createContext<{ lang: Lang; setLang: (lang: Lang) => void } | null>(null);
const useLang = () => {
  const value = useContext(LangContext);
  if (!value) throw new Error("Missing language context");
  return value;
};

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg className={diagonal ? "arrow diagonal" : "arrow"} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function BallMark() {
  return (
    <svg className="ball-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" />
      <path
        d="m50 28 15 11-6 18H41l-6-18 15-11ZM35 39l-16-1m22 19-10 14m28-14 10 14m-4-32 16-1M31 71l-2 15m40-15 2 15M50 28V12"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="facebook-icon" viewBox="0 0 24 24" aria-label="Facebook">
      <path
        fill="currentColor"
        d="M13.8 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H8v3h2.6v8h3.2Z"
      />
    </svg>
  );
}

function Label({
  n,
  children,
  light = false,
}: {
  n: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <div className={`page-label${light ? " light" : ""}`}>
      <span>{n}</span>
      {children}
    </div>
  );
}

const faqItems = [
  {
    fr: "Comment démarre une collaboration avec Proadvisory ?",
    en: "How does a collaboration with Proadvisory begin?",
    answerFr:
      "Nous commençons par un échange de cadrage pour comprendre vos objectifs, votre audience et vos ressources, puis nous proposons un plan d’action concret.",
    answerEn:
      "We start with a discovery call to understand your goals, audience and resources, then propose a concrete action plan.",
  },
  {
    fr: "Travaillez-vous avec les clubs et les entreprises ?",
    en: "Do you work with clubs and companies?",
    answerFr:
      "Oui. Nous connectons clubs, institutions, athlètes, associations, marques et entreprises autour de partenariats cohérents et activables.",
    answerEn:
      "Yes. We connect clubs, institutions, athletes, associations, brands and companies through coherent, actionable partnerships.",
  },
  {
    fr: "Pouvez-vous organiser un campus ou un événement complet ?",
    en: "Can you organize a full camp or event?",
    answerFr:
      "Oui, de la conception à la production : programme, partenaires, sponsors, logistique, communication et couverture média.",
    answerEn:
      "Yes, from concept to production: program, partners, sponsors, logistics, communication and media coverage.",
  },
  {
    fr: "Comment accéder aux dossiers de la médiathèque ?",
    en: "How can I access media library collections?",
    answerFr:
      "Chaque dossier possède une page dédiée. Pour recevoir les fichiers haute définition, contactez notre équipe en précisant le projet concerné.",
    answerEn:
      "Each collection has its own page. To receive high-resolution files, contact our team and specify the relevant project.",
  },
];

function FaqSection() {
  const { lang } = useLang();
  const [active, setActive] = useState(0);
  return (
    <section className="mp-faq">
      <div>
        <Label n="FAQ">
          {lang === "fr" ? "Questions fréquentes" : "Frequently asked questions"}
        </Label>
        <h2>
          {lang === "fr" ? "Tout ce qu’il faut" : "Everything you need"}
          <br />
          {lang === "fr" ? "savoir, " : "to know, "}
          <em>{lang === "fr" ? "simplement." : "simply."}</em>
        </h2>
      </div>
      <div className="mp-faq-list">
        {faqItems.map((item, index) => (
          <div className={active === index ? "open" : ""} key={item.fr}>
            <button onClick={() => setActive(active === index ? -1 : index)}>
              <span>0{index + 1}</span>
              {lang === "fr" ? item.fr : item.en}
              <i>{active === index ? "−" : "+"}</i>
            </button>
            <p>{lang === "fr" ? item.answerFr : item.answerEn}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const { lang } = useLang();
  const items = [
    {
      quote: {
        fr: "Une approche claire, structurée et proche du terrain. Proadvisory sait transformer une ambition sportive en projet mobilisateur.",
        en: "A clear, structured and field-focused approach. Proadvisory turns sporting ambition into an engaging project.",
      },
      name: "Dimsport 10",
      role: { fr: "École de football affiliée", en: "Affiliated football academy" },
    },
    {
      quote: {
        fr: "Une vraie capacité à connecter les acteurs, valoriser l’image et donner aux partenariats une dimension concrète.",
        en: "A real ability to connect stakeholders, enhance image and give partnerships a concrete dimension.",
      },
      name: "Corpo Sport Events",
      role: { fr: "Partenaire événementiel", en: "Event partner" },
    },
    {
      quote: {
        fr: "Un accompagnement engagé qui place le développement des talents et la performance au cœur de chaque action.",
        en: "Committed support that puts talent development and performance at the heart of every action.",
      },
      name: "Proadvisory 2.0",
      role: { fr: "Institution affiliée · La Spezia", en: "Affiliated institution · La Spezia" },
    },
  ];
  return (
    <section className="mp-testimonials">
      <Label n="04" light>
        {lang === "fr" ? "Ce qu’ils disent de nous" : "What they say about us"}
      </Label>
      <div className="mp-testimonial-heading">
        <h2>
          {lang === "fr" ? "La confiance se" : "Trust is built"}
          <br />
          {lang === "fr" ? "construit sur le " : "on the "}
          <em>{lang === "fr" ? "terrain." : "field."}</em>
        </h2>
        <p>
          {lang === "fr"
            ? "Des collaborations fondées sur l’écoute, la stratégie et des résultats partagés."
            : "Collaborations built on listening, strategy and shared results."}
        </p>
      </div>
      <div className="mp-testimonial-window">
        <div className="mp-testimonial-cards">
          {[...items, ...items].map((item, index) => (
            <article key={`${item.name}-${index}`}>
              <span>“</span>
              <blockquote>{t(item.quote, lang)}</blockquote>
              <div>
                <strong>{item.name}</strong>
                <small>{t(item.role, lang)}</small>
              </div>
              <i>0{(index % items.length) + 1}</i>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerStrip() {
  const { lang } = useLang();
  const names = [
    "Ascavet",
    "Dimsport 10",
    "Timo Sport Kribi",
    "Nyong E Kelle Volley Ball",
    "Corpo Sport Events",
    "Dimsport 10 Douala",
    "Proadvisory 2.0 La Spezia",
  ];
  return (
    <section className="mp-partner-strip">
      <div>
        <span>{lang === "fr" ? "Ils nous font confiance" : "They trust us"}</span>
        <Link to="/partenaires">
          {lang === "fr" ? "Tous les partenaires" : "All partners"} <Arrow />
        </Link>
      </div>
      <div>
        {names.map((name) => (
          <span key={name}>{name}</span>
        ))}
      </div>
    </section>
  );
}

export function Root() {
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem("proadvisory-language") as Lang) || "fr",
  );
  const change = (next: Lang) => {
    localStorage.setItem("proadvisory-language", next);
    setLang(next);
  };
  return (
    <LangContext.Provider value={{ lang, setLang: change }}>
      <Layout />
    </LangContext.Provider>
  );
}

function Layout() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = "";
    document.documentElement.lang = lang;
    document.title = "Proadvisory — Sponsor & Sport Marketing";
  }, [location.pathname, lang]);
  return (
    <>
      <header className="multipage-header">
        <Link className="mp-brand" to="/">
          <img src="/proadvisory-logo-white.png" alt="Proadvisory Sponsor & Sport Marketing" />
        </Link>
        <nav className={open ? "mp-nav open" : "mp-nav"}>
          <NavLink to="/agence">{lang === "fr" ? "Agence" : "Agency"}</NavLink>
          <NavLink to="/expertises">{lang === "fr" ? "Expertises" : "Services"}</NavLink>
          <NavLink to="/partenaires">{lang === "fr" ? "Partenaires" : "Partners"}</NavLink>
          <NavLink to="/mediatheque">{lang === "fr" ? "Médiathèque" : "Media"}</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <div className="mp-tools">
          <div className="lang-switch">
            <button className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>
              FR
            </button>
            <span>/</span>
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
              EN
            </button>
          </div>
          <Link className="quote-btn" to="/contact">
            {lang === "fr" ? "Demande de devis" : "Get a quote"} <Arrow />
          </Link>
          <button
            className="mp-menu"
            onClick={() => {
              setOpen(!open);
              document.body.style.overflow = !open ? "hidden" : "";
            }}
            aria-label="Menu"
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <Outlet />
      <Footer />
      <a
        className="whatsapp-float"
        href="https://wa.me/393533707645"
        target="_blank"
        rel="noreferrer"
      >
        <svg viewBox="0 0 32 32">
          <path
            fill="currentColor"
            d="M16 3A12.8 12.8 0 0 0 5.1 22.5L3.4 29l6.7-1.7A12.9 12.9 0 1 0 16 3Zm0 23.4c-2 0-3.8-.5-5.5-1.5l-.4-.2-4 .9 1.1-3.8-.3-.4A10.5 10.5 0 1 1 16 26.4Zm5.8-7.8c-.3-.2-1.9-1-2.2-1-.3-.2-.5-.2-.8.2l-1 1.2c-.2.3-.4.3-.7.1-2-.9-3.2-1.7-4.5-4-.3-.6.3-.6.9-1.4.2-.2.2-.5.1-.7l-1-2.5c-.3-.6-.6-.5-.8-.5h-.7c-.3 0-.7.1-1 .5-.4.4-1.4 1.4-1.4 3.5s1.5 4 1.7 4.3c.2.3 3 4.6 7.3 6.4 2.7 1.2 3.8 1.2 5.2 1 .8-.2 2-1 2.2-1.8.3-.8.3-1.5.2-1.7-.1-.2-.3-.3-.6-.5Z"
          />
        </svg>
      </a>
      <ScrollRestoration />
    </>
  );
}

function Footer() {
  const { lang } = useLang();
  return (
    <footer className="mp-footer">
      <div className="mp-footer-marquee">
        <span>Let’s connect</span>
        <BallMark />
        <span>Créons l’impact</span>
        <BallMark />
        <span>Let’s connect</span>
      </div>
      <Label n="06" light>
        {lang === "fr" ? "Faisons équipe" : "Let’s team up"}
      </Label>
      <div className="mp-footer-cta">
        <h2>
          {lang === "fr" ? "Votre prochain impact" : "Your next impact"}
          <br />
          {lang === "fr" ? "commence " : "starts "}
          <em>{lang === "fr" ? "ici." : "here."}</em>
        </h2>
        <Link to="/contact">
          <Arrow diagonal />
        </Link>
      </div>
      <div className="mp-footer-grid">
        <div>
          <strong>PROADVISORY</strong>
          <p>“Connect Matter’s & Brand Impact For The Real”</p>
        </div>
        <div>
          <span>Contact</span>
          <a href="tel:+393533707645">+39 353 370 7645</a>
          <a href="mailto:contact@proadvisory.com">contact@proadvisory.com</a>
          <a href="https://wa.me/393533707645">WhatsApp</a>
        </div>
        <div>
          <span>{lang === "fr" ? "Réseaux" : "Social"}</span>
          <a className="social-icon-link" href="https://www.facebook.com/Pro_Advisor">
            <FacebookIcon />
          </a>
        </div>
        <div>
          <span>{lang === "fr" ? "Présence" : "Presence"}</span>
          <p>Italia · Cameroun · France</p>
        </div>
      </div>
      <div className="mp-footer-bottom">
        <span>© {new Date().getFullYear()} Proadvisory SRL</span>
        <span>Sponsor & Sport Marketing</span>
      </div>
    </footer>
  );
}

function PageHero({
  eyebrow,
  title,
  text,
  image,
}: {
  eyebrow: Copy;
  title: Copy;
  text: Copy;
  image?: string;
}) {
  const { lang } = useLang();
  return (
    <section className="mp-page-hero">
      {image && <img src={image} alt="" />}
      <div className="mp-hero-shade" />
      <div className="mp-page-hero-content">
        <span>{t(eyebrow, lang)}</span>
        <h1>{t(title, lang)}</h1>
        <p>{t(text, lang)}</p>
      </div>
    </section>
  );
}

function ServiceRows() {
  const { lang } = useLang();
  return (
    <div className="mp-service-list">
      {services.map((service) => (
        <Link to={`/expertises/${service.slug}`} key={service.slug}>
          <span>[{service.num}]</span>
          <h3>{t(service.title, lang)}</h3>
          <p>{t(service.subtitle, lang)}</p>
          <Arrow diagonal />
        </Link>
      ))}
    </div>
  );
}

export function HomePage() {
  const { lang } = useLang();
  return (
    <main>
      <section className="mp-home-hero">
        <img src={img.hero} alt="Football" />
        <div className="mp-hero-shade" />
        <div className="mp-home-content">
          <span>Sponsor & Sport Marketing · Italia / Africa</span>
          <p className="mp-slogan">“Connect Matter’s & Brand Impact For The Real”</p>
          <h1>
            {lang === "fr" ? "Connecter les " : "Connect "}
            <em>{lang === "fr" ? "talents." : "talent."}</em>
            <br />
            {lang === "fr" ? "Activer les " : "Activate "}
            <strong>{lang === "fr" ? "marques." : "brands."}</strong>
          </h1>
          <div className="mp-home-bottom">
            <p>
              {lang === "fr"
                ? "Nous créons les connexions qui font grandir le sport, les marques et les communautés."
                : "We create connections that help sports, brands and communities grow."}
            </p>
            <Link to="/agence">
              <Arrow diagonal />
            </Link>
          </div>
        </div>
      </section>
      <section className="mp-split">
        <div>
          <Label n="01">{lang === "fr" ? "Notre agence" : "Our agency"}</Label>
          <h2>
            {lang === "fr" ? "Le sport devient" : "Sport becomes"}
            <br />
            {lang === "fr" ? "une " : "a "}
            <em>force.</em>
          </h2>
        </div>
        <div className="mp-copy">
          <p className="mp-copy-lead">
            {lang === "fr"
              ? "PROADVISOR est une agence du sponsoring et du marketing spécialisée dans la conception et le pilotage du partenariat des marques entre associations sportives, entreprises et de l’évènementiel pour une visibilité utile mesurable et quantifiable."
              : "PROADVISOR is a sponsorship and marketing agency specializing in designing and managing brand partnerships between sports associations, companies and event stakeholders to deliver useful, measurable visibility."}
          </p>
          <p>
            {lang === "fr"
              ? "PROADVISOR est un pôle de connexion stratégique entre performances et acteurs du sport et de la communication suivant une certaine audience et la transformation d’opportunités en dispositifs concrets…"
              : "PROADVISOR is a strategic connection point between performance and stakeholders in sports and communication, aligning the right audiences and turning opportunities into concrete programs."}
          </p>
          <Link className="mp-line-link" to="/agence">
            {lang === "fr" ? "Découvrir l’agence" : "Discover the agency"} <Arrow />
          </Link>
        </div>
      </section>
      <section className="mp-services-dark">
        <Label n="02" light>
          {lang === "fr" ? "Nos expertises" : "Our services"}
        </Label>
        <div className="mp-heading">
          <h2>
            {lang === "fr" ? "Quatre terrains." : "Four fields."}
            <br />
            {lang === "fr" ? "Un même " : "One "}
            <em>{lang === "fr" ? "objectif." : "goal."}</em>
          </h2>
          <Link to="/expertises">{lang === "fr" ? "Toutes les expertises" : "All services"}</Link>
        </div>
        <ServiceRows />
      </section>
      <FaqSection />
      <Testimonials />
      <PartnerStrip />
    </main>
  );
}

const missions: Copy[] = [
  { fr: "Sponsoring", en: "Sponsorship" },
  { fr: "Marques", en: "Brands" },
  { fr: "Campus & stages", en: "Camps & clinics" },
  { fr: "Institution de football", en: "Football institutions" },
  { fr: "Football professionnel", en: "Professional football" },
  { fr: "Image", en: "Image" },
  { fr: "Expertise", en: "Expertise" },
  { fr: "Équipements sportifs", en: "Sports equipment" },
  { fr: "Partenariats", en: "Partnerships" },
  { fr: "Médias", en: "Media" },
];

export function AgencyPage() {
  const { lang } = useLang();
  return (
    <main>
      <PageHero
        eyebrow={{ fr: "À propos de nous", en: "About us" }}
        title={{ fr: "Derrière la vision.", en: "Behind the vision." }}
        text={{
          fr: "Une agence de sponsoring et marketing sportif qui connecte ambitions, talents et marques.",
          en: "A sponsorship and sports marketing agency connecting ambition, talent and brands.",
        }}
        image={img.stadium}
      />
      <section className="mp-split">
        <div>
          <Label n="01">{lang === "fr" ? "Notre raison d’être" : "Our purpose"}</Label>
          <h2>
            {lang === "fr" ? "Connecter ce qui" : "Connecting what"}
            <br />
            {lang === "fr" ? "doit " : "must "}
            <em>{lang === "fr" ? "compter." : "matter."}</em>
          </h2>
        </div>
        <div className="mp-copy">
          <p className="mp-copy-lead">
            {lang === "fr"
              ? "PROADVISOR est une agence du sponsoring et du marketing spécialisée dans la conception et le pilotage du partenariat des marques entre associations sportives, entreprises et de l’évènementiel pour une visibilité utile mesurable et quantifiable."
              : "PROADVISOR is a sponsorship and marketing agency specializing in designing and managing brand partnerships between sports associations, companies and event stakeholders to deliver useful, measurable visibility."}
          </p>
          <p>
            {lang === "fr"
              ? "PROADVISOR est un pôle de connexion stratégique entre performances et acteurs du sport et de la communication suivant une certaine audience et la transformation d’opportunités en dispositifs concrets…"
              : "PROADVISOR is a strategic connection point between performance and stakeholders in sports and communication, aligning the right audiences and turning opportunities into concrete programs."}
          </p>
        </div>
      </section>
      <section className="mp-missions">
        <Label n="02" light>
          {lang === "fr" ? "Nos missions" : "Our missions"}
        </Label>
        <h2>
          {lang === "fr" ? "Notre terrain d’" : "Our field of "}
          <em>action.</em>
        </h2>
        <div className="mp-mission-grid">
          {missions.map((mission, i) => (
            <div key={mission.fr}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>{t(mission, lang)}</h3>
              <Arrow diagonal />
            </div>
          ))}
        </div>
      </section>
      <section className="mp-story">
        <img src={img.match} alt="Football" />
        <div>
          <Label n="03">{lang === "fr" ? "Notre méthode" : "Our method"}</Label>
          <h2>
            Strategy.
            <br />
            Business. <em>Impact.</em>
          </h2>
          {[
            {
              fr: "Identifier le sponsor qui correspond à vos principes.",
              en: "Identify the sponsor aligned with your principles.",
            },
            {
              fr: "Construire un partenariat proportionné au profil et à l’audience.",
              en: "Build a partnership tailored to profile and audience.",
            },
            {
              fr: "Activer l’ambassadeur comme levier de développement.",
              en: "Activate ambassadors as a growth driver.",
            },
          ].map((step, i) => (
            <p className="mp-step" key={step.fr}>
              <span>0{i + 1}</span>
              {t(step, lang)}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}

export function ServicesPage() {
  const { lang } = useLang();
  return (
    <main>
      <PageHero
        eyebrow={{ fr: "Nos solutions", en: "Our solutions" }}
        title={{ fr: "Expertises.", en: "Our expertise." }}
        text={{
          fr: "Quatre pôles complémentaires pour connecter les talents, activer les marques et amplifier chaque projet sportif.",
          en: "Four complementary practices to connect talent, activate brands and amplify every sports project.",
        }}
        image={img.academy}
      />
      <section className="mp-service-details">
        <Label n="01">{lang === "fr" ? "Nos solutions" : "Our solutions"}</Label>
        {services.map((service) => (
          <article key={service.slug}>
            <div className="mp-service-image">
              <img src={service.image} alt={t(service.title, lang)} />
              <span>[{service.num}]</span>
            </div>
            <div>
              <h2>{t(service.title, lang)}</h2>
              <p>{t(service.text, lang)}</p>
              <ul>
                {service.bullets.map((bullet) => (
                  <li key={bullet.fr}>{t(bullet, lang)}</li>
                ))}
              </ul>
              <Link className="mp-line-link" to={`/expertises/${service.slug}`}>
                {lang === "fr" ? "Voir le détail" : "View details"} <Arrow />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export function ServiceDetailPage() {
  const { lang } = useLang();
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug) || services[0];
  const next = services[(services.indexOf(service) + 1) % services.length];
  return (
    <main>
      <PageHero
        eyebrow={{ fr: `Expertise ${service.num}`, en: `Service ${service.num}` }}
        title={service.title}
        text={service.subtitle}
        image={service.image}
      />
      <section className="mp-split">
        <div>
          <Label n="01">{lang === "fr" ? "L’approche" : "The approach"}</Label>
          <h2>{t(service.subtitle, lang)}</h2>
        </div>
        <div className="mp-copy">
          <p>{t(service.text, lang)}</p>
          <Link className="mp-red-btn" to="/contact">
            {lang === "fr" ? "Demander un devis" : "Request a quote"} <Arrow />
          </Link>
        </div>
      </section>
      <section className="mp-deliverables">
        {service.bullets.map((bullet, i) => (
          <div key={bullet.fr}>
            <span>0{i + 1}</span>
            <h3>{t(bullet, lang)}</h3>
            <p>
              {lang === "fr"
                ? "Une solution construite selon votre profil, vos objectifs et votre audience."
                : "A solution built around your profile, goals and audience."}
            </p>
          </div>
        ))}
      </section>
      <section className="mp-next">
        <span>{lang === "fr" ? "Expertise suivante" : "Next service"}</span>
        <Link to={`/expertises/${next.slug}`}>
          {t(next.title, lang)} <Arrow diagonal />
        </Link>
      </section>
    </main>
  );
}

const equipmentPhotos = Array.from(
  { length: 10 },
  (_, index) => `/media/equipement-${String(index + 1).padStart(2, "0")}.jpg`,
);

const projects = [
  [
    "Équipements & maillots",
    "Equipment & teamwear",
    "Équipements sportifs",
    "Sports equipment",
    equipmentPhotos[0],
    "equipements-maillots",
  ],
  [
    "Campus & détection",
    "Camp & scouting",
    "École de football",
    "Football academy",
    img.academy,
    "campus-detection",
  ],
  [
    "Matchs & compétitions",
    "Matches & competitions",
    "Football professionnel",
    "Professional football",
    img.match,
    "matchs-competitions",
  ],
  [
    "Brand activation",
    "Brand activation",
    "Marques & sponsoring",
    "Brands & sponsorship",
    img.stadium,
    "brand-activation",
  ],
  ["Corpo Sport Events", "Corpo Sport Events", "Événementiel", "Events", img.event, "corpo-sport"],
  [
    "La relève en action",
    "Next generation in action",
    "Formation",
    "Training",
    img.children,
    "releve-action",
  ],
  ["Dans les coulisses", "Behind the scenes", "Médias", "Media", img.media, "coulisses"],
];

export function MediaPage() {
  const { lang } = useLang();
  return (
    <main>
      <PageHero
        eyebrow={{ fr: "Médiathèque", en: "Media library" }}
        title={{ fr: "Moments forts.", en: "Highlighted moments." }}
        text={{
          fr: "Une sélection d’actions, de talents et d’expériences façonnées sur le terrain.",
          en: "A selection of actions, talent and experiences shaped on the field.",
        }}
        image={img.media}
      />
      <section className="mp-portfolio">
        {projects.map((project, i) => (
          <article key={project[0]}>
            <Link to={`/mediatheque/${project[5]}`}>
              <div>
                <img src={project[4]} alt={project[lang === "fr" ? 0 : 1]} />
                <span>0{i + 1}</span>
              </div>
              <p>{project[lang === "fr" ? 2 : 3]}</p>
              <h2>{project[lang === "fr" ? 0 : 1]}</h2>
              <small>
                {lang === "fr" ? "Voir le dossier" : "View collection"} <Arrow diagonal />
              </small>
            </Link>
          </article>
        ))}
      </section>
      <section className="mp-equipment-preview">
        <div>
          <Label n="07">{lang === "fr" ? "Équipements sportifs" : "Sports equipment"}</Label>
          <h2>
            {lang === "fr" ? "Maillots, clubs & " : "Teamwear, clubs & "}
            <em>{lang === "fr" ? "identités." : "identity."}</em>
          </h2>
          <Link className="mp-line-link" to="/mediatheque/equipements-maillots">
            {lang === "fr" ? "Ouvrir le dossier complet" : "Open full collection"} <Arrow />
          </Link>
        </div>
        <div>
          {equipmentPhotos.map((source, index) => (
            <img src={source} alt={`Équipement sportif Proadvisory ${index + 1}`} key={source} />
          ))}
        </div>
      </section>
      <FaqSection />
    </main>
  );
}

export function MediaDetailPage() {
  const { lang } = useLang();
  const { slug } = useParams();
  const project = projects.find((item) => item[5] === slug) || projects[0];
  const gallery =
    project[5] === "equipements-maillots"
      ? equipmentPhotos
      : [project[4], img.academy, img.match, img.event];
  return (
    <main>
      <PageHero
        eyebrow={{ fr: "Dossier média", en: "Media collection" }}
        title={{ fr: project[0], en: project[1] }}
        text={{
          fr: `Une immersion dans notre dossier ${project[0]}, entre terrain, talents et impact.`,
          en: `An inside look at our ${project[1]} collection, where field, talent and impact meet.`,
        }}
        image={project[4]}
      />
      <section className="mp-gallery-intro">
        <Label n="01">{lang === "fr" ? "Le dossier" : "The collection"}</Label>
        <h2>
          {lang === "fr" ? "Les temps forts en " : "Highlights in "}
          <em>{lang === "fr" ? "images." : "images."}</em>
        </h2>
        <p>
          {lang === "fr"
            ? "Cette sélection documente l’engagement des équipes, les moments de performance et les connexions créées autour du projet."
            : "This selection documents team commitment, performance moments and the connections created around the project."}
        </p>
      </section>
      <section className="mp-gallery-grid">
        {gallery.map((source, index) => (
          <img src={source} alt={`${project[lang === "fr" ? 0 : 1]} — ${index + 1}`} key={source} />
        ))}
      </section>
      <section className="mp-next">
        <span>{lang === "fr" ? "Retour aux dossiers" : "Back to collections"}</span>
        <Link to="/mediatheque">
          {lang === "fr" ? "Médiathèque" : "Media library"} <Arrow diagonal />
        </Link>
      </section>
    </main>
  );
}

export function PartnersPage() {
  const { lang } = useLang();
  const groups = [
    {
      title: { fr: "Associations & corporations", en: "Associations & corporations" },
      names: [
        "Ascavet",
        "Dimsport 10",
        "Timo Sport Kribi",
        "Nyong E Kelle Volley Ball",
        "Corpo Sport Events",
      ],
      text: {
        fr: "Des acteurs engagés avec lesquels nous construisons des passerelles durables entre sport, territoire et visibilité.",
        en: "Committed stakeholders with whom we build lasting bridges between sport, community and visibility.",
      },
    },
    {
      title: { fr: "École de football affiliée", en: "Affiliated football academy" },
      names: ["Dimsport 10 Douala"],
      text: {
        fr: "Un cadre de formation et de détection qui accompagne les jeunes talents vers leur meilleur niveau.",
        en: "A training and scouting environment helping young talent reach their best level.",
      },
    },
    {
      title: { fr: "Institution de football affiliée", en: "Affiliated football institution" },
      names: ["Proadvisory 2.0 La Spezia · Italia"],
      text: {
        fr: "Notre ancrage européen pour développer les connexions, les opportunités et les échanges internationaux.",
        en: "Our European base for developing connections, opportunities and international exchanges.",
      },
    },
  ];
  return (
    <main>
      <PageHero
        eyebrow={{ fr: "Notre réseau", en: "Our network" }}
        title={{ fr: "Partenaires.", en: "Partners." }}
        text={{
          fr: "Des relations solides qui transforment les ambitions individuelles en force collective.",
          en: "Strong relationships that turn individual ambitions into collective strength.",
        }}
        image={img.stadium}
      />
      <section className="mp-partner-categories">
        <Label n="01">{lang === "fr" ? "Ils nous font confiance" : "They trust us"}</Label>
        {groups.map((group, index) => (
          <article key={group.title.fr}>
            <div className="mp-partner-category-heading">
              <span>0{index + 1}</span>
              <h2>{t(group.title, lang)}</h2>
              <p>{t(group.text, lang)}</p>
            </div>
            <div className="mp-partner-blocks">
              {group.names.map((name) => (
                <span key={name}>{name}</span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export function ContactPage() {
  const { lang } = useLang();
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const d = new FormData(event.currentTarget);
    const message = `Formulaire de contact Proadvisory\nNom: ${d.get("name")}\nEmail: ${d.get("email")}\nTéléphone: ${d.get("phone")}\nService: ${d.get("service")}\nMessage: ${d.get("message")}`;
    window.open(`https://wa.me/393533707645?text=${encodeURIComponent(message)}`, "_blank");
    setSent(true);
  };
  return (
    <main>
      <PageHero
        eyebrow={{ fr: "Contactez-nous", en: "Contact us" }}
        title={{ fr: "Donnons vie à votre projet.", en: "Let’s bring your project to life." }}
        text={{
          fr: "Partagez votre vision. Notre équipe vous répondra pour construire la bonne activation.",
          en: "Share your vision. Our team will get back to you to build the right activation.",
        }}
        image={img.field}
      />
      <section className="mp-contact">
        <div>
          <Label n="01">{lang === "fr" ? "Nos coordonnées" : "Our details"}</Label>
          <div className="mp-contact-block">
            <span>{lang === "fr" ? "Téléphone & WhatsApp" : "Phone & WhatsApp"}</span>
            <a href="tel:+393533707645">+39 353 370 7645</a>
          </div>
          <div className="mp-contact-block">
            <span>Email</span>
            <a href="mailto:contact@proadvisory.com">contact@proadvisory.com</a>
          </div>
          <div className="mp-contact-block">
            <span>{lang === "fr" ? "Adresse" : "Address"}</span>
            <p>La Spezia, Italia</p>
            <p>Douala, Cameroun</p>
            <p>France — Campus partenaire</p>
          </div>
          <div className="mp-contact-block">
            <span>{lang === "fr" ? "Réseaux" : "Social"}</span>
            <a className="social-icon-link" href="https://www.facebook.com/Pro_Advisor">
              <FacebookIcon />
            </a>
          </div>
        </div>
        <form onSubmit={submit}>
          <h2>{lang === "fr" ? "Formulaire de contact" : "Contact form"}</h2>
          <label>
            {lang === "fr" ? "Nom complet" : "Full name"}
            <input name="name" required placeholder={lang === "fr" ? "Votre nom" : "Your name"} />
          </label>
          <div className="mp-form-row">
            <label>
              Email
              <input name="email" type="email" required placeholder="nom@email.com" />
            </label>
            <label>
              {lang === "fr" ? "Téléphone" : "Phone"}
              <input name="phone" type="tel" placeholder="+39..." />
            </label>
          </div>
          <label>
            Service
            <select name="service" required defaultValue="">
              <option value="" disabled>
                {lang === "fr" ? "Sélectionner" : "Select"}
              </option>
              {services.map((service) => (
                <option key={service.slug}>{t(service.title, lang)}</option>
              ))}
            </select>
          </label>
          <label>
            Message
            <textarea name="message" required rows={5} />
          </label>
          <button className="mp-red-btn" type="submit">
            {lang === "fr" ? "Envoyer via WhatsApp" : "Send via WhatsApp"} <Arrow />
          </button>
          {sent && (
            <p className="mp-notice">
              {lang === "fr" ? "Message préparé dans WhatsApp." : "Message prepared in WhatsApp."}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main className="mp-not-found">
      <span>404</span>
      <h1>Hors-jeu.</h1>
      <Link className="mp-red-btn" to="/">
        Accueil <Arrow />
      </Link>
    </main>
  );
}
