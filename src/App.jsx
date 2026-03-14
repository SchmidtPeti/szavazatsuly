import { useState } from 'react'
import { lookupByZip } from '@/utils/lookup'
import ZipInput from '@/components/ZipInput'
import ResultCard from '@/components/ResultCard'
import MobilizSlider from '@/components/MobilizSlider'
import ShareCard from '@/components/ShareCard'

export default function App() {
  const [step, setStep] = useState('input')
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
        setError('Nem tal\u00e1ltuk meg ezt az ir\u00e1ny\u00edt\u00f3sz\u00e1mot. Pr\u00f3b\u00e1ld egy m\u00e1sikkal!')
        setLoading(false)
        return
      }
      setOevk(result)
      setStep('result')
    } catch {
      setError('Hiba t\u00f6rt\u00e9nt az adatok bet\u00f6lt\u00e9sekor. K\u00e9rj\u00fck, pr\u00f3b\u00e1ld \u00fajra!')
    }
    setLoading(false)
  }

  function handleReset() {
    setStep('input')
    setOevk(null)
    setError(null)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, rgba(255,249,241,0.3) 0%, rgba(246,239,230,0) 30%), var(--paper)',
        position: 'relative',
      }}
    >
      {step !== 'input' && (
        <button
          onClick={handleReset}
          style={{
            position: 'fixed',
            top: '1.1rem',
            left: '1.1rem',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: 'var(--surface-overlay)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--surface-border)',
            borderRadius: 999,
            padding: '0.5rem 0.9rem',
            cursor: 'pointer',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--warm-gray)',
            boxShadow: '0 10px 30px rgba(89, 53, 24, 0.08)',
            transition: 'color 0.18s ease, border-color 0.18s ease, transform 0.18s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--ink)'
            e.currentTarget.style.borderColor = 'var(--surface-border-strong)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--warm-gray)'
            e.currentTarget.style.borderColor = 'var(--surface-border)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {'\u2190 Vissza'}
        </button>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: step === 'input' ? '100%' : 448 }}>
          {step === 'input' && (
            <ZipInput
              onSearch={handleSearch}
              loading={loading}
              error={error}
            />
          )}

          {step === 'result' && oevk && (
            <div>
              <ResultCard oevk={oevk} />
              <div style={{ padding: '0 1.5rem 2.5rem' }}>
                <CtaButton onClick={() => setStep('slider')}>
                  {'Mit tehetek \u00e9n? \u2192'}
                </CtaButton>
              </div>
            </div>
          )}

          {step === 'slider' && oevk && (
            <div>
              <MobilizSlider
                oevk={oevk}
                onValueChange={setMobilizCount}
              />
              <div style={{ padding: '0 1.5rem 2.5rem' }}>
                <CtaButton onClick={() => setStep('share')}>
                  {'V\u00e1llalom! Megmutatom \u2192'}
                </CtaButton>
              </div>
            </div>
          )}

          {step === 'share' && oevk && (
            <div style={{ padding: '1.5rem 1.5rem' }}>
              <ShareCard oevk={oevk} mobilizCount={mobilizCount} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CtaButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'linear-gradient(180deg, var(--ember) 0%, var(--ember-deep) 100%)',
        color: 'var(--cream)',
        border: '1px solid rgba(190, 66, 25, 0.3)',
        boxShadow: '0 18px 38px rgba(227, 90, 43, 0.18)',
        fontFamily: 'Barlow Condensed, sans-serif',
        fontSize: '1rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '1rem',
        borderRadius: 999,
        cursor: 'pointer',
        width: '100%',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.94'
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = '0 22px 42px rgba(227, 90, 43, 0.22)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 18px 38px rgba(227, 90, 43, 0.18)'
      }}
    >
      {children}
    </button>
  )
}
