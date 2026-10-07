import { Color } from 'three';
import { readCssVar } from '@/lib/env';

/** Scene colours come from design tokens in src/styles/tokens.css. */
export function readPalette() {
  const color = (token: string) => new Color(readCssVar(token));
  return {
    background: color('--color-bg'),
    accent: color('--color-accent'),
    bricks: { 1: color('--scene-brick-1'), 2: color('--scene-brick-2'), 3: color('--scene-brick-3') },
  };
}

export type Palette = ReturnType<typeof readPalette>;
