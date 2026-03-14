/**
 * Irányítószám alapján megkeresi az OEVK-t, majd visszaadja az eredményeket.
 */

let zipData = null
let oevkData = null

export async function loadData() {
  if (!zipData) {
    const [zipRes, oevkRes] = await Promise.all([
      fetch('/zip_to_oevk.json'),
      fetch('/oevk_results.json'),
    ])
    zipData = await zipRes.json()
    oevkData = await oevkRes.json()
  }
  return { zipData, oevkData }
}

const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X',
  'XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX',
  'XXI','XXII','XXIII']

function getBudapestAreaName(oevkId, zipMap) {
  const keruletek = [...new Set(
    Object.keys(zipMap)
      .filter(z => zipMap[z] === oevkId && z.startsWith('1') && z.length === 4)
      .map(z => parseInt(z.slice(1, 3)))
      .filter(k => k >= 1 && k <= 23)
  )].sort((a, b) => a - b)

  if (keruletek.length === 0) return null
  return keruletek.map(k => `${ROMAN[k - 1]}. kerület`).join(', ')
}

export async function lookupByZip(zip) {
  const { zipData, oevkData } = await loadData()
  const trimmed = zip.trim()

  const oevkId = zipData[trimmed]
  if (!oevkId) return null

  const oevk = oevkData.find((o) => o.oevk_id === oevkId) || null
  if (!oevk) return null

  if (oevk.county === 'Budapest') {
    const area_name = getBudapestAreaName(oevkId, zipData)
    return { ...oevk, area_name }
  }

  return oevk
}
