# Malapit Na Play Store CTA and SEO Design

## Goal

Turn the bilingual launch site from a coming-soon page into a clear path to the
live Android app, while adding useful search copy for Philippine commuters.

## Play Store calls to action

- Use Google's official “Get it on Google Play” badge rather than a custom
  imitation.
- Link every badge to
  `https://play.google.com/store/apps/details?id=com.arrivalalarm.app`.
- Place the badge in the hero and the closing call to action on both the English
  and Filipino pages.
- Give each linked badge an explicit accessible label in the page language.
- Replace all public coming-soon wording with accurate availability wording.

## Search copy

- Improve each page title and meta description with natural, localized terms
  for an Android destination/GPS alarm and Philippine commuting.
- Add one compact, visible section per language explaining the app's relevant
  use cases across jeepneys, buses, UV Express, provincial buses, and trains.
- Keep the English and Filipino copy idiomatic rather than mechanically
  translated.
- Avoid keyword stuffing, claims about rankings or reliability guarantees, and
  features the app does not provide.

## Presentation

The official badge should remain legible and retain its supplied aspect ratio.
It will sit within the existing visual system without altering the site's core
layout, colors, screenshots, privacy content, or no-JavaScript architecture.

## Validation

Extend the existing site verifier to require the exact Play Store URL on both
localized landing pages, reject stale coming-soon wording, and preserve current
metadata, heading, language-link, accessibility, and privacy checks. Verify the
static site locally at desktop and mobile widths, check the external listing,
and run the repository's automated verifier before opening the pull request.

## Delivery

Commit the implementation on `feat/play-store-cta`, open a draft pull request
against `main`, review the diff and checks, fix any issues found, mark the pull
request ready, and merge only after all checks pass.
