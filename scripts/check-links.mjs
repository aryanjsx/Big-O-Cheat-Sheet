// Checks the static build in out/ after `npm run build`:
// - every internal href and src points at a file that exists, under the base path
// - every #anchor on an internal link exists on the target page
// - canonical, og:url, og:image, and twitter:image tags, and sitemap entries, point at real
//   pages or files on the site URL
// - every page has one h1 and no skipped heading levels
// Uses the same NEXT_PUBLIC_BASE_PATH and NEXT_PUBLIC_SITE_URL as the build. No dependencies.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://aryanjsx.github.io/BigOSheet/").replace(/\/?$/, "/");

if (!existsSync(OUT)) {
  console.error("No out/ folder. Run `npm run build` first.");
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const pages = walk(OUT).filter((f) => f.endsWith(".html"));
const ids = new Map(); // file -> Set of ids
const idsOf = (file) => {
  if (!ids.has(file)) ids.set(file, new Set([...readFileSync(file, "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  return ids.get(file);
};

/** Maps a site path such as "/sorting/" to the file that serves it, or null. */
function fileFor(path) {
  const clean = decodeURIComponent(path.split("?")[0]);
  const p = join(OUT, clean);
  if (clean.endsWith("/")) return existsSync(join(p, "index.html")) ? join(p, "index.html") : null;
  if (existsSync(p) && statSync(p).isFile()) return p;
  if (existsSync(p + ".html")) return p + ".html";
  if (existsSync(join(p, "index.html"))) return join(p, "index.html");
  return null;
}

const problems = [];
let checked = 0;

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const where = relative(OUT, page).split(sep).join("/");
  for (const [, attr, url] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:|javascript:)/.test(url)) continue;
    checked++;
    if (url.startsWith("#")) {
      const id = url.slice(1);
      if (id && !idsOf(page).has(id)) problems.push(`${where}: ${attr}="${url}" has no matching id on the page`);
      continue;
    }
    if (!url.startsWith("/")) {
      problems.push(`${where}: ${attr}="${url}" is relative; use a root path so it works under ${BASE || "/"}`);
      continue;
    }
    if (BASE && !(url === BASE || url.startsWith(BASE + "/"))) {
      problems.push(`${where}: ${attr}="${url}" is missing the base path ${BASE}`);
      continue;
    }
    const [path, hash] = url.slice(BASE.length).split("#");
    const target = fileFor(path || "/");
    if (!target) {
      problems.push(`${where}: ${attr}="${url}" points at a file that does not exist`);
      continue;
    }
    // /compare/#a,b stores the pair in the hash; it is not an element id.
    if (hash && target.endsWith(".html") && !hash.includes(",") && !idsOf(target).has(hash)) {
      problems.push(`${where}: ${attr}="${url}" has no element with id="${hash}" on the target page`);
    }
  }

  for (const [, tag, url] of html.matchAll(/<(link rel="canonical"|meta property="og:url"|meta property="og:image"|meta name="twitter:image") (?:href|content)="([^"]+)"/g)) {
    if (!url.startsWith(SITE)) problems.push(`${where}: ${tag} "${url}" is not on ${SITE}`);
    else if (!fileFor("/" + url.slice(SITE.length).split("?")[0])) problems.push(`${where}: ${tag} "${url}" is not a built page or file`);
  }
}

// Headings: one h1 per page, and no skipped levels (an h2 followed by an h4, say).
for (const page of pages) {
  const where = relative(OUT, page).split(sep).join("/");
  const html = readFileSync(page, "utf8").replace(/<dialog[\s\S]*?<\/dialog>/g, "");
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  const h1s = levels.filter((l) => l === 1).length;
  if (h1s !== 1) problems.push(`${where}: has ${h1s} h1 headings, expected 1`);
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      problems.push(`${where}: heading jumps from h${levels[i - 1]} to h${levels[i]}`);
      break;
    }
  }
}

const sitemap = join(OUT, "sitemap.xml");
if (!existsSync(sitemap)) problems.push("sitemap.xml is missing");
else {
  const locs = [...readFileSync(sitemap, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const loc of locs) {
    if (!loc.startsWith(SITE)) problems.push(`sitemap.xml: ${loc} is not on ${SITE}`);
    else if (!fileFor("/" + loc.slice(SITE.length))) problems.push(`sitemap.xml: ${loc} is not a built page or file`);
  }
  console.log(`sitemap.xml: ${locs.length} URLs`);
}

console.log(`Checked ${checked} links on ${pages.length} pages (base path "${BASE}", site ${SITE}).`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n` + problems.map((p) => "  " + p).join("\n"));
  process.exit(1);
}
console.log("No broken links.");
