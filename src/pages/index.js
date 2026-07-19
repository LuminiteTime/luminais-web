import React, { useMemo, useState } from 'react'
import { withPrefix } from 'gatsby'
import '../styles/global.css'

import { LangContext } from '../context/LangContext'
import { Header } from '../components/Header'
import { Overlay } from '../components/Overlay'
import { Experience } from '../components/three/Experience'
import { useIsClient, isWebGLAvailable } from '../hooks/useIsClient'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { timelines, noteLabels } from '../content/copy'
import { scrollStore } from '../lib/scrollStore'

const IndexPage = () => {
  const [lang, setLang] = useState('en')
  const [sceneReady, setSceneReady] = useState(false)
  const isClient = useIsClient()
  const reducedMotion = usePrefersReducedMotion()

  const webgl = isClient && isWebGLAvailable()
  const animationsEnabled = webgl && !reducedMotion

  // Short note text rendered on the 3D sticky notes; long text stays in the DOM.
  const notes = useMemo(
    () =>
      timelines[lang].map((item, i) => ({
        title: item.title,
        label: noteLabels[lang][i],
        hint: item.title.split('—')[0].trim(),
      })),
    [lang]
  )

  const langValue = useMemo(
    () => ({ lang, toggleLang: () => setLang((prev) => (prev === 'en' ? 'ru' : 'en')) }),
    [lang]
  )

  const markReady = () => {
    scrollStore.reducedMotion = !animationsEnabled
    setSceneReady(true)
  }

  return (
    <LangContext.Provider value={langValue}>
      <div className={`veil ${sceneReady || (isClient && !webgl) ? 'veil-hidden' : ''}`} aria-hidden="true" />
      <Header />
      {webgl && <Experience notes={notes} onReady={markReady} />}
      <Overlay animationsEnabled={animationsEnabled} />
    </LangContext.Provider>
  )
}

export default IndexPage

export const Head = () => (
  <>
    <html lang="en" />
    <title>Mikhail Trifonov — Java Backend</title>
    <link rel="icon" href={withPrefix('/images/main_me.jpg')} type="image/jpeg" />
    <meta
      name="description"
      content="Java Backend Developer — portfolio of Mikhail Trifonov. Microservices, integrations, Java/Scala, distributed systems."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=IBM+Plex+Mono:wght@400;600&display=swap"
      rel="stylesheet"
    />
  </>
)
