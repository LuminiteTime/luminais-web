// Small browser capability helpers shared by client scripts.

export const prefersReducedMotion = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = (): boolean => matchMedia('(pointer: fine)').matches;

export const readCssVar = (name: string, el: Element = document.documentElement): string =>
  getComputedStyle(el).getPropertyValue(name).trim();

export const prefersSaveData = (): boolean =>
  (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

export function supportsWebGL2(): boolean {
  try {
    return document.createElement('canvas').getContext('webgl2') !== null;
  } catch {
    return false;
  }
}
