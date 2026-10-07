import { Color } from 'three';
import { readCssVar } from '@/lib/env';

/** Scene colours come from design tokens in src/styles/tokens.css. */
export function readPalette() {
  const color = (token: string) => new Color(readCssVar(token));
  return {
    background: color('--color-bg'),
    accent: color('--color-accent'),
    bricks: [1, 2, 3].map((i) => color(`--scene-brick-${i}`)),
  };
}

export type Palette = ReturnType<typeof readPalette>;
