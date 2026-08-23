// Extracteurs HTML minimalistes, volontairement fondés sur des regex plutôt qu'un parseur DOM.
// Choix assumé (voir rapport de mission, "OUTILS / LIBRAIRIES ÉVALUÉS") : le HTML audité est
// entièrement généré par notre propre build (pas du contenu tiers arbitraire), sa structure est
// stable, et le test existant du dépôt (tests/rendered-html.test.mjs) utilise déjà ce principe.
// Ce n'est pas un parseur HTML généraliste : chaque fonction cible un besoin précis et rien d'autre.

/** @param {string} html */
export function extractTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1].trim()) : null;
}

/** @param {string} html */
export function extractMetaDescription(html) {
  const m = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?>/i);
  return m ? decodeEntities(m[1].trim()) : null;
}

/** @param {string} html */
export function extractMetaRobots(html) {
  const m = html.match(/<meta\s+name=["']robots["']\s+content=["']([\s\S]*?)["']\s*\/?>/i);
  return m ? m[1].trim().toLowerCase() : null;
}

/** @param {string} html */
export function extractCanonical(html) {
  const m = html.match(/<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']\s*\/?>/i);
  return m ? m[1].trim() : null;
}

/** @param {string} html */
export function extractOpenGraph(html) {
  const props = ["og:title", "og:description", "og:image", "og:url"];
  /** @type {Record<string,string|null>} */
  const result = {};
  for (const prop of props) {
    const re = new RegExp(
      `<meta\\s+property=["']${prop.replace(":", "\\:")}["']\\s+content=["']([\\s\\S]*?)["']\\s*\\/?>`,
      "i",
    );
    const m = html.match(re);
    result[prop] = m ? m[1].trim() : null;
  }
  return result;
}

/** @param {string} html */
export function extractHeadings(html) {
  /** @type {{level:number,text:string}[]} */
  const headings = [];
  const re = /<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html))) {
    headings.push({ level: Number(m[1]), text: decodeEntities(stripTags(m[2]).trim()) });
  }
  return headings;
}

/** @param {string} html */
export function extractJsonLd(html) {
  /** @type {any[]} */
  const blocks = [];
  const re = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch {
      blocks.push({ __parse_error: true, raw: m[1].slice(0, 120) });
    }
  }
  return blocks;
}

/** @param {string} html */
export function extractImages(html) {
  /** @type {{src:string|null,alt:string|null,hasWidth:boolean,hasHeight:boolean,loading:string|null}[]} */
  const images = [];
  const re = /<img\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(html))) {
    const attrs = m[1];
    images.push({
      src: attr(attrs, "src"),
      alt: attr(attrs, "alt"),
      hasWidth: /\bwidth=/.test(attrs),
      hasHeight: /\bheight=/.test(attrs),
      loading: attr(attrs, "loading"),
    });
  }
  return images;
}

/** Liens internes (href commençant par "/" ou relatif), en excluant tel:/mailto:/# purs et externes. */
/** @param {string} html */
export function extractInternalLinks(html) {
  /** @type {string[]} */
  const links = [];
  const re = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const href = m[1];
    if (href.startsWith("/") && !href.startsWith("//")) links.push(href);
  }
  return links;
}

function attr(attrString, name) {
  const m = attrString.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"));
  return m ? m[1] : null;
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}
