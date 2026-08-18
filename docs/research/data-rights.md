# Data rights — Maps, ratings, and reviews

Reviewed: 2026-08-12  
**Scope change authorized: 2026-08-12** — user authorized Apify Google review backfill for sewer-specific classification and the public “N sewer review(s)” UI (autonomy condition 5).

Policy machine file: `docs/research/data-rights.json`  
Status summary: **discovery permitted; Apify review backfill permitted under user authorization; overall AggregateRating still blocked; raw review text ephemeral only**

## Executive decision

Apify’s `compass/crawler-google-places` actor is an **execution provider**. It does **not** grant a license to store or republish Google Maps / Places content. Google Maps Platform and Places API policies allow indefinite storage of `place_id` when obtained under those Services, generally prohibit caching other Places Content except narrow temporary exceptions, and require attribution plus Google Maps source links when reviews are displayed through the Places API.

Therefore:

1. Statewide Maps runs may be used only as **candidate discovery** (opaque `placeId`, website URL hint, category hint).
2. Publishable business identity, phone, email, and website must be **recaptured from contractor-controlled websites or official registries**.
3. Persistable coordinates must come from the **U.S. Census Geocoder** (or another geocoder whose terms allow multi-user site storage), after an address is verified from a permitted identity source. Google Maps coordinates from the scrape are **not** persisted into site JSON.
4. Overall Google **star ratings** still may not be published as `AggregateRating`. Overall Google review **counts** may display as context and must never be relabeled as sewer reviews.
5. **User-authorized (2026-08-12):** Apify review backfill may fetch reviews for residential M+ `placeId`s. Raw text is classified ephemerally, then deleted within 24h. Durable artifacts are sewer-derived counts, tags, and content hashes only. Public badge shows “N sewer review(s)” from those derived counts.

## Sources reviewed

| ID | Title | URL | Retrieved |
|----|-------|-----|-----------|
| gmp-tos | Google Maps Platform Terms of Service | https://cloud.google.com/maps-platform/terms | 2026-08-12 |
| gmp-sst | Google Maps Platform Service Specific Terms | https://cloud.google.com/maps-platform/terms/maps-service-terms | 2026-08-12 |
| places-policies | Policies and attributions for Places API | https://developers.google.com/maps/documentation/places/web-service/policies | 2026-08-12 |
| ugc-policy | Maps User Generated Content Policy (prohibited content) | https://support.google.com/contributionpolicy/answer/7400114 | 2026-08-12 |
| apify-actor | Google Maps Scraper actor page | https://apify.com/compass/crawler-google-places | 2026-08-12 |
| census-geocoder | Census Geocoder documentation | https://geocoding.geo.census.gov/geocoder/ | 2026-08-12 |

### Key citations

- Places API policies: do not pre-fetch, cache, or store Places API content beyond allowed exceptions; **`place_id` is exempt** and may be stored indefinitely.
- Service Specific Terms: Places API latitude/longitude may be cached only temporarily (documented 30-day window), then deleted; Google ID/`place_id` caching is separately allowed.
- Places review display (when using Places API): attribute authors, provide Google Maps source links (`googleMapsUri`), describe ordering/filtering, and follow logo/text attribution rules. These rules apply to **Places API customers**, not to third-party scrapers.
- Apify actor docs describe extracting ratings, reviews, and contacts and “expanding beyond” Places API limits. That capability is **not** a content license for underlying Google data. User scope change (condition 5) authorizes ephemeral classification only.

## Field-by-field policy

| Field | Discovery via Apify Maps | Persist | Public display | Derived use | Notes |
|-------|--------------------------|---------|----------------|-------------|-------|
| placeId | yes | yes | none (internal key / optional sameAs only) | id mapping | Opaque Google Place ID for dedupe and review backfill |
| businessIdentity (name, address, phone, website, email) | hint only | yes after website/registry recapture | yes after recapture | classification | Scrape values are provisional; publish only contractor-site or official-registry values |
| categories | yes | provisional only | derived_only as discovery hint | prefilter | Never sole proof of structural sewer repair |
| coordinates (Google) | incidental | **no** | **no** | none | Delete from publish path; do not copy into `lib/data` |
| coordinates (Census Geocoder) | n/a | yes | yes | map pins | After permitted address exists |
| overallRating | incidental | **no** | **no** | none | Not permitted from scrape; no AggregateRating JSON-LD ever |
| overallReviewCount | incidental | **yes** | **yes** (as overall context) | never as sewer proof | Never relabel as sewer reviews |
| rawReviewText | Apify review backfill (authorized) | **no** (ephemeral ≤24h) | **no** | classify then delete | Never commit to repo |
| reviewer identity | optional scrape | **no** | **no** | none | |
| sewerReviewClassification | Apify review backfill (authorized) | **yes** | **yes** (tags/lanes) | ranking filters | Derived only; no raw text |
| sewerReviewCount | Apify review backfill (authorized) | **yes** | **yes** (“N sewer review(s)”) | badge / filters | User-authorized condition 5 |
| reviewSummary | Flash from derived evidence | **yes** | **yes** | profile copy | Do not paste raw Google review text |
| reviewExcerpt | n/a | **no** | **no** | blocked | No verbatim Google review excerpts |

## Retention and deletion

| Artifact | Location | Retention | Deletion rule |
|----------|----------|-----------|---------------|
| Maps discovery dataset | `~/sewer-line-repair-data/{state}/01-raw.json` etc. | until state validated + 14 days | Strip Google coords/ratings/reviews before any site extract; do not copy prohibited fields |
| Provisional scrape identity | pipeline only | until website recapture | Prefer website values; drop scrape-only PII not confirmed |
| Raw review files | `ephemeral_artifacts` + `reviews-dataset-raw.json` | **≤24h**; delete immediately after classification when possible | `COMPLETE.json` forbidden while past `delete_after` with null `deleted_at` |
| Site JSON | `lib/data/*.json` | durable | Only fields with `persist: true`; never raw review text |

## Attribution / disclosure

1. When sewer-review counts are shown, disclose website/review research; do not imply Google endorsement.
2. Never emit `AggregateRating` or `Review` JSON-LD for third-party Google reviews.
3. Do not present overall Google review counts as sewer-specific social proof.
4. Collection/processing date may be shown for derived counts when available.

## Controller implications

- `data-rights.json` `status` is `permitted` with `reviewOperations.apifyReviewBackfill` and `publicSewerReviewBadge` set to `permitted` after the 2026-08-12 user scope change.
- Paid review POSTs are allowed under the per-run soft cap (`REVIEW_CAP_USD`).
- Overall Google star rating UI and AggregateRating remain **blocked**.
- Raw review text must not land in the site repository.

## Claims to avoid

- “Apify grants rights to Google reviews.”
- “Overall Google review count equals sewer reviews.”
- “We can keep scraped review text offline indefinitely because we do not show it.”
- Any public AggregateRating / star-rating UI without a separately licensed Places API path.
