import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the T.A.F Qualité prototype and conversion journey", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html lang="fr">/);
  assert.match(html, /<title>T\.A\.F Qualité — Rénovation intérieure, extérieure et bois à Angers<\/title>/);
  assert.match(html, /Échanger avec Majid/);
  assert.match(html, /Un projet clair/);
  assert.match(html, /Demander un devis/);
  assert.doesNotMatch(html, /Étape 1 sur 2/);
  assert.match(html, /Mentions légales/);
  assert.match(html, /Politique de confidentialité/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview/);
});

test("gives each public route its own title and description", async () => {
  const seen = new Set();
  for (const path of ["/", "/interieur", "/exterieur", "/bois", "/taf-qualite"]) {
    const html = await (await render(path)).text();
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title, `missing <title> for ${path}`);
    assert.ok(!seen.has(title), `duplicate <title> "${title}" for ${path}`);
    seen.add(title);
    assert.match(html, /name="description" content="[^"]+"/, path);
  }
});

test("preserves the five validated routes", async () => {
  for (const [path, marker] of [
    ["/", "Trois savoir-faire"],
    ["/interieur", "Repeindre, refaire un sol"],
    ["/exterieur", "On s.en occupe pareil"],
    ["/bois", "il suffit de les remettre en état"],
    ["/taf-qualite", "Le travail bien fait"],
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), new RegExp(marker), path);
  }
});
