// Distingue un vrai problème SEO d'une donnée métier simplement pas encore confirmée par Majid.
// Règle du brief : "à confirmer" n'est jamais une erreur SEO, c'est une information business en attente.

const UNCONFIRMED_MARKER = /·\s*[ÀA]\s*confirmer/i;

/**
 * Cherche les marqueurs "À confirmer" déjà utilisés par le site lui-même dans son propre texte
 * (ex: "RC professionnelle · À confirmer"). Un match = BUSINESS_DATA_UNCONFIRMED, jamais SEO_ERROR.
 * @param {string} html
 */
export function findUnconfirmedBusinessMarkers(html) {
  const matches = [];
  const re = new RegExp(UNCONFIRMED_MARKER.source, "gi");
  let m;
  const text = html.replace(/<[^>]+>/g, " ");
  while ((m = re.exec(text))) {
    const start = Math.max(0, m.index - 40);
    matches.push(text.slice(start, m.index + 20).trim().replace(/\s+/g, " "));
  }
  return matches;
}

/**
 * Vérifie qu'un changement proposé (`update`) ne s'appuie pas sur un fait métier non vérifié.
 * Retourne la liste des raisons de blocage (vide = rien à bloquer).
 * @param {{title?:string, description?:string, text?:string, business_facts_used?:string[]}} change
 * @param {import("../seo.config.mjs").seoConfig["businessFacts"]} businessFacts
 * @param {RegExp[]} sensitivePatterns
 */
export function guardBusinessFacts(change, businessFacts, sensitivePatterns) {
  const reasons = [];
  const verifiedKeys = new Set(businessFacts.verified.map((f) => f.key));

  for (const key of change.business_facts_used ?? []) {
    if (!verifiedKeys.has(key)) {
      reasons.push(`fait métier "${key}" non présent dans businessFacts.verified`);
    }
  }

  const textFields = [change.title, change.description, change.text].filter(Boolean).join(" \n ");
  if (textFields) {
    for (const pattern of sensitivePatterns) {
      if (pattern.test(textFields)) {
        const declared = new Set(change.business_facts_used ?? []);
        const alreadyDeclaredAndVerified = [...declared].some((k) => verifiedKeys.has(k));
        if (!alreadyDeclaredAndVerified) {
          reasons.push(
            `texte contient une affirmation sensible (${pattern}) sans fait métier vérifié déclaré`,
          );
        }
      }
    }
  }

  return reasons;
}
