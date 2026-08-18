#!/usr/bin/env node
/**
 * Generate state editorial via Gemini Flash for SewerLineRepairList.
 *
 * Usage:
 *   node scripts/generate-state-editorial.mjs --state tn --state tx --state ca
 *   node scripts/generate-state-editorial.mjs --limit 5 --force
 *   node scripts/generate-state-editorial.mjs --concurrency 6
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const OUT_PATH = path.join(repoRoot, 'lib/data/state-editorial.json')
const STATES_PATH = path.join(repoRoot, 'lib/data/states.json')
const RESEARCH_PATH = path.join(
  repoRoot,
  'docs/research/10-state-and-regional-variation.md',
)
const ENV_CANDIDATES = [
  path.join(repoRoot, '.env.local'),
  path.join(process.env.HOME || '', 'sewer-line-repair-scrape/.env'),
]

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const CONCURRENCY = Number(process.env.STATE_GEN_CONCURRENCY || 6)

if (!/^gemini-.*flash/i.test(MODEL)) {
  console.error(`Refusing non-Flash model: ${MODEL}`)
  process.exit(1)
}

function loadEnv() {
  for (const envPath of ENV_CANDIDATES) {
    if (!fs.existsSync(envPath)) continue
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (!m) continue
      if (!process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  }
}

const SYSTEM = `You write state-level buyer notes for SewerLineRepairList, an independent directory of residential sewer line repair and replacement contractors.

Voice: practical, plainspoken, buyer-first. Website signal is a starting filter, not an endorsement.

Rules:
- Use ONLY facts in the input JSON. Do not invent statutes, assistance amounts, pipe ages, soil conditions, permit fees, or wage numbers.
- Active lane is residential_sewer. Drain cleaning, camera inspection, hydro jetting, root removal, and septic pumping do not independently prove structural sewer repair.
- Never claim we verified licenses or endorse contractors.
- Never use em dashes.
- Avoid: trusted, top-rated, premier, vetted, leading, seamless, comprehensive.
- Never mention standby generators, heating-fuel paths, electric-vehicle charging, or outage metrics.
- Hedge credentials; tell buyers to confirm licensing, insurance, camera documentation, lateral ownership, method options, permits, and restoration.

Return JSON with exactly:
marketOverview (2-4 sentences on contractor depth and where listings cluster)
homeRepairContext (2-3 sentences on housing age, lateral ownership, pipe/access, roots, freeze, soil, flood, or repair-method context supported by the payload)
buyerNote (2-3 sentences on licensing, permits, ownership, inspection, restoration, and what to confirm)
metaDescription (max 155 characters)
`

function parseArgs(argv) {
  const out = {
    states: [],
    force: false,
    limit: Infinity,
    dryRun: false,
    concurrency: CONCURRENCY,
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--state') out.states.push(argv[++i])
    else if (a === '--force') out.force = true
    else if (a === '--limit') out.limit = Number(argv[++i])
    else if (a === '--dry-run') out.dryRun = true
    else if (a === '--concurrency') out.concurrency = Number(argv[++i])
  }
  return out
}

function excerptForState(researchText, stateName, abbr) {
  if (!researchText) return ''
  const patterns = [
    new RegExp(`##+\\s*${stateName}[\\s\\S]*?(?=\\n##+|$)`, 'i'),
    new RegExp(`\\|\\s*${abbr}\\s*\\|[^\\n]*`, 'i'),
  ]
  for (const re of patterns) {
    const m = researchText.match(re)
    if (m) return m[0].slice(0, 3500)
  }
  return researchText.slice(0, 2500)
}

function buildPayload(slug, stateMeta, researchText) {
  return {
    state: {
      slug,
      name: stateMeta.name,
      abbr: stateMeta.abbr,
    },
    directorySignal: {
      activeLane: 'residential_sewer',
      totalListings: stateMeta.totalListings || 0,
      explicitCount: stateMeta.explicitCount || 0,
      highCount: stateMeta.highCount || 0,
      mediumCount: stateMeta.mediumCount || 0,
      topCities: stateMeta.topCities || [],
    },
    landscape: {
      researchExcerpt: excerptForState(
        researchText,
        stateMeta.name,
        stateMeta.abbr,
      ),
      housing: {},
      pipeAge: {},
      publicSewer: {},
      code: {},
      licensing: {},
      lateralRules: {},
      documentedPrograms: [],
      verifiedAsOf: '2026-08-12',
      sources: ['docs/research/10-state-and-regional-variation.md'],
    },
  }
}

function validate(output, payload) {
  for (const key of [
    'marketOverview',
    'homeRepairContext',
    'buyerNote',
    'metaDescription',
  ]) {
    if (!output[key] || typeof output[key] !== 'string') {
      throw new Error(`missing ${key}`)
    }
    if (output[key].includes('—')) throw new Error('em dash')
  }
  if (output.metaDescription.length > 155) {
    output.metaDescription = `${output.metaDescription.slice(0, 152).trim()}…`
  }
  const blob =
    `${output.marketOverview} ${output.homeRepairContext} ${output.buyerNote}`.toLowerCase()
  for (const bad of [
    'trusted',
    'top-rated',
    'premier',
    'vetted',
    'leading',
    'standby',
    'generator',
    'outage',
    'nec ',
    'electric-vehicle charging',
  ]) {
    if (blob.includes(bad)) throw new Error(`banned word ${bad}`)
  }
  if (!output.marketOverview.includes(payload.state.name)) {
    output.marketOverview = `${payload.state.name}: ${output.marketOverview}`
  }
  return output
}

async function callGemini(payload) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY missing')
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(120000),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM }] },
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Write state editorial for ${payload.state.name}. Input:\n${JSON.stringify(payload)}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.55,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            marketOverview: { type: 'STRING' },
            homeRepairContext: { type: 'STRING' },
            buyerNote: { type: 'STRING' },
            metaDescription: { type: 'STRING' },
          },
          required: [
            'marketOverview',
            'homeRepairContext',
            'buyerNote',
            'metaDescription',
          ],
        },
      },
    }),
  })
  if (!response.ok) {
    throw new Error(
      `Gemini ${response.status}: ${(await response.text()).slice(0, 400)}`,
    )
  }
  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('')
  if (!text) throw new Error('empty Gemini response')
  return validate(JSON.parse(text), payload)
}

async function mapPool(items, concurrency, worker) {
  const results = []
  let i = 0
  async function run() {
    while (i < items.length) {
      const idx = i++
      results[idx] = await worker(items[idx], idx)
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => run()),
  )
  return results
}

async function main() {
  loadEnv()
  const args = parseArgs(process.argv.slice(2))
  if (!fs.existsSync(STATES_PATH)) {
    console.error('Missing lib/data/states.json; run extract first')
    process.exit(1)
  }
  const states = JSON.parse(fs.readFileSync(STATES_PATH, 'utf8'))
  const research = fs.existsSync(RESEARCH_PATH)
    ? fs.readFileSync(RESEARCH_PATH, 'utf8')
    : ''
  let store = {}
  if (fs.existsSync(OUT_PATH)) {
    try {
      store = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8')) || {}
    } catch {
      store = {}
    }
  }

  let targets = args.states.length
    ? args.states
    : Object.keys(states).filter((s) => (states[s].totalListings || 0) > 0)
  targets = targets.filter((slug) => {
    if (!states[slug]) return false
    if (args.force) return true
    return !store[slug]?.marketOverview
  })
  targets = targets.slice(0, args.limit)

  console.log(
    `Generating ${targets.length} state editorials with ${MODEL} concurrency=${args.concurrency}`,
  )
  if (args.dryRun) {
    console.log(targets)
    return
  }

  await mapPool(targets, args.concurrency, async (slug) => {
    const payload = buildPayload(slug, states[slug], research)
    let lastErr
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const output = await callGemini(payload)
        store[slug] = {
          ...output,
          costContext: output.homeRepairContext,
          model: MODEL,
          generatedAt: new Date().toISOString(),
          source: 'flash',
          verifiedAsOf: payload.landscape.verifiedAsOf,
        }
        fs.writeFileSync(OUT_PATH, `${JSON.stringify(store, null, 2)}\n`)
        console.log(`ok ${slug}`)
        return
      } catch (err) {
        lastErr = err
        console.warn(`retry ${slug} attempt=${attempt}: ${err.message}`)
        await new Promise((r) => setTimeout(r, 1500 * attempt))
      }
    }
    console.error(`FAIL ${slug}: ${lastErr?.message}`)
  })

  console.log(`Wrote ${OUT_PATH} (${Object.keys(store).length} states)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
