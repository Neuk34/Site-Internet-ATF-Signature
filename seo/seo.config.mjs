// Configuration centrale du SEO Maintenance Engine.
// Aucun mot-clé, zone ou fait métier ne doit être écrit ailleurs dans le moteur :
// tout part d'ici, pour rester modifiable sans toucher au code.

export const seoConfig = {
  brand: "T.A.F Qualité",

  // Domaine de production : pas encore connu (site pas encore en ligne publiquement).
  // Utilisé pour construire des URLs canoniques absolues une fois défini.
  domain: null,

  zones: {
    primary: "Angers",
    // Zones volontairement secondaires : jamais promues automatiquement en cible SEO primaire,
    // jamais transformées en page dédiée par le moteur (voir opportunities.mjs).
    secondary: ["Nantes"],
    // Aucune commune de 1ère couronne n'est encore validée comme zone de service confirmée.
    // Toute commune détectée dans la recherche devient un LOCAL_PAGE_CANDIDATE, jamais une page.
    communes: [],
    // Communes où une activité concurrentielle réelle a été observée pendant l'audit SEO local
    // (22/08/2026), sans que T.A.F Qualité y intervienne de façon confirmée. Source de départ
    // pour `opportunities`, qui les transforme en LOCAL_PAGE_CANDIDATE — jamais en page.
    observedCommunes: ["Avrillé", "Beaucouzé", "Trélazé", "Les Ponts-de-Cé"],
  },

  // Les 5 pages publiques réelles du site. `id` doit correspondre au dossier sous app/.
  pages: [
    { id: "accueil", path: "/", label: "Accueil", file: "app/page.tsx" },
    { id: "interieur", path: "/interieur", label: "Intérieur", file: "app/interieur/page.tsx" },
    { id: "exterieur", path: "/exterieur", label: "Extérieur", file: "app/exterieur/page.tsx" },
    { id: "renovation", path: "/renovation", label: "Rénovation", file: "app/renovation/page.tsx" },
    { id: "taf-qualite", path: "/taf-qualite", label: "T.A.F Qualité", file: "app/taf-qualite/page.tsx" },
  ],

  // Pages volontairement hors périmètre commercial (planches de comparaison internes).
  // Le moteur vérifie qu'elles restent noindex,nofollow plutôt que de les auditer comme pages publiques.
  excludedPages: [
    { id: "boutons-devis", path: "/boutons-devis" },
    { id: "boutons-contact", path: "/boutons-contact" },
  ],

  // Familles de requêtes par page, issues de l'audit SEO local du 22/08/2026.
  // Une famille ne doit apparaître fortement que sur UNE page cible (voir cannibalisation).
  keywordMap: {
    accueil: [
      "rénovation Angers",
      "entreprise rénovation Angers",
      "artisan rénovation Angers",
      "devis rénovation Angers",
    ],
    interieur: [
      "rénovation intérieure Angers",
      "travaux intérieur Angers",
      "rénovation appartement Angers",
    ],
    exterieur: ["rénovation extérieure Angers"],
    renovation: [
      "rénovation maison Angers",
      "rénovation globale maison Angers",
      "rénovation maison ancienne Angers",
    ],
    "taf-qualite": ["T.A.F Qualité", "Majid Touati", "avis T.A.F Qualité"],
  },

  // Opportunités métiers identifiées par la recherche mais non confirmées par Majid.
  // Utilisées par `opportunities` pour générer des NEW_PAGE_CANDIDATE bloqués tant que non confirmées.
  unconfirmedOpportunities: [
    { cluster: "rénovation salle de bain Angers", nearestPage: "interieur" },
    { cluster: "rénovation cuisine Angers", nearestPage: "interieur" },
    { cluster: "ravalement façade Angers", nearestPage: "exterieur" },
    { cluster: "extension / agrandissement maison Angers", nearestPage: "renovation" },
  ],

  // Faits métier : tout ce qui n'est pas explicitement VERIFIED reste UNCONFIRMED.
  // `update` refuse d'écrire un texte qui s'appuie sur une clé absente de `verified`.
  businessFacts: {
    verified: [
      // Vide intentionnellement : aucun fait métier n'a encore été confirmé par Majid.
      // Exemple une fois confirmé : { key: "garantie_decennale", note: "Attestation reçue le ..." }
    ],
    unconfirmed: [
      "rc_professionnelle",
      "garantie_decennale",
      "prestation_salle_de_bain",
      "prestation_facade",
      "prestation_extension",
      "certification_rge",
    ],
  },

  // Mots qui, s'ils apparaissent dans un changement proposé sans fait métier vérifié correspondant,
  // déclenchent un BLOCKED_BUSINESS_FACT par prudence (heuristique simple, pas une analyse sémantique).
  sensitiveClaimPatterns: [
    /d[ée]cennale/i,
    /RC\s*pro(fessionnelle)?/i,
    /RGE/i,
    /certifi[ée]/i,
    /assur[ée]/i,
    /\b\d+\s*(clients?|avis|projets?|chantiers?|ans?\s+d.exp[ée]rience)\b/i,
  ],

  // Types de changement que `update` sait valider. Seul META_UPDATE a une logique d'écriture
  // implémentée aujourd'hui (voir lib/update.mjs) — les autres sont validés mais NOT_YET_IMPLEMENTED.
  allowedChangeTypes: [
    "META_UPDATE",
    "ALT_UPDATE",
    "STRUCTURED_DATA",
    "INTERNAL_LINK",
    "CANONICAL",
    "SITEMAP",
    "TECH_METADATA",
    "CONTENT_EDIT", // nécessite --allow-content-edit, jamais actif par défaut
  ],

  thresholds: {
    // Chute de score (points) entre deux audits qui déclenche un bloc "SEO REGRESSION".
    regressionDropPoints: 10,
  },

  // Sévérités qui font échouer `--ci`. P1 volontairement exclu par défaut (voir §21 de la mission :
  // ne pas faire échouer un build pour un alt perfectible).
  ciFailOn: ["P0"],
};
