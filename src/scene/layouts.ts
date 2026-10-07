import { Vector3 } from 'three';
import { sceneConfig } from './config';

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
  chaos: Vector3;
  column: Vector3;
  table: Vector3;
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
function chaosPoint(i: number): Vector3 {
  const u = hash(i * 3 + 1) * 2 - 1;
  const theta = hash(i * 3 + 2) * Math.PI * 2;
  const r = Math.cbrt(hash(i * 3 + 3));
  const ring = Math.sqrt(1 - u * u) * r;
  return new Vector3(ring * Math.cos(theta) * cfg.chaos.x, u * r * cfg.chaos.y, ring * Math.sin(theta) * cfg.chaos.z);
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
    return { key, chaos: chaosPoint(i), column: columnPoint(key, slot, floor), table: tablePoint(i, count) };
  });
}
