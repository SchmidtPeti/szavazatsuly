import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'

const EXPORT_SPECS = {
  social: {
    width: 540,
    height: 675,
    pixelRatio: 2,
    label: '1080x1350 PNG',
  },
  print: {
    width: 620,
    height: 874,
    pixelRatio: 2,
    label: 'A6 PNG',
  },
}

const CARD_VARIANTS = {
  screen: {
    height: 386,
    radius: 28,
    padding: '1.45rem',
    border: '1px solid #dec8b1',
    shadow: '0 26px 56px rgba(89,53,24,0.12)',
    logoGap: 7,
    logoSize: '0.6rem',
    kickerSize: '0.82rem',
    countSize: '6.1rem',
    unitSize: '1.55rem',
    bodyJustify: 'flex-start',
    bodyGap: '1rem',
    bodyMarginTop: '1.15rem',
    leadDot: 12,
    supportDot: 9,
    dotsGap: 5,
    dotsMarginTop: 12,
    panelPadding: '1rem 1rem 0.95rem',
    panelRadius: 16,
    panelLabel: '0.76rem',
    panelValue: '1.1rem',
    panelBody: '1rem',
    panelSupport: '0.95rem',
    footer: 'social',
    footerTextSize: '1.68rem',
    footerGap: 6,
    footerLetterSpacing: '0.035em',
    footerPaddingTop: '0.85rem',
  },
  social: {
    height: EXPORT_SPECS.social.height,
    radius: 0,
    padding: '1.5rem',
    border: 'none',
    shadow: 'none',
    logoGap: 8,
    logoSize: '0.78rem',
    kickerSize: '1rem',
    countSize: '8.9rem',
    unitSize: '2.1rem',
    bodyJustify: 'flex-start',
    bodyGap: '1rem',
    bodyMarginTop: '1.1rem',
    leadDot: 16,
    supportDot: 12,
    dotsGap: 7,
    dotsMarginTop: 18,
    panelPadding: '1.15rem 1.15rem 1.05rem',
    panelRadius: 18,
    panelLabel: '0.96rem',
    panelValue: '1.7rem',
    panelBody: '1.28rem',
    panelSupport: '1.12rem',
    footer: 'social',
    footerTextSize: '2.14rem',
    footerGap: 8,
    footerLetterSpacing: '0.032em',
    footerPaddingTop: '1rem',
  },
  print: {
    height: EXPORT_SPECS.print.height,
    radius: 0,
    padding: '1.65rem',
    border: 'none',
    shadow: 'none',
    logoGap: 9,
    logoSize: '0.86rem',
    kickerSize: '1.06rem',
    countSize: '10.8rem',
    unitSize: '2.35rem',
    bodyJustify: 'flex-start',
    bodyGap: '1.15rem',
    bodyMarginTop: '1.2rem',
    leadDot: 18,
    supportDot: 13,
    dotsGap: 7,
    dotsMarginTop: 18,
    panelPadding: '1.25rem 1.2rem 1.15rem',
    panelRadius: 20,
    panelLabel: '0.98rem',
    panelValue: '1.88rem',
    panelBody: '1.36rem',
    panelSupport: '1.08rem',
    footer: 'print',
    footerTextSize: '2rem',
    footerGap: 6,
    footerLetterSpacing: '0.04em',
    footerPaddingTop: '0.8rem',
  },
}

const FLYER_VARIANTS = {
  screen: {
    height: 478,
    radius: 24,
    padding: '1.45rem',
    border: '1px solid #dec8b1',
    shadow: '0 26px 56px rgba(89,53,24,0.1)',
    logoGap: 7,
    logoSize: '0.6rem',
    bodyGap: '1.15rem',
    bodyMarginTop: '1.2rem',
    areaSize: '0.72rem',
    countSize: '4.25rem',
    subtitleSize: '1rem',
    messagePadding: '1rem',
    messageRadius: 16,
    messageLead: '1.04rem',
    messageSupport: '0.95rem',
    ctaTop: '1.45rem',
    ctaWord: '2.6rem',
    ctaBottom: '1.85rem',
  },
  social: {
    height: EXPORT_SPECS.social.height,
    radius: 0,
    padding: '1.5rem',
    border: 'none',
    shadow: 'none',
    logoGap: 8,
    logoSize: '0.78rem',
    bodyGap: '1.2rem',
    bodyMarginTop: '1rem',
    areaSize: '0.92rem',
    countSize: '6.6rem',
    subtitleSize: '1.45rem',
    messagePadding: '1.15rem',
    messageRadius: 18,
    messageLead: '1.46rem',
    messageSupport: '1.08rem',
    ctaTop: '2.35rem',
    ctaWord: '4.5rem',
    ctaBottom: '3rem',
  },
  print: {
    height: EXPORT_SPECS.print.height,
    radius: 0,
    padding: '1.65rem',
    border: 'none',
    shadow: 'none',
    logoGap: 9,
    logoSize: '0.86rem',
    bodyGap: '1.3rem',
    bodyMarginTop: '1.15rem',
    areaSize: '0.98rem',
    countSize: '8.2rem',
    subtitleSize: '1.72rem',
    messagePadding: '1.3rem',
    messageRadius: 20,
    messageLead: '1.6rem',
    messageSupport: '1.12rem',
    ctaTop: '2.7rem',
    ctaWord: '5.35rem',
    ctaBottom: '3.4rem',
  },
}

export default function ShareCard({ oevk, mobilizCount }) {
  const socialCardRef = useRef(null)
  const socialFlyerRef = useRef(null)
  const printFlyerRef = useRef(null)
  const activeActionRef = useRef(null)
  const [loadingAction, setLoadingAction] = useState(null)

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

  const cardCopy = {
    displayName,
    marginText,
    socialLead:
      needCount === 1
        ? `Ha még egy ember ugyanígy mozgósít, ez a ${marginText} különbség behozható.`
        : `Ha ${needCountText}-en ugyanúgy mozgósítunk, mint én, ez a ${marginText} különbség behozható.`,
    socialSupport:
      everyN && everyN >= 2
        ? `Ez ugyanaz, mintha minden ${everyN}. otthon maradó elmenne szavazni.`
        : null,
    printLead:
      needCount === 1
        ? `Ez a ${marginText} különbség behozható, ha még egy ember ugyanígy mozgósít.`
        : `Ha ${needCountText}-en ugyanúgy mozgósítunk, a ${marginText} különbség behozható.`,
    printSupport:
      everyN && everyN >= 2
        ? `Ez nagyjából minden ${everyN}. otthon maradó szavazatát jelenti.`
        : null,
    socialFooter: {
      prefix: 'AZ ÉN',
      accent: 'SZAVAZATOM',
      suffix: 'DÖNTHET',
      screenReaderText: 'AZ ÉN SZAVAZATOM DÖNTHET.',
    },
    printFooter: {
      prefix: 'A TE MOZGÓSÍTÁSOD',
      accent: 'IS SZÁMÍT',
      suffix: '',
      screenReaderText: 'A TE MOZGÓSÍTÁSOD IS SZÁMÍT.',
    },
  }

  const flyerCopy = {
    displayName,
    nonVotersText,
    socialLead:
      everyN && everyN >= 2
        ? `Ha minden ${everyN}. otthon maradó elmegy, a ${marginText} különbség behozható.`
        : `A körzetben ${marginText} volt a különbség. Ennyi szavazat valóban eldönthet egy választást.`,
    socialSupport:
      everyN && everyN >= 2
        ? `Ez ugyanaz, mintha minden ${everyN}. otthon maradó elmenne szavazni.`
        : null,
    printLead:
      everyN && everyN >= 2
        ? `A ${marginText} különbség behozható, ha minden ${everyN}. otthon maradó szavaz.`
        : `A ${marginText} különbség ezen a körzeten belül valódi döntő erő.`,
    printSupport:
      everyN && everyN >= 2
        ? `Egyetlen mozdulat: menj el szavazni, és szólj másnak is.`
        : 'A te szavazatod itt is számít.',
  }

  async function capturePng(ref, exportKey) {
    const spec = EXPORT_SPECS[exportKey]
    return toPng(ref.current, {
      pixelRatio: spec.pixelRatio,
      cacheBust: true,
    })
  }

  async function withLoading(action, work) {
    if (activeActionRef.current) return

    activeActionRef.current = action
    try {
      setLoadingAction(action)
      await work()
    } finally {
      activeActionRef.current = null
      setLoadingAction(null)
    }
  }

  async function handleShareSocialCard() {
    await withLoading('share-card-social', async () => {
      const dataUrl = await capturePng(socialCardRef, 'social')
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], 'szavazatom-dont-social.png', { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'A szavazatom dönthet.' })
        } catch {
          // Native share was cancelled.
        }
      } else {
        triggerDownload(dataUrl, 'szavazatom-dont-social.png')
      }
    })
  }

  async function handleDownload(ref, exportKey, filename, action) {
    await withLoading(action, async () => {
      const dataUrl = await capturePng(ref, exportKey)
      triggerDownload(dataUrl, filename)
    })
  }

  function triggerDownload(dataUrl, filename) {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    a.click()
  }

  const isBusy = loadingAction !== null
  const isLoading = (action) => loadingAction === action

  return (
    <div className="share-page">
      <div className="share-page-header" style={{ marginBottom: '1.75rem' }}>
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
              variant="screen"
              mobilizCount={mobilizCount}
              dotCount={previewDotCount}
              showMore={showPreviewMore}
              copy={cardCopy}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: '1rem', width: '100%', maxWidth: 430 }}>
            <button
              onClick={handleShareSocialCard}
              disabled={isLoading('share-card-social')}
              aria-disabled={isBusy}
              style={primaryBtnStyle({ busy: isBusy, loading: isLoading('share-card-social') })}
            >
              {loadingAction === 'share-card-social' ? 'Feldolgozás...' : 'Megosztom ->'}
            </button>
            <button
              onClick={() => handleDownload(socialCardRef, 'social', 'szavazatom-dont-social.png', 'download-card-social')}
              disabled={isLoading('download-card-social')}
              aria-disabled={isBusy}
              style={secondaryBtnStyle({ busy: isBusy, loading: isLoading('download-card-social') })}
            >
              {loadingAction === 'download-card-social'
                ? 'Feldolgozás...'
                : `Letöltés socialra (${EXPORT_SPECS.social.label})`}
            </button>
          </div>
        </div>

        <div className="share-col share-col-secondary">
          <div style={{ marginBottom: '1rem' }}>
            <p style={eyebrowStyle}>Körzeted otthon maradóinak</p>
            <h4 style={sectionTitleStyle}>Felhívó a szomszédaidnak</h4>
          </div>

          <div style={{ width: '100%', maxWidth: 360 }}>
            <FlyerPreview variant="screen" copy={flyerCopy} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: '1rem', width: '100%', maxWidth: 360 }}>
            <button
              onClick={() => handleDownload(socialFlyerRef, 'social', 'korzetunk-otthon-maradoi-social.png', 'download-flyer-social')}
              disabled={isLoading('download-flyer-social')}
              aria-disabled={isBusy}
              style={secondaryBtnStyle({ busy: isBusy, loading: isLoading('download-flyer-social') })}
            >
              {loadingAction === 'download-flyer-social'
                ? 'Feldolgozás...'
                : `Letöltés socialra (${EXPORT_SPECS.social.label})`}
            </button>
            <button
              onClick={() => handleDownload(printFlyerRef, 'print', 'korzetunk-otthon-maradoi-print-a6.png', 'download-flyer-print')}
              disabled={isLoading('download-flyer-print')}
              aria-disabled={isBusy}
              style={flyerBtnStyle({ busy: isBusy, loading: isLoading('download-flyer-print') })}
            >
              {loadingAction === 'download-flyer-print'
                ? 'Feldolgozás...'
                : `Letöltés nyomtatáshoz (${EXPORT_SPECS.print.label})`}
            </button>
          </div>
        </div>
      </div>

      <p style={footnoteStyle}>Nem tárolunk semmilyen személyes adatot.</p>

      <HiddenExport spec={EXPORT_SPECS.social}>
        <div ref={socialCardRef} style={exportSurfaceStyle(EXPORT_SPECS.social)}>
          <SocialCardPreview
            variant="social"
            mobilizCount={mobilizCount}
            dotCount={exportDotCount}
            showMore={showExportMore}
            copy={cardCopy}
          />
        </div>
      </HiddenExport>

      <HiddenExport spec={EXPORT_SPECS.social}>
        <div ref={socialFlyerRef} style={exportSurfaceStyle(EXPORT_SPECS.social)}>
          <FlyerPreview variant="social" copy={flyerCopy} />
        </div>
      </HiddenExport>

      <HiddenExport spec={EXPORT_SPECS.print}>
        <div ref={printFlyerRef} style={exportSurfaceStyle(EXPORT_SPECS.print)}>
          <FlyerPreview variant="print" copy={flyerCopy} />
        </div>
      </HiddenExport>
    </div>
  )
}

function HiddenExport({ spec, children }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: spec.width,
        height: spec.height,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      {children}
    </div>
  )
}

function SocialCardPreview({ mobilizCount, dotCount, showMore, copy, variant }) {
  const config = CARD_VARIANTS[variant]
  const leadText = variant === 'print' ? copy.printLead : copy.socialLead
  const supportText = variant === 'print' ? copy.printSupport : copy.socialSupport
  const footerCopy = config.footer === 'print' ? copy.printFooter : copy.socialFooter

  return (
    <div style={cardShellStyle(config)}>
      <CardGlow />
      <div style={sharedInnerStyle(config)}>
        <BrandLogo gap={config.logoGap} textSize={config.logoSize} />
        <div style={stackStyle(config)}>
          <CardHero
            config={config}
            mobilizCount={mobilizCount}
            dotCount={dotCount}
            showMore={showMore}
          />
          <CardImpactPanel
            config={config}
            displayName={copy.displayName}
            marginText={copy.marginText}
            leadText={leadText}
            supportText={supportText}
          />
          {config.footer && <CardFooter config={config} footer={footerCopy} />}
        </div>
      </div>
    </div>
  )
}

function FlyerPreview({ copy, variant }) {
  const config = FLYER_VARIANTS[variant]
  const leadText = variant === 'print' ? copy.printLead : copy.socialLead
  const supportText = variant === 'print' ? copy.printSupport : copy.socialSupport

  return (
    <div style={flyerShellStyle(config)}>
      <FlyerGlow />
      <div style={sharedInnerStyle(config)}>
        <BrandLogo gap={config.logoGap} textSize={config.logoSize} />
        <div style={stackStyle(config)}>
          <FlyerHero
            config={config}
            displayName={copy.displayName}
            nonVotersText={copy.nonVotersText}
          />
          <FlyerMessage
            config={config}
            leadText={leadText}
            supportText={supportText}
          />
          <FlyerCta config={config} />
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
          'radial-gradient(circle at 86% 24%, rgba(227,90,43,0.18), transparent 36%), radial-gradient(circle at 14% 84%, rgba(215,156,28,0.13), transparent 30%)',
        pointerEvents: 'none',
      }}
    />
  )
}

function BrandLogo({ gap, textSize }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, position: 'relative', zIndex: 1 }}>
      <DotMark textSize={textSize} />
      <span
        style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700,
          fontSize: textSize,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: '#8d7763',
        }}
      >
        SzavazatSúly
      </span>
    </div>
  )
}

function DotMark({ textSize }) {
  const large = parseFloat(textSize) >= 0.78
  return (
    <svg width={large ? '22' : '18'} height={large ? '12' : '10'} viewBox="0 0 18 10">
      <circle cx="4" cy="5" r="4" fill="#E35A2B" />
      <circle cx="11" cy="5" r="3" fill="#D79C1C" opacity="0.92" />
      <circle cx="16" cy="5" r="2" fill="#E35A2B" opacity="0.35" />
    </svg>
  )
}

function CardHero({ config, mobilizCount, dotCount, showMore }) {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={cardKickerStyle(config)}>{'Én hozok'}</div>
      <div style={cardCountStyle(config)}>{mobilizCount}</div>
      <div style={cardUnitStyle(config)}>embert</div>
      <div style={cardDotsRowStyle(config)}>
        <span style={leadDotStyle(config)} />
        {Array.from({ length: dotCount }, (_, index) => (
          <span key={index} style={supportDotStyle(config)} />
        ))}
        {showMore && <span style={extraDotsStyle(config)}>+{mobilizCount - dotCount}</span>}
      </div>
    </div>
  )
}

function CardImpactPanel({ config, displayName, marginText, leadText, supportText }) {
  return (
    <div style={cardPanelStyle(config)}>
      <div style={cardAreaStyle(config)}>{displayName}</div>
      <div style={impactBlockStyle}>
        <div style={impactLabelStyle(config)}>Különbség 2022-ben</div>
        <div style={impactValueStyle(config)}>{marginText}</div>
      </div>
      <p style={impactBodyStyle(config)}>{leadText}</p>
      {supportText && <p style={impactSupportStyle(config)}>{supportText}</p>}
    </div>
  )
}

function CardFooter({ config, footer }) {
  return (
    <div style={cardFooterWrapStyle(config)}>
      <span style={cardFooterTextStyle(config)}>{footer.prefix}</span>
      <span style={cardFooterAccentStyle(config)}>{footer.accent}</span>
      {footer.suffix && <span style={cardFooterTextStyle(config)}>{footer.suffix}</span>}
      <span style={cardFooterDotStyle(config)}>.</span>
      <span style={visuallyHiddenStyle}>{footer.screenReaderText}</span>
    </div>
  )
}

function FlyerHero({ config, displayName, nonVotersText }) {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <p style={flyerAreaStyle(config)}>{displayName}</p>
      <div style={flyerCountStyle(config)}>{nonVotersText}</div>
      <p style={flyerSubtitleStyle(config)}>ember nem szavazott 2022-ben</p>
    </div>
  )
}

function FlyerMessage({ config, leadText, supportText }) {
  return (
    <div style={flyerMessageWrapStyle(config)}>
      <p style={flyerMessageLeadStyle(config)}>{leadText}</p>
      {supportText && <p style={flyerMessageSupportStyle(config)}>{supportText}</p>}
    </div>
  )
}

function FlyerCta({ config }) {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={flyerCtaWrapStyle}>
        <div style={flyerCtaTopStyle(config)}>A TE</div>
        <div style={flyerCtaWordStyle(config)}>SZAVAZATOD</div>
        <div style={flyerCtaBottomStyle(config)}>
          IS DÖNTHET<span style={flyerCtaDotStyle}>.</span>
        </div>
      </div>
    </div>
  )
}

function cardShellStyle(config) {
  return {
    width: '100%',
    minHeight: config.height,
    background: 'linear-gradient(155deg, #fffaf3 0%, #f8eee2 56%, #f1e0d0 100%)',
    borderRadius: config.radius,
    border: config.border,
    boxShadow: config.shadow,
    position: 'relative',
    overflow: 'hidden',
  }
}

function flyerShellStyle(config) {
  return {
    width: '100%',
    minHeight: config.height,
    background: 'linear-gradient(160deg, #fffaf3 0%, #f7ecdf 58%, #efdccc 100%)',
    borderRadius: config.radius,
    border: config.border,
    boxShadow: config.shadow,
    position: 'relative',
    overflow: 'hidden',
  }
}

function sharedInnerStyle(config) {
  return {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: config.padding,
    boxSizing: 'border-box',
  }
}

function stackStyle(config) {
  return {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: config.bodyJustify,
    flex: 1,
    gap: config.bodyGap,
    marginTop: config.bodyMarginTop,
  }
}

function cardKickerStyle(config) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 700,
    fontSize: config.kickerSize,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: '#8d7763',
    marginBottom: 4,
  }
}

function cardCountStyle(config) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 900,
    fontSize: config.countSize,
    lineHeight: 0.92,
    letterSpacing: '-0.03em',
    color: '#d85026',
  }
}

function cardUnitStyle(config) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 900,
    fontSize: config.unitSize,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#34251b',
    marginTop: 6,
  }
}

function cardDotsRowStyle(config) {
  return {
    display: 'flex',
    flexWrap: 'wrap',
    gap: config.dotsGap,
    marginTop: config.dotsMarginTop,
    alignItems: 'center',
  }
}

function leadDotStyle(config) {
  return {
    width: config.leadDot,
    height: config.leadDot,
    borderRadius: '50%',
    backgroundColor: '#D79C1C',
    display: 'inline-block',
    flexShrink: 0,
  }
}

function supportDotStyle(config) {
  return {
    width: config.supportDot,
    height: config.supportDot,
    borderRadius: '50%',
    backgroundColor: '#E35A2B',
    display: 'inline-block',
    opacity: 0.9,
    flexShrink: 0,
  }
}

function extraDotsStyle(config) {
  return {
    color: '#8d7763',
    fontSize: config.logoSize,
    fontFamily: 'Barlow Condensed, sans-serif',
    letterSpacing: '0.05em',
  }
}

function cardPanelStyle(config) {
  return {
    position: 'relative',
    zIndex: 1,
    background: 'rgba(255, 249, 241, 0.62)',
    border: '1px solid rgba(205, 181, 155, 0.88)',
    borderRadius: config.panelRadius,
    padding: config.panelPadding,
    boxShadow: config.shadow === 'none' ? 'none' : '0 12px 24px rgba(89,53,24,0.05)',
    backdropFilter: 'blur(8px)',
  }
}

function cardAreaStyle(config) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: `calc(${config.panelLabel} + 0.08rem)`,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: '#8d7763',
    marginBottom: 10,
  }
}

const impactBlockStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  marginBottom: 10,
}

function impactLabelStyle(config) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: config.panelLabel,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#8d7763',
  }
}

function impactValueStyle(config) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 900,
    fontSize: config.panelValue,
    lineHeight: 1.02,
    color: '#d85026',
  }
}

function impactBodyStyle(config) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: config.panelBody,
    lineHeight: 1.16,
    color: '#35251b',
    margin: 0,
    fontWeight: 700,
  }
}

function impactSupportStyle(config) {
  return {
    fontFamily: 'Crimson Pro, Georgia, serif',
    fontSize: config.panelSupport,
    lineHeight: 1.32,
    color: '#6f5b4b',
    margin: '0.55rem 0 0',
    fontStyle: 'italic',
  }
}

function cardFooterWrapStyle(config) {
  return {
    display: 'flex',
    alignItems: 'baseline',
    gap: config.footerGap,
    flexWrap: 'wrap',
    marginTop: 'auto',
    paddingTop: config.footerPaddingTop,
  }
}

function cardFooterTextStyle(config) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 900,
    fontSize: config.footerTextSize,
    lineHeight: 1,
    letterSpacing: config.footerLetterSpacing,
    textTransform: 'uppercase',
    color: 'var(--ink)',
  }
}

function cardFooterAccentStyle(config) {
  return {
    ...cardFooterTextStyle(config),
    color: 'var(--ember)',
  }
}

function cardFooterDotStyle(config) {
  return {
    color: 'var(--amber)',
    fontSize: config.footerTextSize,
    lineHeight: 1,
    fontWeight: 900,
  }
}

function flyerAreaStyle(config) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 700,
    fontSize: config.areaSize,
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: '#cf5b31',
    margin: '0 0 8px',
  }
}

function flyerCountStyle(config) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 900,
    fontSize: config.countSize,
    lineHeight: 0.96,
    letterSpacing: '-0.02em',
    color: '#2f2118',
  }
}

function flyerSubtitleStyle(config) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 700,
    fontSize: config.subtitleSize,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: '#7a6654',
    margin: '8px 0 0',
  }
}

function flyerMessageWrapStyle(config) {
  return {
    background: 'rgba(245, 232, 218, 0.84)',
    borderRadius: config.messageRadius,
    padding: config.messagePadding,
    border: '1px solid rgba(227,90,43,0.22)',
    position: 'relative',
    zIndex: 1,
    boxShadow: config.shadow === 'none' ? 'none' : '0 12px 24px rgba(89,53,24,0.05)',
  }
}

function flyerMessageLeadStyle(config) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 800,
    fontSize: config.messageLead,
    lineHeight: 1.12,
    color: '#35251b',
    margin: 0,
  }
}

function flyerMessageSupportStyle(config) {
  return {
    fontFamily: 'Crimson Pro, Georgia, serif',
    fontStyle: 'italic',
    fontSize: config.messageSupport,
    lineHeight: 1.34,
    color: '#7a6654',
    margin: '0.7rem 0 0',
  }
}

const flyerCtaWrapStyle = {
  fontFamily: 'Barlow Condensed, sans-serif',
  fontWeight: 900,
  lineHeight: 0.96,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
}

function flyerCtaTopStyle(config) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 900,
    fontSize: config.ctaWord,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--ink)',
    margin: 0,
    lineHeight: 1,
  }
}

function flyerCtaWordStyle(config) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 900,
    fontSize: config.ctaWord,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    color: 'var(--ember)',
    margin: '0.08rem 0',
    lineHeight: 0.95,
  }
}

function flyerCtaBottomStyle(config) {
  return {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 900,
    fontSize: config.ctaWord,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--ink)',
    margin: 0,
    lineHeight: 1,
  }
}

const flyerCtaDotStyle = {
  color: 'var(--amber)',
}

function buttonStateChrome({ busy, loading }) {
  return {
    appearance: 'none',
    WebkitAppearance: 'none',
    WebkitTapHighlightColor: 'transparent',
    opacity: busy && !loading ? 0.68 : 1,
    pointerEvents: busy && !loading ? 'none' : 'auto',
    cursor: busy ? 'wait' : 'pointer',
  }
}

function primaryBtnStyle({ busy, loading }) {
  return {
    ...buttonStateChrome({ busy, loading }),
    background: loading
      ? 'linear-gradient(180deg, #efe5d7 0%, #ead9c5 100%)'
      : 'linear-gradient(180deg, #e35a2b 0%, #be4219 100%)',
    color: loading ? '#7a6654' : '#fff9f1',
    border: '1px solid rgba(190,66,25,0.28)',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '1rem',
    borderRadius: 999,
    width: '100%',
    boxShadow: loading ? 'none' : '0 16px 32px rgba(227,90,43,0.18)',
    transition: 'opacity 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
  }
}

function secondaryBtnStyle({ busy, loading }) {
  return {
    ...buttonStateChrome({ busy, loading }),
    background: loading ? 'rgba(239,229,215,0.92)' : 'rgba(252,248,241,0.78)',
    color: loading ? '#7a6654' : '#35251b',
    border: '1px solid #dcc8b4',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.92rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '0.9rem',
    borderRadius: 999,
    width: '100%',
    boxShadow: 'none',
    transition: 'opacity 0.2s ease, background 0.2s ease, color 0.2s ease',
  }
}

function flyerBtnStyle({ busy, loading }) {
  return {
    ...buttonStateChrome({ busy, loading }),
    background: loading
      ? 'rgba(252,248,241,0.6)'
      : 'linear-gradient(180deg, rgba(84,60,42,0.96) 0%, rgba(58,39,28,0.98) 100%)',
    color: loading ? '#7a6654' : 'rgba(255,255,255,0.92)',
    border: '1px solid rgba(89,53,24,0.18)',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '0.95rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    padding: '0.95rem',
    borderRadius: 999,
    width: '100%',
    transition: 'opacity 0.2s ease, background 0.2s ease',
    boxShadow: loading ? 'none' : '0 16px 30px rgba(89,53,24,0.14)',
  }
}

function exportSurfaceStyle(spec) {
  return {
    width: spec.width,
    height: spec.height,
  }
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

const visuallyHiddenStyle = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}
