# SewerLineRepairList build handoff

Written 2026-08-13. Collection and Flash are done. Production build/deploy/commit were paused to keep WindowServer load light.

## URLs

| Item | Value |
| --- | --- |
| Intended production URL | `https://sewerlinerepair.vercel.app` (custom `sewerlinerepairlist.com` is not on this Vercel account) |
| GitHub | not connected yet — CLI deploy only |
| Final commit | none (repo still has no commits) |
| Sitemap URL | https://sewerlinerepair.vercel.app/sitemap.xml (9,589 URLs, host `sewerlinerepair.vercel.app`) |

Set `NEXT_PUBLIC_SITE_URL` to the host that is actually canonical before deploy.

## Inventory

| Metric | Count |
| --- | --- |
| Published contractors (`contractors.json`) | 9,242 |
| `states.json` listing sum | 9,219 (known extract drift) |
| States | 50 |
| Residential explicit / high / medium (`states.json`) | 5,683 / 2,023 / 1,513 |
| Metro Flash editorial stored | 267 |
| State Flash editorial | 50/50 |
| Flash profiles | 9,219 `gemini-3.6-flash`; ~20 deterministic-fallback; 3 missing lead |
| Places with sewer reviews | 3,501 |
| Classified sewer reviews | 8,603 (receipts) / 8,684 (site lane sums) |

Commercial and municipal evidence are scored in separate lanes. Default directory rows require `residential_sewer` medium+. Municipal-only firms are not a public launch collection.

## Spend and sources

| Kind | Runs | Spend |
| --- | --- | --- |
| Apify Maps (`compass/crawler-google-places`) | 50 (45 SUCCEEDED, 5 ABORTED with artifacts) | $247.72 |
| Apify reviews (same actor, ephemeral) | 50 (49 SUCCEEDED, 1 ABORTED `ca` with processed receipt) | $172.46 |
| **Total** | 100 | **$420.18** |

- Policy file: `docs/research/data-rights.json` v2, SHA-256 `0b526c66d92a7ba83c1bf01582adc22147ab47171ce9b0f3300e8686e7bf1c94`
- Allowed public review UI: sewer-review **count** badge (`1 sewer review` / `N sewer reviews`) plus overall Google **count** as context. No overall stars. No AggregateRating / Review JSON-LD. No raw snippets in site data.
- Raw review text: ephemeral; receipts report deletion.
- Coordinates: Census Geocoder only (never Google Maps lat/lng in site JSON).
- Gemini Flash model: `gemini-3.6-flash`
- Research reviewed: 2026-08-12 (`docs/research/`, guide provenance)

## Tests / build

| Gate | Result |
| --- | --- |
| Pipeline `qa_pipeline.py` | 20 OK (earlier) |
| `scripts/audit-data.mjs` | 9,242 contractors, 50 states, 0 errors; warnings for fallbacks / 3 missing leads |
| `npm test` (2026-08-13) | 25 passed in 1.56s. Vitest **must not** import `lib/data/contractors.json` (47 MB pretty JSON spiked WindowServer). Tests use `contractors.fixture.json` / metro-list / tag-seo modules. |
| `npm run audit:copy` | not rerun this session (12 MB parse) |
| `npm run build` | **passed on Vercel** — 9,599 static pages, ~2 min, first-load JS ~113 KB |
| Production smoke crawl | homepage, national, near-me, TN, Houston metro, cost guide, robots, sitemap, NC profile that previously crashed: all HTTP 200 |
| SEO/AEO audit | `docs/audits/seo-aeo-launch-audit.md` — **launch-ready in source** (2026-08-13). Live `sewerlinerepair.vercel.app` crawled. Domain + GSC submit deferred. Next deploy still needed for copy/HTML-size/method-hub fixes. |

## GSC / Ahrefs

- Ahrefs analytics script is in `app/layout.tsx` (`data-key=b2joC9DpGjWvDH4gUqg2RA`) plus site-verification meta.
- Search Console sitemap submit: **deferred** (waiting on the real domain).
- Live sitemap today: https://sewerlinerepair.vercel.app/sitemap.xml (9,589 URLs).
- First indexing priority once GSC exists: `/`, `/contractors`, `/contractors/near-me`, `/contractors/tags/trenchless`, `/guides/sewer-line-repair-cost`, top five states, top five metros.

## Known non-blocking gaps

1. 3 contractors missing Flash lead; ~20 deterministic-fallback profiles.
2. `states.json` vs `contractors.json` count drift (9,219 vs 9,242).
3. Geocode holes: thousands of publishable rows still have `lat`/`lng` null.
4. Maps ABORTED: `md`, `sc`, `tn`, `tx`, `va` (artifacts present).
5. Header/SITE.name aligned to `SewerRepairList` in source (live HTML still has the previous name until deploy).
6. Pretty-printed 47 MB `contractors.json` still on disk; next extract writes compact JSON.
7. Component RTL tests not added (`ContractorCard`, `FilteredContractors`).
8. Dense-state HTML cap, CIPP/open-cut method aliases, and profile star-rating removal are in source, not yet on `sewerlinerepair.vercel.app`.

## Refresh commands

```bash
# Refresh one state
cd ~/sewer-line-repair-scrape
python3 orchestration/controller.py retry tn --from maps_start
launchctl kickstart "gui/$(id -u)/com.austinhardcastle.sewerrepairpipeline"
python3 orchestration/controller.py status

# Fill missing Flash profiles
python3 orchestration/controller.py retry tn --from profiles
launchctl kickstart "gui/$(id -u)/com.austinhardcastle.sewerrepairpipeline"

# Compact re-extract into the site (quiet window; writes contractors.json)
python3 ~/sewer-line-repair-scrape/extract_for_directory_site.py

# Regenerate state and metro editorial without overwriting existing copy
cd ~/Documents/GitHub/sewerlinerepair
npm run editorial:states
npm run editorial:metros

# Light verify (does not load 47 MB JSON)
npm test
node scripts/audit-data.mjs

# Heavy — only when WindowServer is healthy
npm run build
git status
```
