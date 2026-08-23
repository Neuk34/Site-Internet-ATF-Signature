// Analyse cross-pages : cannibalisation, candidats de nouvelle page/zone, et opportunités
// dépendantes de Search Console (dégradées proprement si la source n'est pas disponible).
// Rien ici ne crée jamais de fichier — uniquement des recommandations.

import { extractTitle, extractMetaDescription, extractHeadings } from "./html.mjs";

const STOPWORDS = new Set([
  "de", "du", "des", "le", "la", "les", "à", "a", "en", "un", "une", "et", "ou",
  "pour", "avec", "dans", "sur", "votre", "vos", "notre", "nos", "vous",
]);

function significantTokens(phrase) {
  return phrase
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // accents -> lettres simples
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function familyTokenSet(phrases) {
  const set = new Set();
  for (const phrase of phrases) for (const t of significantTokens(phrase)) set.add(t);
  return set;
}

/**
 * Poids IDF-lite : un token présent dans plusieurs familles (ex. "rénovation", "angers", partagés
 * par toutes) pèse peu ; un token propre à une seule famille (ex. "intérieure", "globale") pèse
 * plein pot. Sans ça, la seule co-occurrence de mots génériques déclenche des faux positifs.
 * @param {Record<string,string[]>} keywordMap
 */
function tokenDiscriminativeWeights(keywordMap) {
  /** @type {Map<string, number>} */
  const familyCountByToken = new Map();
  const perFamilyTokens = Object.values(keywordMap).map((phrases) => familyTokenSet(phrases));
  for (const tokens of perFamilyTokens) {
    for (const t of tokens) familyCountByToken.set(t, (familyCountByToken.get(t) ?? 0) + 1);
  }
  /** @type {Map<string, number>} */
  const weights = new Map();
  for (const [token, count] of familyCountByToken) weights.set(token, 1 / count);
  return weights;
}

function pageWeightedTokens(html) {
  const title = extractTitle(html) ?? "";
  const description = extractMetaDescription(html) ?? "";
  const headings = extractHeadings(html);
  const h1s = headings.filter((h) => h.level === 1).map((h) => h.text).join(" ");
  const h2h3 = headings.filter((h) => h.level > 1).map((h) => h.text).join(" ");

  /** @type {Map<string, number>} */
  const weighted = new Map();
  const add = (text, weight) => {
    for (const t of significantTokens(text)) weighted.set(t, (weighted.get(t) ?? 0) + weight);
  };
  add(title, 2);
  add(h1s, 2);
  add(h2h3, 1);
  add(description, 1);
  return weighted;
}

function scoreAgainstFamily(weightedTokens, tokenSet, discriminativeWeights) {
  let score = 0;
  for (const [token, weight] of weightedTokens) {
    if (tokenSet.has(token)) score += weight * (discriminativeWeights.get(token) ?? 1);
  }
  return Math.round(score * 10) / 10;
}

/**
 * @param {{id:string,path:string,html:string}[]} pages
 * @param {Record<string,string[]>} keywordMap
 */
export function detectCannibalization(pages, keywordMap) {
  const findings = [];
  const pageTokens = new Map(pages.map((p) => [p.id, pageWeightedTokens(p.html)]));
  const discriminativeWeights = tokenDiscriminativeWeights(keywordMap);

  for (const [family, phrases] of Object.entries(keywordMap)) {
    const tokenSet = familyTokenSet(phrases);
    const scored = pages
      .map((p) => ({ id: p.id, path: p.path, score: scoreAgainstFamily(pageTokens.get(p.id), tokenSet, discriminativeWeights) }))
      .sort((a, b) => b.score - a.score);

    const [top, ...rest] = scored;
    if (!top || top.score < 1) continue; // score trop faible pour être un signal fiable

    for (const other of rest) {
      if (other.score > 0 && other.score >= 0.6 * top.score) {
        findings.push({
          type: "KEYWORD_CANNIBALIZATION_RISK",
          family,
          pages: [
            { id: top.id, path: top.path, score: top.score },
            { id: other.id, path: other.path, score: other.score },
          ],
          message: `"${family}" est porté presque autant par ${top.path} (${top.score}) que par ${other.path} (${other.score}), sur title/H1/H2-H3/meta description.`,
        });
      }
    }
  }
  return findings;
}

/**
 * @param {import("../seo.config.mjs").seoConfig} config
 * @param {ReturnType<typeof detectCannibalization>} cannibalizationFindings
 */
export function buildNewPageCandidates(config, cannibalizationFindings) {
  return config.unconfirmedOpportunities.map((entry) => {
    const relatedRisk = cannibalizationFindings.some(
      (c) => c.pages.some((p) => p.id === entry.nearestPage),
    );
    return {
      type: "NEW_PAGE_CANDIDATE",
      cluster: entry.cluster,
      nearest_page: entry.nearestPage,
      business_confirmed: "NO",
      real_projects_available: "UNKNOWN",
      search_demand: "OBSERVED",
      source: "manual_research_2026-08-22", // pas de Search Console : recherche manuelle documentée
      search_console: null,
      cannibalization_risk: relatedRisk,
      recommendation: "DO_NOT_CREATE_YET",
    };
  });
}

/**
 * @param {import("../seo.config.mjs").seoConfig} config
 */
export function buildLocalPageCandidates(config) {
  const secondary = new Set(config.zones.secondary.map((z) => z.toLowerCase()));
  return config.zones.observedCommunes
    .filter((commune) => !secondary.has(commune.toLowerCase())) // garde-fou dur, pas seulement l'absence de données
    .map((commune) => ({
      type: "LOCAL_PAGE_CANDIDATE",
      commune,
      zone_status: "observed_not_confirmed",
      recommendation: "REQUIRES_HUMAN_VALIDATION",
    }));
}

/**
 * @param {import("./provider.mjs")} providers list of SeoDataProvider
 */
export async function buildSearchConsoleOpportunities(providers) {
  const gsc = providers.find((p) => p.name === "search_console");
  if (!gsc || !gsc.isAvailable()) {
    return {
      unavailable: true,
      finding: {
        type: "SOURCE_UNAVAILABLE",
        source: "search_console",
        message:
          "Search Console non configuré (aucun GOOGLE_SEARCH_CONSOLE_CREDENTIALS / GSC_SITE_URL). " +
          "Catégories non calculables : HIGH_IMPRESSIONS_LOW_CTR, STRIKING_DISTANCE, " +
          "QUERY_WITHOUT_CLEAR_TARGET, EMERGING_SERVICE.",
      },
    };
  }
  const rows = await gsc.getSearchConsoleData();
  // Le calcul réel sur données GSC n'est pas implémenté tant qu'aucun compte n'est branché
  // (voir provider.mjs) — l'architecture est prête, l'implémentation est volontairement différée.
  return { unavailable: false, rows, finding: null };
}
