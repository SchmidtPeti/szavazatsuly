import { useState } from 'react'
import { PersonalDots, DotRatio, DotTree } from './DotDisplay'

export default function MobilizSlider({ oevk, onValueChange }) {
  const [count, setCount] = useState(3)

  function handleChange(e) {
    const value = Number(e.target.value)
    setCount(value)
    onValueChange(value)
  }

  const margin = oevk.margin
  const nonVoters = oevk.non_voters
  const needCount = Math.ceil(margin / count)
  const everyN = nonVoters ? Math.floor(nonVoters / margin) : null
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
  const level3Total = 1 + count + count * count
  const impact =
    count <= 2 ? 'Már ez is számít, indulj el ebből!' :
    count <= 5 ? 'Egy kis csoport, ez már érezhető.' :
    count <= 8 ? 'Komolyabb mozgás indul el tőled.' :
    'Egy egész közösséget mozgatsz meg.'
  const fillPct = ((count - 1) / 29) * 100

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '2.5rem 1.5rem 1.5rem',
        gap: '1.5rem',
        background: 'transparent',
      }}
    >
      <div>
        <p
          style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--warm-gray)',
            margin: 0,
          }}
        >
          {oevk.oevk_name}
        </p>
        <h2
          style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 800,
            fontSize: '1.75rem',
            color: 'var(--ink)',
            margin: '4px 0 0',
            lineHeight: 1.1,
          }}
        >
          Hány embert hozol?
        </h2>
      </div>

      <div
        style={{
          background: 'linear-gradient(180deg, rgba(252,248,241,0.95) 0%, rgba(239,226,211,0.86) 100%)',
          border: '1px solid var(--surface-border)',
          borderRadius: 28,
          padding: '1.5rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: 'var(--surface-shadow)',
        }}
      >
        <p
          style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--warm-gray)',
            margin: 0,
          }}
        >
          Te hozol
        </p>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          <span
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              fontSize: '5.5rem',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: 'var(--ember)',
            }}
          >
            {count}
          </span>
          <span
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: '1.3rem',
              color: 'var(--warm-gray)',
              letterSpacing: '0.05em',
              marginBottom: '0.65rem',
            }}
          >
            embert
          </span>
        </div>

        <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--amber)', margin: '0 0 4px', textTransform: 'uppercase' }}>
          te + {count} = összesen {count + 1} fő
        </p>

        <PersonalDots count={count} />

        <div style={{ width: '100%', paddingTop: '0.25rem' }}>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={count}
            onChange={handleChange}
            style={{
              width: '100%',
              height: 6,
              borderRadius: 999,
              background: `linear-gradient(to right,
                var(--ember) 0%,
                var(--ember) ${fillPct}%,
                var(--paper-strong) ${fillPct}%,
                var(--paper-strong) 100%)`,
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={scaleLabelStyle}>1</span>
            <span style={scaleLabelStyle}>30</span>
          </div>
        </div>
      </div>

      <Panel label="Kollektív cél">
        <p style={bodyCopyStyle}>
          Ha te hozol{' '}
          <strong style={neutralStrongStyle}>{count} embert</strong>,
          {' '}és ugyanezt teszi{' '}
          <strong style={accentStrongStyle}>{needCount.toLocaleString('hu-HU')} ember</strong>,
          {' '}a körzet behozható.
        </p>
        <p style={supportCopyStyle}>{impact}</p>
      </Panel>

      {everyN && everyN >= 2 && (
        <Panel label="Otthon maradók">
          <p style={bodyCopyStyle}>
            Legutóbb{' '}
            <strong style={neutralStrongStyle}>{nonVoters.toLocaleString('hu-HU')} ember</strong>
            {' '}nem szavazott. Minden{' '}
            <strong
              style={{
                ...neutralStrongStyle,
                color: '#94680f',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: '1.2rem',
              }}
            >
              {everyN}.
            </strong>
            {' '}otthon maradónak kellene elmennie
          </p>
          <DotRatio lit={1} total={Math.min(everyN, 30)} dotSize={10} />
          <p style={microCopyStyle}> és a különbség behozható lenne.</p>
        </Panel>
      )}

      <Panel label="Szorzó erő">
        {count === 1 ? (
          <p style={{ ...bodyCopyStyle, margin: 0 }}>
            Hozz legalább 2 embert a szorzó hatáshoz.
          </p>
        ) : (
          <>
            <p style={{ ...bodyCopyStyle, marginBottom: '1rem' }}>
              Ha mindenki, akit hozol, szintén hoz {count} embert...
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <DotTree branches={count} maxDots={40} />
            </div>
            <p
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: '1rem',
                color: 'var(--ink)',
                margin: '0.85rem 0 0',
                textAlign: 'center',
              }}
            >
              3 szint mélyen{' '}
              <strong style={{ color: 'var(--ember)', fontSize: '1.3rem' }}>
                {level3Total.toLocaleString('hu-HU')}
              </strong>
              {' '}ember.
            </p>
            {compoundRounds && (
              <p style={{ ...microCopyStyle, textAlign: 'center', marginTop: '0.4rem' }}>
                {compoundRounds.length} körben eléri a {margin.toLocaleString('hu-HU')}-es különbséget.
              </p>
            )}
          </>
        )}
      </Panel>
    </div>
  )
}

function Panel({ label, children }) {
  return (
    <div
      style={{
        background: 'linear-gradient(180deg, rgba(252,248,241,0.95) 0%, rgba(246,239,230,0.94) 100%)',
        border: '1px solid var(--surface-border)',
        borderRadius: 24,
        padding: '1rem 1.1rem',
        boxShadow: 'var(--surface-shadow)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: 'var(--ember)',
            display: 'inline-block',
            flexShrink: 0,
            boxShadow: '0 8px 16px rgba(227,90,43,0.22)',
          }}
        />
        <span
          style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--warm-gray)',
          }}
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}

const scaleLabelStyle = {
  fontFamily: 'Barlow Condensed, sans-serif',
  fontSize: '0.78rem',
  color: 'var(--warm-gray)',
}

const bodyCopyStyle = {
  fontFamily: 'Crimson Pro, Georgia, serif',
  fontSize: '1rem',
  fontStyle: 'italic',
  color: 'var(--warm-gray)',
  margin: '0 0 10px',
  lineHeight: 1.5,
}

const supportCopyStyle = {
  fontFamily: 'Barlow Condensed, sans-serif',
  fontSize: '0.88rem',
  letterSpacing: '0.04em',
  color: 'var(--warm-gray)',
  margin: 0,
}

const microCopyStyle = {
  fontFamily: 'Crimson Pro, Georgia, serif',
  fontSize: '0.85rem',
  fontStyle: 'italic',
  color: 'var(--warm-gray)',
  margin: '7px 0 0',
}

const neutralStrongStyle = {
  color: 'var(--ink)',
  fontStyle: 'normal',
}

const accentStrongStyle = {
  color: 'var(--ember-deep)',
  fontStyle: 'normal',
}
