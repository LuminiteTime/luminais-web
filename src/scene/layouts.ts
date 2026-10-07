import { Vector3 } from 'three';
import { sceneConfig, type LayoutName } from './config';

// Layout maths: where every brick sits in each stage. No rendering here.

const { bricks: cfg } = sceneConfig;
const pitch = new Vector3(cfg.size.x + cfg.gap, cfg.size.y + cfg.gap, cfg.size.z + cfg.gap);

/** Deterministic hash in [0, 1), so the layout is identical on every load. */
export const hash = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export interface BrickLayout {
  /** Partition the brick belongs to; also picks its colour. */
  key: number;
  /** Static slots, computed once. */
  cloud: Vector3;
  column: Vector3;
  table: Vector3;
  /** Position along moving paths (stream, ring), mixed so colours interleave. */
  flow: number;
  /** Per-brick offset in [0, 1) for organic variation. */
  jitter: number;
}

/** Splits `count` bricks into partitions by share; brick order is the partition order. */
function assignKeys(count: number): number[] {
  let share = 0;
  const bounds = cfg.partitions.map((part) => Math.round((share += part) * count));
  return Array.from({ length: count }, (_, i) => {
    const key = bounds.findIndex((bound) => i < bound);
    return key === -1 ? cfg.partitions.length - 1 : key;
  });
}

/** A point in a loose ellipsoid cloud. */
function cloudPoint(i: number): Vector3 {
  const u = hash(i * 3 + 1) * 2 - 1;
  const theta = hash(i * 3 + 2) * Math.PI * 2;
  const r = Math.cbrt(hash(i * 3 + 3));
  const ring = Math.sqrt(1 - u * u) * r;
  return new Vector3(ring * Math.cos(theta) * cfg.cloud.x, u * r * cfg.cloud.y, ring * Math.sin(theta) * cfg.cloud.z);
}

/** Slot `slot` of the column for `key`; columns stand on a shared floor. */
function columnPoint(key: number, slot: number, floor: number): Vector3 {
  const perLayer = cfg.footprint ** 2;
  const cell = slot % perLayer;
  const centre = (cfg.footprint - 1) / 2;
  return new Vector3(
    (key - (cfg.partitions.length - 1) / 2) * cfg.partitionSpacing + ((cell % cfg.footprint) - centre) * pitch.x,
    floor + Math.floor(slot / perLayer) * pitch.y,
    (Math.floor(cell / cfg.footprint) - centre) * pitch.z,
  );
}

/** Cell `i` of a solid block filled slab by slab along x, so sorted keys show as stripes. */
function tablePoint(i: number, count: number): Vector3 {
  const { x: width, z: depth } = cfg.table;
  const height = Math.ceil(count / (width * depth));
  const rest = i % (height * depth);
  return new Vector3(
    Math.floor(i / (height * depth)) - (width - 1) / 2,
    Math.floor(rest / depth) - (height - 1) / 2,
    (rest % depth) - (depth - 1) / 2,
  ).multiply(pitch);
}

export function buildLayouts(count: number): BrickLayout[] {
  const keys = assignKeys(count);
  const tallest = Math.ceil((Math.max(...cfg.partitions) * count) / cfg.footprint ** 2);
  const floor = (-tallest * pitch.y) / 2;
  const filled = new Map<number, number>();

  return keys.map((key, i) => {
    const slot = filled.get(key) ?? 0;
    filled.set(key, slot + 1);
    return {
      key,
      cloud: cloudPoint(i),
      column: columnPoint(key, slot, floor),
      table: tablePoint(i, count),
      flow: (i * 0.618034) % 1,
      jitter: hash(i * 29 + 5),
    };
  });
}

const TAU = Math.PI * 2;

/** Writes where `brick` sits in `layout` at `time` into `out`. Moving layouts animate with time. */
export function place(layout: LayoutName, brick: BrickLayout, time: number, out: Vector3): Vector3 {
  switch (layout) {
    case 'cloud': {
      const drift = cfg.cloud.drift;
      const seed = brick.jitter * 40;
      return out
        .set(Math.sin(time * 0.5 + seed), Math.sin(time * 0.4 + seed * 1.7), Math.sin(time * 0.45 + seed * 2.3))
        .multiplyScalar(drift)
        .add(brick.cloud);
    }
    case 'stream': {
      // a helix along x that keeps turning, like records on a conveyor
      const { length, radius, turns, speed } = cfg.stream;
      const angle = brick.flow * turns * TAU + time * speed;
      const r = radius * (0.75 + brick.jitter * 0.5);
      return out.set((brick.flow - 0.5) * length, Math.sin(angle) * r, Math.cos(angle) * r);
    }
    case 'columns':
      return out.copy(brick.column);
    case 'table':
      return out.copy(brick.table);
    case 'ring': {
      // a slow elliptical orbit
      const { x, y, depth, speed } = cfg.ring;
      const angle = brick.flow * TAU + time * speed;
      const spread = 0.88 + brick.jitter * 0.24;
      return out.set(Math.cos(angle) * x * spread, Math.sin(angle) * y * spread, (brick.jitter - 0.5) * depth);
    }
  }
}
