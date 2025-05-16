#!/usr/bin/env node

/**
 * One‐off: assign parent keys in eleventyNavigation front-matter
 * so your menu groups correctly under “Works on paper”, “Public commissions”, etc.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ✏️  Adjust these slugs if your folders differ from these names
const mapping = {
  "Works on paper": [
    "works-on-paper",
    "artist-parent-drawings"
  ],
  "Public commissions": [
    "cork-caryatids",
    "processions",
    "painted-pigeons-and-ladys-tresses",
    "refugee-week-healing-banner",
    "summer-of-smiles",
    "darlinghurst-playground-songs"
  ],
  "Sculpture": [
    "centre-of-gravity",
    "fat-rascals",
    "annihilation-seal",
    "fabric-drawing",
    "definitions-of-drawing-ii",
    "thiss-2022",
    "ceramics",
    "leather-wood-bodies",
    "womens-work-songs",
    "live-work-space",
    "market-portraits"
  ],
  "Archive": [
    "songs-of-salt",
    "mapping-places",
    "role-reversal-rehearsal",
    "sculpture",
    "the-place-where-drummers-look"
  ]
};

const contentDir = path.join(process.cwd(), "src", "content");

for (let [parentKey, childSlugs] of Object.entries(mapping)) {
  for (let slug of childSlugs) {
    const filePath = path.join(contentDir, slug, "index.md");
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Skipping “${slug}”: ${filePath} not found`);
      continue;
    }

    const raw = fs.readFileSync(filePath, "utf8");
    const fm  = matter(raw);

    if (!fm.data.eleventyNavigation) {
      fm.data.eleventyNavigation = {};
    }
    fm.data.eleventyNavigation.parent = parentKey;

    // Write back, preserving everything else
    const output = matter.stringify(fm.content, fm.data);
    fs.writeFileSync(filePath, output, "utf8");
    console.log(`✅  Set parent="${parentKey}" on src/content/${slug}/index.md`);
  }
}

console.log("\n🎉 All done! Rebuild your site to see the nested menu.");
