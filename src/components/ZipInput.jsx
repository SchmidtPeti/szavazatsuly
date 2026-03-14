import { useState } from 'react'

export default function ZipInput({ onSearch, loading, error }) {
  const [value, setValue] = useState('')

  function handleChange(e) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 4)
    setValue(v)
    if (v.length === 4) onSearch(v)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (value.trim().length >= 4) onSearch(value.trim())
  }

  const isReady = value.length === 4 && !loading

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        background:
          'radial-gradient(circle at top left, rgba(227,90,43,0.08), transparent 28%), var(--paper)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BackgroundGlow />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 372,
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <DotMark />
          <span
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--ember)',
            }}
          >
            SzavazatSúly
          </span>
        </div>

        <div>
          <h1
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(3rem, 13vw, 4.5rem)',
              lineHeight: 0.92,
              letterSpacing: '0.01em',
              textTransform: 'uppercase',
              color: 'var(--ink)',
              margin: 0,
            }}
          >
            AZ ÉN
            <br />
            SZAVAZA<span style={{ color: 'var(--ember)' }}>TOM</span>
            <br />
            DÖNTHET<span style={{ color: 'var(--amber)' }}>.</span>
          </h1>
          <p
            style={{
              marginTop: '1rem',
              fontFamily: 'Crimson Pro, Georgia, serif',
              fontSize: '1.05rem',
              fontStyle: 'italic',
              color: 'var(--warm-gray)',
              lineHeight: 1.55,
              maxWidth: 320,
            }}
          >
            Nézd meg, mit jelent ez a számodra, és mit tehetsz te egyedül is.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 7 }}>
          {[1, 0.5, 0.2].map((opacity, index) => (
            <span
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--ember)',
                opacity,
                display: 'inline-block',
                boxShadow:
                  index === 0 ? '0 10px 18px rgba(227,90,43,0.18)' : 'none',
              }}
            />
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'rgba(252, 248, 241, 0.72)',
            border: '1px solid var(--surface-border)',
            borderRadius: 24,
            padding: '1.2rem',
            boxShadow: 'var(--surface-shadow)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--warm-gray)',
              }}
            >
              Irányítószámod
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="1011"
              value={value}
              onChange={handleChange}
              maxLength={4}
              autoFocus
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'linear-gradient(180deg, var(--paper-light) 0%, var(--paper-medium) 100%)',
                border: '1px solid var(--surface-border)',
                borderBottom: `2px solid ${value.length === 4 ? 'var(--amber)' : 'var(--ember)'}`,
                borderRadius: 18,
                color: 'var(--ink)',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: '2.8rem',
                fontWeight: 800,
                letterSpacing: '0.25em',
                textAlign: 'center',
                padding: '0.7rem 1rem',
                outline: 'none',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65)',
                transition: 'border-bottom-color 0.2s ease, border-color 0.2s ease',
              }}
            />
          </div>

          {error && (
            <p
              style={{
                fontFamily: 'Crimson Pro, Georgia, serif',
                fontSize: '0.95rem',
                fontStyle: 'italic',
                color: '#bf4b3f',
                margin: 0,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!isReady}
            style={{
              background: isReady
                ? 'linear-gradient(180deg, var(--ember) 0%, var(--ember-deep) 100%)'
                : 'linear-gradient(180deg, #efe5d7 0%, #ead9c5 100%)',
              color: isReady ? 'var(--cream)' : 'var(--warm-gray)',
              border: `1px solid ${isReady ? 'rgba(190, 66, 25, 0.3)' : 'var(--surface-border)'}`,
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '1rem',
              borderRadius: 999,
              cursor: isReady ? 'pointer' : 'not-allowed',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease',
              boxShadow: isReady ? '0 18px 36px rgba(227,90,43,0.18)' : 'none',
              width: '100%',
            }}
          >
            {loading ? 'Keresés...' : 'Megmutatom a körzetem →'}
          </button>
        </form>

        <p
          style={{
            fontFamily: 'Crimson Pro, Georgia, serif',
            fontSize: '0.83rem',
            fontStyle: 'italic',
            color: 'var(--warm-gray)',
            textAlign: 'center',
            opacity: 0.78,
            margin: 0,
          }}
        >
          Adatok forrása: Nemzeti Választási Iroda, 2022 · Semmi sem kerül rögzítésre.
        </p>
      </div>
    </div>
  )
}

function DotMark() {
  return (
    <svg width="22" height="12" viewBox="0 0 22 12" style={{ flexShrink: 0 }}>
      <circle cx="5" cy="6" r="5" fill="#E35A2B" />
      <circle cx="13" cy="6" r="3.5" fill="#D79C1C" opacity="0.9" />
      <circle cx="19" cy="6" r="2" fill="#E35A2B" opacity="0.35" />
    </svg>
  )
}

function BackgroundGlow() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
        <circle cx="10%" cy="16%" r="160" fill="#E35A2B" opacity="0.055" />
        <circle cx="86%" cy="74%" r="138" fill="#E35A2B" opacity="0.05" />
        <circle cx="61%" cy="18%" r="82" fill="#D79C1C" opacity="0.055" />
        <circle cx="24%" cy="84%" r="92" fill="#E35A2B" opacity="0.04" />
        {Array.from({ length: 28 }, (_, i) => ({
          x: (i * 73 + 17) % 97,
          y: (i * 47 + 11) % 91,
          r: i % 3 === 0 ? 2.5 : i % 3 === 1 ? 1.5 : 1,
          opacity: 0.028 + (i % 5) * 0.01,
          fill: i % 4 === 0 ? '#D79C1C' : '#E35A2B',
        })).map((dot, index) => (
          <circle
            key={index}
            cx={`${dot.x}%`}
            cy={`${dot.y}%`}
            r={dot.r}
            fill={dot.fill}
            opacity={dot.opacity}
          />
        ))}
      </svg>
    </div>
  )
}
