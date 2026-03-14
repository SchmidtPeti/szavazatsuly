import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'

// Export canvas: 540×675 → 1080×1350px @2x (4:5 social ratio)
const EXP_W = 540
const EXP_H = 675

export default function ShareCard({ oevk, mobilizCount }) {
  const cardRef = useRef(null)
  const flyerRef = useRef(null)
  const exportCardRef = useRef(null)
  const exportFlyerRef = useRef(null)
  const [loadingShare, setLoadingShare] = useState(false)
  const [loadingFlyer, setLoadingFlyer] = useState(false)

  const margin = oevk.margin
  const needCount = Math.ceil(margin / mobilizCount)
  const nonVoters = oevk.non_voters
  const everyN = nonVoters ? Math.floor(nonVoters / margin) : null
  const dotCount = Math.min(mobilizCount, 19)
  const showMore = mobilizCount > 19
  const displayName = oevk.area_name || oevk.oevk_name

  async function capturePng(ref, pixelRatio = 2) {
    return await toPng(ref.current, { pixelRatio, cacheBust: true })
  }

  async function handleShare() {
    setLoadingShare(true)
    const dataUrl = await capturePng(exportCardRef)
    setLoadingShare(false)
    const blob = await (await fetch(dataUrl)).blob()
    const file = new File([blob], 'szavazatom-dont.png', { type: 'image/png' })
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'A szavazatom dönthet.' }) } catch { /* cancelled */ }
    } else {
      triggerDownload(dataUrl, 'szavazatom-dont.png')
    }
  }

  async function handleDownloadCard() {
    setLoadingShare(true)
    const dataUrl = await capturePng(exportCardRef)
    setLoadingShare(false)
    triggerDownload(dataUrl, 'szavazatom-dont.png')
  }

  async function handleFlyerDownload() {
    setLoadingFlyer(true)
    const dataUrl = await capturePng(exportFlyerRef)
    setLoadingFlyer(false)
    triggerDownload(dataUrl, 'korzetunk-otthon-maradoi.png')
  }

  function triggerDownload(dataUrl, filename) {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    a.click()
  }

  return (
    <div className="share-page">
      {/* ── Page header ── */}
      <div className="share-page-header" style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: '#35251b', margin: 0, lineHeight: 1.1 }}>
          Megosztás
        </h3>
        <p style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '1rem', fontStyle: 'italic', color: '#7a6654', margin: '4px 0 0' }}>
          Mentsd le vagy oszd meg a kártyákat.
        </p>
      </div>

      <div className="share-cols">
        {/* ── Left column: social card ── */}
        <div className="share-col">
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7a6654', margin: 0 }}>
              A te vállalásod
            </p>
            <h4 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#35251b', margin: '2px 0 0', lineHeight: 1.1 }}>
              Social media kártya
            </h4>
          </div>

          {/* Preview card (screen display) */}
          <div
            ref={cardRef}
            style={{
              width: 360, height: 360,
              background: 'linear-gradient(150deg, #fffaf3 0%, #f5ebde 52%, #efdfcf 100%)',
              borderRadius: 24,
              padding: '1.6rem',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxSizing: 'border-box', position: 'relative', overflow: 'hidden',
              border: '1px solid #dec8b1',
              boxShadow: '0 24px 56px rgba(89,53,24,0.12)',
            }}
          >
            <CardGlow />
            <CardLogo />
            <CardHero mobilizCount={mobilizCount} dotCount={dotCount} showMore={showMore} scale={1} />
            <CardStats displayName={displayName} margin={margin} needCount={needCount} everyN={everyN} scale={1} />
          </div>

          {/* Share buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: '1rem' }}>
            <button onClick={handleShare} disabled={loadingShare} style={primaryBtnStyle(loadingShare)}>
              {loadingShare ? 'Feldolgozás...' : 'Megosztom →'}
            </button>
            <button onClick={handleDownloadCard} disabled={loadingShare} style={secondaryBtnStyle}>
              Letöltés (1080×1350 PNG)
            </button>
          </div>
        </div>

        {/* ── Right column: flyer ── */}
        <div className="share-col">
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#7a6654', margin: 0 }}>
              Körzeted otthon maradóinak
            </p>
            <h4 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.4rem', color: '#35251b', margin: '2px 0 0', lineHeight: 1.1 }}>
              Felhívó a szomszédaidnak
            </h4>
          </div>

          {/* Preview flyer */}
          <div
            ref={flyerRef}
            style={{
              width: 360, height: 509,
              background: 'linear-gradient(165deg, #2a1a0e 0%, #3d2614 45%, #1e1108 100%)',
              borderRadius: 20,
              padding: '1.75rem',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxSizing: 'border-box', position: 'relative', overflow: 'hidden',
              border: '1px solid rgba(227,90,43,0.22)',
              boxShadow: '0 24px 56px rgba(89,53,24,0.2)',
            }}
          >
            <FlyerGlow />
            <FlyerLogo />
            <FlyerHero nonVoters={nonVoters} displayName={displayName} scale={1} />
            <FlyerMessage everyN={everyN} margin={margin} scale={1} />
            <FlyerCta scale={1} />
          </div>

          {/* Flyer button */}
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleFlyerDownload} disabled={loadingFlyer} style={flyerBtnStyle(loadingFlyer)}>
              {loadingFlyer ? 'Feldolgozás...' : 'Letöltés (1080×1350 PNG)'}
            </button>
          </div>
        </div>
      </div>

      <p style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontSize: '0.83rem', fontStyle: 'italic', color: '#7a6654', textAlign: 'center', opacity: 0.7, margin: '2rem 0 0' }}>
        Nem tárolunk semmilyen személyes adatot.
      </p>

      {/* ── Hidden export versions (4:5, square corners, solid background) ── */}
      {/* Social card export: 540×675 → 1080×1350 @2x */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: EXP_W, height: EXP_H, zIndex: -1, pointerEvents: 'none' }}>
        <div
          ref={exportCardRef}
          style={{
            width: EXP_W, height: EXP_H,
            background: '#f9f3eb',
            borderRadius: 0,
            padding: '2.5rem 2.4rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxSizing: 'border-box', position: 'relative', overflow: 'hidden',
          }}
        >
          <CardGlow />
          <ExportCardLogo />
          <ExportCardHero mobilizCount={mobilizCount} dotCount={Math.min(mobilizCount, 28)} showMore={mobilizCount > 28} />
          <ExportCardStats displayName={displayName} margin={margin} needCount={needCount} everyN={everyN} />
        </div>
      </div>

      {/* Flyer export: 540×675 → 1080×1350 @2x */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: EXP_W, height: EXP_H, zIndex: -1, pointerEvents: 'none' }}>
        <div
          ref={exportFlyerRef}
          style={{
            width: EXP_W, height: EXP_H,
            background: '#2a1a0e',
            borderRadius: 0,
            padding: '2.5rem 2.4rem',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxSizing: 'border-box', position: 'relative', overflow: 'hidden',
          }}
        >
          <FlyerGlow />
          <FlyerLogo />
          <ExportFlyerHero nonVoters={nonVoters} displayName={displayName} />
          <ExportFlyerMessage everyN={everyN} margin={margin} />
          <ExportFlyerCta />
        </div>
      </div>
    </div>
  )
}

// ── Shared decorative elements ──────────────────────────────────────────────

function CardGlow() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 82% 78%, rgba(227,90,43,0.14), transparent 30%), radial-gradient(circle at 14% 14%, rgba(215,156,28,0.14), transparent 24%)', pointerEvents: 'none' }} />
  )
}

function FlyerGlow() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 85% 15%, rgba(227,90,43,0.2), transparent 40%), radial-gradient(circle at 10% 85%, rgba(215,156,28,0.1), transparent 35%)', pointerEvents: 'none' }} />
  )
}

function CardLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, position: 'relative' }}>
      <DotMark />
      <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#8d7763' }}>SzavazatSúly</span>
    </div>
  )
}

function FlyerLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, position: 'relative' }}>
      <DotMark />
      <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>SzavazatSúly</span>
    </div>
  )
}

function DotMark() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10">
      <circle cx="4" cy="5" r="4" fill="#E35A2B" />
      <circle cx="11" cy="5" r="3" fill="#D79C1C" opacity="0.92" />
      <circle cx="16" cy="5" r="2" fill="#E35A2B" opacity="0.35" />
    </svg>
  )
}

// ── Display card sub-components ─────────────────────────────────────────────

function CardHero({ mobilizCount, dotCount, showMore }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8d7763', marginBottom: 2 }}>
        ÉN HOZOK
      </div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '5.5rem', lineHeight: 1, letterSpacing: '-0.02em', color: '#d85026' }}>
        {mobilizCount}
      </div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.45rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#34251b' }}>
        EMBERT
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10, alignItems: 'center' }}>
        <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#D79C1C', display: 'inline-block' }} />
        {Array.from({ length: dotCount }, (_, i) => (
          <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#E35A2B', display: 'inline-block', opacity: 0.9 }} />
        ))}
        {showMore && <span style={{ color: '#8d7763', fontSize: 11, fontFamily: 'Barlow Condensed, sans-serif' }}>+{mobilizCount - dotCount}</span>}
      </div>
    </div>
  )
}

function CardStats({ displayName, margin, needCount, everyN }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8d7763' }}>
        {displayName}
      </div>
      <div style={statRow}>
        <span style={statLabel}>Különbség 2022-ben: </span>
        <strong style={{ color: '#d85026', fontWeight: 900 }}>{margin.toLocaleString('hu-HU')} szavazat</strong>
      </div>
      <div style={statRow}>
        <span style={statLabel}>Ilyen csoport kell: </span>
        <strong style={{ color: '#94680f', fontWeight: 900 }}>{needCount.toLocaleString('hu-HU')} ember</strong>
      </div>
      {everyN && everyN >= 2 && (
        <div style={statRow}>
          <span style={statLabel}>Minden </span>
          <strong style={{ color: '#94680f', fontWeight: 900 }}>{everyN}.</strong>
          <span style={statLabel}> otthon maradónak kell elmennie</span>
        </div>
      )}
    </div>
  )
}

// ── Display flyer sub-components ────────────────────────────────────────────

function FlyerHero({ nonVoters, displayName }) {
  return (
    <div style={{ position: 'relative' }}>
      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(227,90,43,0.85)', margin: '0 0 6px' }}>{displayName}</p>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '3.6rem', lineHeight: 1, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.92)', textTransform: 'uppercase' }}>
        {nonVoters.toLocaleString('hu-HU')}
      </div>
      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0' }}>
        ember nem szavazott 2022-ben
      </p>
    </div>
  )
}

function FlyerMessage({ everyN, margin }) {
  const text = everyN && everyN >= 2
    ? <>Ha minden <strong style={{ fontStyle: 'normal', color: '#E35A2B', fontWeight: 900 }}>{everyN}.</strong> otthon maradó elmegy szavazni, a <strong style={{ fontStyle: 'normal', color: '#E35A2B', fontWeight: 900 }}>{margin.toLocaleString('hu-HU')} szavazatos</strong> különbség behozható.</>
    : <>A körzetedben <strong style={{ fontStyle: 'normal', color: '#E35A2B', fontWeight: 900 }}>{margin.toLocaleString('hu-HU')} szavazat</strong> volt a különbség. A te szavazatod is számít.</>
  return (
    <div style={{ background: 'rgba(227,90,43,0.13)', borderRadius: 12, padding: '0.85rem 1rem', border: '1px solid rgba(227,90,43,0.28)', position: 'relative' }}>
      <p style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.85)', margin: 0 }}>{text}</p>
    </div>
  )
}

function FlyerCta() {
  return (
    <div style={{ position: 'relative' }}>
      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '1.9rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#E35A2B', margin: '0 0 2px', lineHeight: 1 }}>
        Menj el szavazni!
      </p>
    </div>
  )
}

// ── Export card sub-components (540×675, bigger text, solid bg) ─────────────

function ExportCardLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
      <svg width="24" height="13" viewBox="0 0 18 10">
        <circle cx="4" cy="5" r="4" fill="#E35A2B" />
        <circle cx="11" cy="5" r="3" fill="#D79C1C" opacity="0.92" />
        <circle cx="16" cy="5" r="2" fill="#E35A2B" opacity="0.35" />
      </svg>
      <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#8d7763' }}>SzavazatSúly</span>
    </div>
  )
}

function ExportCardHero({ mobilizCount, dotCount, showMore }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8d7763', marginBottom: 2 }}>
        ÉN HOZOK
      </div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '7rem', lineHeight: 1, letterSpacing: '-0.02em', color: '#d85026' }}>
        {mobilizCount}
      </div>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '1.9rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#34251b' }}>
        EMBERT
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14, alignItems: 'center' }}>
        <span style={{ width: 15, height: 15, borderRadius: '50%', backgroundColor: '#D79C1C', display: 'inline-block' }} />
        {Array.from({ length: dotCount }, (_, i) => (
          <span key={i} style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#E35A2B', display: 'inline-block', opacity: 0.9 }} />
        ))}
        {showMore && <span style={{ color: '#8d7763', fontSize: 14, fontFamily: 'Barlow Condensed, sans-serif' }}>+{mobilizCount - dotCount}</span>}
      </div>
    </div>
  )
}

function ExportCardStats({ displayName, margin, needCount, everyN }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
      <div style={{ width: '100%', height: 1, background: '#dcc8b4', marginBottom: 2 }} />
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.82rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8d7763' }}>
        {displayName}
      </div>
      <div style={exportStatRow}>
        <span style={exportStatLabel}>Különbség 2022-ben: </span>
        <strong style={{ color: '#d85026', fontWeight: 900 }}>{margin.toLocaleString('hu-HU')} szavazat</strong>
      </div>
      <div style={exportStatRow}>
        <span style={exportStatLabel}>Ilyen csoport kell: </span>
        <strong style={{ color: '#94680f', fontWeight: 900 }}>{needCount.toLocaleString('hu-HU')} ember</strong>
      </div>
      {everyN && everyN >= 2 && (
        <div style={exportStatRow}>
          <span style={exportStatLabel}>Minden </span>
          <strong style={{ color: '#94680f', fontWeight: 900 }}>{everyN}.</strong>
          <span style={exportStatLabel}> otthon maradónak kell elmennie</span>
        </div>
      )}
    </div>
  )
}

// ── Export flyer sub-components ─────────────────────────────────────────────

function ExportFlyerHero({ nonVoters, displayName }) {
  return (
    <div style={{ position: 'relative' }}>
      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(227,90,43,0.85)', margin: '0 0 8px' }}>{displayName}</p>
      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '4.8rem', lineHeight: 1, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.92)' }}>
        {nonVoters.toLocaleString('hu-HU')}
      </div>
      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.6)', margin: '6px 0 0' }}>
        ember nem szavazott 2022-ben
      </p>
    </div>
  )
}

function ExportFlyerMessage({ everyN, margin }) {
  const text = everyN && everyN >= 2
    ? <>Ha minden <strong style={{ fontStyle: 'normal', color: '#E35A2B', fontWeight: 900 }}>{everyN}.</strong> otthon maradó elmegy szavazni, a <strong style={{ fontStyle: 'normal', color: '#E35A2B', fontWeight: 900 }}>{margin.toLocaleString('hu-HU')} szavazatos</strong> különbség behozható.</>
    : <>A körzetedben <strong style={{ fontStyle: 'normal', color: '#E35A2B', fontWeight: 900 }}>{margin.toLocaleString('hu-HU')} szavazat</strong> volt a különbség. A te szavazatod is számít.</>
  return (
    <div style={{ background: 'rgba(227,90,43,0.13)', borderRadius: 16, padding: '1.2rem 1.4rem', border: '1px solid rgba(227,90,43,0.3)', position: 'relative' }}>
      <p style={{ fontFamily: 'Crimson Pro, Georgia, serif', fontStyle: 'italic', fontSize: '1.3rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.88)', margin: 0 }}>{text}</p>
    </div>
  )
}

function ExportFlyerCta() {
  return (
    <div style={{ position: 'relative' }}>
      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '2.5rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#E35A2B', margin: '0 0 4px', lineHeight: 1 }}>
        Menj el szavazni!
      </p>
    </div>
  )
}

// ── Button styles ────────────────────────────────────────────────────────────

function primaryBtnStyle(disabled) {
  return {
    background: disabled ? 'linear-gradient(180deg, #efe5d7 0%, #ead9c5 100%)' : 'linear-gradient(180deg, #e35a2b 0%, #be4219 100%)',
    color: disabled ? '#7a6654' : '#fff9f1',
    border: '1px solid rgba(190,66,25,0.28)',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
    padding: '1rem', borderRadius: 999,
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: '100%',
    boxShadow: disabled ? 'none' : '0 16px 32px rgba(227,90,43,0.18)',
    transition: 'box-shadow 0.2s ease',
  }
}

const secondaryBtnStyle = {
  background: 'rgba(252,248,241,0.75)',
  color: '#35251b',
  border: '1px solid #dcc8b4',
  fontFamily: 'Barlow Condensed, sans-serif',
  fontSize: '0.92rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
  padding: '0.85rem', borderRadius: 999, cursor: 'pointer', width: '100%',
}

function flyerBtnStyle(disabled) {
  return {
    background: disabled ? 'rgba(252,248,241,0.5)' : 'rgba(42,26,14,0.88)',
    color: disabled ? '#7a6654' : 'rgba(255,255,255,0.85)',
    border: '1px solid rgba(227,90,43,0.3)',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
    padding: '0.9rem', borderRadius: 999,
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: '100%', transition: 'opacity 0.2s ease',
  }
}

// ── Style constants ──────────────────────────────────────────────────────────

const statRow = {
  fontFamily: 'Barlow Condensed, sans-serif',
  fontSize: '0.82rem',
  color: '#34251b',
}

const statLabel = {
  color: '#8d7763',
}

const exportStatRow = {
  fontFamily: 'Barlow Condensed, sans-serif',
  fontSize: '1.05rem',
  color: '#34251b',
}

const exportStatLabel = {
  color: '#8d7763',
}
