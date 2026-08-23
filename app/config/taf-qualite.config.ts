import type { SiteConfig } from "./types.ts";

/**
 * Configuration réelle de T.A.F Qualité — c'est la seule source de contenu métier
 * pour ce site. app/prototype.tsx et les fichiers app/*\/page.tsx ne connaissent que
 * la forme SiteConfig, jamais "T.A.F Qualité", "Majid" ou "Angers" en dur.
 */
export const tafQualiteConfig: SiteConfig = {
  business: {
    name: "T.A.F Qualité",
    homeMeta: {
      title: "T.A.F Qualité — Rénovation intérieure, extérieure et bois à Angers",
      description:
        "Peinture, sols, façades, terrasses, portes et meubles : T.A.F Qualité rénove et remet en état à Angers, avec Majid Touati comme interlocuteur unique.",
    },
    hero: {
      eyebrow: "Intérieur · Extérieur · Bois — Angers et alentours",
      headlineLead: "Une équipe. Trois savoir-faire.",
      headlineEmphasis: "Un seul interlocuteur.",
      text: "T.A.F Qualité rénove l’intérieur et l’extérieur des maisons à Angers, et remet en état ce qui peut encore servir — portes, meubles, boiseries — plutôt que de systématiquement tout remplacer.",
      benefits: ["Devis détaillé", "Équipe coordonnée", "Suivi du projet"],
      footnote: "Premier échange sans engagement · Projets étudiés jusqu’à Nantes selon leur nature.",
    },
    selector: {
      eyebrow: "Trois savoir-faire",
      title: "Voyez la différence.",
      intro: {
        eyebrow: "Votre projet commence ici",
        title: "Que souhaitez-vous transformer ?",
        text: "Un premier choix suffit. Vous pourrez préciser votre besoin ensuite.",
      },
      fallbackChoice: { title: "Je ne sais pas encore", subtitle: "Échangeons simplement" },
      note: "Étude de votre demande gratuite · Sans engagement",
    },
    philosophy: {
      eyebrow: "Notre philosophie",
      title: "Rénover. Transformer. Faire durer.",
      text: "Chez T.A.F Qualité, remplacer n’est pas le seul réflexe. Un mur fatigué, une façade abîmée, une porte qui ferme mal : souvent, remettre en état coûte moins cher et donne un résultat tout aussi net qu’un remplacement complet.",
    },
    scope: {
      eyebrow: "Notre périmètre",
      title: "Ce que nous faisons — et ce que nous ne faisons pas.",
      text: "T.A.F Qualité intervient sur la rénovation intérieure, la rénovation extérieure et la remise en état d’éléments bois (portes, meubles, boiseries). Nous n’intervenons pas sur la toiture, l’isolation, la maçonnerie lourde ou le gros œuvre — nous préférons être clairs sur notre périmètre plutôt que de nous présenter comme une entreprise tous corps d’état.",
    },
    guarantees: {
      eyebrow: "Les engagements T.A.F Qualité",
      title: "Vous savez où vous allez.",
      items: [
        {
          title: "Votre projet est cadré",
          description: "Les besoins, les solutions, les travaux et le prix sont expliqués avant de commencer.",
        },
        {
          title: "Votre chantier est coordonné",
          description: "Majid organise les bonnes compétences et reste votre interlocuteur.",
        },
        {
          title: "Le résultat est vérifié",
          description: "Les finitions sont contrôlées avec vous avant la réception.",
        },
      ],
    },
    reassuranceChips: [
      "Interlocuteur unique",
      "Devis détaillé",
      "RC professionnelle · À confirmer",
      "Décennale · À confirmer",
      "Angers & alentours",
    ],
  },

  cta: {
    stickyQuoteBadge: { line1: "OBTENIR MON DEVIS", line2: "Gratuit - Sans engagement" },
  },

  contact: {
    phoneDisplay: "07 66 83 20 30",
    phoneHref: "tel:0766832030",
    phoneInternational: "+33766832030",
    whatsappMessage:
      "Bonjour Majid, je viens de visiter le site T.A.F Qualité et j’aimerais échanger avec vous au sujet de mon projet.",
  },

  serviceArea: {
    city: "Angers",
    label: "Angers et alentours",
    extendedNote: "jusqu’à Nantes selon leur nature",
  },

  leader: {
    name: "Majid Touati",
    role: "Dirigeant",
    shortEyebrow: "Majid · dirigeant",
    quoteEyebrow: "Majid Touati · dirigeant",
    quote: "Mon rôle est d’écouter, de coordonner les bonnes compétences et de veiller à l’exigence du résultat.",
    quoteNote: "[TEXTE DE MAJID À CONFIRMER]",
    sectionTitle: "Écouter. Coordonner. Exiger.",
    bio: [
      "Je suis l’interlocuteur du client. Mon rôle est de comprendre le projet, de réunir les bonnes compétences et de veiller à la cohérence du travail.",
      "Sur un mur, une façade ou une porte, la question posée est toujours la même : remplacer est-il vraiment nécessaire, ou peut-on remettre en état pour un résultat aussi net ? Cette logique — rénover, transformer, faire durer — guide à égalité les trois savoir-faire de T.A.F Qualité : intérieur, extérieur, bois/meubles/portes.",
    ],
    bioNote: "[HISTOIRE ET MOTS DE MAJID À CONFIRMER]",
  },

  team: {
    specialties: ["[SPÉCIALITÉ À CONFIRMER]", "[SPÉCIALITÉ À CONFIRMER]"],
  },

  process: {
    eyebrow: "Comment ça se passe",
    title: "Un projet clair,\nsans surprise.",
    text: "Du premier échange à la réception, chaque étape est compréhensible.",
    steps: [
      {
        title: "Vous nous présentez votre projet",
        description: "Quelques informations, des photos ou une courte vidéo nous aident à comprendre votre besoin.",
      },
      {
        title: "Majid échange avec vous",
        description: "Il précise vos attentes, vérifie la faisabilité et organise une visite si nécessaire.",
      },
      {
        title: "Vous recevez une proposition claire",
        description: "Le périmètre des travaux, les solutions, le prix et les prochaines étapes sont expliqués.",
      },
      {
        title: "Notre équipe réalise les travaux",
        description: "Les compétences nécessaires sont organisées autour d’un interlocuteur identifié.",
      },
      {
        title: "Nous vérifions le résultat ensemble",
        description: "Les finitions sont contrôlées avant la réception et les derniers ajustements éventuels.",
      },
    ],
  },

  services: [
    {
      key: "interieur",
      navLabel: "Intérieur",
      projectLabel: "Intérieur",
      quickChoice: { title: "Mon intérieur", subtitle: "Aménager ou rénover" },
      comparatorLabel: "Intérieur",
      mediaKey: "interieur",
      eyebrow: "Travaux intérieurs",
      heroTitle: "Repeindre, refaire un sol, moderniser une pièce — sans tout casser.",
      heroText:
        "De la préparation des murs aux finitions de cuisine ou de salle de bains, T.A.F Qualité prend en charge vos travaux intérieurs à Angers avec un seul interlocuteur du début à la fin.",
      ctaLabel: "Obtenir un devis pour ma rénovation intérieure",
      groups: [
        {
          title: "Murs et finitions",
          items: ["Peinture murs et plafonds", "Préparation et remise en état des murs", "Enduits et finitions", "Papier peint et revêtements muraux"],
        },
        { title: "Sols", items: ["Pose et rénovation de sols", "Parquet", "Stratifié", "PVC", "Plinthes"] },
        {
          title: "Aménagement et pièces clés",
          items: [
            "Cloisons",
            "Petits travaux d’aménagement",
            "Rénovation et rafraîchissement de pièces",
            "Rénovation de cuisine (peinture, crédence, finitions)",
            "Rénovation de salle de bains et finitions",
          ],
        },
        { title: "Petites réparations", items: ["Reprises et petites réparations après travaux"] },
      ],
      crossSell: {
        textBefore:
          "Portes intérieures et boiseries sont reprises dans le cadre de vos travaux de pièce. Pour la remise en état d’une porte ou d’un meuble en particulier, voir ",
        links: [{ label: "Bois, meubles et portes", serviceKey: "bois" }],
        textAfter: ".",
      },
      faq: [],
      meta: {
        title: "Rénovation intérieure à Angers — Peinture, sols, cuisine — T.A.F Qualité",
        description:
          "Peinture, enduits, sols, cuisine, salle de bains : T.A.F Qualité rénove l'intérieur de votre maison à Angers avec un devis détaillé.",
      },
    },
    {
      key: "exterieur",
      navLabel: "Extérieur",
      projectLabel: "Extérieur",
      quickChoice: { title: "Mon extérieur", subtitle: "Transformer ou valoriser" },
      comparatorLabel: "Extérieur",
      mediaKey: "exterieur",
      eyebrow: "Travaux extérieurs",
      heroTitle: "Ce qui est dehors s’use différemment. On s’en occupe pareil.",
      heroText:
        "Façade, terrasse, clôture, portail : T.A.F Qualité remet en état et protège les extérieurs de votre maison à Angers, avec la même exigence que pour l’intérieur.",
      ctaLabel: "Obtenir un devis pour ma rénovation extérieure",
      groups: [
        {
          title: "Façades et surfaces",
          items: ["Peinture extérieure", "Façades et murs extérieurs", "Nettoyage et remise en état des surfaces", "Petites réparations et reprises"],
        },
        { title: "Menuiseries extérieures", items: ["Volets", "Portes et éléments bois extérieurs"] },
        { title: "Aménagements extérieurs", items: ["Terrasses", "Clôtures", "Portails", "Murets"] },
      ],
      crossSell: {
        textBefore:
          "Pour la remise en état d’une porte ou d’un volet en particulier, indépendamment d’un chantier de façade, voir ",
        links: [{ label: "Bois, meubles et portes", serviceKey: "bois" }],
        textAfter: ".",
      },
      faq: [],
      meta: {
        title: "Rénovation extérieure à Angers — Façade, terrasse, portail — T.A.F Qualité",
        description: "Façades, terrasses, clôtures, portails, volets : T.A.F Qualité remet en état vos extérieurs à Angers avec un interlocuteur unique.",
      },
    },
    {
      key: "bois",
      navLabel: "Bois",
      projectLabel: "Bois",
      quickChoice: { title: "Une porte, un meuble", subtitle: "Remise en état" },
      comparatorLabel: "Bois",
      mediaKey: "bois",
      eyebrow: "Bois, meubles, portes",
      heroTitle: "Une porte, un meuble : parfois, il suffit de les remettre en état.",
      heroText:
        "Une porte qui ferme mal, un meuble qui a perdu de son éclat, une boiserie marquée par le temps : T.A.F Qualité les décape, les répare et leur redonne une nouvelle finition — sans passer par un chantier complet.",
      ctaLabel: "Faire estimer ma porte ou mon meuble",
      groups: [
        { title: "Ce que nous remettons en état", items: ["Portes", "Meubles", "Boiseries intérieures", "Boiseries extérieures"] },
        {
          title: "Comment",
          items: ["Décapage", "Ponçage", "Réparation et remise en état", "Peinture", "Vernis", "Protection", "Changement de teinte ou de couleur", "Modernisation"],
        },
      ],
      crossSell: {
        textBefore: "Un mur, un sol ou une façade à revoir en plus de la porte ou du meuble ? Voir ",
        links: [
          { label: "Travaux intérieurs", serviceKey: "interieur" },
          { label: "Travaux extérieurs", serviceKey: "exterieur" },
        ],
        joiner: " ou ",
        textAfter: ".",
      },
      faq: [
        { question: "Est-ce que vous fabriquez des meubles ou des portes sur mesure ?", answer: "[Réponse à confirmer avec Majid]" },
        {
          question: "Une porte qui ferme mal peut-elle être réparée sans être remplacée ?",
          answer: "Dans beaucoup de cas, oui : un décapage, un ajustement et une nouvelle finition suffisent souvent à redonner à une porte son usage normal.",
        },
      ],
      meta: {
        title: "Rénovation de portes et de meubles à Angers — T.A.F Qualité",
        description:
          "Décapage, ponçage, peinture, vernis : T.A.F Qualité remet en état vos portes, meubles et boiseries à Angers, sans passer par un chantier complet.",
      },
    },
  ],

  about: {
    eyebrow: "T.A.F Qualité",
    title: "Le travail bien fait commence par les bonnes personnes.",
    lede: "Une entreprise dirigée par Majid Touati, entourée d’une équipe aux savoir-faire complémentaires.",
    teamEyebrow: "L’équipe",
    teamTitle: "À chacun son savoir-faire.",
    meta: {
      title: "T.A.F Qualité — L'entreprise et son dirigeant, Majid Touati",
      description:
        "Majid Touati dirige T.A.F Qualité à Angers : rénovation intérieure, extérieure et remise en état de portes et meubles, avec un interlocuteur unique.",
    },
  },

  nav: {
    homeLabel: "Accueil",
    aboutLabel: "T.A.F Qualité",
    aboutPath: "/taf-qualite",
  },

  footer: {
    tagline: "Travaux intérieurs, extérieurs et bois",
    projectColumnTitle: "Votre projet",
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
    editorLine: "T.A.F Qualité — forme juridique, capital, SIREN/SIRET, adresse, téléphone et email à confirmer.",
    publicationDirectorLine: "Majid Touati — à confirmer.",
    hostingLine: "identité, adresse et téléphone de l’hébergeur à compléter avant publication.",
    insuranceLine: "références de l’assurance professionnelle, de la garantie décennale et du médiateur de la consommation à compléter.",
    privacyIntro:
      "Les informations du formulaire serviront uniquement à étudier la demande et à reprendre contact. Les destinataires, durées de conservation et coordonnées permettant d’exercer les droits d’accès, de rectification, d’effacement et d’opposition seront précisés avant publication.",
    privacyPrototypeNote: "Ce prototype local ne transmet aucune donnée et ne dépose aucun traceur de mesure d’audience.",
  },

  form: {
    eyebrow: "Votre projet",
    title: "Parlons-en simplement.",
    intro: "Deux étapes, environ deux minutes. Prototype : la demande n’est pas envoyée.",
    step1Legend: "Étape 1 sur 2 · Le projet",
    step2Legend: "Étape 2 sur 2 · Vos coordonnées",
    projectLabel: "Type de projet",
    projectPlaceholder: "Choisir",
    communeLabel: "Commune",
    communePlaceholder: "Ex. Angers",
    periodLabel: "Période souhaitée",
    periodPlaceholder: "Ex. cet automne",
    budgetLabel: "Budget indicatif (facultatif)",
    budgetPlaceholder: "Ex. 2000 à 4000 €",
    needsLabel: "Décrivez votre besoin",
    needsPlaceholder: "Les travaux envisagés, vos contraintes, vos questions…",
    continueLabel: "Continuer →",
    nameLabel: "Nom",
    phoneLabel: "Téléphone",
    emailLabel: "Email",
    contactPreferenceLabel: "Moyen de contact préféré",
    contactPreferenceOptions: ["Téléphone", "Email", "WhatsApp"],
    mediaUploadLabel: "Photos ou courte vidéo",
    consentText: "J’accepte que T.A.F Qualité utilise ces informations pour répondre à ma demande.",
    consentLinkLabel: "En savoir plus",
    backLabel: "← Retour",
    submitLabel: "Simuler l’envoi",
  },

  colors: {
    navy: "#050505",
    accent: "#8a6f52",
    highlight: "#c9b396",
    sky: "#f0ece6",
    soft: "#f8f7f5",
    white: "#fff",
    text: "#111",
    muted: "#625d56",
    line: "#ded6cc",
  },

  media: {
    logo: {
      src: "/media/logo.png",
      alt: "T.A.F Qualité",
      isPlaceholder: false,
      aspectRatio: "1536/525",
      objectPosition: "top",
    },
    heroImage: {
      src: "/media/hero-renovation.jpg",
      alt: "Réalisation T.A.F Qualité",
      isPlaceholder: true,
      placeholderLabel: "Réalisation T.A.F Qualité à insérer",
      stockCredit: "Pexels",
    },
    // Non affichée par les composants actuels (aucune section "photo d'équipe" sur
    // la page à propos aujourd'hui) - conservée pour qu'un futur artisan qui
    // rétablirait cette section ait un emplacement de config prêt à l'emploi.
    teamPhoto: {
      src: "/media/exterieur.jpg",
      alt: "Équipe T.A.F Qualité",
      isPlaceholder: true,
      placeholderLabel: "Photo de l’équipe à insérer",
      stockCredit: "Pexels",
    },
    leaderPortrait: {
      src: "/media/details.jpg",
      alt: "Portrait de Majid Touati",
      isPlaceholder: true,
      placeholderLabel: "Portrait naturel de Majid à insérer",
      stockCredit: "Pexels",
    },
    beforeAfter: {
      interieur: {
        avant: { src: "/media/outils.jpg", isPlaceholder: true, stockCredit: "Pexels" },
        apres: { src: "/media/interieur.jpg", isPlaceholder: true, stockCredit: "Pexels" },
      },
      exterieur: {
        avant: { src: "/media/details.jpg", isPlaceholder: true, stockCredit: "Pexels" },
        apres: { src: "/media/exterieur.jpg", isPlaceholder: true, stockCredit: "Pexels" },
      },
      bois: {
        avant: { src: "/media/outils.jpg", isPlaceholder: true, stockCredit: "Pexels" },
        apres: { src: "/media/details.jpg", isPlaceholder: true, stockCredit: "Pexels" },
      },
    },
    socialShareImage: { src: "/media/logo.png", alt: "Logo T.A.F Qualité", isPlaceholder: false },
  },

  seo: {
    siteUrl: process.env.SITE_URL ?? "https://example.com",
    ogLocale: "fr_FR",
  },
};
