import type { SiteConfig } from "../types.ts";

/**
 * Configuration fictive utilisée UNIQUEMENT par tests/config/example-config.test.mjs
 * pour vérifier que le gabarit fonctionne bien avec une entreprise différente de
 * T.A.F Qualité (autre nom, autre métier, autres couleurs, autres services...).
 *
 * Ne jamais importer ce fichier depuis app/config/index.ts, layout.tsx ou un
 * app/*\/page.tsx : "Dupont Plomberie" ne doit ni être servi ni devenir un second
 * site en production. Pour créer un VRAI nouveau site, copier ce fichier (ou
 * taf-qualite.config.ts) sous un nouveau nom et le brancher dans app/config/index.ts.
 */
export const exempleArtisanConfig: SiteConfig = {
  business: {
    name: "Dupont Plomberie",
    homeMeta: {
      title: "Dupont Plomberie — Dépannage et installation à Lyon",
      description: "Dépannage plomberie, installation de chaudières et salles de bains à Lyon avec Sophie Dupont comme interlocutrice unique.",
    },
    hero: {
      eyebrow: "Dépannage · Installation · Chaudières — Lyon et alentours",
      headlineLead: "Une artisane. Trois savoir-faire.",
      headlineEmphasis: "Une seule interlocutrice.",
      text: "Dupont Plomberie intervient sur vos urgences, vos installations et vos chaudières à Lyon, avec un devis clair avant toute intervention.",
      benefits: ["Devis avant travaux", "Intervention rapide", "Suivi du chantier"],
      footnote: "Devis gratuit sous 24h · Interventions urgentes sept jours sur sept.",
    },
    selector: {
      eyebrow: "Trois savoir-faire",
      title: "Voyez la différence.",
      intro: {
        eyebrow: "Votre demande commence ici",
        title: "De quoi avez-vous besoin ?",
        text: "Un premier choix suffit, vous pourrez préciser ensuite.",
      },
      fallbackChoice: { title: "Je ne sais pas encore", subtitle: "Discutons-en" },
      note: "Étude de votre demande gratuite · Sans engagement",
    },
    philosophy: {
      eyebrow: "Notre philosophie",
      title: "Réparer avant de remplacer.",
      text: "Chez Dupont Plomberie, chaque intervention commence par un diagnostic honnête : remplacer une pièce ou tout un équipement n'est pas toujours nécessaire.",
    },
    scope: {
      eyebrow: "Notre périmètre",
      title: "Ce que nous faisons — et ce que nous ne faisons pas.",
      text: "Dupont Plomberie intervient sur le dépannage, l'installation sanitaire et les chaudières. Nous n'intervenons pas sur les réseaux de gaz collectifs ni la climatisation industrielle.",
    },
    guarantees: {
      eyebrow: "Les engagements Dupont Plomberie",
      title: "Vous savez où vous allez.",
      items: [
        { title: "Votre devis est clair", description: "Le prix des pièces et de la main d'œuvre est détaillé avant intervention." },
        { title: "Votre rendez-vous est tenu", description: "Sophie confirme un créneau précis et vous informe en cas d'imprévu." },
        { title: "Le travail est garanti", description: "Chaque intervention est garantie deux ans pièces et main d'œuvre." },
      ],
    },
    reassuranceChips: ["Interlocutrice unique", "Devis détaillé", "Assurance décennale", "Lyon & alentours"],
  },

  contact: {
    phoneDisplay: "04 78 00 00 00",
    phoneHref: "tel:0478000000",
    phoneInternational: "+33478000000",
    whatsappMessage: "Bonjour Sophie, je viens de visiter le site Dupont Plomberie et j'aimerais échanger avec vous au sujet de mon projet.",
    whatsappNumber: "33612345678",
  },

  serviceArea: { city: "Lyon", label: "Lyon et alentours", extendedNote: "jusqu'à Villeurbanne selon les cas" },

  leader: {
    name: "Sophie Dupont",
    role: "Dirigeante",
    shortEyebrow: "Sophie · dirigeante",
    quoteEyebrow: "Sophie Dupont · dirigeante",
    quote: "Mon rôle est d'être honnête sur ce qui est vraiment nécessaire, et de le faire bien.",
    quoteNote: "[TEXTE DE SOPHIE À CONFIRMER]",
    sectionTitle: "Diagnostiquer. Expliquer. Réparer.",
    bio: [
      "Je suis l'interlocutrice unique du client, du premier appel à la fin du chantier.",
      "Une chaudière qui tousse ou une fuite qui persiste posent toujours la même question : faut-il réparer ou remplacer ? Cette question guide chacune de nos interventions.",
    ],
    bioNote: "[HISTOIRE DE SOPHIE À CONFIRMER]",
  },

  team: { specialties: ["[SPÉCIALITÉ À CONFIRMER]", "[SPÉCIALITÉ À CONFIRMER]", "[SPÉCIALITÉ À CONFIRMER]"] },

  process: {
    eyebrow: "Comment ça se passe",
    title: "Une intervention claire,\nsans surprise.",
    text: "De votre appel à la fin du chantier, chaque étape est expliquée.",
    steps: [
      { title: "Vous décrivez votre besoin", description: "Par téléphone ou via le formulaire, avec des photos si possible." },
      { title: "Sophie évalue l'urgence", description: "Elle confirme un créneau et, si besoin, un diagnostic sur place." },
      { title: "Vous recevez un devis clair", description: "Pièces, main d'œuvre et délai sont détaillés avant intervention." },
      { title: "L'équipe intervient", description: "Au créneau confirmé, avec le matériel nécessaire." },
      { title: "Le résultat est vérifié ensemble", description: "Sophie contrôle avec vous avant de considérer le chantier terminé." },
    ],
  },

  services: [
    {
      key: "depannage",
      navLabel: "Dépannage",
      projectLabel: "Dépannage",
      quickChoice: { title: "Une urgence", subtitle: "Fuite, panne, blocage" },
      comparatorLabel: "Dépannage",
      mediaKey: "depannage",
      eyebrow: "Dépannage plomberie",
      heroTitle: "Une fuite, une panne : on intervient vite.",
      heroText: "Dupont Plomberie intervient rapidement sur vos urgences à Lyon, avec un diagnostic honnête avant toute réparation.",
      ctaLabel: "Demander une intervention urgente",
      groups: [{ title: "Interventions courantes", items: ["Fuite d'eau", "Canalisation bouchée", "Chasse d'eau", "Robinetterie"] }],
      crossSell: {
        textBefore: "Pour une chaudière en panne en particulier, voir ",
        links: [{ label: "Chaudières", serviceKey: "chaudieres" }],
        textAfter: ".",
      },
      faq: [],
      meta: {
        title: "Dépannage plomberie à Lyon — Dupont Plomberie",
        description: "Fuite, canalisation bouchée, robinetterie : Dupont Plomberie intervient rapidement à Lyon.",
      },
    },
    {
      key: "installation",
      navLabel: "Installation",
      projectLabel: "Installation",
      quickChoice: { title: "Une installation", subtitle: "Salle de bains, cuisine" },
      comparatorLabel: "Installation",
      mediaKey: "installation",
      eyebrow: "Installation sanitaire",
      heroTitle: "Une salle de bains à repenser, une cuisine à équiper.",
      heroText: "Dupont Plomberie installe et rénove vos équipements sanitaires à Lyon avec une interlocutrice unique du devis à la réception.",
      ctaLabel: "Obtenir un devis d'installation",
      groups: [{ title: "Ce que nous installons", items: ["Salle de bains complète", "Douche à l'italienne", "Évier et robinetterie de cuisine"] }],
      faq: [],
      meta: {
        title: "Installation sanitaire à Lyon — Dupont Plomberie",
        description: "Salle de bains, douche à l'italienne, cuisine : Dupont Plomberie installe vos équipements sanitaires à Lyon.",
      },
    },
    {
      key: "chaudieres",
      navLabel: "Chaudières",
      projectLabel: "Chaudières",
      quickChoice: { title: "Une chaudière", subtitle: "Entretien, remplacement" },
      comparatorLabel: "Chaudières",
      mediaKey: "chaudieres",
      eyebrow: "Chaudières",
      heroTitle: "Une chaudière qui vieillit mal : réparer ou remplacer ?",
      heroText: "Dupont Plomberie entretient et remplace vos chaudières à Lyon, avec un avis honnête sur ce qui est vraiment nécessaire.",
      ctaLabel: "Faire évaluer ma chaudière",
      groups: [{ title: "Nos interventions", items: ["Entretien annuel", "Réparation", "Remplacement", "Mise aux normes"] }],
      faq: [
        { question: "Faut-il entretenir sa chaudière tous les ans ?", answer: "Oui, c'est une obligation légale et cela évite la plupart des pannes." },
      ],
      meta: {
        title: "Entretien et remplacement de chaudière à Lyon — Dupont Plomberie",
        description: "Entretien, réparation, remplacement de chaudière à Lyon avec Dupont Plomberie.",
      },
    },
  ],

  about: {
    eyebrow: "Dupont Plomberie",
    title: "Le travail bien fait commence par une bonne écoute.",
    lede: "Une entreprise dirigée par Sophie Dupont, entourée d'une équipe aux savoir-faire complémentaires.",
    teamEyebrow: "L'équipe",
    teamTitle: "À chacun son savoir-faire.",
    meta: {
      title: "Dupont Plomberie — L'entreprise et sa dirigeante, Sophie Dupont",
      description: "Sophie Dupont dirige Dupont Plomberie à Lyon : dépannage, installation et chaudières, avec une interlocutrice unique.",
    },
  },

  nav: { homeLabel: "Accueil", aboutLabel: "Dupont Plomberie", aboutPath: "/dupont-plomberie" },

  footer: {
    tagline: "Dépannage, installation et chaudières",
    projectColumnTitle: "Votre demande",
    quoteLinkLabel: "Demander un devis",
    whatsappLinkLabel: "Échanger avec nous",
    infoColumnTitle: "Informations",
    legalLinkLabel: "Mentions légales",
    privacyLinkLabel: "Confidentialité",
    privacyPanelTitle: "Politique de confidentialité",
    cookiesNote: "Gérer mes cookies · aucun traceur dans le prototype",
    disclaimer: "Prototype local — coordonnées, contenus, justificatifs et médias à confirmer avant publication.",
  },

  legal: {
    editorLine: "Dupont Plomberie — forme juridique, capital, SIREN/SIRET, adresse, téléphone et email à confirmer.",
    publicationDirectorLine: "Sophie Dupont — à confirmer.",
    hostingLine: "identité, adresse et téléphone de l'hébergeur à compléter avant publication.",
    insuranceLine: "références de l'assurance professionnelle, de la garantie décennale et du médiateur de la consommation à compléter.",
    privacyIntro: "Les informations du formulaire serviront uniquement à étudier la demande et à reprendre contact.",
    privacyPrototypeNote: "Ce prototype local ne transmet aucune donnée et ne dépose aucun traceur de mesure d'audience.",
  },

  form: {
    eyebrow: "Votre demande",
    title: "Parlons-en simplement.",
    intro: "Deux étapes, environ deux minutes. Prototype : la demande n'est pas envoyée.",
    step1Legend: "Étape 1 sur 2 · La demande",
    step2Legend: "Étape 2 sur 2 · Vos coordonnées",
    projectLabel: "Type d'intervention",
    projectPlaceholder: "Choisir",
    communeLabel: "Commune",
    communePlaceholder: "Ex. Lyon",
    periodLabel: "Urgence ?",
    periodPlaceholder: "Ex. dans la journée",
    budgetLabel: "Budget indicatif (facultatif)",
    budgetPlaceholder: "Ex. 200 à 500 €",
    needsLabel: "Décrivez votre besoin",
    needsPlaceholder: "La panne ou le projet, vos contraintes, vos questions…",
    continueLabel: "Continuer →",
    nameLabel: "Nom",
    phoneLabel: "Téléphone",
    emailLabel: "Email",
    contactPreferenceLabel: "Moyen de contact préféré",
    contactPreferenceOptions: ["Téléphone", "Email", "WhatsApp"],
    mediaUploadLabel: "Photos ou courte vidéo",
    consentText: "J'accepte que Dupont Plomberie utilise ces informations pour répondre à ma demande.",
    consentLinkLabel: "En savoir plus",
    backLabel: "← Retour",
    submitLabel: "Simuler l'envoi",
  },

  colors: {
    navy: "#0b1f2a",
    accent: "#2f6f8f",
    highlight: "#7fb6c9",
    sky: "#e8f2f5",
    soft: "#f4f8f9",
    white: "#fff",
    text: "#111",
    muted: "#54646b",
    line: "#d7e2e5",
  },

  media: {
    logo: {
      src: "/media/logo-exemple.png",
      alt: "Dupont Plomberie",
      isPlaceholder: true,
      placeholderLabel: "Logo Dupont Plomberie à intégrer",
      aspectRatio: "3/1",
      objectPosition: "center",
    },
    heroImage: { src: "/media/hero-exemple.jpg", alt: "Intervention Dupont Plomberie", isPlaceholder: true, placeholderLabel: "Intervention à insérer", stockCredit: "Pexels" },
    teamPhoto: { src: "/media/equipe-exemple.jpg", alt: "Équipe Dupont Plomberie", isPlaceholder: true, placeholderLabel: "Photo d'équipe à insérer", stockCredit: "Pexels" },
    leaderPortrait: { src: "/media/portrait-exemple.jpg", alt: "Portrait de Sophie Dupont", isPlaceholder: true, placeholderLabel: "Portrait de Sophie à insérer", stockCredit: "Pexels" },
    beforeAfter: {
      depannage: {
        avant: { src: "/media/depannage-avant.jpg", isPlaceholder: true, stockCredit: "Pexels" },
        apres: { src: "/media/depannage-apres.jpg", isPlaceholder: true, stockCredit: "Pexels" },
      },
      installation: {
        avant: { src: "/media/installation-avant.jpg", isPlaceholder: true, stockCredit: "Pexels" },
        apres: { src: "/media/installation-apres.jpg", isPlaceholder: true, stockCredit: "Pexels" },
      },
      chaudieres: {
        avant: { src: "/media/chaudieres-avant.jpg", isPlaceholder: true, stockCredit: "Pexels" },
        apres: { src: "/media/chaudieres-apres.jpg", isPlaceholder: true, stockCredit: "Pexels" },
      },
    },
    socialShareImage: { src: "/media/logo-exemple.png", alt: "Logo Dupont Plomberie", isPlaceholder: true, placeholderLabel: "Logo à intégrer" },
  },

  seo: {
    siteUrl: "https://example.com",
    ogLocale: "fr_FR",
  },
};
