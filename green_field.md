# Greenfield újraindítás

Ha teljesen nulláról szeretnéd újraépíteni a projektet, és csak az adatfájlokat + tesztet viszed át, ez a leírás mutatja meg, mit kell újra elvégezni.

---

## Mit kell átvinni (kötelező fájlok)

```
public/
  oevk_results.json      ← 106 OEVK rekord, 16 mező (lásd data_info.md)
  zip_to_oevk.json       ← ~1500 irányítószám → oevk_id leképezés

src/__tests__/
  oevk-results.test.js   ← Vitest adatintegritás + riport teszt
```

Ezzel a három fájllal az összes adat és validáció megvan.

---

## Mit kell még beállítani az új projektben

### 1. Vitest telepítése

```bash
npm install -D vitest
```

### 2. vite.config.js — test blokk hozzáadása

```js
export default defineConfig({
  // ... meglévő konfig ...
  test: {
    environment: 'node',
  },
})
```

### 3. package.json — test script hozzáadása

```json
"scripts": {
  "test": "vitest run"
}
```

### 4. Teszt futtatása

```bash
npm test
```

Elvárt kimenet: **10/10 teszt zöld** + a 106 OEVK eredmény-táblázat a konzolban.

---

## Ha az adatokat is újra kell generálni (opcionális)

Ha az `oevk_results.json` vagy `zip_to_oevk.json` nem vihető át, és az NVI nyersfájlok elérhetők, a teljes pipeline:

### Szükséges nyersfájlok (NVI 2022, nem részei a repónak)

| Fájl | Tartalom |
|------|----------|
| `SzorosVerseny_raw.json` | OEVK-szintű szavazatszámok (szavazat1, szavazat2, kulonbseg) |
| `Telepulesek_raw.json` | Település–OEVK leképezés (megnev, maz, evk_lst) |
| `postal-codes-raw.json` | Vidéki irányítószámok (zip, city) |
| `budapest-postal.json` | Budapesti irányítószámok (zip, district) |
| `debrecen-postal.json` | Debreceni irányítószámok (opcionális) |
| `gyor-postal.json` | Győri irányítószámok (opcionális) |
| `miskolc-postal.json` | Miskolci irányítószámok (opcionális) |
| `pecs-postal.json` | Pécsi irányítószámok (opcionális) |
| `szeged-postal.json` | Szegedi irányítószámok (opcionális) |

### Pipeline futtatása sorrendben

```bash
# 1. Alap OEVK eredmények + ZIP leképezés generálása
node build-data.mjs

# 2. Részvételi adatok hozzáadása (eligible_voters, turnout_votes, non_voters)
#    NVI-ről begyűjtött winner_pct + turnout_pct adatok alapján számítja vissza
node enrich-turnout.mjs

# 3. Pártadatok hozzáadása (winner_party, second_party, winner_name, winner_pct, turnout_pct)
#    Mindkét script ugyanazt teszi; create-parties-json.mjs a teljesebb, winner_name-mel
node create-parties-json.mjs   # létrehoz oevk_parties.json-t
node merge-parties-back.mjs    # visszaolvasztja az oevk_results.json-ba, törli a külön fájlt
```

### Alternatíva: csak enrich-parties.mjs

Ha a create + merge workflow nem kell:

```bash
node build-data.mjs
node enrich-turnout.mjs
node enrich-parties.mjs   # winner_party + second_party, de nincs winner_name/winner_pct/turnout_pct
```

Ebben az esetben a `winner_name`, `winner_pct`, `turnout_pct` mezők hiányoznak — a teszt 3 tesztje hibázni fog.

---

## Az adatok mögötti logika röviden

### eligible_voters és non_voters számítása

Az NVI nem közöl per-OEVK abszolút névjegyzékszámot könnyen letölthető formában. Ezért visszaszámolással:

```
turnout_votes  = round(winner_votes / (winner_pct / 100))
eligible_voters = round(turnout_votes / (turnout_pct / 100))
non_voters     = eligible_voters - turnout_votes
```

Forrás: NVI `reszvetel.html` (19:00-ás részvételi %) + `eredmenyek.html` (győztes %).

### Pártok meghatározása

A 2022-es választáson minden OEVK-ban bináris verseny volt (Fidesz–KDNP vs Ellenzéki összefogás). Az ellenzéki győzelmek hardkódolt listája (oevk_id alapján):

```js
// Budapest 01-13, 15-18 + Baranya 01 (id=19) + Csongrád-Csanád 01 (id=40)
const ellenzekiWins = new Set([1,2,3,4,5,6,7,8,9,10,11,12,13,15,16,17,18,19,40])
```
