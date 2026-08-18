# SEO / AEO launch audit

**Status:** launch-ready in source  
**Date:** 2026-08-13  
**Live host checked:** `https://sewerlinerepair.vercel.app`  
**Canonical host (deferred):** custom domain + Search Console submit, per product hold  
**Tests:** 29 passed (`npx vitest run`, 2026-08-13)

Live production was crawled and parsed. P0/P1 issues found on that host are **fixed in source**. They will not show on `sewerlinerepair.vercel.app` until the next production deploy. Domain connection and GSC sitemap submit are out of scope for this pass.

## Summary

The live `.vercel.app` host is indexable, serves a 9,589-URL sitemap on the same host as `robots.txt`, and returns HTTP 200 with one H1, unique titles, canonicals, OG images, and parseable JSON-LD on every required page class except the thin/excluded routes that correctly 404. No AggregateRating, Review, or FAQPage schema is emitted.

Source fixes from this audit:

1. Profile UI no longer shows Google star ratings or review excerpts (policy).
2. Dense state/metro hubs cap cards at 75 and map pins at 200 (California HTML was 3.8 MB).
3. Method IDs now alias `pipe_lining_cipp` → CIPP and `excavation` → open-cut, so those hubs and filters actually match the extract.
4. Below-threshold state tag URLs 404 instead of 308-redirecting to `?brands=`.
5. Site name/header/tagline already aligned to **SewerRepairList** in source (live HTML still has the previous name until deploy).

## Deferred (not blockers)

| Item | Why it waits |
| --- | --- |
| Custom domain as canonical | Explicit hold |
| Search Console property + sitemap submit | Explicit hold |
| Next production deploy | Needed for HTML-size, method hubs, profile rating, and SewerRepairList copy to go live |

First indexing priority once GSC exists: `/`, `/contractors`, `/contractors/near-me`, `/contractors/tags/trenchless`, `/guides/sewer-line-repair-cost`, then CA/TX/FL/NY/PA and Houston/Los Angeles/Dallas/Miami/Chicago metros.

## Page-class checklist (live HTML)

Base: `https://sewerlinerepair.vercel.app`. All indexable rows: HTTP 200, one H1, unique title, meta description, absolute canonical on this host, `og:image`, `robots: index, follow`. No AggregateRating / Review / FAQPage.

| Class | URL | Title | H1 | JSON-LD | Notes |
| --- | --- | --- | --- | --- | --- |
| Homepage | `/` | Sewer Line Repair Directory \| Residential Sewer… | Sewer line repair, from someone who works on the pipe… | Organization, WebSite | Visible FAQ as “Common questions” (no FAQPage). Source H1/title is now SewerRepairList copy. |
| National directory | `/contractors` | Sewer Line Repair by State · SewerLineRepairList | Sewer line repair research, sorted by state. | BreadcrumbList | |
| Near me | `/contractors/near-me` | Sewer Line Repair Near Me · … | Sewer line repair near me. | CollectionPage, WebSite, BreadcrumbList | Owns generic near-me intent |
| Thin indexable state | `/contractors/ak` | 15 Sewer Repair Contractors in Alaska | Sewer line repair in Alaska | CollectionPage | 15 listings, 8 explicit / 2 high |
| Small indexable state | `/contractors/wa` | 7 Sewer Repair Contractors in Washington | Sewer line repair in Washington | CollectionPage | |
| Dense state | `/contractors/ca` | 1207 Sewer Repair Contractors in California | Sewer line repair in California | CollectionPage | **3.8 MB HTML live.** Capped in source (75 cards / 200 pins). |
| Dense metro | `/contractors/tx/metros/houston` | 129 Sewer Repair Contractors Near Houston | Sewer line repair near Houston | CollectionPage, Place, GeoCircle | 435 KB live; same card cap in source |
| Thinner metro | `/contractors/hi/metros/honolulu` | 16 Sewer Repair Contractors Near Honolulu | Sewer line repair near Honolulu | CollectionPage, Place | |
| Explicit profile | `/contractors/ak/drain-masters` | Drain Masters Sewer Repair Contractor in Anchorage, AK | Drain Masters | LocalBusiness, PostalAddress, GeoCoordinates | Title preserved; no AggregateRating |
| Medium profile | `/contractors/ak/asap-sewer-and-drain-inc` | ASAP Sewer and Drain, Sewer Repair Contractor in Alaska | ASAP Sewer and Drain, Inc. | LocalBusiness | Live HTML still showed Google score · count. Stars removed in source; count may remain as context. |
| Method tag | `/contractors/tags/trenchless` | Trenchless Sewer Contractors | Trenchless sewer contractors | CollectionPage, ItemList | 75-card preview already live |
| Method tag | `/contractors/tags/pipe-bursting` | Pipe bursting Sewer Repair | Pipe bursting sewer repair | CollectionPage, ItemList | |
| Intent tag | `/contractors/tags/emergency-backup` | Sewer Backup Emergency Contractors | Sewer backup emergency contractors | CollectionPage, ItemList | |
| State method tag | `/contractors/tx/tags/cipp` | (308 → `/contractors/tx?brands=cipp`) | — | — | **Fixed in source:** ID alias + 404 instead of redirect. Next build should render a real CIPP page. |
| Guide | `/guides/sewer-line-repair-cost` | Sewer line repair cost | Sewer line repair cost | Article, Organization, BreadcrumbList | Citations present |
| Guides index | `/guides` | Sewer Line Repair Buyer Guides | Practical next steps… | BreadcrumbList | Source copy no longer says “an contractor” |
| About / contact / for-contractors / privacy | static | Unique titles | Unique H1s | BreadcrumbList on privacy; visual crumbs on others | |
| Commercial collection | — | — | — | — | No public commercial hub. Commercial is a separated lane, not a default ranking. |
| Municipal collection | — | — | — | — | No indexable municipal hub |
| Thin excluded state | `/contractors/vt` | — | — | — | HTTP 404 (2–3 listings, below 5 / 2 strong) |
| Thin excluded metro | `/contractors/vt/metros/burlington-vt` | — | — | — | HTTP 404 |
| Unqualified national CIPP/open-cut (live) | `/contractors/tags/cipp`, `/contractors/tags/open-cut` | — | — | — | HTTP 404 on live host because extract IDs did not match tag IDs. **Fixed in source.** |
| Retired hubs | `/blog`, `/financing`, `/installers` | — | — | — | Permanent redirect to `/guides`, cost guide, `/contractors` |

OG image on sampled pages: `/images/og-default.jpg` (143 KB, budget 250 KB). Hero `public/images/sewer/lateral-repair-hero.jpg` 248 KB (budget 600 KB).

## Sitemap audit (live)

| Check | Result |
| --- | --- |
| HTTP 200 `application/xml` | Yes (1,523,187 bytes, ~1.5 MB, under 50 MB) |
| Declared in robots.txt | `Sitemap: https://sewerlinerepair.vercel.app/sitemap.xml` |
| Host | `sewerlinerepair.vercel.app` only (matches robots Host) |
| URL count | 9,589 (under 50,000) |
| Unique | Yes |
| `/blog` or `/installers` | None |
| lastmod | 18 editorial/static URLs use `2026-08-12`; directory URLs omit lastmod (not a build stamp) |
| State hubs | 49 (Vermont excluded; correct) |
| Metros | 181 |
| National tags | 3 live (`emergency-backup`, `pipe-bursting`, `trenchless`). Source aliasing will add CIPP and open-cut on next build. |
| State tags | 111 live; some (CIPP) 308 because of the ID mismatch. Fixed in source. |
| Profiles | 9,227 (filtered export). 15 OEM/muni/supply rows stay in `contractors.json` but are dropped before sitemap. |
| Script | `NEXT_PUBLIC_SITE_URL=https://sewerlinerepair.vercel.app node scripts/audit-sitemap.mjs https://sewerlinerepair.vercel.app/sitemap.xml` → `errors: []` |

Smoke crawl (`node scripts/smoke-crawl.mjs https://sewerlinerepair.vercel.app`): 12/12 HTTP 200, H1 present, robots has Sitemap, sitemap is XML.

## Hard gates (source)

- No `gen review` / `EV review` / `GeneratorReviewsBadge` in `app` / `components` / `lib` except the badge contract test.
- No `EVSE` / `J1772` / `ChargePoint`.
- Badge copy: `1 sewer review` / `N sewer reviews`.
- Client components do not import `contractors.json`.
- `FAQJsonLd` exists but is unused (Google retired FAQ rich results; visible FAQs stay).
- LocalBusiness JSON-LD omits AggregateRating.
- `data-rights.json` v2: overall rating blocked; sewer-review badge permitted; excerpts not displayed.
- Residential lane is the default directory; municipal_infra cannot publish without a residential/commercial medium+ lane (`scripts/audit-data.mjs`).
- “Main sewer line” is not used as a municipal-main claim in public copy.

## GeneratorInstallerList launch checks

| Check | Result |
| --- | --- |
| Client bundle data leakage | Client components take list-item props only; no `contractors.json` import |
| National tag HTML size | Live trenchless/emergency/bursting ~470–550 KB with 75-card cap |
| Dense state HTML size | Live CA 3.8 MB. Source now uses `DIRECTORY_LIST_PREVIEW_LIMIT` (75) and `DIRECTORY_MAP_PREVIEW_LIMIT` (200); full name list remains |
| Sewer-specific tags | Method + emergency tags; camera/jetting are not standalone structural hubs |
| Lane separation | Residential default; commercial is a lane, not a collection; municipal not a launch hub |
| Review policy | Count badge + optional overall Google **count** as context. Stars and excerpts removed from profile UI in source |
| Hero/LCP | 248 KB |
| Credential hedging | Guides/about tell buyers to verify licenses. Flash copy still has ~52 “Premier/Trusted” hits (below copy-lint fail threshold of 80) |
| Third-party review schema | None on sampled pages |
| Profile title preservation | Sample titles keep name + “Sewer Repair Contractor” + location |
| Guide citations | Article JSON-LD + on-page sources |
| Listing eligibility | OEM/supply/treatment filtered at import; 15 such rows never enter the sitemap |
| Near-me intent | `/contractors/near-me` owns it |
| Schema graph | Homepage Organization + WebSite; collections CollectionPage; profiles LocalBusiness; guides Article. No SearchAction |

## Findings

### P0

None on live HTML. None remaining in source after this pass.

### P1 — fixed this pass (source)

| Finding | Evidence | Fix |
| --- | --- | --- |
| Profile showed Google star ratings | `totalScore.toFixed(1)` on profile header; `publicOverallGoogleRating: blocked` | Stars removed. Overall **count** may still show as third-party context. Sewer-review badge added on the profile. |
| Profile still had a review-excerpt section | `sewerReviewSnippets` UI; `reviewExcerpt.display: false` | Section removed. Extract already stores no snippets. |
| California state HTML 3.8 MB | Live `/contractors/ca` 3,792 KB | State and metro cards capped at 75; maps at 200. Name list kept. |
| CIPP / open-cut tags matched nobody | Extract IDs are `pipe_lining_cipp` and `excavation`; tags used `cipp` / `open_cut`. Live `/contractors/tags/cipp` 404; TX CIPP 308 to `?brands=cipp` | Aliases in `contractorHasBrand` / `canonicalMethodId`. Below-threshold state tags `notFound()` instead of redirect. |
| Header / SITE.name mismatch | Prior audit | Already aligned to SewerRepairList in source |
| JSON-LD host / sitemap host | Live build uses `NEXT_PUBLIC_SITE_URL=https://sewerlinerepair.vercel.app` | Correct for the current host. Switch env when the custom domain is attached. |

### P1 — still open (operational, not code)

| Finding | Evidence | When |
| --- | --- | --- |
| Production is one deploy behind source | Live titles still say SewerLineRepairList; CA still 3.8 MB; CIPP still 308 | Next `vercel deploy` |
| Custom domain / GSC | Held | After DNS |

### P2

- `states.json` sums 9,219 listings; filtered `contractors.json` is 9,227 sitemap profiles / 9,242 raw rows. Titles use `states.json` counts. Re-extract compact JSON when convenient.
- `npm run audit:copy`: 0 P0, 52 P1 (mostly Flash “Premier” / “Trusted”), 14 P2 credential verbs. Under the 80-hit fail cap. Next Flash regen should ban those words.
- ~20 deterministic-fallback profiles; 3 missing Flash leads.
- Geocode holes remain (Census-only).
- Five Maps runs aborted (`md`, `sc`, `tn`, `tx`, `va`) with artifacts.
- About/contact/for-contractors use visual crumbs without BreadcrumbList JSON-LD.
- Pipe-bursting title casing (“Pipe bursting Sewer Repair”).
- `contractors.json` still pretty-printed 47 MB.
- Homepage discovery snapshot is small.
- Component RTL tests for cards/filters still absent; copy contracts are covered by helper tests.

## Launch-ready criteria

| Criterion | Status |
| --- | --- |
| Production host returns 200 on required routes | Met (`sewerlinerepair.vercel.app`) |
| Smoke crawl + sitemap audit | Met |
| Sitemap under 50k, canonical host only, no `/blog` or `/installers` | Met |
| No open source P0/P1 | Met |
| Custom domain as canonical | Deferred |
| GSC sitemap submit | Deferred |
| Next deploy of this source | Still needed for live HTML to match source |

Until the next deploy, treat **source** as launch-ready and **live HTML** as structurally passing with known stale copy, oversized CA, and broken CIPP/open-cut hubs.

## Commands used

```bash
cd ~/Documents/GitHub/sewerlinerepair
npx vitest run
NEXT_PUBLIC_SITE_URL=https://sewerlinerepair.vercel.app \
  node scripts/audit-sitemap.mjs https://sewerlinerepair.vercel.app/sitemap.xml
node scripts/smoke-crawl.mjs https://sewerlinerepair.vercel.app
node scripts/seo-page-class-audit.mjs https://sewerlinerepair.vercel.app
node scripts/audit-generated-copy.mjs
```
