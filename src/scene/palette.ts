import { Color } from 'three';
import { readCssVar } from '@/lib/env';

/** Scene colours come from design tokens in src/styles/tokens.css. */
export function readPalette() {
  const color = (token: string) => new Color(readCssVar(token));
  return {
    background: color('--color-bg'),
    pulse: color('--color-accent'),
    pulseAlt: color('--scene-pulse-alt'),
    streams: [1, 2, 3, 4].map((i) => color(`--scene-stream-${i}`)),
  };
}

export type Palette = ReturnType<typeof readPalette>;
