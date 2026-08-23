// Rendu console (UX lisible) + écriture des rapports machine/humain + diff vs audit précédent.
// Rotation volontairement minimale : latest.json/latest.md toujours à jour, previous.json gardé
// pour le diff. Pas d'accumulation de fichiers datés (voir §32/33 : éviter le superflu).

import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import path from "node:path";
import { seoConfig } from "../seo.config.mjs";

export function reportsDir(rootDir) {
  return path.join(rootDir, "reports", "seo");
}

function severityCounts(findings) {
  const counts = { P0: 0, P1: 0, P2: 0, P3: 0, INFO: 0 };
  for (const f of findings) counts[f.severity ?? "INFO"]++;
  return counts;
}

function gate(counts) {
  if (counts.P0 > 0) return "BLOCKED";
  if (counts.P1 > 0 || counts.P2 > 0) return "PASS_WITH_WARNINGS";
  return "PASS";
}

/** Écrit latest.json (en gardant l'ancien en previous.json) + latest.md, retourne le rapport précédent. */
export function persistAuditReport(rootDir, auditResult) {
  const dir = reportsDir(rootDir);
  mkdirSync(dir, { recursive: true });
  const latestPath = path.join(dir, "latest.json");
  const previousPath = path.join(dir, "previous.json");
  const mdPath = path.join(dir, "latest.md");

  let previous = null;
  if (existsSync(latestPath)) {
    previous = JSON.parse(readFileSync(latestPath, "utf8"));
    copyFileSync(latestPath, previousPath);
  }

  writeFileSync(latestPath, JSON.stringify(auditResult, null, 2), "utf8");
  writeFileSync(mdPath, renderAuditMarkdown(auditResult), "utf8");

  return previous;
}

/** @param {ReturnType<typeof import("./audit.mjs").analyzeSite>} current @param {any} previous */
export function diffAgainstPrevious(current, previous) {
  if (!previous) return [];
  const regressions = [];
  for (const page of current.pages) {
    const prevPage = previous.pages?.find((p) => p.path === page.path);
    if (!prevPage) continue;
    const drop = prevPage.overall - page.overall;
    if (drop >= seoConfig.thresholds.regressionDropPoints) {
      const prevIds = new Set(prevPage.findings.map((f) => f.id));
      const newFindings = page.findings.filter((f) => !prevIds.has(f.id));
      regressions.push({
        page: page.path,
        previousScore: prevPage.overall,
        currentScore: page.overall,
        cause: newFindings.map((f) => f.message).join(" ; ") || "score en baisse sans nouveau finding identifiable",
      });
    }
  }
  return regressions;
}

function renderAuditMarkdown(result) {
  const counts = severityCounts(result.findings);
  const lines = [];
  lines.push(`# SEO Maintenance — ${seoConfig.brand}`, "");
  lines.push(`Généré le ${result.generatedAt}`, "");
  lines.push(`**Gate : ${gate(counts)}**`, "");
  lines.push(`P0: ${counts.P0} · P1: ${counts.P1} · P2: ${counts.P2} · P3: ${counts.P3} · INFO: ${counts.INFO}`, "");
  for (const page of result.pages) {
    lines.push(`## ${page.label} (\`${page.path}\`) — score ${page.overall}/100`, "");
    for (const [cat, score] of Object.entries(page.categoryScores)) lines.push(`- ${cat}: ${score}/100`);
    lines.push("");
    if (page.findings.length === 0) {
      lines.push("Aucun problème détecté.", "");
      continue;
    }
    for (const f of page.findings) lines.push(`- **${f.severity}** \`${f.id}\` — ${f.message}`);
    lines.push("");
  }
  return lines.join("\n");
}

/** Sortie console au format du brief (§27). */
export function renderConsoleAudit(result, regressions) {
  const counts = severityCounts(result.findings);
  const out = [];
  out.push("");
  out.push(`SEO MAINTENANCE — ${seoConfig.brand.toUpperCase()}`);
  out.push("");
  out.push(`Gate:`);
  out.push(gate(counts));
  out.push("");
  out.push(`P0: ${counts.P0}`);
  out.push(`P1: ${counts.P1}`);
  out.push(`P2: ${counts.P2}`);
  out.push(`P3: ${counts.P3}`);
  out.push("");

  if (regressions.length > 0) {
    out.push("SEO REGRESSION");
    for (const r of regressions) {
      out.push("");
      out.push(r.page);
      out.push("");
      out.push("Previous score:");
      out.push(String(r.previousScore));
      out.push("Current score:");
      out.push(String(r.currentScore));
      out.push("Cause:");
      out.push(r.cause);
    }
    out.push("");
  }

  out.push("TOP ACTIONS");
  out.push("");
  const priority = { P0: 0, P1: 1, P2: 2, P3: 3 };
  const topFindings = [...result.findings]
    .filter((f) => f.severity !== "INFO")
    .sort((a, b) => priority[a.severity] - priority[b.severity])
    .slice(0, 8);
  topFindings.forEach((f, i) => {
    out.push(`${i + 1}.`);
    out.push(`[${f.severity}] ${f.page} — ${f.message}`);
    out.push("");
  });

  if (topFindings.length === 0) out.push("Rien à corriger.", "");

  return out.join("\n");
}

export function renderConsoleOpportunities({ cannibalization, newPages, localPages, gscStatus }) {
  const out = [];
  out.push("");
  out.push(`SEO OPPORTUNITIES — ${seoConfig.brand.toUpperCase()}`);
  out.push("");

  if (gscStatus?.unavailable) {
    out.push(`SOURCE_UNAVAILABLE: ${gscStatus.finding.source}`);
    out.push(gscStatus.finding.message);
    out.push("");
  }

  out.push(`Cannibalisation détectée : ${cannibalization.length}`);
  for (const c of cannibalization) {
    out.push("");
    out.push("KEYWORD_CANNIBALIZATION_RISK");
    out.push(c.message);
  }
  out.push("");

  out.push(`Candidats de nouvelle page : ${newPages.length}`);
  for (const p of newPages) {
    out.push("");
    out.push("NEW_PAGE_CANDIDATE");
    out.push(`Cluster: ${p.cluster}`);
    out.push(`Business confirmed: ${p.business_confirmed}`);
    out.push(`Real projects available: ${p.real_projects_available}`);
    out.push(`Search demand: ${p.search_demand} (source: ${p.source})`);
    if (p.cannibalization_risk) out.push(`Cannibalization risk: YES (${p.nearest_page})`);
    out.push(`Recommendation: ${p.recommendation}`);
  }
  out.push("");

  out.push(`Candidats de zone locale : ${localPages.length}`);
  for (const l of localPages) {
    out.push("");
    out.push("LOCAL_PAGE_CANDIDATE");
    out.push(`Commune: ${l.commune}`);
    out.push(`Recommendation: ${l.recommendation}`);
  }
  out.push("");

  return out.join("\n");
}
