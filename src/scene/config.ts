// Scene tunables. Change the look and the choreography here, not in the modules.

export type LayoutName = 'cloud' | 'stream' | 'columns' | 'table' | 'ring';

interface Placement {
  x: number;
  y: number;
  scale: number;
}

/** One step of the choreography. Page sections pick a step with `data-stage`. */
interface Stage {
  layout: LayoutName;
  /** 1 lets blocks tumble freely, 0 squares them up. */
  tumble: number;
  /** 1 keeps raw mixed proportions, 0 normalises every block to one size. */
  raw: number;
  rotation: { x: number; y: number };
  wide: Placement;
  narrow: Placement;
}

// hero: raw data, a mixed cloud beside the name
const hero: Stage = {
  layout: 'cloud',
  tumble: 1,
  raw: 1,
  rotation: { x: 0.34, y: -0.62 },
  wide: { x: 3.05, y: 0, scale: 1 },
  narrow: { x: 0, y: 2.55, scale: 0.74 },
};

const stages: Stage[] = [
  hero,
  // now: ingestion, a helix stream across the whole screen
  {
    layout: 'stream',
    tumble: 0.45,
    raw: 0.6,
    rotation: { x: 0.12, y: -0.2 },
    wide: { x: 0, y: 0.2, scale: 1 },
    narrow: { x: 0, y: 0, scale: 0.75 },
  },
  // experience: sorted into partitions
  {
    layout: 'columns',
    tumble: 0,
    raw: 0,
    rotation: { x: 0.28, y: -0.45 },
    wide: { x: 0, y: -0.2, scale: 1.3 },
    narrow: { x: 0, y: 0, scale: 0.46 },
  },
  // work and stack: one curated table, close up
  {
    layout: 'table',
    tumble: 0,
    raw: 0,
    rotation: { x: 0.55, y: 0.75 },
    wide: { x: 0, y: 0, scale: 1.55 },
    narrow: { x: 0, y: 0, scale: 0.9 },
  },
  // contact: served, an orbit framing the contact card
  {
    layout: 'ring',
    tumble: 0.6,
    raw: 0.8,
    rotation: { x: 0.12, y: 0 },
    wide: { x: 0, y: 0, scale: 1 },
    narrow: { x: 0, y: 0, scale: 0.62 },
  },
];

export const sceneConfig = {
  maxPixelRatio: { high: 1.75, low: 1.5 },
  camera: { fov: 30, y: 0.5, distance: { wide: 12.5, narrow: 15 } },
  stages,
  /** Small tilt that follows the cursor. */
  pointerRotation: { x: 0.05, y: 0.1 },
  bricks: {
    size: { x: 0.3, y: 0.18, z: 0.3 },
    gap: 0.04,
    /** Small radius keeps edges crisp: machined parts, not soft candy. */
    radius: 0.012,
    material: { metalness: 0, roughness: 0.82 },
    /** Raw blocks come in mixed proportions and are normalised to one size once sorted. */
    rawScale: { min: { x: 0.6, y: 0.6, z: 0.6 }, max: { x: 2.1, y: 1.3, z: 1.6 } },
    quality: {
      high: { count: 320, segments: 2, shadows: true },
      low: { count: 240, segments: 1, shadows: false },
    },
    /** Partition sizes as shares of all blocks. Skewed on purpose, like real data. */
    partitions: [0.16, 0.32, 0.12, 0.26, 0.14],
    /** Colour of each partition: a brick token number (--scene-brick-N) or the accent. */
    colours: [1, 2, 'accent', 1, 3],
    /** Blocks per side of a partition column footprint. */
    footprint: 3,
    partitionSpacing: 1.45,
    /** Table footprint in blocks; height follows from the count. */
    table: { x: 10, z: 7 },
    cloud: { x: 2.8, y: 2.6, z: 2.1, drift: 0.16 },
    stream: { length: 19, radius: 1.7, turns: 5, speed: 0.55 },
    ring: { x: 6.4, y: 3.2, depth: 1.6, speed: 0.1 },
    spring: { stiffness: 38, damping: 8.5 },
    /** Share of a transition used to stagger blocks, 0 moves them all at once. */
    stagger: 0.45,
    pointer: { radius: 1.1, force: 38 },
    /** Blocks start above their places and fall in on load. */
    intro: { drop: 7, spread: 3 },
  },
  /** Fraction of distance left after one second of smoothing. Lower is snappier. */
  damping: 0.0015,
} as const;

export type SceneQuality = keyof typeof sceneConfig.bricks.quality;

/** Splits a continuous stage value into the two stages around it and the progress between them. */
export function stageSpan(stage: number): { from: Stage; to: Stage; local: number } {
  const last = stages.length - 1;
  const clamped = Math.min(Math.max(stage, 0), last);
  const index = Math.min(Math.floor(clamped), last - 1);
  return { from: stages[index] ?? hero, to: stages[index + 1] ?? hero, local: clamped - index };
}
