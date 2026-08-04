# Play Store CTA and SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Link the bilingual Malapit Na website to its live Google Play listing and add useful, localized search copy.

**Architecture:** Keep the site fully static and framework-free. Store the official Google Play badge locally, add reusable CSS for its two placements, update both localized HTML pages, and enforce launch-state requirements in the existing Node verifier.

**Tech Stack:** Semantic HTML, CSS, Node.js verification script, GitHub Pages

## Global Constraints

- The listing URL is exactly `https://play.google.com/store/apps/details?id=com.arrivalalarm.app`.
- Use Google's official “Get it on Google Play” badge without changing its aspect ratio.
- Put the badge in the hero and closing CTA on both localized landing pages.
- Use idiomatic English and Filipino copy without keyword stuffing, rankings, reliability guarantees, or unsupported features.
- Keep the site free of runtime JavaScript, analytics, forms, and private-source references.

---

### Task 1: Encode the live-store contract

**Files:**
- Modify: `scripts/verify-site.mjs`

**Interfaces:**
- Consumes: UTF-8 HTML from `index.html` and `fil/index.html`.
- Produces: verifier failures when either landing page lacks two exact Play links, contains stale launch copy, or omits the local badge asset.

- [ ] **Step 1: Add failing launch-state assertions**

Add a `landingPages` set and, for those pages, count the exact Play URL, require `google-play-badge.png`, and reject `Coming soon`, `Malapit na sa Android`, and `Malapit na` when used as the old availability pill/button text.

```js
const landingPages = new Set(["index.html", "fil/index.html"]);
const playUrl = "https://play.google.com/store/apps/details?id=com.arrivalalarm.app";

if (landingPages.has(relative)) {
  const playLinkCount = html.split(`href="${playUrl}"`).length - 1;
  if (playLinkCount !== 2) failures.push(`${relative}: expected two Play Store links, found ${playLinkCount}`);
  if (!/google-play-badge\.png/i.test(html)) failures.push(`${relative}: missing official Play Store badge`);
  if (/<span class="pill">(?:Coming soon on Android|Malapit na sa Android)<\/span>|class="coming"/i.test(html)) {
    failures.push(`${relative}: stale coming-soon content found`);
  }
}
```

- [ ] **Step 2: Run the verifier and confirm it fails**

Run: `node scripts/verify-site.mjs`

Expected: FAIL for both landing pages because the Play links are absent and stale launch content remains.

### Task 2: Publish localized install paths and search copy

**Files:**
- Create: `assets/google-play-badge.png`
- Modify: `index.html`
- Modify: `fil/index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: the exact Play URL and official badge PNG.
- Produces: two accessible install links on each language page, updated localized metadata, and one visible search-oriented use-case section per language.

- [ ] **Step 1: Download and inspect the official badge**

Download Google's English web badge from its official static badge endpoint to `assets/google-play-badge.png`. Verify it is a PNG and record its pixel dimensions; do not crop, recolor, redraw, or distort it.

- [ ] **Step 2: Update the English page**

Use a title and description that naturally name the Android destination/GPS alarm and Philippine commuting. Replace the hero pill with `Available on Android`, replace the old `.coming` span with a linked official badge labelled `Get Malapit Na on Google Play`, and add the same link after the closing CTA.

Add a compact section headed `A GPS alarm made for Philippine commutes` explaining that riders can use Malapit Na on jeepneys, city and provincial buses, UV Express, and trains; that the rider chooses a stop and alert distance; and that the alarm continues during an active ride when the screen is locked.

- [ ] **Step 3: Update the Filipino page**

Use idiomatic Filipino metadata for an Android GPS alarm sa babaan. Replace the hero pill with `Available na sa Android`, add the same official badge with the label `I-download ang Malapit Na sa Google Play`, and repeat it after the closing CTA.

Add a compact section headed `GPS alarm para sa araw-araw na biyahe` explaining the same supported commute modes and behavior in natural Filipino.

- [ ] **Step 4: Style both placements and the SEO sections**

Add `.play-link`, `.play-badge`, and `.use-cases` rules that preserve the badge ratio, provide a visible keyboard focus state, fit the current dark/amber design, and remain readable at the existing `850px` and `560px` breakpoints.

- [ ] **Step 5: Run automated validation**

Run: `node scripts/verify-site.mjs`

Expected: `PASS: static site is complete, local, and tracker-free`.

- [ ] **Step 6: Run repository hygiene checks**

Run: `git diff --check`

Expected: no output and exit code 0.

- [ ] **Step 7: Commit the implementation**

Commit with subject `feat(site): link the live Android app` and a body explaining that the launch page must now lead visitors to the released listing while improving bilingual search relevance.

### Task 3: Visual verification and delivery

**Files:**
- Verify only: `index.html`, `fil/index.html`, `styles.css`, `assets/google-play-badge.png`

**Interfaces:**
- Consumes: the completed static site and its verifier.
- Produces: reviewed screenshots, a passing pull request, and a merged `main` branch deployment.

- [ ] **Step 1: Serve the site locally**

Run a local static HTTP server from the repository root and open both `/` and `/fil/`.

- [ ] **Step 2: Review desktop and mobile layouts**

At representative desktop and mobile widths, verify both badges are visible and undistorted, keyboard focus is visible, the new text scans naturally, no horizontal overflow appears, and both badge links resolve to the exact live listing.

- [ ] **Step 3: Re-run final verification**

Run: `node scripts/verify-site.mjs && git diff --check && git status --short`

Expected: verifier PASS, no whitespace errors, and a clean working tree after commits.

- [ ] **Step 4: Push and open a draft pull request**

Push `feat/play-store-cta`, then open a draft PR against `main` titled `feat(site): link the live Android app`. Include the rationale, English/Filipino coverage, exact Play listing, and verification results.

- [ ] **Step 5: Review and fix the pull request**

Inspect the complete diff, unresolved review threads, and every GitHub Actions check. Fix actionable issues in new commits, rerun local verification, and push until the PR is clean and all required checks pass.

- [ ] **Step 6: Merge and verify production**

Mark the PR ready, merge it into `main`, wait for the Pages workflow, and verify the English and Filipino production pages return HTTP 200 and expose working Play Store links.
