import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { analyzeSite, analyzeSitemap } from "../../seo/lib/audit.mjs";
import { detectCannibalization, buildNewPageCandidates } from "../../seo/lib/opportunities.mjs";
import { runUpdate } from "../../seo/lib/update.mjs";
import { seoConfig } from "../../seo/seo.config.mjs";

function page(path_, html) {
  return { id: path_.replace("/", "") || "accueil", path: path_, label: path_, status: 200, html };
}

function baseHtml({ title, description = "Une description.", h1 = "Titre de page", robots = null, extra = "" }) {
  return `<!doctype html><html><head>
    <title>${title}</title>
    <meta name="description" content="${description}"/>
    <link rel="canonical" href="https://example.fr${extra.canonicalPath ?? ""}"/>
    ${robots ? `<meta name="robots" content="${robots}"/>` : ""}
    <meta property="og:title" content="${title}"/>
    <meta property="og:description" content="${description}"/>
    <meta property="og:image" content="https://example.fr/img.jpg"/>
    <meta property="og:url" content="https://example.fr"/>
  </head><body><h1>${h1}</h1>${typeof extra === "string" ? extra : ""}</body></html>`;
}

test("détecte un title dupliqué entre deux pages", () => {
  const p1 = page("/a", baseHtml({ title: "Même titre" }));
  const p2 = page("/b", baseHtml({ title: "Même titre" }));
  const result = analyzeSite([p1, p2], []);
  const dup = result.findings.filter((f) => f.id === "DUPLICATE_TITLE");
  assert.equal(dup.length, 2, "les deux pages doivent être signalées");
  assert.equal(dup[0].severity, "P1");
});

test("détecte un noindex involontaire sur une page publique", () => {
  const p1 = page("/a", baseHtml({ title: "Page A", robots: "noindex,nofollow" }));
  const result = analyzeSite([p1], []);
  const finding = result.findings.find((f) => f.id === "UNINTENTIONAL_NOINDEX");
  assert.ok(finding, "doit détecter le noindex involontaire");
  assert.equal(finding.severity, "P0");
});

test("détecte un canonical manquant", () => {
  const html = `<!doctype html><html><head><title>Sans canonical</title>
    <meta name="description" content="desc"/></head><body><h1>H1</h1></body></html>`;
  const result = analyzeSite([page("/a", html)], []);
  const finding = result.findings.find((f) => f.id === "MISSING_CANONICAL");
  assert.ok(finding);
  assert.equal(finding.severity, "P1");
});

test("sitemap : absent = P1, invalide = P0", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "seo-sitemap-"));
  const pages = [{ path: "/" }];

  const missing = analyzeSitemap(dir, pages);
  assert.equal(missing[0].id, "MISSING_SITEMAP");
  assert.equal(missing[0].severity, "P1");

  mkdirSync(path.join(dir, "public"), { recursive: true });
  writeFileSync(path.join(dir, "public", "sitemap.xml"), "<not-even-xml", "utf8");
  const invalid = analyzeSitemap(dir, pages);
  assert.equal(invalid[0].id, "INVALID_SITEMAP");
  assert.equal(invalid[0].severity, "P0");

  rmSync(dir, { recursive: true, force: true });
});

test("détecte une image sans attribut alt", () => {
  const html = baseHtml({ title: "Page média", extra: `<img src="/x.jpg" width="10" height="10" loading="lazy"/>` });
  const result = analyzeSite([page("/a", html)], []);
  const finding = result.findings.find((f) => f.id === "MISSING_ALT");
  assert.ok(finding);
  assert.equal(finding.severity, "P1");
});

test("détecte une cannibalisation simple entre deux pages", () => {
  const keywordMap = { renovation: ["rénovation maison Angers"] };
  const strong = { id: "renovation", path: "/renovation", html: `<title>Rénovation maison Angers</title><h1>Rénovation maison Angers</h1>` };
  const rival = { id: "accueil", path: "/", html: `<title>Rénovation maison Angers, le spécialiste</title><h1>Rénovation maison à Angers</h1>` };
  const findings = detectCannibalization([strong, rival], keywordMap);
  assert.ok(findings.some((f) => f.type === "KEYWORD_CANNIBALIZATION_RISK" && f.family === "renovation"));
});

test("NEW_PAGE_CANDIDATE ne crée jamais de fichier, reste bloqué tant que non confirmé", () => {
  const candidates = buildNewPageCandidates(seoConfig, []);
  assert.ok(candidates.length > 0);
  for (const c of candidates) {
    assert.equal(c.type, "NEW_PAGE_CANDIDATE");
    assert.equal(c.business_confirmed, "NO");
    assert.equal(c.recommendation, "DO_NOT_CREATE_YET");
  }
  // La fonction est pure (aucun import fs côté opportunities.mjs) : aucune écriture possible.
});

test("update bloque un changement qui affirme un fait métier non vérifié", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "seo-update-"));
  mkdirSync(path.join(dir, "app", "test-page"), { recursive: true });
  const filePath = path.join(dir, "app", "test-page", "page.tsx");
  const original = `export const metadata = {\n  title: "Ancien titre",\n  description:\n    "Ancienne description.",\n};\n`;
  writeFileSync(filePath, original, "utf8");

  const config = {
    ...seoConfig,
    pages: [{ id: "test-page", path: "/test-page", file: "app/test-page/page.tsx" }],
  };

  const decisions = {
    approved_changes: [
      { type: "META_UPDATE", page: "test-page", title: "Entreprise décennale certifiée à Angers" },
    ],
  };

  const results = runUpdate(dir, decisions, config, { dryRun: true, allowContentEdit: false });
  assert.equal(results[0].status, "BLOCKED_BUSINESS_FACT");
  assert.equal(readFileSync(filePath, "utf8"), original, "le fichier ne doit pas avoir bougé");

  rmSync(dir, { recursive: true, force: true });
});

test("dry-run n'écrit rien sur le disque", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "seo-dryrun-"));
  mkdirSync(path.join(dir, "app", "test-page"), { recursive: true });
  const filePath = path.join(dir, "app", "test-page", "page.tsx");
  const original = `export const metadata = {\n  title: "Ancien titre",\n  description:\n    "Ancienne description.",\n};\n`;
  writeFileSync(filePath, original, "utf8");

  const config = {
    ...seoConfig,
    pages: [{ id: "test-page", path: "/test-page", file: "app/test-page/page.tsx" }],
  };

  const decisions = {
    approved_changes: [{ type: "META_UPDATE", page: "test-page", title: "Nouveau titre sans affirmation sensible" }],
  };

  const results = runUpdate(dir, decisions, config, { dryRun: true, allowContentEdit: false });
  assert.equal(results[0].status, "DRY_RUN");
  assert.equal(readFileSync(filePath, "utf8"), original, "dry-run ne doit jamais écrire");

  const applied = runUpdate(dir, decisions, config, { dryRun: false, allowContentEdit: false });
  assert.equal(applied[0].status, "APPLIED");
  assert.match(readFileSync(filePath, "utf8"), /Nouveau titre sans affirmation sensible/);

  rmSync(dir, { recursive: true, force: true });
});

test("CONTENT_EDIT est ignoré sans --allow-content-edit", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "seo-content-"));
  const config = { ...seoConfig, pages: [{ id: "test-page", path: "/test-page", file: "app/test-page/page.tsx" }] };
  const decisions = { approved_changes: [{ type: "CONTENT_EDIT", page: "test-page", text: "Nouveau paragraphe." }] };
  const results = runUpdate(dir, decisions, config, { dryRun: true, allowContentEdit: false });
  assert.equal(results[0].status, "SKIPPED_REQUIRES_FLAG");
  rmSync(dir, { recursive: true, force: true });
});

// Fixture qui reproduit la forme réelle de app/config/*.config.ts : plusieurs services
// dans un seul fichier, et une page "about" qui a un `title` d'accroche (h1) ET un
// `meta.title` distinct - le piège que doit éviter la recherche par metaPath.
function writeSharedConfigFixture(dir) {
  mkdirSync(path.join(dir, "app", "config"), { recursive: true });
  const filePath = path.join(dir, "app", "config", "site.config.ts");
  const content = `export const config = {
  business: {
    homeMeta: { title: "Accueil - titre", description: "Accueil - description" },
  },
  services: [
    {
      key: "interieur",
      meta: { title: "Interieur - titre", description: "Interieur - description" },
    },
    {
      key: "exterieur",
      meta: { title: "Exterieur - titre", description: "Exterieur - description" },
    },
  ],
  about: {
    title: "Accroche à propos (h1, pas un meta title)",
    meta: { title: "A propos - titre", description: "A propos - description" },
  },
};
`;
  writeFileSync(filePath, content, "utf8");
  return { filePath, relativeFile: "app/config/site.config.ts" };
}

test("META_UPDATE localise le bon service dans un fichier de config partagé", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "seo-shared-config-"));
  const { filePath, relativeFile } = writeSharedConfigFixture(dir);

  const config = {
    ...seoConfig,
    pages: [
      { id: "interieur", path: "/interieur", file: "app/interieur/page.tsx", metaPath: { file: relativeFile, kind: "service", key: "interieur" } },
      { id: "exterieur", path: "/exterieur", file: "app/exterieur/page.tsx", metaPath: { file: relativeFile, kind: "service", key: "exterieur" } },
    ],
  };

  const decisions = {
    approved_changes: [{ type: "META_UPDATE", page: "interieur", title: "Nouveau titre intérieur", description: "Nouvelle description intérieur" }],
  };

  const results = runUpdate(dir, decisions, config, { dryRun: false, allowContentEdit: false });
  assert.equal(results[0].status, "APPLIED");

  const after = readFileSync(filePath, "utf8");
  assert.match(after, /key: "interieur",\s*\n\s*meta: \{ title: "Nouveau titre intérieur", description: "Nouvelle description intérieur" \}/);
  // Le service voisin ne doit pas avoir bougé.
  assert.match(after, /key: "exterieur",\s*\n\s*meta: \{ title: "Exterieur - titre", description: "Exterieur - description" \}/);

  rmSync(dir, { recursive: true, force: true });
});

test("META_UPDATE sur la page à propos édite meta.title, jamais l'accroche (h1) qui porte aussi un champ title", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "seo-shared-config-about-"));
  const { filePath, relativeFile } = writeSharedConfigFixture(dir);

  const config = {
    ...seoConfig,
    pages: [{ id: "atf-signature", path: "/atf-signature", file: "app/atf-signature/page.tsx", metaPath: { file: relativeFile, kind: "about" } }],
  };

  const decisions = { approved_changes: [{ type: "META_UPDATE", page: "atf-signature", title: "Nouveau titre SEO à propos" }] };
  const results = runUpdate(dir, decisions, config, { dryRun: false, allowContentEdit: false });
  assert.equal(results[0].status, "APPLIED");

  const after = readFileSync(filePath, "utf8");
  assert.match(after, /meta: \{ title: "Nouveau titre SEO à propos"/);
  assert.match(after, /title: "Accroche à propos \(h1, pas un meta title\)"/, "le h1 de la page ne doit pas être touché");

  rmSync(dir, { recursive: true, force: true });
});

test("META_UPDATE sur l'accueil édite business.homeMeta", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "seo-shared-config-home-"));
  const { filePath, relativeFile } = writeSharedConfigFixture(dir);

  const config = {
    ...seoConfig,
    pages: [{ id: "accueil", path: "/", file: "app/page.tsx", metaPath: { file: relativeFile, kind: "home" } }],
  };

  const decisions = { approved_changes: [{ type: "META_UPDATE", page: "accueil", description: "Nouvelle description accueil" }] };
  const results = runUpdate(dir, decisions, config, { dryRun: false, allowContentEdit: false });
  assert.equal(results[0].status, "APPLIED");
  assert.match(readFileSync(filePath, "utf8"), /homeMeta: \{ title: "Accueil - titre", description: "Nouvelle description accueil" \}/);

  rmSync(dir, { recursive: true, force: true });
});
