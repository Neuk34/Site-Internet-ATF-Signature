// Configuration centrale du SEO Maintenance Engine.
// Aucun mot-clé, zone ou fait métier ne doit être écrit ailleurs dans le moteur :
// tout part d'ici, pour rester modifiable sans toucher au code.
//
// brand, domain et pages ne sont PAS dupliqués à la main : ils viennent de
// app/config (la config réelle du site rendu), pour qu'un service ajouté/renommé/
// retiré là-bas ne puisse pas se retrouver oublié ici. Tout le reste (mots-clés,
// faits métier, motifs sensibles...) est propre à cet outil d'audit et n'a pas
// d'équivalent dans app/config - ça reste défini ici.
import { siteConfig, activeConfigFile } from "../app/config/index.ts";

const aboutId = siteConfig.nav.aboutPath.replace(/^\//, "");

export const seoConfig = {
  brand: siteConfig.business.name,

  // Domaine de production : pas encore connu (site pas encore en ligne publiquement).
  // Utilisé pour construire des URLs canoniques absolues une fois défini. Même variable
  // d'environnement que app/config (SITE_URL), mais null tant qu'elle n'est pas définie
  // plutôt que le domaine de secours "https://example.com" que sert le site lui-même :
  // ici, "non défini" doit rester distinguable d'une vraie valeur.
  domain: process.env.SITE_URL ?? null,

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

  // Les pages publiques réelles du site, dérivées de app/config (services + accueil +
  // à propos) plutôt que recopiées : ajouter/renommer/retirer un service dans
  // app/config met cette liste à jour automatiquement.
  //
  // `file` pointe vers le composant de la page (app/<page>/page.tsx). `metaPath` dit où
  // vit RÉELLEMENT le title/description à éditer pour un META_UPDATE : depuis que les
  // page.tsx n'appellent plus que buildXMetadata(config, ...), ce n'est plus dans `file`
  // mais dans activeConfigFile, partagé entre plusieurs pages - lib/update.mjs s'en sert
  // pour localiser le bon bloc `meta` par analyse syntaxique plutôt que par un regex qui
  // trouverait le premier "title:" venu (voir applyMetaUpdateInSharedConfig).
  pages: [
    {
      id: "accueil",
      path: "/",
      label: siteConfig.nav.homeLabel,
      file: "app/page.tsx",
      metaPath: { file: activeConfigFile, kind: "home" },
    },
    ...siteConfig.services.map((service) => ({
      id: service.key,
      path: `/${service.key}`,
      label: service.navLabel,
      file: `app/${service.key}/page.tsx`,
      metaPath: { file: activeConfigFile, kind: "service", key: service.key },
    })),
    {
      id: aboutId,
      path: siteConfig.nav.aboutPath,
      label: siteConfig.nav.aboutLabel,
      file: `app${siteConfig.nav.aboutPath}/page.tsx`,
      metaPath: { file: activeConfigFile, kind: "about" },
    },
  ],

  // Pages volontairement hors périmètre commercial (planches de comparaison internes).
  // Le moteur vérifie qu'elles restent noindex,nofollow plutôt que de les auditer comme pages publiques.
  excludedPages: [
    { id: "boutons-devis", path: "/boutons-devis" },
    { id: "boutons-contact", path: "/boutons-contact" },
  ],

  // Familles de requêtes par page, issues de l'audit SEO local du 22/08/2026, mises à jour le
  // 23/08/2026 quand la 4e page est passée de "rénovation globale" (hors périmètre validé, voir
  // businessFacts) à "bois/meubles/portes" avec des prestations désormais confirmées.
  // Une famille ne doit apparaître fortement que sur UNE page cible (voir cannibalisation).
  keywordMap: {
    accueil: [
      "rénovation Angers",
      "entreprise rénovation Angers",
      "artisan rénovation Angers",
      "devis rénovation Angers",
      "rénovation maison Angers",
    ],
    interieur: [
      "rénovation intérieure Angers",
      "travaux intérieur Angers",
      "rénovation appartement Angers",
    ],
    exterieur: ["rénovation extérieure Angers"],
    bois: [
      "menuiserie Angers",
      "pose de porte Angers",
      "restauration meuble Angers",
      "rénovation de porte Angers",
    ],
    "taf-qualite": ["T.A.F Qualité", "Majid Touati", "avis T.A.F Qualité"],
  },

  // Opportunités métiers identifiées par la recherche mais non confirmées par Majid.
  // Utilisées par `opportunities` pour générer des NEW_PAGE_CANDIDATE bloqués tant que non confirmées.
  // "salle de bain"/"cuisine" retirées le 23/08 : désormais couvertes par les prestations validées
  // de la page Intérieur (rénovation de cuisine, de salle de bains), donc plus une "opportunité" à
  // confirmer mais un service confirmé. "Extension/agrandissement" retirée : explicitement hors
  // périmètre validé (gros œuvre) et sa page de rattachement ("rénovation globale") n'existe plus.
  unconfirmedOpportunities: [
    { cluster: "ravalement façade Angers", nearestPage: "exterieur" },
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
