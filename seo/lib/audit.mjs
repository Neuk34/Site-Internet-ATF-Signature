// Contrôles déterministes, aucun appel réseau ni LLM. Chaque fonction produit des findings
// {id, severity, category, page, message, evidence}. `analyzeSite` les assemble et calcule les scores.

import {
  extractTitle,
  extractMetaDescription,
  extractMetaRobots,
  extractCanonical,
  extractOpenGraph,
  extractHeadings,
  extractJsonLd,
  extractImages,
  extractInternalLinks,
} from "./html.mjs";
import { findUnconfirmedBusinessMarkers } from "./businessFacts.mjs";
import { scorePage, overallScore } from "./score.mjs";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function finding(page, id, severity, category, message, evidence = null) {
  return { page, id, severity, category, message, evidence };
}

/**
 * Analyse une page publique déjà rendue.
 * @param {{path:string,label:string,status:number,html:string}} page
 * @param {string[]} allTitles titles des autres pages publiques (pour détecter les doublons)
 * @param {string[]} allDescriptions
 */
function analyzePublicPage(page, allTitles, allDescriptions) {
  const f = [];
  const { path, html, status } = page;

  if (status !== 200) {
    f.push(finding(path, "PAGE_NOT_200", "P0", "TECHNICAL", `Statut HTTP ${status} au lieu de 200.`));
  }

  // --- TITLE ---
  const title = extractTitle(html);
  if (!title) {
    f.push(finding(path, "MISSING_TITLE", "P0", "CONTENT", "Aucune balise <title>."));
  } else {
    const duplicates = allTitles.filter((t) => t === title).length;
    if (duplicates > 1) {
      f.push(finding(path, "DUPLICATE_TITLE", "P1", "CONTENT", `Title dupliqué avec une autre page : "${title}"`, title));
    }
  }

  // --- META DESCRIPTION ---
  const description = extractMetaDescription(html);
  if (!description) {
    f.push(finding(path, "MISSING_META_DESCRIPTION", "P1", "CONTENT", "Aucune meta description."));
  } else {
    const duplicates = allDescriptions.filter((d) => d === description).length;
    if (duplicates > 1) {
      f.push(finding(path, "DUPLICATE_META_DESCRIPTION", "P1", "CONTENT", "Meta description dupliquée avec une autre page.", description));
    }
  }

  // --- H1 ---
  const headings = extractHeadings(html);
  const h1s = headings.filter((h) => h.level === 1);
  if (h1s.length === 0) {
    f.push(finding(path, "MISSING_H1", "P1", "CONTENT", "Aucun H1 détecté."));
  } else if (h1s.length > 1) {
    f.push(finding(path, "MULTIPLE_H1", "P2", "CONTENT", `${h1s.length} H1 détectés (un seul attendu).`));
  }

  // --- structure H2/H3 : signale un saut de niveau (H1 -> H3 sans H2), simple avertissement ---
  for (let i = 1; i < headings.length; i++) {
    if (headings[i].level - headings[i - 1].level > 1) {
      f.push(finding(path, "HEADING_LEVEL_SKIP", "P3", "CONTENT", `Saut de niveau de titre : H${headings[i - 1].level} → H${headings[i].level}.`));
      break; // un seul signalement suffit, pas la peine de lister chaque occurrence
    }
  }

  // --- CANONICAL ---
  const canonical = extractCanonical(html);
  if (!canonical) {
    f.push(finding(path, "MISSING_CANONICAL", "P1", "TECHNICAL", "Aucune balise <link rel=\"canonical\">."));
  }

  // --- ROBOTS : une page publique ne doit jamais être noindex par accident ---
  const robots = extractMetaRobots(html);
  if (robots && robots.includes("noindex")) {
    f.push(finding(path, "UNINTENTIONAL_NOINDEX", "P0", "TECHNICAL", `Page publique marquée "${robots}" — noindex probablement involontaire.`));
  }

  // --- OPENGRAPH ---
  const og = extractOpenGraph(html);
  const missingOg = Object.entries(og).filter(([, v]) => !v).map(([k]) => k);
  if (missingOg.length > 0) {
    f.push(finding(path, "MISSING_OPENGRAPH", "P1", "TECHNICAL", `Balises OpenGraph manquantes : ${missingOg.join(", ")}.`));
  }

  // --- STRUCTURED DATA ---
  const jsonLd = extractJsonLd(html);
  if (jsonLd.length === 0) {
    f.push(finding(path, "MISSING_STRUCTURED_DATA", "P2", "STRUCTURED_DATA", "Aucune donnée structurée (JSON-LD) sur cette page."));
  } else {
    for (const block of jsonLd) {
      if (block.__parse_error) {
        f.push(finding(path, "INVALID_STRUCTURED_DATA", "P1", "STRUCTURED_DATA", "Un bloc JSON-LD n'est pas un JSON valide.", block.raw));
      }
    }
  }

  // --- IMAGES ---
  const images = extractImages(html);
  if (images.length === 0) {
    f.push(finding(path, "MEDIA_NOT_YET_INTEGRATED", "INFO", "MEDIA", "Aucune balise <img> réelle sur cette page (médias encore en placeholder)."));
  } else {
    for (const img of images) {
      if (!img.alt) {
        f.push(finding(path, "MISSING_ALT", "P1", "MEDIA", `Image sans attribut alt : ${img.src ?? "(src inconnu)"}`));
      }
      if (!img.hasWidth || !img.hasHeight) {
        f.push(finding(path, "IMAGE_MISSING_DIMENSIONS", "P2", "MEDIA", `Image sans width/height explicites : ${img.src ?? "(src inconnu)"}`));
      }
      if (!img.loading) {
        f.push(finding(path, "IMAGE_MISSING_LAZY_LOADING", "P3", "MEDIA", `Image sans attribut loading : ${img.src ?? "(src inconnu)"}`));
      }
    }
  }

  // --- LOCAL SEO : zone + marque présentes sur la page ---
  const text = html.replace(/<[^>]+>/g, " ");
  if (!/Angers/i.test(text)) {
    f.push(finding(path, "MISSING_LOCAL_SIGNAL", "P2", "LOCAL", "Aucune mention \"Angers\" détectée sur cette page."));
  }
  if (!/ATF Signature/i.test(text)) {
    f.push(finding(path, "MISSING_BRAND_SIGNAL", "P2", "LOCAL", "Aucune mention de la marque ATF Signature détectée sur cette page."));
  }

  // --- BUSINESS_DATA_UNCONFIRMED : jamais une erreur SEO, un simple rappel ---
  for (const marker of findUnconfirmedBusinessMarkers(html)) {
    f.push(finding(path, "BUSINESS_DATA_UNCONFIRMED", "INFO", "LOCAL", `Donnée métier encore non confirmée sur cette page : "${marker}"`));
  }

  return f;
}

/**
 * @param {{id:string,path:string}[]} excludedPages
 * @param {{path:string,html:string}[]} renderedExcluded
 */
function analyzeExcludedPages(renderedExcluded) {
  const f = [];
  for (const page of renderedExcluded) {
    const robots = extractMetaRobots(page.html);
    if (!robots || !robots.includes("noindex")) {
      f.push(finding(page.path, "LAB_PAGE_MISSING_NOINDEX", "P1", "TECHNICAL", "Page interne (hors périmètre commercial) sans noindex,nofollow."));
    }
  }
  return f;
}

/**
 * Liens internes cassés (pointent vers un chemin qui n'existe dans aucune page connue),
 * et repérage des pages orphelines (aucune autre page du site n'y renvoie).
 * @param {{path:string,html:string}[]} publicPages
 */
function analyzeInternalLinking(publicPages) {
  const f = [];
  const knownPaths = new Set(publicPages.map((p) => p.path));
  const inboundCount = Object.fromEntries(publicPages.map((p) => [p.path, 0]));

  for (const page of publicPages) {
    const links = extractInternalLinks(page.html);
    for (const href of links) {
      const cleanPath = href.split("#")[0].split("?")[0] || "/";
      if (cleanPath === page.path) continue; // lien vers soi-même (ex: logo), ignoré
      if (knownPaths.has(cleanPath)) {
        inboundCount[cleanPath] = (inboundCount[cleanPath] ?? 0) + 1;
      } else if (!knownPaths.has(href)) {
        // Chemin interne inconnu du site : lien potentiellement cassé.
        f.push(finding(page.path, "BROKEN_INTERNAL_LINK", "P1", "INTERNAL_LINKING", `Lien interne vers un chemin inconnu : ${href}`));
      }
    }
  }

  for (const page of publicPages) {
    if (page.path === "/") continue; // l'accueil n'a pas besoin d'être "linké" pour exister
    if ((inboundCount[page.path] ?? 0) === 0) {
      f.push(finding(page.path, "ORPHAN_PAGE", "P1", "INTERNAL_LINKING", "Aucune autre page publique ne pointe vers celle-ci (hors navigation)."));
    }
  }

  return f;
}

/**
 * Vérifie /sitemap.xml tel que réellement servi (fichier statique dans public/ OU route
 * dynamique app/sitemap.ts — vinext/Next.js supportent les deux, l'audit ne doit pas supposer
 * laquelle est utilisée). Présence, XML valide, couverture des pages publiques.
 * @param {string} rootDir
 * @param {{path:string}[]} publicPages
 * @param {{status:number, html:string}|null} sitemapResponse rendu réel de /sitemap.xml, ou null
 *   si non fourni (fallback sur l'ancien contrôle de fichier statique).
 */
export function analyzeSitemap(rootDir, publicPages, sitemapResponse = null) {
  const f = [];
  let raw;

  if (sitemapResponse) {
    if (sitemapResponse.status !== 200) {
      f.push(finding("(site)", "MISSING_SITEMAP", "P1", "TECHNICAL", "/sitemap.xml ne répond pas (ni fichier statique public/sitemap.xml, ni route app/sitemap.ts)."));
      return f;
    }
    raw = sitemapResponse.html;
  } else {
    const sitemapPath = path.join(rootDir, "public", "sitemap.xml");
    if (!existsSync(sitemapPath)) {
      f.push(finding("(site)", "MISSING_SITEMAP", "P1", "TECHNICAL", "public/sitemap.xml est absent (et aucun rendu de /sitemap.xml fourni à l'audit)."));
      return f;
    }
    raw = readFileSync(sitemapPath, "utf8");
  }

  const isWellFormed = /<urlset[\s\S]*<\/urlset>/i.test(raw) && !/<[^>]+$/.test(raw.trim());
  if (!isWellFormed) {
    f.push(finding("(site)", "INVALID_SITEMAP", "P0", "TECHNICAL", "/sitemap.xml existe mais ne ressemble pas à un XML <urlset> valide."));
    return f;
  }

  const locs = [...raw.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((m) => m[1].trim());
  for (const page of publicPages) {
    const covered = locs.some((loc) => loc.endsWith(page.path) || (page.path === "/" && /\/?$/.test(loc)));
    if (!covered) {
      f.push(finding("(site)", "PAGE_MISSING_FROM_SITEMAP", "P2", "TECHNICAL", `${page.path} n'apparaît pas dans le sitemap.`));
    }
  }

  return f;
}

/**
 * @param {{path:string,label:string,status:number,html:string}[]} publicRendered
 * @param {{path:string,html:string}[]} excludedRendered
 */
export function analyzeSite(publicRendered, excludedRendered, extraFindings = []) {
  const allTitles = publicRendered.map((p) => extractTitle(p.html)).filter(Boolean);
  const allDescriptions = publicRendered.map((p) => extractMetaDescription(p.html)).filter(Boolean);

  /** @type {any[]} */
  let findings = [];
  for (const page of publicRendered) {
    findings = findings.concat(analyzePublicPage(page, allTitles, allDescriptions));
  }
  findings = findings.concat(analyzeExcludedPages(excludedRendered));
  findings = findings.concat(analyzeInternalLinking(publicRendered));
  findings = findings.concat(extraFindings);

  const scoredFindings = findings.filter((x) => x.severity !== "INFO");

  const pages = publicRendered.map((page) => {
    const pageFindings = scoredFindings.filter((x) => x.page === page.path);
    const categoryScores = scorePage(pageFindings);
    return {
      path: page.path,
      label: page.label,
      categoryScores,
      overall: overallScore(categoryScores),
      findings: findings.filter((x) => x.page === page.path),
    };
  });

  const counts = { P0: 0, P1: 0, P2: 0, P3: 0, INFO: 0 };
  for (const finding of findings) counts[finding.severity]++;

  return { generatedAt: new Date().toISOString(), pages, counts, findings };
}
