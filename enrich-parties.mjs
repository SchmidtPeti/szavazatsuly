/**
 * enrich-parties.mjs
 *
 * Hozzáadja a winner_party és second_party mezőket az oevk_results.json-hoz.
 * Forrás: NVI 2022 vtr.valasztas.hu eredmenyek.html
 *
 * 2022-ben minden OEVK bináris verseny volt:
 *   Fidesz–KDNP  vs.  Ellenzéki összefogás (DK-JOBBIK-MOMENTUM-MSZP-LMP-PÁRBESZÉD)
 */

import fs from 'fs'

const BASE = 'c:/Users/schmi/Documents/Projects/szavazatsuly'

// Az ellenzéki összefogás által nyert oevk_id-k (NVI 2022 eredmenyek.html alapján)
// Budapest 01-13, 15-18 + Baranya 01 + Csongrád-Csanád 01
const ellenzekiWins = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, // Budapest
  19,  // Baranya 01
  40,  // Csongrád-Csanád 01
])

const FIDESZ = 'Fidesz–KDNP'
const ELLENZEK = 'Ellenzéki összefogás'

const oevkResults = JSON.parse(fs.readFileSync(`${BASE}/public/oevk_results.json`, 'utf8'))

const enriched = oevkResults.map(o => {
  const isEllenzekiWinner = ellenzekiWins.has(o.oevk_id)
  return {
    ...o,
    winner_party: isEllenzekiWinner ? ELLENZEK : FIDESZ,
    second_party: isEllenzekiWinner ? FIDESZ : ELLENZEK,
  }
})

fs.writeFileSync(`${BASE}/public/oevk_results.json`, JSON.stringify(enriched, null, 2))
console.log(`Enriched ${enriched.length} OEVKs with party data`)

// Sanity check
const samples = [1, 14, 19, 40, 72]
for (const id of samples) {
  const o = enriched.find(x => x.oevk_id === id)
  if (o) console.log(`#${o.oevk_id} ${o.oevk_name}: ${o.winner_party} → ${o.second_party}`)
}
