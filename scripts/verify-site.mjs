import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pages = ["index.html", "fil/index.html", "privacy/index.html"];
const landingPages = new Set(["index.html", "fil/index.html"]);
const playUrl = "https://play.google.com/store/apps/details?id=com.arrivalalarm.app";
const failures = [];

for (const relative of pages) {
  const path = resolve(root, relative);
  if (!existsSync(path)) {
    failures.push(`${relative}: missing`);
    continue;
  }

  const html = readFileSync(path, "utf8");

  // Structured data is the one <script> the site is allowed to ship: it carries no
  // behaviour. Strip those blocks first so the runtime-script ban below still bites.
  const withoutStructuredData = html.replace(
    /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi,
    "",
  );

  const h1Count = (html.match(/<h1(?:\s|>)/gi) ?? []).length;
  if (h1Count !== 1) failures.push(`${relative}: expected one h1, found ${h1Count}`);
  if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(html)) failures.push(`${relative}: missing description`);
  if (!/<link\s+rel="canonical"\s+href="https:\/\/sd2-studio\.github\.io\/app-malapit-na-site\//i.test(html)) failures.push(`${relative}: missing canonical URL`);
  if (!/English/i.test(html) || !/Filipino/i.test(html)) failures.push(`${relative}: missing language links`);
  if (/<script(?:\s|>)/i.test(withoutStructuredData)) failures.push(`${relative}: runtime script found`);
  if (!/<meta\s+property="og:image"\s+content="https:\/\//i.test(html)) failures.push(`${relative}: missing og:image`);
  for (const hreflang of ["en", "fil", "x-default"]) {
    if (!new RegExp(`<link\\s+rel="alternate"\\s+hreflang="${hreflang}"`, "i").test(html)) {
      failures.push(`${relative}: missing hreflang=${hreflang} alternate`);
    }
  }
  if (/<form(?:\s|>)/i.test(html)) failures.push(`${relative}: form found`);
  if (/googletagmanager|google-analytics|gtag\s*\(|facebook\.com\/tr|pixel\.js/i.test(html)) failures.push(`${relative}: analytics reference found`);
  if (/\.kt\b|\.jks\b|\.keystore\b|MAPS_API_KEY|MALAPIT_STORE_PASSWORD|local\.properties|\/Users\//i.test(html)) failures.push(`${relative}: private/source reference found`);

  if (landingPages.has(relative)) {
    const playLinkCount = html.split(`href="${playUrl}"`).length - 1;
    if (playLinkCount !== 2) failures.push(`${relative}: expected two Play Store links, found ${playLinkCount}`);
    if (!/google-play-badge\.png/i.test(html)) failures.push(`${relative}: missing official Play Store badge`);
    if (/<span class="pill">(?:Coming soon on Android|Malapit na sa Android)<\/span>|class="coming"/i.test(html)) {
      failures.push(`${relative}: stale coming-soon content found`);
    }
  }

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const src = tag.match(/\bsrc="([^"]+)"/i)?.[1];
    const alt = tag.match(/\balt="([^"]*)"/i)?.[1];
    if (alt === undefined) failures.push(`${relative}: image missing alt`);
    if (alt !== "" && alt.trim().length < 5) failures.push(`${relative}: image alt is not meaningful`);
    if (src && !/^(?:https?:|data:|\/)/i.test(src)) {
      const asset = resolve(dirname(path), src.split("#")[0].split("?")[0]);
      if (!existsSync(asset)) failures.push(`${relative}: missing image ${src}`);
    }
  }
}

if (failures.length) {
  console.error(`FAIL\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  process.exit(1);
}

console.log("PASS: static site is complete, local, and tracker-free");
