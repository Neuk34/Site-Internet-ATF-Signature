// Abstraction de source de données pour `opportunities`. Le moteur doit fonctionner sans
// Search Console configuré : chaque provider répond avec isAvailable() plutôt que de planter
// ou d'inventer des chiffres.

/**
 * @typedef {Object} SeoDataProvider
 * @property {string} name
 * @property {() => boolean} isAvailable
 * @property {() => Promise<SearchConsoleRow[] | null>} getSearchConsoleData
 */

/** @typedef {{query:string, page:string, impressions:number, clicks:number, ctr:number, position:number}} SearchConsoleRow */

/** Fonctionne toujours : c'est la base (audit statique, config) sans aucune dépendance externe. */
export function createLocalProvider() {
  return {
    name: "local",
    isAvailable: () => true,
    async getSearchConsoleData() {
      return null; // le provider local n'a jamais de données Search Console, par définition
    },
  };
}

/**
 * Reste non configuré tant que les identifiants Google Search Console ne sont pas fournis.
 * Le point d'extension existe déjà : brancher l'API réelle ici (OAuth/service account) le jour venu,
 * sans changer l'interface consommée par opportunities.mjs.
 */
export function createSearchConsoleProvider(env = process.env) {
  const configured = Boolean(env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS || env.GSC_SITE_URL);
  return {
    name: "search_console",
    isAvailable: () => configured,
    async getSearchConsoleData() {
      if (!configured) return null;
      // TODO: implémenter l'appel réel à l'API Search Console une fois les identifiants disponibles.
      // Volontairement non implémenté : aucune credential n'existe aujourd'hui pour ce site.
      throw new Error("SearchConsoleProvider configuré mais l'appel API n'est pas encore implémenté.");
    },
  };
}
