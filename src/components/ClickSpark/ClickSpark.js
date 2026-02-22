import React, { useEffect, useMemo, useRef } from 'react'
import './ClickSpark.css'

function usePrefersReducedMotion() {
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      prefersReducedMotion.current = !!media.matches
    }
    update()
    if (media.addEventListener) media.addEventListener('change', update)
    else media.addListener(update)
    return () => {
      if (media.removeEventListener) media.removeEventListener('change', update)
      else media.removeListener(update)
    }
  }, [])

  return prefersReducedMotion
}

/**
 * ClickSpark
 * - Global-friendly click spark effect.
 * - Props mirror the React Bits component page.
 */
export default function ClickSpark({
  sparkColor = '#f00',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1,
  children,
}) {
  const rootRef = useRef(null)
  const overlayRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const config = useMemo(() => {
    const safeCount = Math.max(1, Math.min(32, Number(sparkCount) || 8))
    const safeDuration = Math.max(80, Math.min(2000, Number(duration) || 400))
    const safeSize = Math.max(2, Math.min(48, Number(sparkSize) || 10))
    const safeRadius = Math.max(1, Math.min(260, Number(sparkRadius) || 15))
    const safeExtraScale = Math.max(0.2, Math.min(6, Number(extraScale) || 1))

    return {
      sparkColor: String(sparkColor || '#f00'),
      sparkCount: safeCount,
      duration: safeDuration,
      sparkSize: safeSize,
      sparkRadius: safeRadius,
      extraScale: safeExtraScale,
      easing: String(easing || 'ease-out'),
    }
  }, [sparkColor, sparkCount, duration, sparkSize, sparkRadius, extraScale, easing])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (prefersReducedMotion.current) return

    const overlay = overlayRef.current
    if (!overlay) return

    const handlePointerDown = (event) => {
      // Ignore right-click / non-primary taps.
      if (event.button != null && event.button !== 0) return

      // Don’t spark on inputs where it feels noisy.
      const target = event.target
      if (target && target.closest) {
        const el = target.closest('input, textarea, select, [contenteditable="true"]')
        if (el) return
      }

      const x = event.clientX
      const y = event.clientY

      const burst = document.createElement('div')
      burst.className = 'rb-clickspark-burst'
      burst.style.left = `${x}px`
      burst.style.top = `${y}px`

      const distance = config.sparkRadius * config.extraScale

      for (let i = 0; i < config.sparkCount; i++) {
        const spark = document.createElement('div')
        spark.className = 'rb-clickspark-spark'
        const angle = (360 / config.sparkCount) * i + (Math.random() * 14 - 7)

        spark.style.setProperty('--rb-spark-color', config.sparkColor)
        spark.style.setProperty('--rb-spark-size', `${config.sparkSize}px`)
        spark.style.setProperty('--rb-spark-distance', `${distance}px`)

        // Use Web Animations for easing strings like "ease-in-out".
        spark.animate(
          [
            {
              transform: `rotate(${angle}deg) translateX(0px) scaleX(1)`,
              opacity: 1,
            },
            {
              transform: `rotate(${angle}deg) translateX(${distance}px) scaleX(0.35)`,
              opacity: 0,
            },
          ],
          {
            duration: config.duration,
            easing: config.easing,
            fill: 'forwards',
          }
        )

        burst.appendChild(spark)
      }

      overlay.appendChild(burst)
      window.setTimeout(() => {
        burst.remove()
      }, config.duration + 60)
    }

    document.addEventListener('pointerdown', handlePointerDown, { passive: true })
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [config, prefersReducedMotion])

  return (
    <div ref={rootRef} className="rb-clickspark-root">
      <div ref={overlayRef} className="rb-clickspark-overlay" aria-hidden="true" />
      {children}
    </div>
  )
}
