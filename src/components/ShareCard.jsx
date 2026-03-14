import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'

export default function ShareCard({ oevk, mobilizCount }) {
  const cardRef = useRef(null)
  const [loading, setLoading] = useState(false)

  const margin = oevk.margin
  const needCount = Math.ceil(margin / mobilizCount)
  const nonVoters = oevk.non_voters
  const everyN = nonVoters ? Math.floor(nonVoters / margin) : null
  const dotCount = Math.min(mobilizCount, 19)
  const showMore = mobilizCount > 19

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '0.5rem 0 2rem',
      }}
    >
      <div>
        <h3
          style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 800,
            fontSize: '1.6rem',
            color: 'var(--ink)',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          A te vállalásod
        </h3>
        <p
          style={{
            fontFamily: 'Crimson Pro, Georgia, serif',
            fontSize: '1rem',
            fontStyle: 'italic',
            color: 'var(--warm-gray)',
            margin: '4px 0 0',
          }}
        >
          Oszd meg, és vonj be másokat.
        </p>
      </div>

      <div
        ref={cardRef}
        style={{
          width: 360,
          height: 360,
          background: 'linear-gradient(150deg, #fffaf3 0%, #f5ebde 52%, #efdfcf 100%)',
          borderRadius: 28,
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
          alignSelf: 'center',
          border: '1px solid #dec8b1',
          boxShadow: '0 28px 60px rgba(89, 53, 24, 0.12)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 82% 78%, rgba(227,90,43,0.14) 0%, rgba(227,90,43,0) 30%), radial-gradient(circle at 14% 14%, rgba(215,156,28,0.14) 0%, rgba(215,156,28,0) 24%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 7, position: 'relative' }}>
          <svg width="18" height="10" viewBox="0 0 18 10">
            <circle cx="4" cy="5" r="4" fill="#E35A2B" />
            <circle cx="11" cy="5" r="3" fill="#D79C1C" opacity="0.92" />
            <circle cx="16" cy="5" r="2" fill="#E35A2B" opacity="0.35" />
          </svg>
          <span
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '0.6rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#8d7763',
            }}
          >
            SzavazatSúly
          </span>
        </div>

        <div style={{ position: 'relative' }}>
          <div
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#8d7763',
              marginBottom: 2,
            }}
          >
            ÉN HOZOK
          </div>
          <div
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              fontSize: '5.5rem',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: '#d85026',
            }}
          >
            {mobilizCount}
          </div>
          <div
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '1.45rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#34251b',
            }}
          >
            EMBERT
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 5,
              marginTop: 12,
              alignItems: 'center',
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#D79C1C',
                display: 'inline-block',
                boxShadow: '0 10px 18px rgba(215,156,28,0.25)',
              }}
            />
            {Array.from({ length: dotCount }, (_, index) => (
              <span
                key={index}
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  backgroundColor: '#E35A2B',
                  display: 'inline-block',
                  opacity: 0.9,
                }}
              />
            ))}
            {showMore && (
              <span
                style={{
                  color: '#8d7763',
                  fontSize: 11,
                  fontFamily: 'Barlow Condensed, sans-serif',
                  letterSpacing: '0.04em',
                }}
              >
                +{mobilizCount - dotCount}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
          <div
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#8d7763',
            }}
          >
            {oevk.oevk_name}
          </div>
          <div style={shareStatStyle}>
            <span style={shareLabelStyle}>Különbség 2022-ben: </span>
            <strong style={{ color: '#d85026' }}>{margin.toLocaleString('hu-HU')} szavazat</strong>
          </div>
          <div style={shareStatStyle}>
            <span style={shareLabelStyle}>Ilyen csoportra lenne szükség: </span>
            <strong style={{ color: '#94680f' }}>{needCount.toLocaleString('hu-HU')}</strong>
          </div>
          {everyN && everyN >= 2 && (
            <div style={shareStatStyle}>
              <span style={shareLabelStyle}>Minden </span>
              <strong style={{ color: '#94680f' }}>{everyN}.</strong>
              <span style={shareLabelStyle}> otthon maradó számít</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={handleShare}
          disabled={loading}
          style={{
            background: loading
              ? 'linear-gradient(180deg, #efe5d7 0%, #ead9c5 100%)'
              : 'linear-gradient(180deg, var(--ember) 0%, var(--ember-deep) 100%)',
            color: loading ? 'var(--warm-gray)' : 'var(--cream)',
            border: '1px solid rgba(190, 66, 25, 0.28)',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '1rem',
            borderRadius: 999,
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            transition: 'box-shadow 0.2s ease, transform 0.2s ease',
            boxShadow: loading ? 'none' : '0 18px 36px rgba(227,90,43,0.18)',
          }}
        >
          {loading ? 'Feldolgozás...' : 'Megosztom'}
        </button>
        <button
          onClick={handleDownload}
          disabled={loading}
          style={{
            background: 'rgba(252,248,241,0.75)',
            color: 'var(--ink)',
            border: '1px solid var(--surface-border)',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '0.85rem',
            borderRadius: 999,
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
          }}
        >
          Mentés képként
        </button>
      </div>

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
        Nem tárolunk semmilyen személyes adatot.
      </p>
    </div>
  )
}

const shareStatStyle = {
  fontFamily: 'Barlow Condensed, sans-serif',
  fontSize: '0.82rem',
  color: '#34251b',
}

const shareLabelStyle = {
  color: '#8d7763',
}
