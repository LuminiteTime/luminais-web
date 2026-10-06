import Lenis from 'lenis';
import { prefersReducedMotion, readCssVar } from '@/lib/env';

/** Inertial scrolling; anchor links land below the fixed nav. Off when motion is reduced. */
export function initSmoothScroll(): Lenis | null {
  if (prefersReducedMotion()) return null;
  const offset = parseFloat(readCssVar('--scroll-offset')) || 0;
  return new Lenis({ autoRaf: true, anchors: { offset: -offset } });
}
