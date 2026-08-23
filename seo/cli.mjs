#!/usr/bin/env node
// Point d'entrée unique : seo:audit | seo:opportunities | seo:update
// Principe du moteur : audit automatique, recommandations automatiques, publication humaine.
// Ce fichier orchestre uniquement — toute la logique vit dans seo/lib/*.mjs (testable seule).

import { readFileSync } from "node:fs";
import path from "node:path";

import { seoConfig } from "./seo.config.mjs";
import { isBuilt, projectRoot, renderAllPages, renderPage } from "./lib/render.mjs";
import { analyzeSite, analyzeSitemap } from "./lib/audit.mjs";
import { persistAuditReport, diffAgainstPrevious, renderConsoleAudit, renderConsoleOpportunities } from "./lib/report.mjs";
import { createLocalProvider, createSearchConsoleProvider } from "./lib/provider.mjs";
import { detectCannibalization, buildNewPageCandidates, buildLocalPageCandidates, buildSearchConsoleOpportunities } from "./lib/opportunities.mjs";
import { runUpdate } from "./lib/update.mjs";

const rootDir = projectRoot();
const [, , command, ...rest] = process.argv;
const flags = new Set(rest.filter((a) => a.startsWith("--")));
const fileFlagIndex = rest.indexOf("--file");
const fileArg = fileFlagIndex >= 0 ? rest[fileFlagIndex + 1] : null;

async function requireBuild() {
  if (!isBuilt()) {
    console.error(
      "dist/ introuvable. Le SEO Maintenance Engine audite le HTML réellement servi : " +
        "lancez `npm run build` avant `seo:audit` ou `seo:opportunities`.",
    );
    process.exit(1);
  }
}

async function renderPagesForAudit() {
  const publicRendered = await renderAllPages(seoConfig.pages);
  const excludedRendered = await renderAllPages(seoConfig.excludedPages);
  return { publicRendered, excludedRendered };
}

async function cmdAudit() {
  await requireBuild();
  const { publicRendered, excludedRendered } = await renderPagesForAudit();
  const sitemapResponse = await renderPage("/sitemap.xml");
  const sitemapFindings = analyzeSitemap(rootDir, seoConfig.pages, sitemapResponse);
  const result = analyzeSite(publicRendered, excludedRendered, sitemapFindings);

  const previous = persistAuditReport(rootDir, result);
  const regressions = diffAgainstPrevious(result, previous);

  console.log(renderConsoleAudit(result, regressions));
  console.log(`Rapports écrits dans reports/seo/latest.json et reports/seo/latest.md`);

  if (flags.has("--ci")) {
    const counts = { P0: 0, P1: 0, P2: 0, P3: 0 };
    for (const f of result.findings) if (f.severity in counts) counts[f.severity]++;
    const shouldFail = seoConfig.ciFailOn.some((sev) => counts[sev] > 0);
    if (shouldFail) {
      console.error(`\n--ci : échec (sévérités bloquantes présentes : ${seoConfig.ciFailOn.join(", ")}).`);
      process.exit(1);
    }
  }
}

async function cmdOpportunities() {
  await requireBuild();
  const { publicRendered } = await renderPagesForAudit();

  const providers = [createLocalProvider(), createSearchConsoleProvider()];
  const gscStatus = await buildSearchConsoleOpportunities(providers);

  const cannibalization = detectCannibalization(publicRendered, seoConfig.keywordMap);
  const newPages = buildNewPageCandidates(seoConfig, cannibalization);
  const localPages = buildLocalPageCandidates(seoConfig);

  console.log(renderConsoleOpportunities({ cannibalization, newPages, localPages, gscStatus }));
}

async function cmdUpdate() {
  if (!fileArg) {
    console.error(
      "seo:update nécessite --file <chemin-vers-changements-approuvés.json>\n" +
        "Exemple : npm run seo:update -- --file approved-seo-changes.json --dry-run",
    );
    process.exit(1);
  }
  const decisionsPath = path.isAbsolute(fileArg) ? fileArg : path.join(process.cwd(), fileArg);
  const decisions = JSON.parse(readFileSync(decisionsPath, "utf8"));

  // Dry-run par défaut : écrire exige --apply en plus d'un fichier de décisions valide.
  const apply = flags.has("--apply");
  const allowContentEdit = flags.has("--allow-content-edit");

  const results = runUpdate(rootDir, decisions, seoConfig, { dryRun: !apply, allowContentEdit });

  console.log("");
  console.log(`SEO UPDATE — ${seoConfig.brand.toUpperCase()}`);
  console.log(apply ? "Mode: APPLY (écriture sur le disque)" : "Mode: DRY-RUN (aucune écriture — ajoutez --apply pour écrire)");
  console.log("");

  let blocked = 0;
  for (const r of results) {
    console.log(`[${r.status}] ${r.change.type} — ${r.change.page}`);
    if (r.problems) for (const p of r.problems) console.log(`  ${p.status}: ${p.reason}`);
    if (r.diffs) for (const d of r.diffs) console.log(`  ${d.field}: "${d.before}" -> "${d.after}"`);
    if (r.error) console.log(`  ERROR: ${r.error}`);
    if (r.status === "BLOCKED_BUSINESS_FACT") blocked++;
    console.log("");
  }

  if (blocked > 0) {
    console.error(`${blocked} changement(s) bloqué(s) pour fait métier non vérifié. Aucun n'a été appliqué.`);
    process.exit(1);
  }
}

const commands = { audit: cmdAudit, opportunities: cmdOpportunities, update: cmdUpdate };

if (!commands[command]) {
  console.error("Usage: node seo/cli.mjs <audit|opportunities|update> [--ci] [--file <path>] [--apply] [--allow-content-edit]");
  process.exit(1);
}

await commands[command]();
