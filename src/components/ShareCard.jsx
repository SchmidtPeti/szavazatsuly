import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Button } from '@/components/ui/button'
import { Download, Share2, Loader2 } from 'lucide-react'

export default function ShareCard({ oevk, mobilizCount }) {
  const cardRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const margin = oevk.margin
  const needCount = Math.ceil(margin / mobilizCount)
  const nonVoters = oevk.non_voters
  const everyN = nonVoters ? Math.floor(nonVoters / margin) : null

  async function generatePng() {
    setLoading(true)
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 })
    setLoading(false)
    return dataUrl
  }

  async function handleDownload() {
    const dataUrl = await generatePng()
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'szavazatom-dont.png'
    a.click()
  }

  async function handleShare() {
    const dataUrl = await generatePng()
    const blob = await (await fetch(dataUrl)).blob()
    const file = new File([blob], 'szavazatom-dont.png', { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'A szavazatom dönthet.' })
      } catch {
        // user cancelled
      }
    } else {
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'szavazatom-dont.png'
      a.click()
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-center">A te vállalásod</h3>

      {/* Shareable card – captured as PNG */}
      <div
        ref={cardRef}
        style={{
          width: 360,
          height: 360,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          borderRadius: 16,
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#ffffff',
          boxSizing: 'border-box',
        }}
      >
        {/* Top */}
        <div>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4 }}>
            A szavazatom dönthet.
          </div>
          <div style={{ fontSize: 13, color: '#cbd5e1' }}>
            {oevk.oevk_name}
          </div>
        </div>

        {/* Main commitment */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: '14px 18px',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>Én vállalom:</div>
          <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1, color: '#60a5fa' }}>
            {mobilizCount}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', marginTop: 4 }}>
            embert viszek szavazni
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 }}>
            <span style={{ color: '#94a3b8' }}>2022-es különbség: </span>
            <strong style={{ color: '#f1f5f9' }}>{margin.toLocaleString('hu-HU')} szavazat</strong>
          </div>
          <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 }}>
            Ha <strong style={{ color: '#34d399' }}>{needCount.toLocaleString('hu-HU')} ember</strong> teszi ugyanezt
            {' '}→ <strong style={{ color: '#34d399' }}>a körzet behozható 🎯</strong>
          </div>
          {everyN && everyN >= 2 && (
            <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 }}>
              Legutóbb <strong style={{ color: '#fb923c' }}>{nonVoters.toLocaleString('hu-HU')} ember</strong> maradt otthon
              {' '}→ minden <strong style={{ color: '#fb923c' }}>{everyN}. otthon maradónak</strong> kellene elmennie ⏰
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ fontSize: 11, color: '#475569', textAlign: 'right' }}>
          szavazatsuly.hu
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        <Button
          onClick={handleShare}
          className="w-full h-12 gap-2"
          size="lg"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Share2 className="w-5 h-5" />}
          Megosztom
        </Button>
        <Button
          onClick={handleDownload}
          variant="outline"
          className="w-full h-11 gap-2"
          disabled={loading}
        >
          <Download className="w-4 h-4" />
          Mentés képként
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Nem tárolunk semmilyen személyes adatot. 🔒
      </p>
    </div>
  )
}
