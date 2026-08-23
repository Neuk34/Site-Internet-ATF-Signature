// Applique UNIQUEMENT des changements déjà validés par un humain, jamais une décision du moteur.
// Dry-run par défaut : écrire sur le disque exige --file (changements validés) ET --apply.
// META_UPDATE est le seul type dont l'écriture est implémentée aujourd'hui (voir rapport de
// mission, choix assumé) ; les autres types autorisés sont validés mais NOT_YET_IMPLEMENTED.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
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
 * @param {{page:string,file:string,metaPath?:object}} page
 * @param {{title?:string, description?:string}} change
 * @param {{dryRun:boolean}} opts
 */
export function applyMetaUpdate(rootDir, page, change, opts) {
  // Les pages dont le title/description vivent dans un fichier de config partagé
  // (app/config/*.config.ts, plusieurs pages par fichier) plutôt que littéralement
  // dans leur propre page.tsx portent un `metaPath` qui dit où et lequel chercher.
  // Sans metaPath, on retombe sur la recherche directe dans page.file (comportement
  // d'origine, toujours valable pour une page qui a son propre title/description en dur).
  return page.metaPath
    ? applyMetaUpdateInSharedConfig(rootDir, page, change, opts)
    : applyMetaUpdateInOwnFile(rootDir, page, change, opts);
}

function applyMetaUpdateInOwnFile(rootDir, page, change, { dryRun }) {
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

/**
 * Édite title/description dans un fichier de config partagé (plusieurs pages/services
 * cohabitent dedans) en localisant le bon bloc `meta` par analyse syntaxique réelle
 * (TypeScript est déjà une dépendance du projet - pas de regex hasardeuse sur un fichier
 * qui contient plusieurs `title:`/`description:` dont certains hors de tout `meta`,
 * comme `about.title`, le h1 de la page, à côté de `about.meta.title`).
 */
function applyMetaUpdateInSharedConfig(rootDir, page, change, { dryRun }) {
  const { file, kind, key } = page.metaPath;
  const filePath = path.join(rootDir, file);
  if (!existsSync(filePath)) {
    return { applied: false, error: `Fichier introuvable : ${file}` };
  }
  const text = readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  const configObject = findConfigObjectLiteral(sourceFile);
  if (!configObject) {
    return { applied: false, error: `Impossible de localiser l'objet de configuration dans ${file}` };
  }

  const metaObject = findMetaObject(configObject, { kind, key });
  if (!metaObject) {
    const where = kind === "service" ? `services[key="${key}"].meta` : kind === "about" ? "about.meta" : "business.homeMeta";
    return { applied: false, error: `Impossible de localiser ${where} dans ${file}` };
  }

  const diffs = [];
  const edits = [];

  for (const [field, value] of [["title", change.title], ["description", change.description]]) {
    if (!value) continue;
    const property = findProperty(metaObject, field);
    const node = property?.initializer;
    if (!node || !ts.isStringLiteralLike(node)) {
      return { applied: false, error: `Impossible de localiser "${field}" pour "${page.id}" dans ${file}` };
    }
    diffs.push({ field, before: node.text, after: value });
    edits.push({ start: node.getStart(sourceFile), end: node.getEnd(), replacement: JSON.stringify(value) });
  }

  // Du texte le plus loin dans le fichier vers le début, pour que les positions déjà
  // calculées restent valables au fur et à mesure des remplacements.
  edits.sort((a, b) => b.start - a.start);
  let after = text;
  for (const edit of edits) {
    after = after.slice(0, edit.start) + edit.replacement + after.slice(edit.end);
  }

  if (!dryRun) writeFileSync(filePath, after, "utf8");

  return { applied: !dryRun, file, diffs };
}

/** Le premier objet littéral exporté qui a la forme d'un SiteConfig (repéré par la
 *  présence de "business" et "services", sans dépendre du nom de la variable). */
function findConfigObjectLiteral(sourceFile) {
  let found;
  const visit = (node) => {
    if (found) return;
    if (ts.isVariableDeclaration(node) && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
      const obj = node.initializer;
      if (findProperty(obj, "business") && findProperty(obj, "services")) {
        found = obj;
        return;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return found;
}

function findProperty(objectLiteral, name) {
  if (!objectLiteral || !ts.isObjectLiteralExpression(objectLiteral)) return undefined;
  return objectLiteral.properties.find(
    (p) => ts.isPropertyAssignment(p) && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) && p.name.text === name,
  );
}

function findMetaObject(configObject, { kind, key }) {
  if (kind === "home") {
    const business = findProperty(configObject, "business")?.initializer;
    return findProperty(business, "homeMeta")?.initializer;
  }
  if (kind === "about") {
    const about = findProperty(configObject, "about")?.initializer;
    return findProperty(about, "meta")?.initializer;
  }
  if (kind === "service") {
    const services = findProperty(configObject, "services")?.initializer;
    if (!services || !ts.isArrayLiteralExpression(services)) return undefined;
    for (const element of services.elements) {
      if (!ts.isObjectLiteralExpression(element)) continue;
      const keyNode = findProperty(element, "key")?.initializer;
      if (keyNode && ts.isStringLiteralLike(keyNode) && keyNode.text === key) {
        return findProperty(element, "meta")?.initializer;
      }
    }
  }
  return undefined;
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
