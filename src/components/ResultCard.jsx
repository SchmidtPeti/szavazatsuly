export default function ResultCard({ oevk }) {
  const {
    oevk_name,
    area_name,
    county,
    margin,
    winner_votes,
    second_votes,
    winner_party,
    second_party,
    non_voters,
  } = oevk

  const isTight = margin < 1000
  const isModerate = margin < 3000
  const accentColor = isTight ? 'var(--ember)' : isModerate ? 'var(--amber)' : 'var(--ink)'

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
          {county}
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
          {area_name || oevk_name}
        </h2>
      </div>

      {(isTight || isModerate) && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: isTight ? 'var(--accent-ember-soft)' : 'var(--accent-amber-soft)',
            border: `1px solid ${isTight ? 'var(--accent-ember-border)' : 'var(--accent-amber-border)'}`,
            borderRadius: 999,
            padding: '0.4rem 0.8rem',
            alignSelf: 'flex-start',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: isTight ? 'var(--ember)' : 'var(--amber)',
              display: 'inline-block',
              flexShrink: 0,
              boxShadow: isTight ? '0 0 0 6px rgba(227,90,43,0.12)' : '0 0 0 6px rgba(215,156,28,0.12)',
              animation: isTight ? 'dotPulse 2s ease-in-out infinite' : 'none',
            }}
          />
          <span
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: isTight ? 'var(--ember-deep)' : '#94680f',
            }}
          >
            {isTight ? 'Rendkívül szoros körzet' : 'Szoros körzet'}
          </span>
        </div>
      )}

      <div
        style={{
          background: 'linear-gradient(180deg, rgba(252,248,241,0.9) 0%, rgba(239,226,211,0.8) 100%)',
          border: '1px solid var(--surface-border)',
          borderRadius: 28,
          padding: '1.35rem 1.25rem',
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
            margin: '0 0 5px',
          }}
        >
          A győztes előnye
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
          <span
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(3rem, 14vw, 4.5rem)',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              color: accentColor,
            }}
          >
            {margin.toLocaleString('hu-HU')}
          </span>
          <span
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: '1.1rem',
              color: 'var(--warm-gray)',
              letterSpacing: '0.04em',
              marginBottom: '0.4rem',
            }}
          >
            szavazat
          </span>
        </div>
      </div>

      <Panel>
        <SectionLabel>A szavazatok megoszlása</SectionLabel>
        <VoteBar
          winnerVotes={winner_votes}
          secondVotes={second_votes}
          winnerParty={winner_party}
          secondParty={second_party}
          margin={margin}
        />
      </Panel>

      <Panel>
        <StatRow label={`1. hely (${winner_party})`} value={`${winner_votes.toLocaleString('hu-HU')} szav.`} />
        <StatRow label={`2. hely (${second_party})`} value={`${second_votes.toLocaleString('hu-HU')} szav.`} />
        <div style={{ height: 1, background: 'var(--surface-border)' }} />
        <StatRow label="Különbség" value={`${margin.toLocaleString('hu-HU')} szav.`} accent />
        <StatRow label="Nem szavazott" value={non_voters.toLocaleString('hu-HU')} />
      </Panel>

      {!isTight && !isModerate && (
        <p
          style={{
            fontFamily: 'Crimson Pro, Georgia, serif',
            fontSize: '0.95rem',
            fontStyle: 'italic',
            color: 'var(--warm-gray)',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Pártlistás szavazatod minden körzetben ugyanannyit ér, és az dönti el a többséget.
        </p>
      )}
    </div>
  )
}

function Panel({ children }) {
  return (
    <div
      style={{
        background: 'linear-gradient(180deg, rgba(252,248,241,0.94) 0%, rgba(246,239,230,0.94) 100%)',
        border: '1px solid var(--surface-border)',
        borderRadius: 24,
        padding: '1rem 1.1rem',
        boxShadow: 'var(--surface-shadow)',
      }}
    >
      {children}
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p
      style={{
        fontFamily: 'Barlow Condensed, sans-serif',
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--warm-gray)',
        margin: '0 0 9px',
      }}
    >
      {children}
    </p>
  )
}

function VoteBar({ winnerVotes, secondVotes, winnerParty, secondParty, margin }) {
  const total = winnerVotes + secondVotes
  const winnerPct = ((winnerVotes / total) * 100).toFixed(1)
  const secondPct = ((secondVotes / total) * 100).toFixed(1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ember-deep)' }}>
            1. {winnerParty}
          </span>
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.88rem', fontWeight: 700, color: 'var(--ember-deep)' }}>
            {winnerPct}%
          </span>
        </div>
        <div style={{ height: 11, borderRadius: 6, background: 'var(--paper-strong)', overflow: 'hidden' }}>
          <div style={{ width: `${winnerPct}%`, height: '100%', background: 'linear-gradient(to right, var(--ember), var(--ember-deep))', borderRadius: 6 }} />
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)' }}>
            2. {secondParty}
          </span>
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.88rem', fontWeight: 700, color: 'var(--ink)' }}>
            {secondPct}%
          </span>
        </div>
        <div style={{ height: 11, borderRadius: 6, background: 'var(--paper-strong)', overflow: 'hidden' }}>
          <div style={{ width: `${secondPct}%`, height: '100%', background: 'var(--ink)', borderRadius: 6, opacity: 0.55 }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 2 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--surface-border)' }} />
        <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: 'var(--ember-deep)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
          {margin.toLocaleString('hu-HU')} szavazat különbség
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--surface-border)' }} />
      </div>
    </div>
  )
}

function StatRow({ label, value, accent }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: 8,
      }}
    >
      <span
        style={{
          fontFamily: 'Crimson Pro, Georgia, serif',
          fontSize: '1rem',
          color: 'var(--warm-gray)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: '1.05rem',
          fontWeight: 600,
          letterSpacing: '0.03em',
          color: accent ? 'var(--ember-deep)' : 'var(--ink)',
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {value}
      </span>
    </div>
  )
}
