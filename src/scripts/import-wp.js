/*  WordPress WXR → Eleventy importer  (safe-decode edition)
    -------------------------------------------------------------
    Usage (from repo-root):   npm run import:wp
    or:                       node src/scripts/import-wp.js <path/to/export.xml>
    -------------------------------------------------------------
    • Converts published *pages* in a WordPress/Squarespace WXR
      export into Markdown files under  src/content/<slug>/index.md
    • Rewrites every <img> to point at the S3 bucket listed in
      _data/artwork.js (which itself parses assets/images.csv)
*/

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const xml2js   = require("xml2js");
import TurndownService from "turndown";
import slugify from "@sindresorhus/slugify";

// ──────────────────────────────────────────────────────────────
// helpers
// ──────────────────────────────────────────────────────────────
const safeDecode = str => {
  try { return decodeURIComponent(str); }
  catch { return str; }
};
async function pathExists(p) { try { await fs.access(p); return true; } catch { return false; } }
async function findFile(p) {
  if (path.isAbsolute(p) && await pathExists(p))          return p;
  const cwdPath  = path.resolve(process.cwd(), p);
  if (await pathExists(cwdPath))                          return cwdPath;
  const herePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), p);
  if (await pathExists(herePath))                         return herePath;
  throw new Error(`❌  Input file not found: ${p}`);
}

// ──────────────────────────────────────────────────────────────
// 1. Locate the XML export
// ──────────────────────────────────────────────────────────────
const [, , inputArg = "../Squarespace-Wordpress-Export-05-03-2025.xml"] = process.argv;
const xmlPath = await findFile(inputArg);

// ──────────────────────────────────────────────────────────────
// 2. Destination folder for generated Markdown
// ──────────────────────────────────────────────────────────────
const outRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "content");

// ──────────────────────────────────────────────────────────────
// 3. Turndown with image-rewrite
// ──────────────────────────────────────────────────────────────
const turndown = new TurndownService({
  headingStyle:   "atx",
  codeBlockStyle: "fenced",
});
turndown.addRule("skipEmptyImgs", {
  filter: node => node.nodeName === "IMG" && !node.getAttribute("src"),
  replacement: () => "",
});

// // S3 mapping built at Eleventy run-time
// import artworkModule from "../_data/artwork.js";                // parses assets/images.csv
// const { baseUrl, images } = artworkModule();
// const fileMap = Object.values(images).reduce((acc, { filename }) => {
//   acc[safeDecode(filename)] = baseUrl + filename;
//   return acc;
// }, {});

turndown.addRule("rewriteImages", {
  filter: "img",
  replacement: (content, node) => {
    const alt  = node.getAttribute("alt") || "";
    const src  = node.getAttribute("data-image") || node.getAttribute("src") || "";
    const file = safeDecode(src.split("/").pop().split("?")[0]);
    const newUrl = fileMap[file] || src;                      // fall back if CSV doesn’t know it
    return `![${alt}](${newUrl})`;
  }
});

// ──────────────────────────────────────────────────────────────
// 4. Parse the XML and convert pages
// ──────────────────────────────────────────────────────────────
const xml      = await fs.readFile(xmlPath, "utf8");
const { rss:{ channel } } = await xml2js.parseStringPromise(xml, { explicitArray:false });
const items    = Array.isArray(channel.item) ? channel.item : [channel.item];

let count = 0;
for (const item of items) {
  if (item["wp:post_type"] !== "page" || item["wp:status"] !== "publish") continue;

  const title   = (item.title || "Untitled").trim();
  const slug    = item["wp:post_name"]?.trim() || slugify(title);
  const dateIso = item.pubDate ? new Date(item.pubDate).toISOString().slice(0,10) : undefined;
  const bodyMd  = turndown.turndown(item["content:encoded"] || "");

  const frontMatter = [
    "---",
    `title: ${JSON.stringify(title)}`,
    "layout: layouts/base.njk",
    "eleventyNavigation:",
    `  key: ${JSON.stringify(title)}`,
    "  order: 10",
    dateIso ? `date: ${dateIso}` : null,
    "---",
    "",
  ].filter(Boolean).join("\n");

  const dir = path.join(outRoot, slug);
  await fs.mkdir(dir, { recursive:true });
  await fs.writeFile(path.join(dir, "index.md"), frontMatter + bodyMd, "utf8");
  count++;
}

console.log(`✔  Imported ${count} pages into /content`);
