import type { BufferGeometry, Color, Group } from 'three';
import { CatmullRomCurve3, Float32BufferAttribute, Mesh, ShaderMaterial, TubeGeometry, Vector3 } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { SceneQuality } from './config';
import { sceneConfig } from './config';
import type { Palette } from './palette';
import type { FrameState, ScenePart } from './types';
import vertexShader from './shaders/stream.vert.glsl?raw';
import fragmentShader from './shaders/stream.frag.glsl?raw';

const { streams: cfg, panes } = sceneConfig;

/** Deterministic hash so the layout is identical on every load. */
const hash = (seed: number) => {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

/** Tangled before the first pane, ordered after the last one. */
function streamCurve(index: number, count: number): CatmullRomCurve3 {
  const lane = (index / (count - 1) - 0.5) * 2;
  const exit = panes.gap * 1.4;
  const points = Array.from({ length: cfg.controlPoints + 1 }, (_, k) => {
    const x = -cfg.span / 2 + (cfg.span * k) / cfg.controlPoints;
    const chaos = Math.min(1, Math.max(0, (exit - x) / (exit * 2)));
    const ordered = new Vector3(x, lane * 0.85, (hash(index + 3) - 0.5) * 1.1);
    const tangled = new Vector3(x, (hash(index * 17 + k) - 0.5) * 2.6, (hash(index * 31 + k * 7) - 0.5) * 2.4);
    return ordered.lerp(tangled, chaos * chaos);
  });
  return new CatmullRomCurve3(points, false, 'centripetal');
}

/** Fills a per-vertex attribute with one constant value per stream. */
function constant(geometry: BufferGeometry, name: string, value: number | Color) {
  const count = geometry.getAttribute('position').count;
  const size = typeof value === 'number' ? 1 : 3;
  const data = new Float32Array(count * size);
  for (let v = 0; v < count; v++) {
    if (typeof value === 'number') data[v] = value;
    else value.toArray(data, v * 3);
  }
  geometry.setAttribute(name, new Float32BufferAttribute(data, size));
}

function streamGeometry(index: number, quality: SceneQuality, palette: Palette): BufferGeometry {
  const { count, segments } = cfg.quality[quality];
  const radius = cfg.radius.min + hash(index * 5) * (cfg.radius.max - cfg.radius.min);
  const geometry = new TubeGeometry(streamCurve(index, count), segments, radius, 6, false);
  constant(geometry, 'aSpeed', 0.05 + hash(index * 9) * 0.07);
  constant(geometry, 'aOffset', hash(index * 13));
  constant(geometry, 'aBase', palette.streams[index % palette.streams.length] ?? palette.background);
  constant(geometry, 'aPulse', index % 3 === 0 ? palette.pulse : palette.pulseAlt);
  return geometry;
}

/** Data streams flowing through the panes. One geometry, one material, one draw call. */
export function createStreams(parent: Group, palette: Palette, quality: SceneQuality): ScenePart {
  const parts = Array.from({ length: cfg.quality[quality].count }, (_, i) => streamGeometry(i, quality, palette));
  const geometry = mergeGeometries(parts);
  parts.forEach((part) => part.dispose());
  if (!geometry) throw new Error('Stream geometries could not be merged');

  const uTime = { value: 0 };
  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: { uTime, uBg: { value: palette.background } },
  });
  const mesh = new Mesh(geometry, material);
  parent.add(mesh);

  return {
    update({ time }: FrameState) {
      uTime.value = time;
    },
    dispose() {
      parent.remove(mesh);
      geometry.dispose();
      material.dispose();
    },
  };
}
