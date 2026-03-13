/**
 * create-parties-json.mjs
 *
 * Létrehozza a public/oevk_parties.json fájlt az NVI 2022-ről összegyűjtött
 * összes pártadattal, majd megtisztítja az oevk_results.json-t.
 *
 * Adatforrás: vtr.valasztas.hu/ogy2022 – eredmenyek.html + reszvetel.html
 */

import fs from 'fs'

const BASE = 'c:/Users/schmi/Documents/Projects/szavazatsuly'

const FIDESZ   = 'Fidesz–KDNP'
const ELLENZEK = 'Ellenzéki összefogás'

// oevk_id-k ahol az ellenzéki összefogás nyert (a többi Fidesz–KDNP)
const ellenzekiWins = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, // Budapest
  19,  // Baranya 01
  40,  // Csongrád-Csanád 01
])

// [oevk_id, winner_name, winner_pct, turnout_pct]
// Forrás: NVI vtr.valasztas.hu – eredmenyek.html + reszvetel.html (19:00)
const nviData = [
  // Budapest (maz=01)
  [1,  'Csárdi Antal',              48.47, 75.96],
  [2,  'Orosz Anna',                51.94, 81.09],
  [3,  'Hajnal Miklós',             48.42, 82.06],
  [4,  'Tordai Bence',              51.89, 81.95],
  [5,  'Dr. Oláh Lajos',            51.39, 68.72],
  [6,  'Jámbor András',             48.31, 65.67],
  [7,  'Hiszékeny Dezső',           60.53, 74.24],
  [8,  'Dr. Hadházy Ákos',          54.09, 75.35],
  [9,  'Arató Gergely',             45.97, 70.25],
  [10, 'Szabó Tímea',               48.82, 77.28],
  [11, 'Varju László',              50.82, 75.20],
  [12, 'Barkóczi Balázs',           45.11, 72.96],
  [13, 'Vajda Zoltán',              45.46, 81.00],
  [14, 'Dunai Mónika',              44.66, 76.47],
  [15, 'Kunhalmi Ágnes',            44.60, 75.25],
  [16, 'Dr. Hiller István',         46.35, 71.73],
  [17, 'Dr. Szabó Szabolcs',        46.49, 72.00],
  [18, 'Tóth Endre',                48.47, 78.40],
  // Baranya (maz=02)
  [19, 'Dr. Mellár Tamás',          44.01, 70.27],
  [20, 'Dr. Hoppál Péter',          44.41, 68.31],
  [21, 'Dr. Hargitai János',        60.44, 66.97],
  [22, 'Nagy Csaba',                61.08, 64.60],
  // Bács-Kiskun (maz=03)
  [23, 'Dr. Salacz László',         59.02, 68.11],
  [24, 'Dr. Szeberényi Gyula Tamás',53.00, 70.85],
  [25, 'Font Sándor',               59.70, 69.18],
  [26, 'Lezsák Sándor',             62.97, 67.08],
  [27, 'Bányai Gábor',              60.16, 63.66],
  [28, 'Zsigy Róbert',              57.26, 65.71],
  // Békés (maz=04)
  [29, 'Herczeg Tamás',             48.27, 70.42],
  [30, 'Dankó Béla',                57.71, 65.38],
  [31, 'Dr. Kovács József',         55.76, 66.13],
  [32, 'Erdős Norbert',             49.82, 63.95],
  // Borsod-Abaúj-Zemplén (maz=05)
  [33, 'Csábár Katalin',            46.50, 68.93],
  [34, 'Dr. Kiss János',            43.85, 66.67],
  [35, 'Riz Gábor',                 58.93, 58.06],
  [36, 'Demeter Zoltán',            54.39, 62.06],
  [37, 'Dr. Hárcsik Richárd',       60.60, 62.72],
  [38, 'Dr. Koncz Zséfia',          59.00, 67.19],
  [39, 'Túllai András',             60.42, 66.77],
  // Csongrád-Csanád (maz=06)
  [40, 'Szabó Sándor',              49.51, 69.64],
  [41, 'Mihálffi Béla',             45.29, 71.19],
  [42, 'Farkas Sándor',             54.74, 68.28],
  [43, 'Lázár János',               51.77, 72.77],
  // Fejér (maz=07)
  [44, 'Vargha Tamás',              47.43, 76.44],
  [45, 'Tóró Gábor',                56.01, 73.02],
  [46, 'Tessely Zoltán',            57.34, 74.86],
  [47, 'Dr. Mészáros Lajos',        46.17, 68.47],
  [48, 'Varga Gábor',               64.55, 64.41],
  // Győr-Moson-Sopron (maz=08)
  [49, 'Simon Róbert Balázs',       50.44, 72.75],
  [50, 'Kara Ákos',                 60.13, 72.96],
  [51, 'Gyopáros Alpár',            71.22, 74.82],
  [52, 'Barcza Attila',             57.35, 75.88],
  [53, 'Dr. Nagy István',           59.23, 72.21],
  // Hajdú-Bihar (maz=09)
  [54, 'Kósa Lajos',                48.95, 72.87],
  [55, 'Dr. Pásan László',          55.61, 68.68],
  [56, 'Tasó László',               63.51, 63.87],
  [57, 'Dr. Vitányi István',        61.66, 61.81],
  [58, 'Bodó Sándor',               60.61, 64.82],
  [59, 'Dr. Tiba István',           58.19, 65.15],
  // Heves (maz=10)
  [60, 'Dr. Pajtók Gábor',          52.19, 70.93],
  [61, 'Horváth László',            54.91, 69.32],
  [62, 'Szabó Zsolt',               59.06, 66.65],
  // Jász-Nagykun-Szolnok (maz=11)
  [63, 'Dr. Kállay Mária',          46.91, 69.83],
  [64, 'Pécs János',                59.81, 67.39],
  [65, 'F. Kovács Sándor',          64.14, 63.13],
  [66, 'Herczeg Zsolt',             51.50, 63.24],
  // Komárom-Esztergom (maz=12)
  [67, 'Bencsik János',             48.18, 70.01],
  [68, 'Erős Gábor',                49.96, 68.93],
  [69, 'Czunyiné Dr. Bertalan Judit',55.10, 69.09],
  // Nógrád (maz=13)
  [70, 'Becsa Zsolt',               53.85, 65.34],
  [71, 'Balla Mihály',              60.08, 68.41],
  // Pest (maz=14)
  [72, 'Dr. Aradszki András',       45.38, 75.69],
  [73, 'Menczer Tamás',             46.77, 79.76],
  [74, 'Dr. Vitályos Eszter',       51.94, 77.75],
  [75, 'Rátvári Bence',             55.46, 74.73],
  [76, 'Tuzson Bence',              46.30, 76.88],
  [77, 'Vácsey László',             49.05, 75.27],
  [78, 'Dr. Szávay István',         49.22, 71.76],
  [79, 'Béna Zoltán',               45.55, 71.28],
  [80, 'Czerván György',            60.22, 64.98],
  [81, 'Pogácsás Tibor',            59.71, 66.45],
  [82, 'Pánczál Károly',            56.81, 71.05],
  [83, 'Féldi László',              59.11, 65.31],
  // Somogy (maz=15)
  [84, 'Gelencsér Attila',          47.63, 69.84],
  [85, 'Szászfalvi László',         57.86, 63.89],
  [86, 'Máring József Attila',      57.92, 68.01],
  [87, 'Witzmann Mihály',           59.94, 70.59],
  // Szabolcs-Szatmár-Bereg (maz=16)
  [88, 'Dr. Szabó Tünde',           44.92, 71.11],
  [89, 'Dr. Vinnai Győző',          58.13, 64.38],
  [90, 'Dr. Szesztók Miklós',       65.31, 64.19],
  [91, 'Dr. Tilki Attila',          68.71, 64.27],
  [92, 'Kovács Sándor',             64.79, 63.72],
  [93, 'Dr. Simon Miklós',          65.69, 64.77],
  // Tolna (maz=17)
  [94, 'Horváth István',            55.51, 69.67],
  [95, 'Potápi Árpád János',        62.44, 67.58],
  [96, 'Sáli János',                62.98, 68.98],
  // Vas (maz=18)
  [97, 'Dr. Hende Csaba',           49.95, 76.41],
  [98, 'Ágh Péter',                 64.38, 74.40],
  [99, 'V. Németh Zsolt',           66.40, 73.65],
  // Veszprém (maz=19)
  [100,'Ovádi Péter',               50.48, 74.51],
  [101,'Kontrát Károly',            50.99, 72.11],
  [102,'Dr. Navracsics Tibor',      50.70, 70.00],
  [103,'Dr. Kovács Zoltán',         62.70, 70.40],
  // Zala (maz=20)
  [104,'Vigh László',               56.80, 74.42],
  [105,'Nagy Bálint',               59.84, 70.53],
  [106,'Cseresnyés Péter',          52.98, 69.62],
]

// --- 1. oevk_parties.json létrehozása ---
const parties = nviData.map(([id, winner_name, winner_pct, turnout_pct]) => {
  const isEllenzeki = ellenzekiWins.has(id)
  return {
    oevk_id: id,
    winner_party: isEllenzeki ? ELLENZEK : FIDESZ,
    second_party: isEllenzeki ? FIDESZ : ELLENZEK,
    winner_name,
    winner_pct,
    turnout_pct,
  }
})

fs.writeFileSync(`${BASE}/public/oevk_parties.json`, JSON.stringify(parties, null, 2))
console.log(`Created oevk_parties.json (${parties.length} rekord)`)

// --- 2. oevk_results.json megtisztítása (winner_party, second_party eltávolítása) ---
const oevkResults = JSON.parse(fs.readFileSync(`${BASE}/public/oevk_results.json`, 'utf8'))
const cleaned = oevkResults.map(({ winner_party, second_party, ...rest }) => rest)
fs.writeFileSync(`${BASE}/public/oevk_results.json`, JSON.stringify(cleaned, null, 2))
console.log(`Cleaned oevk_results.json (winner_party, second_party eltávolítva)`)

// --- Ellenőrzés ---
console.log('\nSample parties[0]:', JSON.stringify(parties[0], null, 2))
console.log('Sample results[0] keys:', Object.keys(cleaned[0]).join(', '))
