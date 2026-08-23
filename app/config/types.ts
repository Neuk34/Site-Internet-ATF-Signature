// Forme stricte de la configuration d'un site artisan généré à partir de ce gabarit.
// Un nouveau site = une nouvelle valeur de ce type (voir app/config/README.md).
// Rien dans les composants (app/prototype.tsx, app/layout.tsx, app/*/page.tsx) ne doit
// contenir de texte, couleur, coordonnée ou média propre à une entreprise en particulier :
// tout doit venir d'un objet SiteConfig.

/**
 * Micro-texte du badge de devis flottant (bouton sticky en bas d'écran). Le badge
 * lui-même (forme, couleurs, icône ✓) est une décision visuelle déjà validée qui
 * reste dans app/globals.css - seul le texte affiché vient de la config, via les
 * variables CSS --quote-badge-line1/2 posées en style inline sur le bouton
 * (voir LegalFooter/Prototype dans app/prototype.tsx).
 */
export interface StickyQuoteBadge {
  /** Ligne principale, ex. "OBTENIR MON DEVIS". */
  line1: string;
  /** Ligne secondaire, plus petite, ex. "Gratuit - Sans engagement". */
  line2: string;
}

export interface CtaConfig {
  stickyQuoteBadge: StickyQuoteBadge;
}

export interface ColorTokens {
  /** Couleur la plus sombre : texte principal, fonds "dark", boutons du bandeau sticky. */
  navy: string;
  /** Couleur d'accent utilisée pour les eyebrows, liens actifs, petites touches de couleur.
   *  Doit conserver un contraste WCAG AA (>= 4.5:1) sur fond blanc : c'est du texte, pas juste une teinte de marque. */
  accent: string;
  /** Couleur des boutons primaires et des barres décoratives à côté des eyebrows. */
  highlight: string;
  /** Fond très clair utilisé derrière certains badges ("card span"). */
  sky: string;
  /** Fond légèrement teinté utilisé en alternance de sections. */
  soft: string;
  /** Blanc de référence du site. */
  white: string;
  /** Couleur de texte par défaut. */
  text: string;
  /** Couleur de texte secondaire (légendes, "small"). */
  muted: string;
  /** Couleur des bordures / séparateurs. */
  line: string;
}

export interface MediaSlot {
  /** Chemin public de l'image actuellement affichée (ex. "/media/logo.png"). Toujours
   *  renseigné : en attendant le vrai média, src pointe vers une photo de stock temporaire
   *  plutôt que de laisser une case vide. */
  src: string;
  /** Texte alternatif accessible. */
  alt: string;
  /** true tant que src n'est pas le média définitif de l'entreprise. Affiche un badge
   *  "PROTOTYPE" + placeholderLabel par-dessus l'image, pour ne jamais laisser croire
   *  qu'une photo de stock est une réalisation réelle. Repasser à false une fois le
   *  vrai média en place fait disparaître le badge sans autre changement de code. */
  isPlaceholder: boolean;
  /** Légende affichée sur le badge tant que isPlaceholder est true. */
  placeholderLabel?: string;
  /** Attribution de la photo de stock utilisée en attendant le vrai média (ex. "Pexels"). */
  stockCredit?: string;
}

/** Version allégée de MediaSlot pour les comparatifs avant/après : le texte affiché
 *  (sujet + "avant"/"après") est déjà construit dynamiquement par le composant à partir
 *  du service concerné, donc seule l'image (et son statut de placeholder) est nécessaire ici. */
export interface StockMedia {
  src: string;
  isPlaceholder: boolean;
  stockCredit?: string;
}

export interface BeforeAfterMedia {
  avant: StockMedia;
  apres: StockMedia;
}

/**
 * Le mot-symbole du header/footer est recadré sur la partie haute du fichier logo via
 * CSS (aspect-ratio + object-fit:cover + object-position), pour n'afficher que
 * l'icône+texte sans le slogan ni les pictos qu'un logo peut contenir en dessous.
 * Ces trois valeurs dépendent de la mise en page du fichier logo fourni : à recalculer
 * si le logo change de proportions (mesurer la bande utile du fichier et calculer
 * width/height du recadrage voulu -> aspectRatio = "largeur/hauteur du recadrage").
 */
export interface LogoMedia extends MediaSlot {
  aspectRatio: string;
  objectPosition?: string;
}

export interface MediaConfig {
  logo: LogoMedia;
  /** Image du hero de l'accueil. */
  heroImage: MediaSlot;
  /** Photo d'équipe utilisée sur la page "à propos". */
  teamPhoto: MediaSlot;
  /** Portrait du dirigeant sur la page "à propos". */
  leaderPortrait: MediaSlot;
  /** Comparatifs avant/après, une entrée par sujet (clé libre, ex. une clé par service
   *  plus une clé "temoin" pour un comparatif "preuve" générique si besoin). */
  beforeAfter: Record<string, BeforeAfterMedia>;
  /** Image utilisée pour le partage social (Open Graph / Twitter Card). */
  socialShareImage: MediaSlot;
}

export interface ContactInfo {
  /** Numéro affiché aux humains, ex. "07 66 83 20 30". */
  phoneDisplay: string;
  /** Lien tel: correspondant, ex. "tel:0766832030". */
  phoneHref: string;
  /** Format international pour les données structurées (schema.org), ex. "+33766832030". */
  phoneInternational: string;
  /** Email de contact, si publié. */
  email?: string;
  /** Message WhatsApp pré-rempli, encodé par le composant au moment de construire le lien wa.me. */
  whatsappMessage: string;
  /** Numéro WhatsApp au format international sans "+" ni espaces (ex. "33766832030").
   *  Optionnel : un lien wa.me sans numéro ouvre WhatsApp avec le message pré-rempli et
   *  laisse le visiteur choisir le contact, ce qui est le comportement actuel du site. */
  whatsappNumber?: string;
}

export interface ServiceArea {
  /** Ville principale, ex. "Angers". */
  city: string;
  /** Formulation courte de la zone, ex. "Angers et alentours". */
  label: string;
  /** Précision optionnelle sur l'extension de la zone, ex. "jusqu'à Nantes selon leur nature". */
  extendedNote?: string;
}

export interface LeaderConfig {
  name: string;
  role: string;
  /** Eyebrow court utilisé à côté du portrait, ex. "Majid · dirigeant". */
  shortEyebrow: string;
  /** Eyebrow complet utilisé au-dessus de la citation, ex. "Majid Touati · dirigeant". */
  quoteEyebrow: string;
  /** Citation mise en avant (section "quote" de la page "à propos"). */
  quote: string;
  /** Note sous la citation tant qu'elle n'est pas confirmée par le dirigeant. */
  quoteNote?: string;
  /** Titre de la section "à propos" dédiée au dirigeant, ex. "Écouter. Coordonner. Exiger." */
  sectionTitle: string;
  /** Paragraphes de présentation, dans l'ordre. */
  bio: string[];
  /** Note temporaire tant que l'histoire n'est pas confirmée. */
  bioNote?: string;
}

export interface TeamConfig {
  /** Intitulés de spécialités affichés en attendant les fiches nominatives, ex.
   *  ["[SPÉCIALITÉ À CONFIRMER]", "[SPÉCIALITÉ À CONFIRMER]"]. Vide = section masquée. */
  specialties: string[];
}

export interface GuaranteeItem {
  title: string;
  description: string;
}

export interface GuaranteesConfig {
  eyebrow: string;
  title: string;
  items: GuaranteeItem[];
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface ProcessConfig {
  eyebrow: string;
  title: string;
  text: string;
  steps: ProcessStep[];
}

export interface ServiceGroup {
  title: string;
  items: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CrossSellLink {
  label: string;
  serviceKey: string;
}

export interface CrossSellNote {
  textBefore: string;
  links: CrossSellLink[];
  /** Séparateur entre les liens s'il y en a plusieurs, ex. " ou ". */
  joiner?: string;
  textAfter?: string;
}

/**
 * Une "catégorie de service" = une des pages métier (Intérieur, Extérieur, Bois, ...).
 * Le nombre et l'ordre des entrées définissent entièrement la navigation, le sélecteur
 * de l'accueil et le tunnel de devis : ajouter/retirer/renommer un service ne touche
 * jamais app/prototype.tsx, seulement cette liste.
 */
export interface ServiceDefinition {
  /** Identifiant stable (aussi utilisé comme segment de route, ex. "interieur" -> /interieur).
   *  Renommer un service correspond à renommer le dossier app/<key>/ ET cette clé. */
  key: string;
  /** Libellé de navigation court, ex. "Intérieur". */
  navLabel: string;
  /** Valeur utilisée dans le formulaire de devis et pour la présélection via l'URL
   *  (?projet=...). Peut être identique à navLabel. */
  projectLabel: string;
  /** Bouton de sélection rapide sur l'accueil. */
  quickChoice: { title: string; subtitle: string };
  /** Sujet affiché au-dessus du comparatif avant/après de l'accueil, ex. "Intérieur". */
  comparatorLabel: string;
  /** Clé du média avant/après correspondant dans MediaConfig.beforeAfter. */
  mediaKey: string;
  eyebrow: string;
  heroTitle: string;
  heroText: string;
  /** Libellé du bouton d'appel à l'action en haut de la page service. */
  ctaLabel: string;
  groups: ServiceGroup[];
  crossSell?: CrossSellNote;
  faq: FaqItem[];
  meta: { title: string; description: string };
}

export interface HeroConfig {
  eyebrow: string;
  /** Première ligne du h1 (non mise en emphase). */
  headlineLead: string;
  /** Seconde ligne du h1, affichée en emphase (<em>). */
  headlineEmphasis: string;
  text: string;
  benefits: string[];
  footnote: string;
}

export interface SelectorConfig {
  eyebrow: string;
  title: string;
  intro: { eyebrow: string; title: string; text: string };
  /** Choix supplémentaire toujours affiché en dernier, pour les visiteurs indécis. */
  fallbackChoice: { title: string; subtitle: string };
  note: string;
}

export interface StatementConfig {
  eyebrow: string;
  title: string;
  text: string;
}

export interface AboutPageConfig {
  eyebrow: string;
  title: string;
  lede: string;
  teamEyebrow: string;
  teamTitle: string;
  meta: { title: string; description: string };
}

export interface FooterConfig {
  tagline: string;
  projectColumnTitle: string;
  quoteLinkLabel: string;
  whatsappLinkLabel: string;
  infoColumnTitle: string;
  legalLinkLabel: string;
  privacyLinkLabel: string;
  /** Titre complet du panneau détaillé, ex. "Politique de confidentialité"
   *  (indépendant de privacyLinkLabel, qui est le libellé court du lien). */
  privacyPanelTitle: string;
  cookiesNote: string;
  disclaimer: string;
}

export interface LegalConfig {
  editorLine: string;
  publicationDirectorLine: string;
  hostingLine: string;
  insuranceLine: string;
  privacyIntro: string;
  privacyPrototypeNote: string;
}

export interface FormConfig {
  eyebrow: string;
  title: string;
  intro: string;
  step1Legend: string;
  step2Legend: string;
  projectLabel: string;
  projectPlaceholder: string;
  communeLabel: string;
  communePlaceholder: string;
  periodLabel: string;
  periodPlaceholder: string;
  budgetLabel: string;
  budgetPlaceholder: string;
  needsLabel: string;
  needsPlaceholder: string;
  continueLabel: string;
  nameLabel: string;
  phoneLabel: string;
  emailLabel: string;
  contactPreferenceLabel: string;
  contactPreferenceOptions: string[];
  mediaUploadLabel: string;
  consentText: string;
  consentLinkLabel: string;
  backLabel: string;
  submitLabel: string;
}

export interface NavConfig {
  homeLabel: string;
  aboutLabel: string;
  /** Route de la page "à propos" (le dossier app/ correspondant doit exister sous ce nom). */
  aboutPath: string;
}

export interface SeoConfig {
  /** Domaine complet de production, ex. "https://taf-qualite.fr". Utiliser la variable
   *  d'environnement SITE_URL plutôt que de coder le domaine en dur ici. */
  siteUrl: string;
  ogLocale: string;
}

export interface SiteConfig {
  business: {
    name: string;
    /** Raison sociale complète si différente du nom d'usage. */
    legalName?: string;
    /** Titre / description de la page d'accueil (balises <title> et meta description). */
    homeMeta: { title: string; description: string };
    hero: HeroConfig;
    selector: SelectorConfig;
    philosophy: StatementConfig;
    scope: StatementConfig;
    guarantees: GuaranteesConfig;
    reassuranceChips: string[];
  };
  cta: CtaConfig;
  contact: ContactInfo;
  serviceArea: ServiceArea;
  leader: LeaderConfig;
  team: TeamConfig;
  process: ProcessConfig;
  services: ServiceDefinition[];
  about: AboutPageConfig;
  nav: NavConfig;
  footer: FooterConfig;
  legal: LegalConfig;
  form: FormConfig;
  colors: ColorTokens;
  media: MediaConfig;
  seo: SeoConfig;
}
