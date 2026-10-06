import { prefersSaveData, supportsWebGL2 } from '@/lib/env';

/** Resolves once the browser is idle, so the scene never competes with first paint and the hero intro. */
const whenIdle = () =>
  new Promise<void>((resolve) =>
    'requestIdleCallback' in window
      ? requestIdleCallback(() => resolve(), { timeout: 1500 })
      : setTimeout(resolve, 300),
  );

/**
 * Loads the WebGL scene after first paint and feeds it scroll progress.
 * Sets `data-scene` on <html> to `on` or `off` so CSS can style the fallback.
 * Updates `--veil` (0..1) to soften the scene once the hero is scrolled past.
 */
export async function initBackdrop(canvas: HTMLCanvasElement): Promise<void> {
  const root = document.documentElement;
  let setScroll: (progress: number) => void = () => {};

  const onScroll = () => {
    const max = root.scrollHeight - innerHeight;
    setScroll(max > 0 ? scrollY / max : 0);
    root.style.setProperty('--veil', String(Math.min(scrollY / innerHeight, 1)));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (!supportsWebGL2() || prefersSaveData()) {
    root.dataset.scene = 'off';
    return;
  }

  try {
    await whenIdle();
    const { mountScene } = await import('@/scene');
    const scene = await mountScene(canvas);
    setScroll = scene.setScroll;
    root.dataset.scene = 'on';
    onScroll();
    import.meta.hot?.dispose(() => scene.dispose());
  } catch (error) {
    root.dataset.scene = 'off';
    console.error('Backdrop scene failed to start', error);
  }
}
