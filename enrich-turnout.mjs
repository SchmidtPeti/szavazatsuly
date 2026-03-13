/**
 * enrich-turnout.mjs
 *
 * Kiszámolja az eligible_voters, turnout_votes, non_voters mezőket
 * az NVI 2022-es adatokból (winner_pct + turnout_pct alapján)
 * és beírja a public/oevk_results.json-ba.
 *
 * Módszer:
 *   total_votes_cast = round(winner_votes / (winner_pct / 100))
 *   eligible_voters  = round(total_votes_cast / (turnout_pct / 100))
 *   non_voters       = eligible_voters - total_votes_cast
 */

import fs from 'fs'

const BASE = 'c:/Users/schmi/Documents/Projects/szavazatsuly'

// [oevk_id, winner_pct, turnout_pct]
// Forrás: NVI 2022 vtr.valasztas.hu – eredmenyek.html + reszvetel.html (19:00 végeredmény)
const nviData = [
  // Budapest (maz=01, oevk_id 1-18)
  [1,  48.47, 75.96],
  [2,  51.94, 81.09],
  [3,  48.42, 82.06],
  [4,  51.89, 81.95],
  [5,  51.39, 68.72],
  [6,  48.31, 65.67],
  [7,  60.53, 74.24],
  [8,  54.09, 75.35],
  [9,  45.97, 70.25],
  [10, 48.82, 77.28],
  [11, 50.82, 75.20],
  [12, 45.11, 72.96],
  [13, 45.46, 81.00],
  [14, 44.66, 76.47],
  [15, 44.60, 75.25],
  [16, 46.35, 71.73],
  [17, 46.49, 72.00],
  [18, 48.47, 78.40],
  // Baranya (maz=02, oevk_id 19-22)
  [19, 44.01, 70.27],
  [20, 44.41, 68.31],
  [21, 60.44, 66.97],
  [22, 61.08, 64.60],
  // Bács-Kiskun (maz=03, oevk_id 23-28)
  [23, 59.02, 68.11],
  [24, 53.00, 70.85],
  [25, 59.70, 69.18],
  [26, 62.97, 67.08],
  [27, 60.16, 63.66],
  [28, 57.26, 65.71],
  // Békés (maz=04, oevk_id 29-32)
  [29, 48.27, 70.42],
  [30, 57.71, 65.38],
  [31, 55.76, 66.13],
  [32, 49.82, 63.95],
  // Borsod-Abaúj-Zemplén (maz=05, oevk_id 33-39)
  [33, 46.50, 68.93],
  [34, 43.85, 66.67],
  [35, 58.93, 58.06],
  [36, 54.39, 62.06],
  [37, 60.60, 62.72],
  [38, 59.00, 67.19],
  [39, 60.42, 66.77],
  // Csongrád-Csanád (maz=06, oevk_id 40-43)
  [40, 49.51, 69.64],
  [41, 45.29, 71.19],
  [42, 54.74, 68.28],
  [43, 51.77, 72.77],
  // Fejér (maz=07, oevk_id 44-48)
  [44, 47.43, 76.44],
  [45, 56.01, 73.02],
  [46, 57.34, 74.86],
  [47, 46.17, 68.47],
  [48, 64.55, 64.41],
  // Győr-Moson-Sopron (maz=08, oevk_id 49-53)
  [49, 50.44, 72.75],
  [50, 60.13, 72.96],
  [51, 71.22, 74.82],
  [52, 57.35, 75.88],
  [53, 59.23, 72.21],
  // Hajdú-Bihar (maz=09, oevk_id 54-59)
  [54, 48.95, 72.87],
  [55, 55.61, 68.68],
  [56, 63.51, 63.87],
  [57, 61.66, 61.81],
  [58, 60.61, 64.82],
  [59, 58.19, 65.15],
  // Heves (maz=10, oevk_id 60-62)
  [60, 52.19, 70.93],
  [61, 54.91, 69.32],
  [62, 59.06, 66.65],
  // Jász-Nagykun-Szolnok (maz=11, oevk_id 63-66)
  [63, 46.91, 69.83],
  [64, 59.81, 67.39],
  [65, 64.14, 63.13],
  [66, 51.50, 63.24],
  // Komárom-Esztergom (maz=12, oevk_id 67-69)
  [67, 48.18, 70.01],
  [68, 49.96, 68.93],
  [69, 55.10, 69.09],
  // Nógrád (maz=13, oevk_id 70-71)
  [70, 53.85, 65.34],
  [71, 60.08, 68.41],
  // Pest (maz=14, oevk_id 72-83)
  [72, 45.38, 75.69],
  [73, 46.77, 79.76],
  [74, 51.94, 77.75],
  [75, 55.46, 74.73],
  [76, 46.30, 76.88],
  [77, 49.05, 75.27],
  [78, 49.22, 71.76],
  [79, 45.55, 71.28],
  [80, 60.22, 64.98],
  [81, 59.71, 66.45],
  [82, 56.81, 71.05],
  [83, 59.11, 65.31],
  // Somogy (maz=15, oevk_id 84-87)
  [84, 47.63, 69.84],
  [85, 57.86, 63.89],
  [86, 57.92, 68.01],
  [87, 59.94, 70.59],
  // Szabolcs-Szatmár-Bereg (maz=16, oevk_id 88-93)
  [88, 44.92, 71.11],
  [89, 58.13, 64.38],
  [90, 65.31, 64.19],
  [91, 68.71, 64.27],
  [92, 64.79, 63.72],
  [93, 65.69, 64.77],
  // Tolna (maz=17, oevk_id 94-96)
  [94, 55.51, 69.67],
  [95, 62.44, 67.58],
  [96, 62.98, 68.98],
  // Vas (maz=18, oevk_id 97-99)
  [97, 49.95, 76.41],
  [98, 64.38, 74.40],
  [99, 66.40, 73.65],
  // Veszprém (maz=19, oevk_id 100-103)
  [100, 50.48, 74.51],
  [101, 50.99, 72.11],
  [102, 50.70, 70.00],
  [103, 62.70, 70.40],
  // Zala (maz=20, oevk_id 104-106)
  [104, 56.80, 74.42],
  [105, 59.84, 70.53],
  [106, 52.98, 69.62],
]

// Build lookup: oevk_id → { winner_pct, turnout_pct }
const lookup = {}
for (const [id, winnerPct, turnoutPct] of nviData) {
  lookup[id] = { winner_pct: winnerPct, turnout_pct: turnoutPct }
}

// Read current oevk_results.json
const oevkResults = JSON.parse(fs.readFileSync(`${BASE}/public/oevk_results.json`, 'utf8'))

// Enrich each record
const enriched = oevkResults.map(o => {
  const d = lookup[o.oevk_id]
  if (!d) {
    console.warn(`WARN: no data for oevk_id ${o.oevk_id}`)
    return o
  }
  const turnout_votes = Math.round(o.winner_votes / (d.winner_pct / 100))
  const eligible_voters = Math.round(turnout_votes / (d.turnout_pct / 100))
  const non_voters = eligible_voters - turnout_votes
  return { ...o, eligible_voters, turnout_votes, non_voters }
})

fs.writeFileSync(`${BASE}/public/oevk_results.json`, JSON.stringify(enriched, null, 2))
console.log(`Enriched ${enriched.length} OEVKs`)

// Sanity check: print a few samples
const samples = [1, 14, 33, 72, 88]
for (const id of samples) {
  const o = enriched.find(x => x.oevk_id === id)
  if (o) console.log(`#${o.oevk_id} ${o.oevk_name}: eligible=${o.eligible_voters.toLocaleString('hu-HU')} turnout=${o.turnout_votes.toLocaleString('hu-HU')} non_voters=${o.non_voters.toLocaleString('hu-HU')} (${((o.non_voters/o.eligible_voters)*100).toFixed(1)}% maradt otthon)`)
}
