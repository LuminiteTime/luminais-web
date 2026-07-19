import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { scrollStore } from '../lib/scrollStore'
import { SCREEN_CROSS_T } from '../scene/cameraPath'

// Half-width of the flash peak around the screen-cross moment.
const FLASH_WINDOW = 0.028

// Wires page scroll to the camera rig (via scrollStore) and animates the
// overlay panels. Everything lives in one GSAP context and is fully reverted
// on unmount / language change.
export function useScrollAnimations({ enabled, lang }) {
  const rootRef = useRef(null)
  const flashRef = useRef(null)
  const progressBarRef = useRef(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root || !enabled) return undefined

      gsap.registerPlugin(ScrollTrigger)
      scrollStore.reducedMotion = false
      root.classList.add('js-animated')

      const setFlash = gsap.quickSetter(flashRef.current, 'opacity')
      const setProgress = gsap.quickSetter(progressBarRef.current, 'scaleX')

      ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          scrollStore.progress = self.progress
          setProgress(self.progress)
          const distance = Math.abs(self.progress - SCREEN_CROSS_T) / FLASH_WINDOW
          setFlash(Math.max(0, 1 - distance))
        },
      })

      const panels = gsap.utils.toArray(root.querySelectorAll('.story-panel'))
      panels.forEach((panel, i) => {
        const card = panel.querySelector('.panel-card')
        if (!card) return
        const isFirst = i === 0
        const isLast = i === panels.length - 1

        if (isFirst) {
          gsap
            .timeline({
              scrollTrigger: { trigger: panel, start: 'top top', end: 'bottom top', scrub: true },
            })
            .fromTo(card, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -70, ease: 'none' })
          return
        }

        if (isLast) {
          gsap.fromTo(
            card,
            { autoAlpha: 0, y: 70 },
            {
              autoAlpha: 1,
              y: 0,
              ease: 'none',
              scrollTrigger: { trigger: panel, start: 'top 85%', end: 'top 40%', scrub: true },
            }
          )
          return
        }

        gsap
          .timeline({
            scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true },
          })
          .fromTo(card, { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.28, ease: 'none' })
          .to(card, { autoAlpha: 1, duration: 0.44, ease: 'none' })
          .to(card, { autoAlpha: 0, y: -70, duration: 0.28, ease: 'none' })
      })

      return () => {
        root.classList.remove('js-animated')
        scrollStore.reducedMotion = true
      }
    },
    { scope: rootRef, dependencies: [enabled, lang], revertOnUpdate: true }
  )

  return { rootRef, flashRef, progressBarRef }
}
