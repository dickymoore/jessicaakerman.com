import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import pluginFilters from "./_config/filters.js";
import { DateTime } from "luxon";
import util from "util";

/**
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 */
export default async function(eleventyConfig) {
  // ─── Preprocessors ───────────────────────────────────────────────────────
  // Drafts: skip pages with `draft: true` when building for production
  eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
    return content;
  });

  // ─── Passthrough Copy ────────────────────────────────────────────────────
  eleventyConfig
    .addPassthroughCopy({
      "./public/": "/",
      "./public/img/": "/img/",
      "./logos/": "/logos/"
    })

  // ─── Watch Targets ───────────────────────────────────────────────────────
  eleventyConfig.addWatchTarget("css/**/*.css");
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpg,jpeg,gif}");

  // ─── Bundling (per-page CSS/JS) ─────────────────────────────────────────
  eleventyConfig.addBundle("css", {
    toFileDirectory: "dist",
    bundleHtmlContentFromSelector: "style"
  });
  eleventyConfig.addBundle("js", {
    toFileDirectory: "dist",
    bundleHtmlContentFromSelector: "script"
  });

  // ─── Shortcodes ─────────────────────────────────────────────────────────
  eleventyConfig.addShortcode("artworkImage", function(title, size = "medium") {
    const artwork = this.ctx.artwork;
    if (!artwork.images[title]) {
      return "";
    }
    const img = artwork.images[title];
    const url = `${artwork.baseUrl}${img.filename}`;
    const dims = img.width && img.height
      ? `width="${img.width}" height="${img.height}"`
      : "";
    return `<img src="${url}" alt="${img.alt}" ${dims} loading="lazy" decoding="async">`;
  });

  eleventyConfig.addShortcode("currentBuildDate", () => {
    return new Date().toISOString();
  });

  // ─── Plugins ────────────────────────────────────────────────────────────
  eleventyConfig.addPlugin(pluginSyntaxHighlight, { preAttributes: { tabindex: 0 } });
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
  eleventyConfig.addPlugin(pluginFilters);
  eleventyConfig.addPlugin(IdAttributePlugin, {
    // Default slugify and selectors will be used
  });

  // ─── Filters ────────────────────────────────────────────────────────────
  // date("yyyy") for Nunjucks
  eleventyConfig.addFilter("date", (dateObj, fmt = "yyyy") => {
    const d = dateObj === "now" ? new Date() : dateObj;
    return DateTime.fromJSDate(d, { zone: "utc" }).toFormat(fmt);
  });
  // readableDate: "dd LLL yyyy"
  eleventyConfig.addFilter("readableDate", dateObj =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("dd LLL yyyy")
  );
  // htmlDateString: "yyyy-LL-dd"
  eleventyConfig.addFilter("htmlDateString", dateObj =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd")
  );
  // debug helper
  eleventyConfig.addFilter("dump", obj =>
    util.inspect(obj, { showHidden: false, depth: 5, colors: false })
  );

  // ─── Collections ────────────────────────────────────────────────────────
  eleventyConfig.addCollection("tagList", collection => {
    const tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => {
        if (!["all", "posts", "post", "nav", "tagList"].includes(tag)) {
          tagSet.add(tag);
        }
      });
    });
    return [...tagSet].sort();
  });
  eleventyConfig.addCollection("wpPages", collection =>
    collection.getAll().filter(i => i.data.eleventyNavigation?.order === 10)
  );

  // ─── Return final Eleventy config ──────────────────────────────────────
  return {
    templateFormats: ["md", "njk", "html", "liquid", "11ty.js"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data",
      output: "_site"
    }
  };
}