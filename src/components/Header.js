import React, { useContext } from 'react'
import { LangIcon } from './icons'
import { LangContext } from '../context/LangContext'
import { copy } from '../content/copy'

export function Header() {
  const { lang, toggleLang } = useContext(LangContext)
  const t = copy[lang]

  return (
    <header className="site-header">
      <div className="header-progress" aria-hidden="true" />
      <a className="brand" href="#home">
        <span className="brand-dot" aria-hidden="true" />
        {t.heroName}
      </a>
      <nav className="site-nav">
        <a href="#home">{t.nav.home}</a>
        <a href="#experience">{t.nav.exp}</a>
        <a href="#contact">{t.nav.contact}</a>
        <button className="lang-toggle" onClick={toggleLang} aria-label="Switch language">
          <LangIcon />
          <span>{lang === 'en' ? 'EN' : 'RU'}</span>
        </button>
      </nav>
    </header>
  )
}
