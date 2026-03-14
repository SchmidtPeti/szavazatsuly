import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'

// Export canvas: 540x675 -> 1080x1350px @2x (4:5 social ratio)
const EXP_W = 540
const EXP_H = 675

export default function ShareCard({ oevk, mobilizCount }) {
  const exportCardRef = useRef(null)
  const exportFlyerRef = useRef(null)
  const [loadingShare, setLoadingShare] = useState(false)
  const [loadingFlyer, setLoadingFlyer] = useState(false)

  const margin = oevk.margin
  const needCount = Math.max(1, Math.ceil(margin / mobilizCount))
  const nonVoters = oevk.non_voters
  const everyN = nonVoters ? Math.floor(nonVoters / margin) : null
  const displayName = oevk.area_name || oevk.oevk_name
  const marginText = `${margin.toLocaleString('hu-HU')} szavazat`
  const nonVotersText = nonVoters.toLocaleString('hu-HU')
  const needCountText = needCount.toLocaleString('hu-HU')
  const previewDotCount = Math.min(mobilizCount, 19)
  const exportDotCount = Math.min(mobilizCount, 28)
  const showPreviewMore = mobilizCount > previewDotCount
  const showExportMore = mobilizCount > exportDotCount

  const groupImpactText =
    needCount === 1
      ? 'Ha még egy ember ugyanígy mozgósít, ez a különbség behozható.'
      : `Ha ${needCountText}-en ugyanúgy mozgósítunk, mint te, ez a különbség behozható.`

  const turnoutImpactText =
    everyN && everyN >= 2
      ? `Ez ugyanaz, mintha minden ${everyN}. otthon maradó elmenne szavazni.`
      : null

  const flyerImpactText =
    everyN && everyN >= 2
      ? `Ha minden ${everyN}. otthon maradó elmegy, eltűnik az ${marginText} különbség.`
      : `A körzetben ${marginText} volt a különbség. Ennyi szavazat valóban eldönthet egy választást.`

  const cardCopy = {
    displayName,
    marginText,
    groupImpactText,
    turnoutImpactText,
  }

  const flyerCopy = {
    displayName,
    nonVotersText,
    flyerImpactText,
    turnoutImpactText,
  }

  async function capturePng(ref, pixelRatio = 2) {
    return toPng(ref.current, { pixelRatio, cacheBust: true })
  }

  async function handleShare() {
    try {
      setLoadingShare(true)
      const dataUrl = await capturePng(exportCardRef)
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], 'szavazatom-dont.png', { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'A szavazatom dönthet.' })
        } catch {
          // Native share was cancelled.
        }
      } else {
        triggerDownload(dataUrl, 'szavazatom-dont.png')
      }
    } finally {
      setLoadingShare(false)
    }
  }

  async function handleDownloadCard() {
    try {
      setLoadingShare(true)
      const dataUrl = await capturePng(exportCardRef)
      triggerDownload(dataUrl, 'szavazatom-dont.png')
    } finally {
      setLoadingShare(false)
    }
  }

  async function handleFlyerDownload() {
    try {
      setLoadingFlyer(true)
      const dataUrl = await capturePng(exportFlyerRef)
      triggerDownload(dataUrl, 'korzetunk-otthon-maradoi.png')
    } finally {
      setLoadingFlyer(false)
    }
  }

  function triggerDownload(dataUrl, filename) {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    a.click()
  }

  return (
    <div className="share-page">
      <div
        className="share-page-header"
        style={{ marginBottom: '1.75rem' }}
      >
        <h3 style={pageTitleStyle}>Megosztás</h3>
        <p style={pageIntroStyle}>Mentsd le vagy oszd meg a kártyákat.</p>
      </div>

      <div className="share-cols">
        <div className="share-col share-col-primary">
          <div style={{ marginBottom: '1rem' }}>
            <p style={eyebrowStyle}>A te vállalásod</p>
            <h4 style={sectionTitleStyle}>Social media kártya</h4>
          </div>

          <div style={{ width: '100%', maxWidth: 430 }}>
            <SocialCardPreview
              mobilizCount={mobilizCount}
              dotCount={previewDotCount}
              showMore={showPreviewMore}
              copy={cardCopy}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: '1rem', width: '100%', maxWidth: 430 }}>
            <button
              onClick={handleShare}
              disabled={loadingShare}
              style={primaryBtnStyle(loadingShare)}
            >
              {loadingShare ? 'Feldolgozás...' : 'Megosztom ->'}
            </button>
            <button
              onClick={handleDownloadCard}
              disabled={loadingShare}
              style={secondaryBtnStyle}
            >
              Letöltés (1080x1350 PNG)
            </button>
          </div>
        </div>

        <div className="share-col share-col-secondary">
          <div style={{ marginBottom: '1rem' }}>
            <p style={eyebrowStyle}>Körzeted otthon maradóinak</p>
            <h4 style={sectionTitleStyle}>Felhívó a szomszédaidnak</h4>
          </div>

          <div style={{ width: '100%', maxWidth: 360 }}>
            <FlyerPreview copy={flyerCopy} />
          </div>

          <div style={{ marginTop: '1rem', width: '100%', maxWidth: 360 }}>
            <button
              onClick={handleFlyerDownload}
              disabled={loadingFlyer}
              style={flyerBtnStyle(loadingFlyer)}
            >
              {loadingFlyer ? 'Feldolgozás...' : 'Letöltés (1080x1350 PNG)'}
            </button>
          </div>
        </div>
      </div>

      <p style={footnoteStyle}>Nem tárolunk semmilyen személyes adatot.</p>

      <div
        style={hiddenExportWrapStyle}
      >
        <div
          ref={exportCardRef}
          style={exportSurfaceStyle}
        >
          <SocialCardPreview
            mobilizCount={mobilizCount}
            dotCount={exportDotCount}
            showMore={showExportMore}
            copy={cardCopy}
            exportMode
          />
        </div>
      </div>

      <div
        style={hiddenExportWrapStyle}
      >
        <div
          ref={exportFlyerRef}
          style={exportSurfaceStyle}
        >
          <FlyerPreview copy={flyerCopy} exportMode />
        </div>
      </div>
    </div>
  )
}

function SocialCardPreview({ mobilizCount, dotCount, showMore, copy, exportMode = false }) {
  return (
    <div style={cardShellStyle(exportMode)}>
      <CardGlow />
      <div style={cardInnerStyle}>
        <BrandLogo exportMode={exportMode} />
        <div style={cardBodyStyle(exportMode)}>
          <CardHero
            mobilizCount={mobilizCount}
            dotCount={dotCount}
            showMore={showMore}
            exportMode={exportMode}
          />
          <CardImpactPanel copy={copy} exportMode={exportMode} />
        </div>
      </div>
    </div>
  )
}

function FlyerPreview({ copy, exportMode = false }) {
  return (
    <div style={flyerShellStyle(exportMode)}>
      <FlyerGlow />
      <div style={cardInnerStyle}>
        <BrandLogo exportMode={exportMode} />
        <div style={flyerBodyStyle(exportMode)}>
          <FlyerHero
            displayName={copy.displayName}
            nonVotersText={copy.nonVotersText}
            exportMode={exportMode}
          />
          <FlyerMessage
            flyerImpactText={copy.flyerImpactText}
            turnoutImpactText={copy.turnoutImpactText}
            exportMode={exportMode}
          />
          <FlyerCta exportMode={exportMode} />
        </div>
      </div>
    </div>
  )
}

function CardGlow() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(circle at 82% 78%, rgba(227,90,43,0.16), transparent 30%), radial-gradient(circle at 16% 14%, rgba(215,156,28,0.16), transparent 24%)',
        pointerEvents: 'none',
      }}
    />
  )
}

function FlyerGlow() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(circle at 84% 22%, rgba(227,90,43,0.16), transparent 34%), radial-gradient(circle at 14% 78%, rgba(215,156,28,0.12), transparent 28%)',
        pointerEvents: 'none',
      }}
    />
  )
}

function BrandLogo({ exportMode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: exportMode ? 8 : 7, position: 'relative', zIndex: 1 }}>
      <DotMark exportMode={exportMode} />
      <span style={logoTextStyle(exportMode)}>SzavazatSúly</span>
    </div>
  )
}

function DotMark({ exportMode }) {
  return (
    <svg width={exportMode ? '22' : '18'} height={exportMode ? '12' : '10'} viewBox="0 0 18 10">
      <circle cx="4" cy="5" r="4" fill="#E35A2B" />
      <circle cx="11" cy="5" r="3" fill="#D79C1C" opacity="0.92" />
      <circle cx="16" cy="5" r="2" fill="#E35A2B" opacity="0.35" />
    </svg>
  )
}

function CardHero({ mobilizCount, dotCount, showMore, exportMode }) {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={cardKickerStyle(exportMode)}>Én hozok</div>
      <div style={cardCountStyle(exportMode)}>{mobilizCount}</div>
      <div style={cardUnitStyle(exportMode)}>embert</div>
      <div style={cardDotsRowStyle(exportMode)}>
        <span style={leadDotStyle(exportMode)} />
        {Array.from({ length: dotCount }, (_, index) => (
          <span key={index} style={supportDotStyle(exportMode)} />
        ))}
        {showMore && (
          <span style={extraDotsStyle(exportMode)}>+{mobilizCount - dotCount}</span>
        )}
      </div>
    </div>
  )
}

function CardImpactPanel({ copy, exportMode }) {
  return (
    <div style={cardPanelStyle(exportMode)}>
      <div style={cardPanelDividerStyle(exportMode)} />
      <div style={cardAreaStyle(exportMode)}>{copy.displayName}</div>
      <div style={impactBlockStyle(exportMode)}>
        <div style={impactLabelStyle(exportMode)}>Különbség 2022-ben</div>
        <div style={impactValueStyle(exportMode, 'ember')}>{copy.marginText}</div>
      </div>
      <p style={impactBodyStyle(exportMode)}>
        {copy.groupImpactText}
      </p>
      {copy.turnoutImpactText && (
        <p style={impactSupportStyle(exportMode)}>
          {copy.turnoutImpactText}
        </p>
      )}
    </div>
  )
}

function FlyerHero({ displayName, nonVotersText, exportMode }) {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <p style={flyerAreaStyle(exportMode)}>{displayName}</p>
      <div style={flyerCountStyle(exportMode)}>{nonVotersText}</div>
      <p style={flyerSubtitleStyle(exportMode)}>ember nem szavazott 2022-ben</p>
    </div>
  )
}

function FlyerMessage({ flyerImpactText, turnoutImpactText, exportMode }) {
  return (
    <div style={flyerMessageWrapStyle(exportMode)}>
      <p style={flyerMessageLeadStyle(exportMode)}>{flyerImpactText}</p>
      {turnoutImpactText && (
        <p style={flyerMessageSupportStyle(exportMode)}>{turnoutImpactText}</p>
      )}
    </div>
  )
}

function FlyerCta({ exportMode }) {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <p style={flyerCtaStyle(exportMode)}>Menj el szavazni!</p>
      <p style={flyerCtaSubStyle(exportMode)}>Egy mozgósított szavazó is számít.</p>
    </div>
  )
}

function cardShellStyle(exportMode) {
  return {
    width: '100%',
    minHeight: exportMode ? EXP_H : 386,
    background: 'linear-gradient(155deg, #fffaf3 0%, #f8eee2 56%, #f1e0d0 100%)',
    borderRadius: exportMode ? 0 : 28,
    border: exportMode ? 'none' : '1px solid #dec8b1',
    boxShadow: exportMode ? 'none' : '0 26px 56px rgba(89,53,24,0.12)',
    position: 'relative',
    overflow: 'hidden',
  }
}

function flyerShellStyle(exportMode) {
  return {
    width: '100%',
    minHeight: exportMode ? EXP_H : 478,
    background: 'linear-gradient(160deg, #fffaf3 0%, #f7ecdf 58%, #efdccc 100%)',
    borderRadius: exportMode ? 0 : 24,
    border: exportMode ? 'none' : '1px solid #dec8b1',
    boxShadow: exportMode ? 'none' : '0 26px 56px rgba(89,53,24,0.1)',
    position: 'relative',
    overflow: 'hidden',
  }
}

const cardInnerStyle = {
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: '1.55rem',
  boxSizing: 'border-box',
}

function cardBodyStyle(exportMode) {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    gap: exportMode ? '1.35rem' : '1rem',
    marginTop: exportMode ? '1.6rem' : '1.15rem',
  }
}

function flyerBodyStyle(exportMode) {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
    gap: exportMode ? '1.4rem' : '1.05rem',
    marginTop: exportMode ? '1.6rem' : '1.25rem',
  }
}

function logoTextStyle(exportMode) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 700,
    fontSize: exportMode ? '0.78rem' : '0.6rem',
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: '#8d7763',
  }
}

function cardKickerStyle(exportMode) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 700,
    fontSize: exportMode ? '1.02rem' : '0.82rem',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: '#8d7763',
    marginBottom: exportMode ? 4 : 2,
  }
}

function cardCountStyle(exportMode) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 900,
    fontSize: exportMode ? '7.9rem' : '5.7rem',
    lineHeight: 0.92,
    letterSpacing: '-0.03em',
    color: '#d85026',
  }
}

function cardUnitStyle(exportMode) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 900,
    fontSize: exportMode ? '1.85rem' : '1.5rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#34251b',
    marginTop: exportMode ? 6 : 4,
  }
}

function cardDotsRowStyle(exportMode) {
  return {
    display: 'flex',
    flexWrap: 'wrap',
    gap: exportMode ? 6 : 5,
    marginTop: exportMode ? 16 : 12,
    alignItems: 'center',
  }
}

function leadDotStyle(exportMode) {
  return {
    width: exportMode ? 16 : 12,
    height: exportMode ? 16 : 12,
    borderRadius: '50%',
    backgroundColor: '#D79C1C',
    display: 'inline-block',
    flexShrink: 0,
  }
}

function supportDotStyle(exportMode) {
  return {
    width: exportMode ? 11 : 9,
    height: exportMode ? 11 : 9,
    borderRadius: '50%',
    backgroundColor: '#E35A2B',
    display: 'inline-block',
    opacity: 0.9,
    flexShrink: 0,
  }
}

function extraDotsStyle(exportMode) {
  return {
    color: '#8d7763',
    fontSize: exportMode ? 15 : 11,
    fontFamily: 'Barlow Condensed, sans-serif',
    letterSpacing: '0.05em',
  }
}

function cardPanelStyle(exportMode) {
  return {
    position: 'relative',
    zIndex: 1,
    background: exportMode ? 'rgba(255, 249, 241, 0.62)' : 'rgba(255, 249, 241, 0.58)',
    border: '1px solid rgba(205, 181, 155, 0.88)',
    borderRadius: exportMode ? 18 : 16,
    padding: exportMode ? '1.15rem 1.15rem 1.08rem' : '0.95rem 0.95rem 0.88rem',
    boxShadow: exportMode ? '0 12px 28px rgba(89,53,24,0.06)' : 'none',
    backdropFilter: 'blur(8px)',
  }
}

function cardPanelDividerStyle(exportMode) {
  return {
    width: '100%',
    height: 1,
    background: '#d8c2ad',
    marginBottom: exportMode ? 12 : 10,
  }
}

function cardAreaStyle(exportMode) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: exportMode ? '0.84rem' : '0.68rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#8d7763',
    marginBottom: exportMode ? 10 : 8,
  }
}

function impactBlockStyle(exportMode) {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: exportMode ? 4 : 2,
    marginBottom: exportMode ? 10 : 8,
  }
}

function impactLabelStyle(exportMode) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: exportMode ? '0.95rem' : '0.76rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#8d7763',
  }
}

function impactValueStyle(exportMode, tone) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 900,
    fontSize: exportMode ? '1.45rem' : '1.08rem',
    lineHeight: 1.02,
    color: tone === 'ember' ? '#d85026' : '#94680f',
  }
}

function impactBodyStyle(exportMode) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: exportMode ? '1.1rem' : '0.95rem',
    lineHeight: exportMode ? 1.18 : 1.2,
    color: '#35251b',
    margin: 0,
    fontWeight: 700,
  }
}

function impactSupportStyle(exportMode) {
  return {
    fontFamily: 'Crimson Pro, Georgia, serif',
    fontSize: exportMode ? '1.12rem' : '0.96rem',
    lineHeight: exportMode ? 1.34 : 1.35,
    color: '#6f5b4b',
    margin: exportMode ? '0.55rem 0 0' : '0.4rem 0 0',
    fontStyle: 'italic',
  }
}

function flyerAreaStyle(exportMode) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 700,
    fontSize: exportMode ? '0.88rem' : '0.72rem',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: '#cf5b31',
    margin: '0 0 8px',
  }
}

function flyerCountStyle(exportMode) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 900,
    fontSize: exportMode ? '5.3rem' : '4.1rem',
    lineHeight: 0.96,
    letterSpacing: '-0.02em',
    color: '#2f2118',
  }
}

function flyerSubtitleStyle(exportMode) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 700,
    fontSize: exportMode ? '1.22rem' : '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#7a6654',
    margin: exportMode ? '8px 0 0' : '6px 0 0',
  }
}

function flyerMessageWrapStyle(exportMode) {
  return {
    background: 'rgba(245, 232, 218, 0.84)',
    borderRadius: exportMode ? 18 : 16,
    padding: exportMode ? '1.2rem 1.2rem 1.1rem' : '1rem',
    border: '1px solid rgba(227,90,43,0.22)',
    position: 'relative',
    zIndex: 1,
    boxShadow: exportMode ? '0 12px 24px rgba(89,53,24,0.05)' : 'none',
  }
}

function flyerMessageLeadStyle(exportMode) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 800,
    fontSize: exportMode ? '1.28rem' : '1.02rem',
    lineHeight: exportMode ? 1.12 : 1.14,
    color: '#35251b',
    margin: 0,
  }
}

function flyerMessageSupportStyle(exportMode) {
  return {
    fontFamily: 'Crimson Pro, Georgia, serif',
    fontStyle: 'italic',
    fontSize: exportMode ? '1.08rem' : '0.94rem',
    lineHeight: 1.34,
    color: '#7a6654',
    margin: exportMode ? '0.7rem 0 0' : '0.55rem 0 0',
  }
}

function flyerCtaStyle(exportMode) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 900,
    fontSize: exportMode ? '2.7rem' : '2rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: '#d85026',
    margin: '0 0 4px',
    lineHeight: 1,
  }
}

function flyerCtaSubStyle(exportMode) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: exportMode ? '0.98rem' : '0.82rem',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    color: '#8d7763',
    margin: 0,
  }
}

function primaryBtnStyle(disabled) {
  return {
    background: disabled
      ? 'linear-gradient(180deg, #efe5d7 0%, #ead9c5 100%)'
      : 'linear-gradient(180deg, #e35a2b 0%, #be4219 100%)',
    color: disabled ? '#7a6654' : '#fff9f1',
    border: '1px solid rgba(190,66,25,0.28)',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '1rem',
    borderRadius: 999,
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: '100%',
    boxShadow: disabled ? 'none' : '0 16px 32px rgba(227,90,43,0.18)',
    transition: 'box-shadow 0.2s ease',
  }
}

const secondaryBtnStyle = {
  background: 'rgba(252,248,241,0.78)',
  color: '#35251b',
  border: '1px solid #dcc8b4',
  fontFamily: 'Barlow Condensed, sans-serif',
  fontSize: '0.92rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '0.88rem',
  borderRadius: 999,
  cursor: 'pointer',
  width: '100%',
}

function flyerBtnStyle(disabled) {
  return {
    background: disabled
      ? 'rgba(252,248,241,0.6)'
      : 'linear-gradient(180deg, rgba(84,60,42,0.96) 0%, rgba(58,39,28,0.98) 100%)',
    color: disabled ? '#7a6654' : 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(89,53,24,0.18)',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.95rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '0.95rem',
    borderRadius: 999,
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: '100%',
    transition: 'opacity 0.2s ease',
    boxShadow: disabled ? 'none' : '0 16px 30px rgba(89,53,24,0.14)',
  }
}

const hiddenExportWrapStyle = {
  position: 'fixed',
  top: '-9999px',
  left: '-9999px',
  width: EXP_W,
  height: EXP_H,
  zIndex: -1,
  pointerEvents: 'none',
}

const exportSurfaceStyle = {
  width: EXP_W,
  height: EXP_H,
}

const pageTitleStyle = {
  fontFamily: 'Barlow Condensed, sans-serif',
  fontWeight: 800,
  fontSize: '1.8rem',
  color: '#35251b',
  margin: 0,
  lineHeight: 1.1,
}

const pageIntroStyle = {
  fontFamily: 'Crimson Pro, Georgia, serif',
  fontSize: '1rem',
  fontStyle: 'italic',
  color: '#7a6654',
  margin: '4px 0 0',
}

const eyebrowStyle = {
  fontFamily: 'Barlow Condensed, sans-serif',
  fontWeight: 700,
  fontSize: '0.72rem',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: '#7a6654',
  margin: 0,
}

const sectionTitleStyle = {
  fontFamily: 'Barlow Condensed, sans-serif',
  fontWeight: 800,
  fontSize: '1.4rem',
  color: '#35251b',
  margin: '2px 0 0',
  lineHeight: 1.1,
}

const footnoteStyle = {
  fontFamily: 'Crimson Pro, Georgia, serif',
  fontSize: '0.83rem',
  fontStyle: 'italic',
  color: '#7a6654',
  textAlign: 'center',
  opacity: 0.72,
  margin: '2rem 0 0',
}
