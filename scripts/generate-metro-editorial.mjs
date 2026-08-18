#!/usr/bin/env node
/**
 * Generate separately written metro intros via Gemini Flash from
 * documented regional landscape + directory signal.
 *
 * Requires GEMINI_API_KEY (env or .env.local).
 *
 * Usage:
 *   node scripts/generate-metro-editorial.mjs --examples
 *   node scripts/generate-metro-editorial.mjs --metro houston --metro miami
 *   node scripts/generate-metro-editorial.mjs --limit 5 --force
 *   node scripts/generate-metro-editorial.mjs --concurrency 8
 *   node scripts/generate-metro-editorial.mjs --dry-run --metro houston
 *   node scripts/generate-metro-editorial.mjs   # all missing metros
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')

const METROS_PATH = path.join(repoRoot, 'lib/metros.ts')
const INSTALLERS_PATH = path.join(repoRoot, 'lib/data/contractors.json')
const STATE_EDITORIAL_PATH = path.join(repoRoot, 'lib/data/state-editorial.json')
const RESEARCH_PATH = path.join(
  repoRoot,
  'docs/research/10-state-and-regional-variation.md',
)
const OUT_PATH = path.join(repoRoot, 'lib/data/metro-editorial.json')
const ENV_PATH = path.join(repoRoot, '.env.local')

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const DELAY_MS = Number(process.env.METRO_GEN_DELAY_MS || 0)
const CONCURRENCY = Number(process.env.METRO_GEN_CONCURRENCY || 8)
const REQUEST_TIMEOUT_MS = Number(process.env.METRO_GEN_TIMEOUT_MS || 120000)
const METRO_RADIUS_MILES = 50

const EXAMPLE_METROS = [
  'houston',
  'nashville',
  'miami',
  'seattle',
  'baltimore',
]

/** State slug → regional profile section title fragment from research doc. */
const STATE_TO_REGION = {
  tx: 'Gulf Coast',
  la: 'Gulf Coast',
  ms: 'Gulf Coast',
  al: 'Gulf Coast',
  fl: 'South Atlantic',
  ga: 'South Atlantic',
  sc: 'South Atlantic',
  nc: 'South Atlantic',
  va: 'South Atlantic',
  tn: 'Southeast interior',
  ky: 'Southeast interior',
  ar: 'Southeast interior',
  wv: 'Southeast interior',
  mi: 'Midwest and Ohio Valley',
  oh: 'Midwest and Ohio Valley',
  in: 'Midwest and Ohio Valley',
  il: 'Midwest and Ohio Valley',
  ia: 'Midwest and Ohio Valley',
  wi: 'Midwest and Ohio Valley',
  mn: 'Midwest and Ohio Valley',
  mo: 'Midwest and Ohio Valley',
  me: 'Northeast',
  nh: 'Northeast',
  vt: 'Northeast',
  ma: 'Northeast',
  ri: 'Northeast',
  ct: 'Northeast',
  ny: 'Northeast',
  nj: 'Northeast',
  pa: 'Northeast',
  ca: 'West Coast and Intermountain',
  or: 'West Coast and Intermountain',
  wa: 'West Coast and Intermountain',
  nv: 'West Coast and Intermountain',
  co: 'West Coast and Intermountain',
  ut: 'West Coast and Intermountain',
  id: 'West Coast and Intermountain',
  nd: 'Great Plains',
  sd: 'Great Plains',
  ne: 'Great Plains',
  ks: 'Great Plains',
  ok: 'Great Plains',
  mt: 'Great Plains',
  wy: 'Great Plains',
  hi: 'island',
  ak: 'Alaska',
  az: 'Southwest local',
  nm: 'West Coast and Intermountain',
  md: 'Northeast',
  de: 'Northeast',
  dc: 'Northeast',
}

const SYSTEM_PROMPT = `You write metro-level buyer intros for SewerLineRepairList, an independent directory of residential sewer line repair and replacement contractors.

Voice: practical, plainspoken, buyer-first. You filter noise so someone can call a shop that has actually done structural lateral repair. Not a marketplace, not endorsements.

Rules:
- Use ONLY facts in the input JSON (landscapeFacts, stateEditorial, directorySignal, metro). Do not invent pipe ages, soil conditions, permit fees, statutes, or wage numbers.
- Prefer landscapeFacts that name this metro or its metro area. State-level facts are fine when marked statewide. Regional facts are OK when they clearly apply to this metro's region.
- If landscapeFacts has no metro-named event, do NOT invent a local flood or sinkhole story. Stay with documented ownership/code/licensing notes and directory signal.
- Never claim we verified, vetted, license-checked, or endorse contractors. Website signal is a starting filter.
- Do not use: trusted, top-rated, premier, vetted, leading, seamless, comprehensive, elevate, unlock, dream, hassle-free.
- Never use em dashes. Use periods, commas, colons, or parentheses.
- Every number you mention must appear in the input payload (or be a year already present there).
- Hedge credentials: shops may claim CIPP or trenchless specialty; say buyers should confirm licensing, insurance, camera documentation, and recent lateral repair work themselves.
- Name the category blur once when useful: drain cleaning, camera inspection, septic pumping, and hydro jetting do not independently prove structural sewer repair.
- Never mention standby generators, heating-fuel paths, electric-vehicle charging, or outage metrics.

Return JSON with exactly these keys:

intro (string, required)
- 3-5 sentences as one paragraph (no bullets).
- Ground the reader in THIS metro's documented sewer landscape first (ownership, soil/pipe material, or code/licensing hook that actually applies), then weave in directorySignal counts and city clusters.
- Mention the ${METRO_RADIUS_MILES}-mile radius when you cite nearby contractor counts.
- End with a non-endorsement boundary (starting filter / confirm yourself / not an endorsement).
- Max 780 characters.

marketNote (string, required)
- 2-3 sentences of practical buying context from landscapeFacts + stateEditorial (lateral ownership, camera locate, trenchless vs open-cut, permits, restoration, licensing) that apply to this metro.
- If a fact is statewide, say so.
- Max 520 characters.

metaDescription (string, required)
- One search snippet, hard max 155 characters.
- Include metro name and nearbyCount. No endorsement words.`

const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    intro: {
      type: 'string',
      description: '3-5 sentence metro intro grounded in landscape + directory signal. Max 780 chars.',
    },
    marketNote: {
      type: 'string',
      description: '2-3 sentence buying context from documented facts. Max 520 chars.',
    },
    metaDescription: {
      type: 'string',
      description: 'Search snippet, max 155 chars, includes metro name and count.',
    },
  },
  required: ['intro', 'marketNote', 'metaDescription'],
}

function parseArgs(argv) {
  const args = {
    limit: Infinity,
    metros: [],
    force: false,
    dryRun: false,
    examples: false,
    concurrency: CONCURRENCY,
  }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--limit') args.limit = Number(argv[++i])
    else if (arg === '--metro') args.metros.push(argv[++i]?.toLowerCase())
    else if (arg === '--force') args.force = true
    else if (arg === '--dry-run') args.dryRun = true
    else if (arg === '--concurrency') args.concurrency = Number(argv[++i])
    else if (arg === '--examples') {
      args.examples = true
      args.metros = [...EXAMPLE_METROS]
      args.force = true
    }
  }
  return args
}

async function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  const lines = fs.readFileSync(filePath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

function loadMetrosFromTs() {
  const text = fs.readFileSync(METROS_PATH, 'utf8')
  const re =
    /M\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([\d_]+)\s*\)/g
  const metros = []
  let match
  while ((match = re.exec(text)) !== null) {
    metros.push({
      slug: match[1],
      name: match[2],
      state: match[3],
      stateAbbr: match[4],
      stateSlug: match[5],
      lat: Number(match[6]),
      lng: Number(match[7]),
      population: Number(match[8].replace(/_/g, '')),
    })
  }
  return metros
}

function haversineMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8
  const toR = (d) => (d * Math.PI) / 180
  const dlat = toR(lat2 - lat1)
  const dlon = toR(lon2 - lon1)
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(toR(lat1)) * Math.cos(toR(lat2)) * Math.sin(dlon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function cityClusters(nearby, limit = 4) {
  const counts = new Map()
  for (const contractor of nearby) {
    const city = (contractor.city || '').trim()
    if (!city) continue
    counts.set(city, (counts.get(city) || 0) + 1)
  }
  return [...counts.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city))
    .slice(0, limit)
}

function densityLabel(count) {
  if (count >= 80) return 'busy'
  if (count >= 35) return 'solid'
  if (count >= 12) return 'moderate'
  return 'thin'
}

function stripMarkdownLinks(text) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}

function extractRegionalProfiles(researchText) {
  const profiles = {}
  const sectionRe =
    /###\s+\d+\.\s+([^\n]+)\n([\s\S]*?)(?=\n###\s+\d+\.|\n##\s+State data table|\n---\n\n## State)/g
  let match
  while ((match = sectionRe.exec(researchText)) !== null) {
    const title = match[1].trim()
    const body = stripMarkdownLinks(match[2].trim()).slice(0, 2200)
    profiles[title] = body
  }
  return profiles
}

function extractStateTableRow(researchText, stateName) {
  const lines = researchText.split('\n')
  for (const line of lines) {
    if (!line.startsWith('|')) continue
    const cells = line.split('|').map((c) => c.trim())
    if (cells[1] === stateName) {
      return {
        state: cells[1],
        utilityGasPct: cells[2],
        propanePct: cells[3],
        electricPct: cells[4],
        fuelOilPct: cells[5],
        saidi2024Hours: cells[6],
        dominantOutageDriver: cells[7],
        necEdition: cells[8],
        licensingNote: cells[9],
      }
    }
  }
  return null
}

function extractMentions(researchText, needles, maxSnippets = 6) {
  const plain = stripMarkdownLinks(researchText)
  const snippets = []
  const seen = new Set()
  for (const needle of needles) {
    if (!needle || needle.length < 3) continue
    const re = new RegExp(
      `([^.\\n]{0,120}\\b${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b[^.\\n]{0,180}\\.)`,
      'gi',
    )
    let match
    while ((match = re.exec(plain)) !== null) {
      const snippet = match[1].replace(/\s+/g, ' ').trim()
      const key = snippet.slice(0, 80)
      if (seen.has(key)) continue
      seen.add(key)
      snippets.push({ needle, snippet })
      if (snippets.length >= maxSnippets) return snippets
    }
  }
  return snippets
}

function extractExecutiveBullets(researchText, stateName, metroName, max = 4) {
  const bullets = []
  const needle =
    metroName.length >= 4
      ? new RegExp(`${metroName}|${stateName}`, 'i')
      : new RegExp(stateName, 'i')
  for (const line of researchText.split('\n')) {
    if (!line.startsWith('- **')) continue
    if (!needle.test(line)) continue
    bullets.push(stripMarkdownLinks(line.replace(/^- /, '')).slice(0, 400))
    if (bullets.length >= max) break
  }
  return bullets
}

function findRegionalBody(profiles, stateSlug) {
  const hint = STATE_TO_REGION[stateSlug]
  if (!hint) return null
  if (hint === 'island') {
    return {
      regionTitle: 'Hawaii (state row + island grid notes)',
      regionBody:
        'Hawaii has island geology and unique lateral/access constraints. Prefer documented state research notes; do not invent mainland flood narratives.',
    }
  }
  if (stateSlug === 'tx') {
    const gulf = Object.entries(profiles).find(([t]) => /Gulf Coast/i.test(t))
    const texas = Object.entries(profiles).find(([t]) => /Texas as its own/i.test(t))
    return {
      regionTitle: 'Texas / Gulf',
      regionBody: [texas?.[1], gulf?.[1]].filter(Boolean).join('\n\n').slice(0, 2800),
    }
  }
  const hit = Object.entries(profiles).find(([t]) =>
    t.toLowerCase().includes(hint.toLowerCase().slice(0, 12)),
  )
  if (!hit) return null
  return { regionTitle: hit[0], regionBody: hit[1] }
}

function buildPayload(metro, contractors, stateEditorial, researchText, profiles) {
  const nearby = contractors.filter(
    (i) =>
      typeof i.lat === 'number' &&
      typeof i.lng === 'number' &&
      haversineMiles(metro.lat, metro.lng, i.lat, i.lng) <= METRO_RADIUS_MILES,
  )
  const explicit = nearby.filter((i) => i.primaryLane === 'explicit').length
  const high = nearby.filter((i) => i.primaryLane === 'high').length
  const medium = nearby.filter((i) => i.primaryLane === 'medium').length
  const clusters = cityClusters(nearby)
  const editorial = stateEditorial[metro.stateSlug] || null
  const region = findRegionalBody(profiles, metro.stateSlug)
  const tableRow = extractStateTableRow(researchText, metro.state)
  const mentionNeedles = [
    metro.name,
    metro.name === 'St. Louis' ? 'St. Louis' : null,
    metro.slug === 'dallas' ? 'Dallas' : null,
    metro.slug === 'fort-worth' ? 'Fort Worth' : null,
    metro.slug === 'miami' ? 'Miami-Dade' : null,
    metro.slug === 'miami' ? 'HVHZ' : null,
    metro.slug === 'houston' ? 'Beryl' : null,
    metro.slug === 'houston' ? 'CenterPoint' : null,
    metro.slug === 'seattle' ? 'bomb cyclone' : null,
    metro.slug === 'cedar-rapids' ? 'Cedar Rapids' : null,
    metro.slug === 'los-angeles' ? 'Los Angeles' : null,
    metro.slug === 'san-francisco' ? 'San Francisco' : null,
  ].filter(Boolean)

  const metroMentions = extractMentions(researchText, mentionNeedles)
  const executiveHits = extractExecutiveBullets(
    researchText,
    metro.state,
    metro.name,
  )

  const landscapeFacts = {
    verifiedAsOf: 'August 2026',
    regionTitle: region?.regionTitle || null,
    regionSummary: region?.regionBody || null,
    stateTableRow: tableRow,
    metroNamedMentions: metroMentions,
    relatedExecutiveBullets: executiveHits,
    caveats: [
      'Do not generalize Miami-Dade NOA / HVHZ requirements beyond Miami-Dade and Broward.',
      'Housing-stock and pipe-age notes are research-pass context, not a property diagnosis.',
      'Plumbing code and lateral ownership rules vary by AHJ; tell buyers to confirm locally.',
      'Regional soil, root, and flood notes are editorial synthesis from cited research; soften wording accordingly.',
    ],
  }

  return {
    metro: {
      slug: metro.slug,
      name: metro.name,
      state: metro.state,
      stateAbbr: metro.stateAbbr,
      stateSlug: metro.stateSlug,
      populationApprox: metro.population,
    },
    directorySignal: {
      radiusMiles: METRO_RADIUS_MILES,
      nearbyCount: nearby.length,
      explicitCount: explicit,
      highCount: high,
      mediumCount: medium,
      density: densityLabel(nearby.length),
      cityClusters: clusters,
    },
    stateEditorial: editorial
      ? {
          marketOverview: editorial.marketOverview,
          costContext: editorial.costContext,
          buyerNote: editorial.buyerNote,
          licensingNote: editorial.licensingNote || null,
          buyerNote: editorial.buyerNote || null,
          homeRepairContext: editorial.homeRepairContext || editorial.costContext || null,
          necEdition: editorial.necEdition || null,
          licensingNote: editorial.licensingNote || null,
          verifiedAsOf: editorial.verifiedAsOf || null,
        }
      : null,
    landscapeFacts,
  }
}

function withoutEmDashes(value) {
  return value
    .replace(/\u2014/g, ', ')
    .replace(/\u2013/g, '-')
    .replace(/\s+,/g, ',')
    .replace(/,\s*,/g, ',')
}

function collectAllowedNumbers(payload) {
  const nums = new Set()
  const walk = (v) => {
    if (typeof v === 'number' && Number.isFinite(v)) {
      nums.add(Math.round(v) === v ? v : v)
      // also allow integer truncation for percentages like 35.4 → 35 if model rounds wrong; skip floats as exact
      if (!Number.isInteger(v)) nums.add(v)
    } else if (typeof v === 'string') {
      for (const m of v.matchAll(/\b\d+(?:\.\d+)?\b/g)) {
        nums.add(Number(m[0]))
      }
    } else if (Array.isArray(v)) {
      v.forEach(walk)
    } else if (v && typeof v === 'object') {
      Object.values(v).forEach(walk)
    }
  }
  walk(payload)
  nums.add(METRO_RADIUS_MILES)
  nums.add(2024)
  nums.add(2023)
  nums.add(2025)
  nums.add(2026)
  nums.add(2021)
  nums.add(2020)
  nums.add(2019)
  nums.add(2017)
  return nums
}

function validateOutput(output, payload) {
  for (const key of ['intro', 'marketNote', 'metaDescription']) {
    if (typeof output[key] !== 'string' || !output[key].trim()) {
      throw new Error(`Missing ${key}`)
    }
  }
  output.intro = withoutEmDashes(output.intro.trim())
  output.marketNote = withoutEmDashes(output.marketNote.trim())
  output.metaDescription = withoutEmDashes(output.metaDescription.trim())

  if (output.intro.length > 900) throw new Error(`intro too long (${output.intro.length})`)
  if (output.marketNote.length > 650) {
    throw new Error(`marketNote too long (${output.marketNote.length})`)
  }
  if (output.metaDescription.length > 165) {
    throw new Error(`metaDescription too long (${output.metaDescription.length})`)
  }
  if (/—/.test(output.intro + output.marketNote + output.metaDescription)) {
    throw new Error('em dash still present')
  }

  const banned =
    /\b(trusted|top-rated|premier|vetted pros|leading contractor|seamless|comprehensive)\b/i
  if (banned.test(`${output.intro} ${output.marketNote}`)) {
    throw new Error('banned endorsement language')
  }

  const allowed = collectAllowedNumbers(payload)
  const mentioned = [
    ...`${output.intro} ${output.marketNote} ${output.metaDescription}`.matchAll(
      /\b\d+(?:\.\d+)?\b/g,
    ),
  ].map((m) => Number(m[0]))
  for (const num of mentioned) {
    if (num >= 1900 && num <= 2100) continue
    // allow small integers used as sentence counts rarely — still enforce
    const ok =
      allowed.has(num) ||
      [...allowed].some((a) => Math.abs(a - num) < 0.05)
    if (!ok) {
      throw new Error(`Output mentions number ${num} not present in payload`)
    }
  }

  return output
}

async function callGemini(payload) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not set. Add it to .env.local or the environment.',
    )
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Write metro editorial for ${payload.metro.name}, ${payload.metro.stateAbbr}. Input data:\n${JSON.stringify(payload, null, 2)}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.65,
        responseMimeType: 'application/json',
        responseSchema: OUTPUT_SCHEMA,
      },
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Gemini API ${response.status}: ${body.slice(0, 500)}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('')
  if (!text) throw new Error('Gemini returned empty content')
  return validateOutput(JSON.parse(text), payload)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function createStore(initial) {
  const data = { ...initial }
  let dirty = false
  let writing = Promise.resolve()

  const persist = () => {
    dirty = true
    writing = writing.then(() => {
      if (!dirty) return
      dirty = false
      fs.writeFileSync(OUT_PATH, `${JSON.stringify(data, null, 2)}\n`)
    })
    return writing
  }

  return {
    get(key) {
      return data[key]
    },
    set(key, copy, model) {
      data[key] = {
        ...copy,
        generatedAt: new Date().toISOString(),
        model,
      }
      return persist()
    },
    keys() {
      return Object.keys(data)
    },
    async flush() {
      await writing
      if (dirty) await persist()
      await writing
    },
  }
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length)
  let next = 0
  async function run() {
    while (next < items.length) {
      const index = next
      next += 1
      results[index] = await worker(items[index], index)
    }
  }
  const runners = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => run(),
  )
  await Promise.all(runners)
  return results
}

async function main() {
  await loadEnvFile(ENV_PATH)
  if (!process.env.GEMINI_API_KEY) {
    await loadEnvFile(
      path.join(process.env.HOME || '', 'sewer-line-repair-scrape/.env'),
    )
  }
  if (!process.env.GEMINI_API_KEY) {
    await loadEnvFile(
      path.join(
        path.dirname(repoRoot),
        'estate-sale-scraper/.env',
      ),
    )
  }

  const args = parseArgs(process.argv.slice(2))
  const metros = loadMetrosFromTs()
  const contractors = JSON.parse(fs.readFileSync(INSTALLERS_PATH, 'utf8'))
  const stateEditorial = JSON.parse(fs.readFileSync(STATE_EDITORIAL_PATH, 'utf8'))
  const researchText = fs.readFileSync(RESEARCH_PATH, 'utf8')
  const profiles = extractRegionalProfiles(researchText)

  let queue = [...metros]
  if (args.metros.length) {
    queue = queue.filter((m) => args.metros.includes(m.slug))
  }

  const existing = fs.existsSync(OUT_PATH)
    ? JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'))
    : {}
  const store = createStore(existing)

  if (!args.force) {
    queue = queue.filter((m) => {
      const key = `${m.stateSlug}/${m.slug}`
      return !store.get(key)?.intro
    })
  }
  if (Number.isFinite(args.limit)) queue = queue.slice(0, args.limit)

  const concurrency = Math.max(1, args.concurrency || CONCURRENCY)
  console.log(`Model: ${MODEL}`)
  console.log(`Concurrency: ${concurrency}`)
  console.log(`Queue: ${queue.length} metro(s)${args.examples ? ' (examples)' : ''}`)
  if (queue.length === 0) {
    console.log(`Nothing to generate. Total stored: ${store.keys().length}`)
    return
  }

  if (args.dryRun) {
    const sample = queue[0]
    console.log(
      JSON.stringify(
        buildPayload(sample, contractors, stateEditorial, researchText, profiles),
        null,
        2,
      ),
    )
    console.log('\nDry run — no API calls made.')
    return
  }

  let ok = 0
  let failed = 0
  const results = []
  const failures = []

  await mapPool(queue, concurrency, async (metro) => {
    const key = `${metro.stateSlug}/${metro.slug}`
    try {
      const payload = buildPayload(
        metro,
        contractors,
        stateEditorial,
        researchText,
        profiles,
      )
      let copy
      let lastErr
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          copy = await callGemini(payload)
          break
        } catch (err) {
          lastErr = err
          if (attempt < 2) await sleep(700 * (attempt + 1))
        }
      }
      if (!copy) throw lastErr
      await store.set(key, copy, MODEL)
      ok += 1
      results.push({ key, ...copy })
      console.log(`✓ ${key} (${copy.intro.length}c)`)
    } catch (error) {
      failed += 1
      failures.push({ key, error: error.message })
      console.log(`✗ ${key}: ${error.message}`)
    }
    if (DELAY_MS > 0) await sleep(DELAY_MS)
  })

  await store.flush()

  console.log(`\nFinished: ${ok} ok, ${failed} failed`)
  console.log(`Total stored metros: ${store.keys().length}`)
  console.log(`Output: ${OUT_PATH}`)
  if (failures.length) {
    console.log('\nFailures:')
    for (const row of failures) console.log(`- ${row.key}: ${row.error}`)
  }

  if (args.examples && results.length) {
    console.log('\n========== EXAMPLE PREVIEWS ==========\n')
    for (const row of results) {
      console.log(`### ${row.key}`)
      console.log(`INTRO:\n${row.intro}\n`)
      console.log(`MARKET NOTE:\n${row.marketNote}\n`)
      console.log(`META:\n${row.metaDescription}\n`)
      console.log('---\n')
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
