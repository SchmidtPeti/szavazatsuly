import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent } from '@/components/ui/card'
import { Users2, Link2, Target } from 'lucide-react'

const MANDATE_THRESHOLD = 55000

export default function MobilizSlider({ oevk, onValueChange }) {
  const [count, setCount] = useState(3)

  function handleChange([val]) {
    setCount(val)
    onValueChange(val)
  }

  const margin = oevk.margin

  // Lánc hatás: te hozol count-ot, ők is hoznak count-ot
  const chainRound2 = count * count

  // Hány ilyen ember kellene a különbség behozásához?
  const needCount = Math.ceil(margin / count)

  // Card 2: hány mobilizáló kell 1 mandátumhoz
  const mobilizersNeeded = Math.ceil(MANDATE_THRESHOLD / count)

  // Card 1: "csendes tömeg" – csak ha van adat
  const nonVoters = oevk.non_voters
  const tenPct = nonVoters ? Math.round(nonVoters * 0.1) : null
  const ratio = tenPct ? (tenPct / margin).toFixed(1) : null

  const impact = count <= 2
    ? 'Már ez is számít — indulj el ebből!'
    : count <= 5
    ? 'Egy baráti kör — ez már érezhető!'
    : count <= 8
    ? 'Komolyabb mozgás indul el tőled!'
    : '🚀 Egy egész közösséget mozgatsz meg!'

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-center">Hány embert viszél szavazni?</h3>
      <p className="text-muted-foreground text-sm text-center">
        Húzd el a csúszkát — hány barátodat tudnád rávenni?
      </p>

      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Fő szám */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Users2 className="w-5 h-5 text-primary" />
              <span className="text-5xl font-black text-primary tabular-nums">{count}</span>
              <span className="text-xl font-medium">ember</span>
            </div>
            <p className="text-xs text-muted-foreground">(magadat is beleszámítva)</p>
          </div>

          <Slider
            min={1}
            max={20}
            step={1}
            value={[count]}
            onValueChange={handleChange}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 fő</span>
            <span>20 fő</span>
          </div>

          {/* 3 metrika */}
          <div className="space-y-3">

            {/* A) Lánc hatás */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">Lánc hatás</span>
                </div>
                <p className="text-sm leading-relaxed">
                  Te hozol <strong>{count} barátot</strong>. Ha ők is hoznak
                  {' '}<strong>{count}-{count}et</strong> — az összesen{' '}
                  <strong className="text-primary text-base">{chainRound2.toLocaleString('hu-HU')} új szavazat</strong>! 🔗
                </p>
              </CardContent>
            </Card>

            {/* B) Kollektív cél */}
            <Card className="bg-muted/50 border-0">
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <Target className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <p className="text-sm">
                  Ha <strong className="text-foreground">{needCount.toLocaleString('hu-HU')} ember</strong> teszi
                  ugyanezt, a körzeti különbség behozható.
                </p>
              </CardContent>
            </Card>

            {/* C) Csendes tömeg matekja */}
            {tenPct && ratio && (
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="py-3 px-4">
                  <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-2">⏰ A kanapén maradók dönthetnek</p>
                  <p className="text-sm leading-relaxed text-orange-900">
                    Legutóbb <strong>{nonVoters.toLocaleString('hu-HU')} ember</strong> nem ment el szavazni ebben a körzetben.
                    Ha csak minden tizedikük elmegy → <strong>{tenPct.toLocaleString('hu-HU')} új voks</strong>.
                    Ez <strong>{ratio}×-a</strong> a legutóbbi {margin.toLocaleString('hu-HU')} szavazatos különbségnek!
                  </p>
                </CardContent>
              </Card>
            )}

            {/* D) Országos mentőöv */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-3 px-4">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">⚖️ Mi van, ha nem szoros a körzeted?</p>
                <p className="text-sm leading-relaxed text-blue-900">
                  ~55 000 töredékszavazat = 1 új parlamenti képviselő.
                  Ha <strong>{mobilizersNeeded.toLocaleString('hu-HU')} ember</strong> teszi ugyanezt, amit te ({count} főt hoz),
                  azzal összesen <strong>1 teljesen új képviselő</strong> kerül be a Parlamentbe!
                  Nincs elveszett szavazat.
                </p>
              </CardContent>
            </Card>

          </div>

          <p className="text-sm font-medium text-center">{impact}</p>
        </CardContent>
      </Card>
    </div>
  )
}
