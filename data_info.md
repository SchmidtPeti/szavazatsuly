# Adatfájlok dokumentációja

## public/oevk_results.json

106 rekord, egy-egy Országgyűlési Egyéni Választókerülethez (OEVK). A 2022-es parlamenti választás eredményei.

### Mezők

| Mező | Típus | Leírás | Példa |
|------|-------|--------|-------|
| `oevk_id` | number | Szekvenciális azonosító 1–106, maz→evk sorrend szerint | `1` |
| `maz` | string | Megye kód (`"01"`–`"20"`) | `"01"` |
| `evk` | string | EVK szám a megyén belül | `"01"` |
| `oevk_name` | string | Megjelenítési név | `"Budapest 01. OEVK"` |
| `county` | string | Megye neve | `"Budapest"` |
| `winner_votes` | number | Győztes jelölt szavazatainak száma | `21778` |
| `second_votes` | number | Második helyezett szavazatainak száma | `19144` |
| `margin` | number | Különbség: `winner_votes − second_votes` | `2634` |
| `eligible_voters` | number | Névjegyzékben lévő szavazópolgárok száma | `59151` |
| `turnout_votes` | number | Ténylegesen szavazók száma | `44931` |
| `non_voters` | number | Otthon maradók: `eligible_voters − turnout_votes` | `14220` |
| `winner_party` | string | Győztes párt neve | `"Ellenzéki összefogás"` |
| `second_party` | string | Második helyezett párt neve | `"Fidesz–KDNP"` |
| `winner_name` | string | Győztes képviselőjelölt neve | `"Csárdi Antal"` |
| `winner_pct` | number | Győztes szavazatarány (%) | `48.47` |
| `turnout_pct` | number | Részvételi arány (%); NVI 19:00-ás végsőérték | `75.96` |

### Invariánsok (a teszt is ellenőrzi)

- `margin === winner_votes - second_votes`
- `non_voters === eligible_voters - turnout_votes`
- `winner_pct` és `turnout_pct` értéke 0–100 között van
- `winner_party` értéke mindig `"Fidesz–KDNP"` vagy `"Ellenzéki összefogás"`

### Pártok

| Párt | Körzetek száma |
|------|---------------|
| Fidesz–KDNP | 87 |
| Ellenzéki összefogás | 19 |

Ellenzéki összefogás (DK-JOBBIK-MOMENTUM-MSZP-LMP-PÁRBESZÉD) győzött: Budapest 01–13, 15–18, Baranya 01, Csongrád-Csanád 01.

### Forrás

NVI (Nemzeti Választási Iroda) 2022-es OGY választás:
- `vtr.valasztas.hu/ogy2022/data/.../eredmenyek.html` — szavazatszámok, győztes %, képviselő nevek
- `vtr.valasztas.hu/ogy2022/data/.../reszvetel.html` — részvételi % OEVK-nként (19:00 végeredmény)

---

## public/zip_to_oevk.json

Egyszerű kulcs-érték objektum: **irányítószám → oevk_id**.

```json
{
  "1011": 1,
  "1012": 1,
  "4029": 54,
  "7621": 19
}
```

- Kulcs: 4 jegyű magyar irányítószám (string)
- Érték: `oevk_id` (1–106)
- ~1500+ irányítószám lefedettsége

### Forrás

Feldolgozva a `build-data.mjs` scripttel az alábbi nyersfájlokból (nem részei a repónak):
- `SzorosVerseny_raw.json` — NVI szoros verseny adatok
- `Telepulesek_raw.json` — település–OEVK leképezés
- `postal-codes-raw.json` — vidéki irányítószámok (város-alapú)
- `budapest-postal.json` — budapesti irányítószámok (kerületi)
- Nagyvárosok: `debrecen-postal.json`, `gyor-postal.json`, `miskolc-postal.json`, `pecs-postal.json`, `szeged-postal.json`

---

## src/__tests__/oevk-results.test.js

Vitest tesztfájl. Futtatás: `npm test`

### Tesztcsoportok

#### 1. Adatintegritás (6 teszt)
- Pontosan 106 rekord van
- Minden OEVK-nak van `winner_party` és `second_party`
- Minden OEVK-nak van `winner_name`
- `margin === winner_votes - second_votes` minden sornál
- `non_voters === eligible_voters - turnout_votes` minden sornál
- `winner_pct` és `turnout_pct` 0–100 között

#### 2. Ismert eredmények spot-check (3 teszt)
- Budapest 01 → Ellenzéki összefogás, Csárdi Antal, margin 2634
- Budapest 14 → Fidesz–KDNP, Dunai Mónika
- Baranya 01 → Ellenzéki összefogás, Dr. Mellár Tamás

#### 3. Összefoglaló riport (1 teszt)
- Kiírja mind a 106 OEVK eredményét: körzet neve, győztes párt, képviselő, különbség
- Statisztika: hány körzetet nyert melyik párt, legszűkebb és legtágabb győzelem
