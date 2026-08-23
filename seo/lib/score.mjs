// Score volontairement simple : 100 par catégorie, on retire des points par sévérité.
// Pas de pondération savante — l'objectif unique est de détecter une régression, comparer deux
// audits, et prioriser. Rien de plus (voir §4 de la mission).

const DEDUCTIONS = { P0: 40, P1: 20, P2: 8, P3: 2 };

export const CATEGORIES = [
  "TECHNICAL",
  "CONTENT",
  "LOCAL",
  "MEDIA",
  "INTERNAL_LINKING",
  "STRUCTURED_DATA",
];

/**
 * @param {{severity:"P0"|"P1"|"P2"|"P3", category:string}[]} findings
 * @returns {Record<string, number>}
 */
export function scorePage(findings) {
  /** @type {Record<string, number>} */
  const scores = Object.fromEntries(CATEGORIES.map((c) => [c, 100]));
  for (const finding of findings) {
    if (!(finding.category in scores)) continue;
    scores[finding.category] = Math.max(0, scores[finding.category] - (DEDUCTIONS[finding.severity] ?? 0));
  }
  return scores;
}

export function overallScore(categoryScores) {
  const values = Object.values(categoryScores);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}
