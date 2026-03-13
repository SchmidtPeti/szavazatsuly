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

export async function lookupByZip(zip) {
  const { zipData, oevkData } = await loadData()
  const trimmed = zip.trim()

  const oevkId = zipData[trimmed]
  if (!oevkId) return null

  const oevk = oevkData.find((o) => o.oevk_id === oevkId)
  return oevk || null
}
