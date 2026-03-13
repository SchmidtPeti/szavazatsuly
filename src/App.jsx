import { useState } from 'react'
import { lookupByZip } from '@/utils/lookup'
import ZipInput from '@/components/ZipInput'
import ResultCard from '@/components/ResultCard'
import MobilizSlider from '@/components/MobilizSlider'
import ShareCard from '@/components/ShareCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function App() {
  const [step, setStep] = useState('input') // 'input' | 'result' | 'slider' | 'share'
  const [oevk, setOevk] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mobilizCount, setMobilizCount] = useState(3)

  async function handleSearch(zip) {
    setLoading(true)
    setError(null)
    try {
      const result = await lookupByZip(zip)
      if (!result) {
        setError('Nem találtuk meg ezt az irányítószámot. Próbálj egy másikat!')
        setLoading(false)
        return
      }
      setOevk(result)
      setStep('result')
    } catch (e) {
      setError('Hiba történt az adatok betöltésekor. Kérjük, próbáld újra!')
    }
    setLoading(false)
  }

  function handleReset() {
    setStep('input')
    setOevk(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-sm px-4 pb-8 pt-4">

        {/* Back button */}
        {step !== 'input' && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-muted-foreground text-sm mb-4 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Vissza
          </button>
        )}

        {/* Step 1: ZIP Input */}
        {step === 'input' && (
          <div>
            <ZipInput onSearch={handleSearch} loading={loading} />
            {error && (
              <p className="text-center text-sm text-red-500 mt-2">{error}</p>
            )}
          </div>
        )}

        {/* Step 2: Result */}
        {step === 'result' && oevk && (
          <div className="space-y-6">
            <ResultCard oevk={oevk} />
            <Button
              onClick={() => setStep('slider')}
              className="w-full h-12"
              size="lg"
            >
              Mit tehetek én? →
            </Button>
          </div>
        )}

        {/* Step 3: Slider */}
        {step === 'slider' && oevk && (
          <div className="space-y-6">
            <MobilizSlider
              oevk={oevk}
              onValueChange={setMobilizCount}
            />
            <Button
              onClick={() => setStep('share')}
              className="w-full h-12"
              size="lg"
            >
              Vállalom! Megmutatom →
            </Button>
          </div>
        )}

        {/* Step 4: Share */}
        {step === 'share' && oevk && (
          <ShareCard oevk={oevk} mobilizCount={mobilizCount} />
        )}

        {/* Footer */}
        {step === 'input' && (
          <p className="text-center text-xs text-muted-foreground mt-8">
            Adatok forrása: Nemzeti Választási Iroda, 2022 • Nyílt forráskód
          </p>
        )}
      </div>
    </div>
  )
}
