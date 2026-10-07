// Scene tunables. Change the look and feel here, not in the modules.

export const sceneConfig = {
  maxPixelRatio: { high: 1.75, low: 1.5 },
  camera: { fov: 30, y: 0.5, distance: { wide: 12.5, narrow: 19 } },
  /** Rig placement in the hero; it drifts to the centre while the page scrolls. */
  rig: {
    wide: { x: 2.7, y: 0, scale: 1 },
    narrow: { x: 0, y: 2.9, scale: 0.6 },
    baseRotation: { x: 0.34, y: -0.62 },
    scrollRotation: { y: 0.8 },
    pointerRotation: { x: 0.05, y: 0.1 },
  },
  bricks: {
    size: { x: 0.32, y: 0.16, z: 0.32 },
    gap: 0.04,
    radius: 0.045,
    quality: {
      high: { count: 380, segments: 2, shadows: true },
      low: { count: 240, segments: 1, shadows: false },
    },
    /** Partition sizes as shares of all bricks. Skewed on purpose, like real data. */
    partitions: [0.16, 0.32, 0.12, 0.26, 0.14],
    /** Index of the partition painted in the accent colour. */
    accentPartition: 2,
    /** Bricks per side of a partition column footprint. */
    footprint: 3,
    partitionSpacing: 1.45,
    /** Table footprint in bricks; height follows from the count. */
    table: { x: 10, z: 7 },
    chaos: { x: 3.1, y: 2.6, z: 2.2, drift: 0.16 },
    spring: { stiffness: 38, damping: 8.5 },
    /** Share of the transition used to stagger bricks, 0 moves them all at once. */
    stagger: 0.45,
    pointer: { radius: 1.1, force: 38 },
    /** Bricks start above their places and fall in on load. */
    intro: { drop: 7, spread: 3 },
  },
  /** Scroll progress at which bricks finish sorting into the table. */
  sortedAt: 0.6,
  /** Fraction of distance left after one second of smoothing. Lower is snappier. */
  damping: 0.0015,
} as const;

export type SceneQuality = keyof typeof sceneConfig.bricks.quality;
