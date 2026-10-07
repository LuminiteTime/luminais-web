import { prefersSaveData, supportsWebGL2 } from '@/lib/env';

/** Resolves once the browser is idle, so the scene never competes with first paint and the hero intro. */
const whenIdle = () =>
  new Promise<void>((resolve) =>
    'requestIdleCallback' in window
      ? requestIdleCallback(() => resolve(), { timeout: 1500 })
      : setTimeout(resolve, 300),
  );

/** Reading line as a share of the viewport height: a section takes over when it reaches it. */
const READING_LINE = 0.35;
/** Share of a section, from its end, over which the scene morphs into the next stage. */
const MORPH = 0.55;

interface Marker {
  top: number;
  stage: number;
}

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Continuous stage for a document position: holds within a section, morphs near its end. */
export function stageAt(markers: Marker[], line: number): number {
  let current = markers[0];
  if (!current) return 0;
  for (const next of markers.slice(1)) {
    if (line < next.top) {
      const progress = (line - current.top) / (next.top - current.top);
      const t = smoothstep(Math.min(1, Math.max(0, (progress - (1 - MORPH)) / MORPH)));
      return current.stage + (next.stage - current.stage) * t;
    }
    current = next;
  }
  return current.stage;
}

/**
 * Loads the WebGL scene after first paint and drives it from the page: elements with `data-stage`
 * pick the scene stage while they are on screen.
 * Sets `data-scene` on <html> to `on` or `off` so CSS can style the fallback.
 * Updates `--veil` (0..1) to soften the scene once the hero is scrolled past.
 */
export async function initBackdrop(canvas: HTMLCanvasElement): Promise<void> {
  const root = document.documentElement;
  let setStage: (stage: number) => void = () => {};
  let markers: Marker[] = [];

  const measure = () => {
    markers = [...document.querySelectorAll<HTMLElement>('[data-stage]')]
      .map((el) => ({ top: el.getBoundingClientRect().top + scrollY, stage: Number(el.dataset.stage) }))
      .sort((a, b) => a.top - b.top);
  };

  const onScroll = () => {
    setStage(stageAt(markers, scrollY + innerHeight * READING_LINE));
    root.style.setProperty('--veil', String(Math.min(scrollY / innerHeight, 1)));
  };

  measure();
  new ResizeObserver(() => {
    measure();
    onScroll();
  }).observe(document.body);
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
    setStage = scene.setStage;
    root.dataset.scene = 'on';
    onScroll();
    import.meta.hot?.dispose(() => scene.dispose());
  } catch (error) {
    root.dataset.scene = 'off';
    console.error('Backdrop scene failed to start', error);
  }
}
