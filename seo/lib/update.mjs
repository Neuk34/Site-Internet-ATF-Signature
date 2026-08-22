// Applique UNIQUEMENT des changements déjà validés par un humain, jamais une décision du moteur.
// Dry-run par défaut : écrire sur le disque exige --file (changements validés) ET --apply.
// META_UPDATE est le seul type dont l'écriture est implémentée aujourd'hui (voir rapport de
// mission, choix assumé) ; les autres types autorisés sont validés mais NOT_YET_IMPLEMENTED.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { guardBusinessFacts } from "./businessFacts.mjs";

/**
 * @param {{type:string, page:string, title?:string, description?:string, business_facts_used?:string[]}} change
 * @param {import("../seo.config.mjs").seoConfig} config
 * @param {boolean} allowContentEdit
 */
export function validateChange(change, config, allowContentEdit) {
  const problems = [];

  if (!config.allowedChangeTypes.includes(change.type)) {
    problems.push({ status: "REJECTED_UNKNOWN_TYPE", reason: `Type "${change.type}" absent de allowedChangeTypes.` });
  }

  if (change.type === "CONTENT_EDIT" && !allowContentEdit) {
    problems.push({ status: "SKIPPED_REQUIRES_FLAG", reason: "CONTENT_EDIT nécessite --allow-content-edit, non fourni." });
  }

  const businessReasons = guardBusinessFacts(change, config.businessFacts, config.sensitiveClaimPatterns);
  for (const reason of businessReasons) {
    problems.push({ status: "BLOCKED_BUSINESS_FACT", reason });
  }

  const page = config.pages.find((p) => p.id === change.page || p.path === change.page);
  if (!page) {
    problems.push({ status: "REJECTED_UNKNOWN_PAGE", reason: `Page "${change.page}" absente de config.pages.` });
  }

  return { problems, page };
}

/**
 * @param {string} rootDir
 * @param {{page:string,file:string}} page
 * @param {{title?:string, description?:string}} change
 * @param {{dryRun:boolean}} opts
 */
export function applyMetaUpdate(rootDir, page, change, { dryRun }) {
  const filePath = path.join(rootDir, page.file);
  if (!existsSync(filePath)) {
    return { applied: false, error: `Fichier introuvable : ${page.file}` };
  }
  const before = readFileSync(filePath, "utf8");
  let after = before;
  const diffs = [];

  if (change.title) {
    const re = /title:\s*"([^"]*)"/;
    const m = before.match(re);
    if (!m) return { applied: false, error: `Impossible de localiser "title:" dans ${page.file}` };
    diffs.push({ field: "title", before: m[1], after: change.title });
    after = after.replace(re, `title: "${escapeForJs(change.title)}"`);
  }

  if (change.description) {
    const re = /description:\s*\n?\s*"([^"]*)"/;
    const m = before.match(re);
    if (!m) return { applied: false, error: `Impossible de localiser "description:" dans ${page.file}` };
    diffs.push({ field: "description", before: m[1], after: change.description });
    after = after.replace(re, `description:\n    "${escapeForJs(change.description)}"`);
  }

  if (!dryRun) writeFileSync(filePath, after, "utf8");

  return { applied: !dryRun, file: page.file, diffs };
}

function escapeForJs(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * @param {string} rootDir
 * @param {{approved_changes: any[]}} decisions
 * @param {import("../seo.config.mjs").seoConfig} config
 * @param {{dryRun:boolean, allowContentEdit:boolean}} opts
 */
export function runUpdate(rootDir, decisions, config, opts) {
  const results = [];
  for (const change of decisions.approved_changes ?? []) {
    const { problems, page } = validateChange(change, config, opts.allowContentEdit);
    if (problems.length > 0) {
      results.push({ change, status: problems[0].status, problems });
      continue;
    }

    if (change.type === "META_UPDATE") {
      const result = applyMetaUpdate(rootDir, page, change, { dryRun: opts.dryRun });
      results.push({
        change,
        status: result.error ? "ERROR" : opts.dryRun ? "DRY_RUN" : "APPLIED",
        ...result,
      });
    } else {
      results.push({ change, status: "NOT_YET_IMPLEMENTED", reason: `L'application de "${change.type}" n'est pas encore codée.` });
    }
  }
  return results;
}
