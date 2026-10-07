import type { Group } from 'three';
import { Euler, InstancedMesh, Matrix4, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { sceneConfig, stageSpan, type SceneQuality } from './config';
import { buildLayouts, hash, place } from './layouts';
import type { Palette } from './palette';
import type { FrameState, ScenePart } from './types';

const { bricks: cfg } = sceneConfig;

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const IDENTITY = new Quaternion();
const UNIT = new Vector3(1, 1, 1);

/**
 * Matte blocks that act out the data lifecycle as the page scrolls: a raw cloud, an ingestion stream,
 * sorted partition columns, one curated table, and an orbit around the contact card (see `stages`
 * in config). Every block rides a damped spring, so moves overshoot and settle, and the cursor can
 * push blocks out of place.
 */
export function createBricks(parent: Group, palette: Palette, quality: SceneQuality): ScenePart {
  const { count, segments, shadows } = cfg.quality[quality];

  const geometry = new RoundedBoxGeometry(cfg.size.x, cfg.size.y, cfg.size.z, segments, cfg.radius);
  const material = new MeshStandardMaterial(cfg.material);
  const mesh = new InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false; // instances travel far from the initial bounds
  mesh.castShadow = shadows;
  mesh.receiveShadow = shadows;
  parent.add(mesh);

  const colourOf = (key: number) => {
    const colour = cfg.colours[key] ?? 1;
    return colour === 'accent' ? palette.accent : palette.bricks[colour];
  };

  const bricks = buildLayouts(count).map((layout, i) => {
    mesh.setColorAt(i, colourOf(layout.key));
    return {
      layout,
      delay: hash(i * 13) * cfg.stagger,
      raw: new Vector3(
        lerp(cfg.rawScale.min.x, cfg.rawScale.max.x, hash(i * 5 + 1) ** 2),
        lerp(cfg.rawScale.min.y, cfg.rawScale.max.y, hash(i * 5 + 2)),
        lerp(cfg.rawScale.min.z, cfg.rawScale.max.z, hash(i * 5 + 3) ** 2),
      ),
      spin: new Euler(hash(i * 3 + 11) * 6.3, hash(i * 3 + 12) * 6.3, hash(i * 3 + 13) * 6.3),
      // start above the cloud and fall in
      position: layout.cloud.clone().setY(layout.cloud.y + cfg.intro.drop + hash(i * 7) * cfg.intro.spread),
      velocity: new Vector3(),
      rotation: new Quaternion(),
    };
  });

  // scratch objects reused every frame
  const from = new Vector3();
  const target = new Vector3();
  const tumble = new Quaternion();
  const euler = new Euler();
  const push = new Vector3();
  const force = new Vector3();
  const scale = new Vector3();
  const matrix = new Matrix4();

  return {
    update({ time, dt, stage, pointer, animated }: FrameState) {
      const span = stageSpan(stage);
      const turn = 1 - Math.exp(-8 * dt);

      bricks.forEach((brick, i) => {
        // each block starts its move a little later than the previous one
        const t = smoothstep(clamp01((span.local - brick.delay) / (1 - cfg.stagger)));

        place(span.from.layout, brick.layout, time, from);
        place(span.to.layout, brick.layout, time, target).sub(from).multiplyScalar(t).add(from);

        euler.set(brick.spin.x + time * 0.2, brick.spin.y, brick.spin.z + time * 0.15);
        tumble.setFromEuler(euler).slerp(IDENTITY, 1 - lerp(span.from.tumble, span.to.tumble, t));
        scale.copy(UNIT).lerp(brick.raw, lerp(span.from.raw, span.to.raw, t));

        if (animated) {
          if (pointer) {
            // offset from the cursor ray, perpendicular to it
            push.subVectors(brick.position, pointer.origin);
            push.addScaledVector(pointer.direction, -push.dot(pointer.direction));
            const distance = push.length();
            if (distance > 1e-4 && distance < cfg.pointer.radius) {
              const strength = ((1 - distance / cfg.pointer.radius) * cfg.pointer.force * dt) / distance;
              brick.velocity.addScaledVector(push, strength);
            }
          }
          // damped spring: a = k (target - x) - c v
          force
            .subVectors(target, brick.position)
            .multiplyScalar(cfg.spring.stiffness)
            .addScaledVector(brick.velocity, -cfg.spring.damping);
          brick.velocity.addScaledVector(force, dt);
          brick.position.addScaledVector(brick.velocity, dt);
          brick.rotation.slerp(tumble, turn);
        } else {
          brick.position.copy(target);
          brick.rotation.copy(tumble);
        }

        mesh.setMatrixAt(i, matrix.compose(brick.position, brick.rotation, scale));
      });
      mesh.instanceMatrix.needsUpdate = true;
    },
    dispose() {
      parent.remove(mesh);
      mesh.dispose();
      geometry.dispose();
      material.dispose();
    },
  };
}
