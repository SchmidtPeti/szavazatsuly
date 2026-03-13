import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Share2, Copy, Check } from 'lucide-react'

export default function ShareCard({ oevk, mobilizCount }) {
  const [copied, setCopied] = useState(false)

  const chainRound2 = mobilizCount * mobilizCount
  const text = `Elviszek ${mobilizCount} embert szavazni április 6-án. Ha ők is ugyanennyit hoznak, az már ${chainRound2} szavazat — ilyen a lánc. 🔗\n\nA körzetemben (${oevk.oevk_name}) 2022-ben ${oevk.margin.toLocaleString('hu-HU')} szavazat volt a különbség. Te hányat hozol?\n\nTeszteld a körzetedet: https://szavazatsuly.hu`

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SzavazatSúly – Az én szavazatom dönthet',
          text,
        })
      } catch {
        // user cancelled
      }
    } else {
      handleCopy()
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-center">Tedd meg a vállalást!</h3>

      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="pt-5 pb-4 space-y-3">
          <div className="text-center space-y-1">
            <div className="text-3xl font-black text-primary">
              {mobilizCount} ember
            </div>
            <div className="text-sm text-muted-foreground">
              vállalom, hogy elviszem szavazni
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center italic px-4">
            "{oevk.oevk_name}: csak {oevk.margin.toLocaleString('hu-HU')} szavazat volt a különbség."
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Button onClick={handleShare} className="w-full h-12 gap-2" size="lg">
          <Share2 className="w-5 h-5" />
          Megosztom a vállalást
        </Button>
        <Button
          onClick={handleCopy}
          variant="outline"
          className="w-full h-11 gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Másolva!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Szöveg másolása
            </>
          )}
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Nem tárolunk semmilyen személyes adatot. 🔒
      </p>
    </div>
  )
}
