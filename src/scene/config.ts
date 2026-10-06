// Scene tunables. Change the look here, not in the modules.

export const sceneConfig = {
  maxPixelRatio: { high: 1.75, low: 1.5 },
  camera: { fov: 32, y: 0.4, distance: { wide: 11, narrow: 18 } },
  /** Rig placement in the hero; it drifts to the centre while the page scrolls. */
  rig: {
    wide: { x: 2.3, y: 0.1 },
    narrow: { x: 0, y: 2.6 },
    baseRotation: { x: 0.12, y: -0.62, z: -0.05 },
    scrollRotation: { x: 0.25, y: 1.4 },
    pointerRotation: { x: 0.06, y: 0.12 },
  },
  panes: { count: 3, gap: 1.5, scrollSpread: 0.9, size: { x: 0.28, y: 2.9, z: 2.2 }, radius: 0.12 },
  streams: {
    span: 18,
    controlPoints: 16,
    radius: { min: 0.012, max: 0.028 },
    /** Small screens and coarse pointers get lighter geometry. */
    quality: {
      high: { count: 22, segments: 220 },
      low: { count: 14, segments: 120 },
    },
  },
  intro: { delay: 0.15, duration: 2.2 },
  /** Fraction of distance left after one second of smoothing. Lower is snappier. */
  damping: 0.0015,
} as const;

export type SceneQuality = keyof typeof sceneConfig.streams.quality;
