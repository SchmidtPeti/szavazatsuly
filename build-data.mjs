/**
 * build-data.mjs
 *
 * Feldolgozza az NVI/valasztas.hu adatokat és létrehozza:
 *   public/oevk_results.json
 *   public/zip_to_oevk.json
 */

import fs from 'fs'

const BASE = 'c:/Users/schmi/Documents/Projects/szavazatsuly'

const MAZ_NAMES = {
  '01': 'Budapest', '02': 'Baranya', '03': 'Bács-Kiskun', '04': 'Békés',
  '05': 'Borsod-Abaúj-Zemplén', '06': 'Csongrád-Csanád', '07': 'Fejér',
  '08': 'Győr-Moson-Sopron', '09': 'Hajdú-Bihar', '10': 'Heves',
  '11': 'Jász-Nagykun-Szolnok', '12': 'Komárom-Esztergom', '13': 'Nógrád',
  '14': 'Pest', '15': 'Somogy', '16': 'Szabolcs-Szatmár-Bereg',
  '17': 'Tolna', '18': 'Vas', '19': 'Veszprém', '20': 'Zala',
}

function romanToArabic(s) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100 }
  let r = 0
  for (let i = 0; i < s.length; i++) {
    const c = map[s[i]], n = map[s[i+1]] || 0
    r += c < n ? -c : c
  }
  return r
}

function normalize(s) {
  return s.toLowerCase().trim()
    .replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i')
    .replace(/ó/g,'o').replace(/ö/g,'o').replace(/ő/g,'o')
    .replace(/ú/g,'u').replace(/ü/g,'u').replace(/ű/g,'u')
    .replace(/\s+/g,' ')
}

// 1. OEVK eredmények
function buildOevkResults() {
  const raw = JSON.parse(fs.readFileSync(`${BASE}/SzorosVerseny_raw.json`, 'utf8'))

  // Szekvenciális ID: maz+evk sorrend szerint
  const pairs = [...new Set(raw.list.map(d => `${d.maz}-${d.evk}`))].sort((a, b) => {
    const [mA, eA] = a.split('-'); const [mB, eB] = b.split('-')
    return parseInt(mA) !== parseInt(mB) ? parseInt(mA)-parseInt(mB) : parseInt(eA)-parseInt(eB)
  })
  const idMap = Object.fromEntries(pairs.map((k, i) => [k, i+1]))

  return raw.list.map(d => {
    const key = `${d.maz}-${d.evk}`
    const county = MAZ_NAMES[d.maz] || d.maz
    const evkNum = d.evk.padStart(2, '0')
    const oevk_name = county === 'Budapest'
      ? `Budapest ${evkNum}. OEVK`
      : `${county} ${evkNum}. OEVK`
    return {
      oevk_id: idMap[key],
      maz: d.maz,
      evk: d.evk,
      oevk_name,
      county,
      winner_votes: d.szavazat1,
      second_votes: d.szavazat2,
      margin: d.szavazat_kulonbseg,
    }
  }).sort((a, b) => a.oevk_id - b.oevk_id)
}

// 2. ZIP → OEVK ID mapping
function buildZipMapping(oevkResults) {
  const telepules = JSON.parse(fs.readFileSync(`${BASE}/Telepulesek_raw.json`, 'utf8'))
  const postalNonBuda = JSON.parse(fs.readFileSync(`${BASE}/postal-codes-raw.json`, 'utf8'))
  const postalBuda = JSON.parse(fs.readFileSync(`${BASE}/budapest-postal.json`, 'utf8'))

  // Kerület → EVK lista lookup (Budapest)
  const kerToEvk = {}
  telepules.list
    .filter(t => t.maz === '01')
    .forEach(t => {
      const m = t.megnev.match(/Budapest ([IVXLCDM]+)\. kerület/)
      if (m) kerToEvk[romanToArabic(m[1])] = t.evk_lst
    })

  // Városnév (normalizált) → {maz, evk_lst} (vidéki)
  const cityToInfo = {}
  telepules.list
    .filter(t => t.maz !== '01')
    .forEach(t => {
      const key = normalize(t.megnev)
      // Ha több OEVK is tartozik a városhoz, az elsőt vesszük
      cityToInfo[key] = { maz: t.maz, evk_lst: t.evk_lst }
    })

  const zipMap = {}

  // --- Budapest: zip → district → evk → oevk_id ---
  // Minden Budapest zip-hez vesszük a legtöbbször előforduló kerületet
  const zipDistrictCount = {}
  for (const entry of postalBuda) {
    const zip = String(entry.zip)
    const dist = entry.district
    if (!zipDistrictCount[zip]) zipDistrictCount[zip] = {}
    zipDistrictCount[zip][dist] = (zipDistrictCount[zip][dist] || 0) + 1
  }
  for (const [zip, counts] of Object.entries(zipDistrictCount)) {
    // Leggyakoribb kerület
    const district = parseInt(Object.entries(counts).sort((a, b) => b[1]-a[1])[0][0])
    const evkLst = kerToEvk[district]
    if (!evkLst || evkLst.length === 0) continue
    // Az első EVK-t vesszük
    const evk = evkLst[0]
    const oevk = oevkResults.find(o => o.maz === '01' && o.evk === evk)
    if (oevk) zipMap[zip] = oevk.oevk_id
  }

  // --- Nagy városok (külön fájlok) ---
  const CITY_FILES = {
    'debrecen-postal.json': 'Debrecen',
    'gyor-postal.json': 'Győr',
    'miskolc-postal.json': 'Miskolc',
    'pecs-postal.json': 'Pécs',
    'szeged-postal.json': 'Szeged',
  }
  for (const [file, cityName] of Object.entries(CITY_FILES)) {
    const filePath = `${BASE}/${file}`
    if (!fs.existsSync(filePath)) continue
    const entries = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const key = normalize(cityName)
    const info = cityToInfo[key]
    if (!info) { console.log(`  WARN: ${cityName} not found in Telepulesek`); continue }
    const evk = info.evk_lst[0]
    const oevk = oevkResults.find(o => o.maz === info.maz && o.evk === evk)
    if (!oevk) { console.log(`  WARN: OEVK not found for ${cityName}`); continue }
    for (const entry of entries) {
      const zip = String(entry.zip)
      if (!zipMap[zip]) zipMap[zip] = oevk.oevk_id
    }
  }

  // --- Vidéki irányítószámok ---
  for (const entry of postalNonBuda) {
    const zip = String(entry.zip)
    if (zipMap[zip]) continue // már feldolgoztuk
    const key = normalize(entry.city)
    const info = cityToInfo[key]
    if (!info) continue
    const evk = info.evk_lst[0]
    const oevk = oevkResults.find(o => o.maz === info.maz && o.evk === evk)
    if (oevk) zipMap[zip] = oevk.oevk_id
  }

  return zipMap
}

// === MAIN ===
console.log('Building OEVK results...')
const oevkResults = buildOevkResults()
console.log(`  ${oevkResults.length} OEVK processed`)

const publicDir = `${BASE}/public`
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

fs.writeFileSync(`${publicDir}/oevk_results.json`, JSON.stringify(oevkResults, null, 2))
console.log('  Saved public/oevk_results.json')

console.log('\nBuilding ZIP → OEVK mapping...')
const zipMap = buildZipMapping(oevkResults)
const zipCount = Object.keys(zipMap).length
console.log(`  ${zipCount} postal codes mapped`)

fs.writeFileSync(`${publicDir}/zip_to_oevk.json`, JSON.stringify(zipMap, null, 2))
console.log('  Saved public/zip_to_oevk.json')

// Ellenőrzés
console.log('\nSample oevk_results:')
const tight = [...oevkResults].sort((a,b) => a.margin-b.margin).slice(0,3)
tight.forEach(o => console.log(`  #${o.oevk_id} ${o.oevk_name}: ${o.margin.toLocaleString('hu-HU')} szav. különbség`))

console.log('\nSample zip_to_oevk:')
const testZips = ['1011', '1051', '1184', '4029', '7621', '6720', '9021', '1221', '2800']
testZips.forEach(z => {
  const id = zipMap[z]
  const oevk = oevkResults.find(o => o.oevk_id === id)
  console.log(`  ${z} → OEVK #${id || '?'} ${oevk ? oevk.oevk_name : ''}`)
})
