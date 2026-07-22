import React, { useContext, useEffect, useRef, useState } from 'react'
import { withPrefix } from 'gatsby'
import { LangContext } from '../context/LangContext'
import { copy, timelines, socials } from '../content/copy'
import { useScrollAnimations } from '../hooks/useScrollAnimations'
import { SocialIcon } from './icons'

// DOM layer above the fixed WebGL canvas: one 100vh panel per camera beat.
export function Overlay({ animationsEnabled }) {
  const { lang } = useContext(LangContext)
  const t = copy[lang]
  const timeline = timelines[lang]
  const { rootRef, flashRef, progressBarRef } = useScrollAnimations({
    enabled: animationsEnabled,
    lang,
  })

  return (
    <>
      <div ref={progressBarRef} className="scroll-progress" aria-hidden="true" />
      <div ref={flashRef} className="screen-flash" aria-hidden="true" />

      <main ref={rootRef} className={`overlay ${animationsEnabled ? '' : 'overlay--static'}`}>
        <section id="home" className="story-panel panel-center">
          <div className="panel-card hero-card">
            <div className="hero-avatar">
              <img src={withPrefix('/images/main_me.jpg')} alt={t.heroName} />
            </div>
            <p className="hero-eyebrow">{t.heroAlias}</p>
            <h1 className="hero-name">{t.heroName}</h1>
            <p className="hero-role">{t.heroRole}</p>
            <div className="hero-socials">
              {socials.map((s) =>
                s.href ? (
                  <a key={s.key} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="icon-link">
                    <SocialIcon name={s.key} />
                  </a>
                ) : (
                  <QrIconButton key={s.key} social={s} scanLabel={t.wechatScan} />
                )
              )}
            </div>
            <p className="scroll-hint" aria-hidden="true">
              <span className="scroll-hint-line" />
              {t.scrollHint}
            </p>
          </div>
        </section>

        <section className="story-panel panel-right">
          <div className="panel-card text-card">
            <h2 className="card-eyebrow">{t.introTitle}</h2>
            <p className="card-para">{t.intro1}</p>
            <p className="card-para">{t.intro2}</p>
          </div>
        </section>

        {timeline.map((item, i) => (
          <section
            key={item.title}
            id={i === 0 ? 'experience' : undefined}
            className={`story-panel ${i % 2 ? 'panel-left' : 'panel-right'}`}
          >
            <div className="panel-card text-card note-card">
              <p className="note-period">{item.period}</p>
              <h2 className="note-title">{item.title}</h2>
              <p className="card-para">{item.detail}</p>
            </div>
          </section>
        ))}

        <section className="story-panel panel-center">
          <div className="panel-card dive-card">
            <p className="dive-hint">{t.diveHint}</p>
          </div>
        </section>

        <section id="contact" className="story-panel panel-center">
          <div className="panel-card">
            <TerminalContact title={t.contactTitle} scanLabel={t.wechatScan} />
          </div>
        </section>
      </main>
    </>
  )
}

function TerminalContact({ title, scanLabel }) {
  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-dot" />
        <span className="terminal-title">{title}</span>
      </div>
      <div className="terminal-body">
        <p className="terminal-line">
          <span className="terminal-prompt">$</span> whoami
        </p>
        <p className="terminal-out">mikhail.trifonov // luminais</p>
        <p className="terminal-line">
          <span className="terminal-prompt">$</span> ./contact --channels
        </p>
        <div className="terminal-links">
          {socials.map((s) =>
            s.href ? (
              <a key={s.key} href={s.href} target="_blank" rel="noreferrer" className="terminal-link">
                <SocialIcon name={s.key} size={15} />
                <span>{s.label}</span>
                <span className="terminal-url">{shortUrl(s.href)}</span>
              </a>
            ) : (
              <TerminalQrRow key={s.key} social={s} scanLabel={scanLabel} />
            )
          )}
        </div>
        <p className="terminal-line">
          <span className="terminal-prompt">$</span>{' '}
          <span className="terminal-cursor" aria-hidden="true" />
        </p>
      </div>
    </div>
  )
}

// Hero socials entry for channels without a URL (WeChat): a button that reveals
// the QR as a small terminal-styled artifact. Tap/click toggles (touch-safe),
// desktop hover also reveals, Escape or outside click closes.
function QrIconButton({ social, scanLabel }) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <span ref={anchorRef} className={`qr-anchor${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="icon-link icon-link--qr"
        aria-expanded={open}
        aria-label={`${social.label}: ${scanLabel}`}
        onClick={() => setOpen((v) => !v)}
      >
        <SocialIcon name={social.key} />
      </button>
      <span className="qr-popup" aria-hidden={!open}>
        <span className="qr-frame">
          <img src={withPrefix(social.qr)} alt={`${social.label} QR code`} />
        </span>
        <span className="qr-caption">
          <span className="qr-prompt" aria-hidden="true">
            $
          </span>
          {scanLabel}
        </span>
      </span>
    </span>
  )
}

// Terminal row for channels without a URL: expands an inline "command output"
// block with the QR instead of overlaying a popup on the sibling rows.
function TerminalQrRow({ social, scanLabel }) {
  const [open, setOpen] = useState(false)
  const outputId = `${social.key}-qr-output`

  return (
    <>
      <button
        type="button"
        className="terminal-link terminal-link--qr"
        aria-expanded={open}
        aria-controls={outputId}
        onClick={() => setOpen((v) => !v)}
      >
        <SocialIcon name={social.key} size={15} />
        <span>{social.label}</span>
        <span className="terminal-url">{social.id}</span>
        <span className="terminal-caret" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>
      <div id={outputId} className={`terminal-qr${open ? ' is-open' : ''}`}>
        <div className="terminal-qr-inner">
          <span className="qr-frame">
            <img src={withPrefix(social.qr)} alt={`${social.label} QR code`} />
          </span>
          <span className="qr-caption">
            <span className="qr-prompt" aria-hidden="true">
              $
            </span>
            {scanLabel}
          </span>
        </div>
      </div>
    </>
  )
}

function shortUrl(href) {
  return href.replace(/^mailto:/, '').replace(/^https:\/\//, '').replace(/^www\./, '')
}
