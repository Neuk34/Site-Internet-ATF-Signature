// Rendu des pages à auditer : réutilise exactement le mécanisme déjà utilisé par
// tests/rendered-html.test.mjs (worker Cloudflare buildé, fetch en mémoire), pour auditer
// le HTML tel qu'il sera réellement servi — pas le JSX source.
// Nécessite `npm run build` au préalable (le CLI le rappelle si dist/ est absent).

import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export function projectRoot() {
  return fileURLToPath(new URL("../../", import.meta.url));
}

export function distWorkerPath() {
  return new URL("../../dist/server/index.js", import.meta.url);
}

export function isBuilt() {
  return existsSync(fileURLToPath(distWorkerPath()));
}

/**
 * Rend une page via le worker buildé, comme un vrai client HTTP la recevrait.
 * @param {string} path ex: "/interieur"
 * @returns {Promise<{status:number, html:string}>}
 */
export async function renderPage(path) {
  const workerUrl = distWorkerPath();
  // Cache-bust pour éviter de réutiliser un module Node déjà importé entre deux runs du CLI.
  workerUrl.searchParams.set("seo-run", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  const html = await response.text();
  return { status: response.status, html };
}

/** Rend toutes les pages listées en config (publiques + exclues), dans l'ordre. */
export async function renderAllPages(pages) {
  const results = [];
  for (const page of pages) {
    const rendered = await renderPage(page.path);
    results.push({ ...page, ...rendered });
  }
  return results;
}
