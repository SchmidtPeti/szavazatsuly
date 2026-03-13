import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const oevkResults = JSON.parse(
  readFileSync(resolve(__dirname, '../../public/oevk_results.json'), 'utf8')
)

// --- Adatvalidáció ---

describe('oevk_results.json adatintegritás', () => {
  it('pontosan 106 OEVK rekord van', () => {
    expect(oevkResults).toHaveLength(106)
  })

  it('minden OEVK-nak van winner_party és second_party', () => {
    oevkResults.forEach(o => {
      expect(o.winner_party, `${o.oevk_name} winner_party hiányzik`).toBeTruthy()
      expect(o.second_party, `${o.oevk_name} second_party hiányzik`).toBeTruthy()
    })
  })

  it('minden OEVK-nak van winner_name', () => {
    oevkResults.forEach(o => {
      expect(o.winner_name, `${o.oevk_name} winner_name hiányzik`).toBeTruthy()
    })
  })

  it('margin = winner_votes - second_votes minden OEVK-ban', () => {
    oevkResults.forEach(o => {
      expect(o.margin, `${o.oevk_name} margin nem egyezik`).toBe(o.winner_votes - o.second_votes)
    })
  })

  it('non_voters = eligible_voters - turnout_votes', () => {
    oevkResults.forEach(o => {
      expect(o.non_voters, `${o.oevk_name} non_voters nem egyezik`).toBe(o.eligible_voters - o.turnout_votes)
    })
  })

  it('winner_pct és turnout_pct 0-100 között van', () => {
    oevkResults.forEach(o => {
      expect(o.winner_pct).toBeGreaterThan(0)
      expect(o.winner_pct).toBeLessThan(100)
      expect(o.turnout_pct).toBeGreaterThan(0)
      expect(o.turnout_pct).toBeLessThan(100)
    })
  })
})

// --- Ismert eredmények spot-check ---

describe('Ismert 2022-es eredmények ellenőrzése', () => {
  it('Budapest 01. OEVK – Ellenzéki összefogás nyert (Csárdi Antal)', () => {
    const o = oevkResults.find(x => x.oevk_id === 1)
    expect(o.winner_party).toBe('Ellenzéki összefogás')
    expect(o.winner_name).toBe('Csárdi Antal')
    expect(o.margin).toBe(2634)
  })

  it('Budapest 14. OEVK – Fidesz–KDNP nyert (Dunai Mónika)', () => {
    const o = oevkResults.find(x => x.oevk_id === 14)
    expect(o.winner_party).toBe('Fidesz–KDNP')
    expect(o.winner_name).toBe('Dunai Mónika')
  })

  it('Baranya 01. OEVK – Ellenzéki összefogás nyert (Dr. Mellár Tamás)', () => {
    const o = oevkResults.find(x => x.oevk_id === 19)
    expect(o.winner_party).toBe('Ellenzéki összefogás')
    expect(o.winner_name).toBe('Dr. Mellár Tamás')
  })
})

// --- Összefoglaló kimutatás ---

describe('Választási eredmény összefoglaló', () => {
  it('minden OEVK eredménye (melyik párt nyert, mennyivel)', () => {
    const HU = n => n.toLocaleString('hu-HU')

    console.log('\n═══════════════════════════════════════════════════════')
    console.log('  2022-es OEVK eredmények – Melyik párt nyert, mennyivel')
    console.log('═══════════════════════════════════════════════════════\n')

    oevkResults.forEach(o => {
      const pct = ((o.margin / o.winner_votes) * 100).toFixed(1)
      console.log(
        `${o.oevk_name.padEnd(30)} │ ${o.winner_party.padEnd(25)} │ ${o.winner_name.padEnd(30)} │ +${HU(o.margin).padStart(6)} szav. (${pct}%)`
      )
    })

    const fideszCount = oevkResults.filter(o => o.winner_party === 'Fidesz–KDNP').length
    const ellenzekCount = oevkResults.filter(o => o.winner_party === 'Ellenzéki összefogás').length

    const legszukebb = [...oevkResults].sort((a, b) => a.margin - b.margin)[0]
    const legtágabb = [...oevkResults].sort((a, b) => b.margin - a.margin)[0]

    console.log('\n─────────────────────────────────────────────────────')
    console.log(`  Fidesz–KDNP győzelem:        ${fideszCount} körzet`)
    console.log(`  Ellenzéki összefogás győzelem: ${ellenzekCount} körzet`)
    console.log(`  Legszűkebb győzelem: ${legszukebb.oevk_name} – ${HU(legszukebb.margin)} szav. (${legszukebb.winner_party})`)
    console.log(`  Legtágabb győzelem:  ${legtágabb.oevk_name} – ${HU(legtágabb.margin)} szav. (${legtágabb.winner_party})`)
    console.log('─────────────────────────────────────────────────────\n')

    expect(fideszCount + ellenzekCount).toBe(106)
  })
})
