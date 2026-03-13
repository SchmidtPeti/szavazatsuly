import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent } from '@/components/ui/card'
import { Users2, Link2, Target } from 'lucide-react'

export default function MobilizSlider({ oevk, onValueChange }) {
  const [count, setCount] = useState(3)

  function handleChange([val]) {
    setCount(val)
    onValueChange(val)
  }

  const margin = oevk.margin

  // Lánc hatás: te hozol count-ot, ők is hoznak count-ot
  const chainRound2 = count * count
  const chainPct = Math.min(100, Math.round((chainRound2 / margin) * 100))
  const chainColor = chainPct >= 100
    ? 'text-green-600'
    : chainPct >= 80
    ? 'text-yellow-500'
    : chainPct >= 50
    ? 'text-orange-500'
    : 'text-red-500'

  // Hány ilyen ember kellene a különbség behozásához?
  const needCount = Math.ceil(margin / count)

  // Kanapén maradók: minden hányadiknak kell elmenni a váltáshoz
  const nonVoters = oevk.non_voters
  const everyN = nonVoters ? Math.floor(nonVoters / margin) : null

  // Szorzódó hatás: hány kör kell, ha mindenki toboroz
  const compoundRounds = (() => {
    if (count <= 1) return null
    const rounds = []
    let total = 0
    let power = 1
    while (total < margin && rounds.length < 10) {
      power *= count
      total += power
      rounds.push({ n: rounds.length + 1, added: power, total })
      if (total >= margin) break
    }
    return total >= margin ? rounds : null
  })()

  const impact = count <= 2
    ? 'Már ez is számít — indulj el ebből!'
    : count <= 5
    ? 'Egy kis csoport — ez már érezhető!'
    : count <= 8
    ? 'Komolyabb mozgás indul el tőled!'
    : '🚀 Egy egész közösséget mozgatsz meg!'

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-center">Hány embert viszél szavazni?</h3>
      <p className="text-muted-foreground text-sm text-center">
        Húzd el a csúszkát — hány embert tudnál rávenni?
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
            max={30}
            step={1}
            value={[count]}
            onValueChange={handleChange}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 fő</span>
            <span>30 fő</span>
          </div>

          {/* 3 metrika */}
          <div className="space-y-3">

            {/* A) Kollektív cél */}
            <Card className="bg-muted/50 border-0">
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <Target className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <p className="text-sm">
                  Ha te hozol <strong className="text-foreground">{count} embert</strong>, és ugyanezt
                  teszi <strong className="text-foreground">{needCount.toLocaleString('hu-HU')} ember</strong> — a körzet behozható.
                </p>
              </CardContent>
            </Card>

            {/* B) Csendes tömeg matekja – érdekesség */}
            {nonVoters && everyN && everyN >= 2 && (
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="py-3 px-4">
                  <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-2">⏰ AZ OTTHON MARADÓK DÖNTHETNEK</p>
                  <p className="text-sm leading-relaxed text-orange-900">
                    Legutóbb <strong>{nonVoters.toLocaleString('hu-HU')} ember</strong> nem ment el szavazni ebben a körzetben.
                    A körzetváltáshoz minden <strong>{everyN}. otthon maradónak</strong> kellene elmennie.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* C) Lánc hatás */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-3 px-4">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">Lánc hatás</span>
                </div>
                {compoundRounds ? (() => {
                  const total = compoundRounds[compoundRounds.length - 1].total
                  const rounds = compoundRounds.length
                  return (
                    <p className="text-sm leading-relaxed">
                      Te hozol <strong>{count} embert</strong>.
                      {' '}Ha ők is hoznak <strong>{count} embert</strong>
                      {rounds >= 2 && <>, és az ő embereik is hoznak <strong>{count} embert</strong></>}
                      {rounds >= 3 && Array.from({ length: rounds - 2 }).map((_, i) => (
                        <span key={i}>, és azok is hoznak <strong>{count} embert</strong></span>
                      ))}
                      {' '}→ azaz{' '}
                      <strong className="text-primary">{rounds} kör után</strong>{' '}
                      <strong className={`tabular-nums transition-colors duration-300 ${chainColor}`}>
                        {total.toLocaleString('hu-HU')} szavazat
                      </strong>
                      , ami szintén elég a különbséghez. 🔗
                    </p>
                  )
                })() : (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Hozz legalább 2 embert a lánc hatáshoz!
                  </p>
                )}
              </CardContent>
            </Card>

          </div>

          <p className="text-sm font-medium text-center">{impact}</p>
        </CardContent>
      </Card>
    </div>
  )
}
