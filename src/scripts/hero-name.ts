import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { hasFinePointer, prefersReducedMotion, readCssVar } from '@/lib/env';

gsap.registerPlugin(SplitText);

const INTRO_WEIGHT = 820;
const PEAK_WEIGHT = 760;
const POINTER_RADIUS = 220;

/**
 * Page-load moment: name letters thin out from heavy to light while the rest fades in.
 * With a fine pointer, letters near the cursor gain weight. Drives `--w`/`--s` on each char.
 */
export function initHeroName(name: HTMLElement, companions: Element[]): void {
  if (prefersReducedMotion()) return;

  const restWeight = parseFloat(readCssVar('--weight-thin')) || 160;
  const { chars } = SplitText.create(name.querySelectorAll('[data-line]'), {
    type: 'chars',
    charsClass: 'char',
    // the <h1> carries the accessible name, letters are presentational
    aria: 'hidden',
  });

  gsap.fromTo(
    chars,
    { '--w': INTRO_WEIGHT, '--s': 0, opacity: 0, yPercent: 30 },
    { '--w': restWeight, '--s': 100, opacity: 1, yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.035 },
  );
  gsap.from(companions, { opacity: 0, y: 14, duration: 1, ease: 'power3.out', delay: 0.55, stagger: 0.08 });

  if (!hasFinePointer()) return;

  const letters = chars.map((char) => ({
    char,
    setWeight: gsap.quickTo(char, '--w', { duration: 0.5, ease: 'power3.out' }),
  }));
  name.addEventListener('pointermove', (event) => {
    for (const { char, setWeight } of letters) {
      const box = char.getBoundingClientRect();
      const distance = Math.hypot(
        event.clientX - (box.left + box.width / 2),
        event.clientY - (box.top + box.height / 2),
      );
      const proximity = Math.max(0, 1 - distance / POINTER_RADIUS);
      setWeight(restWeight + (PEAK_WEIGHT - restWeight) * proximity);
    }
  });
  name.addEventListener('pointerleave', () => letters.forEach(({ setWeight }) => setWeight(restWeight)));
}
