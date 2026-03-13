/**
 * merge-parties-back.mjs
 * Visszaolvasztja az oevk_parties.json adatait az oevk_results.json-ba,
 * majd törli a külön fájlt.
 */
import fs from 'fs'

const BASE = 'c:/Users/schmi/Documents/Projects/szavazatsuly/public'

const results = JSON.parse(fs.readFileSync(`${BASE}/oevk_results.json`, 'utf8'))
const parties = JSON.parse(fs.readFileSync(`${BASE}/oevk_parties.json`, 'utf8'))

const partiesMap = Object.fromEntries(parties.map(p => [p.oevk_id, p]))

const merged = results.map(o => {
  const { oevk_id: _, ...partyFields } = partiesMap[o.oevk_id] || {}
  return { ...o, ...partyFields }
})

fs.writeFileSync(`${BASE}/oevk_results.json`, JSON.stringify(merged, null, 2))
console.log(`Merged. Fields: ${Object.keys(merged[0]).join(', ')}`)

fs.unlinkSync(`${BASE}/oevk_parties.json`)
console.log('Deleted oevk_parties.json')
