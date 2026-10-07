import type { Group } from 'three';
import { Euler, InstancedMesh, Matrix4, MeshPhysicalMaterial, Quaternion, Vector3 } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { sceneConfig, type SceneQuality } from './config';
import { buildLayouts, hash } from './layouts';
import type { Palette } from './palette';
import type { FrameState, ScenePart } from './types';

const { bricks: cfg, sortedAt } = sceneConfig;

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const IDENTITY = new Quaternion();

/**
 * Ceramic bricks that sort themselves while the page scrolls: a mixed cloud, then one column per
 * partition, then a solid table. Every brick rides a damped spring, so moves overshoot and settle,
 * and the cursor can push bricks out of place.
 */
export function createBricks(parent: Group, palette: Palette, quality: SceneQuality): ScenePart {
  const { count, segments, shadows } = cfg.quality[quality];

  const geometry = new RoundedBoxGeometry(cfg.size.x, cfg.size.y, cfg.size.z, segments, cfg.radius);
  const material = new MeshPhysicalMaterial({ roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.35 });
  const mesh = new InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false; // instances travel far from the initial bounds
  mesh.castShadow = shadows;
  mesh.receiveShadow = shadows;
  parent.add(mesh);

  const colourOf = (key: number) =>
    key === cfg.accentPartition ? palette.accent : (palette.bricks[key % palette.bricks.length] ?? palette.background);

  const bricks = buildLayouts(count).map((layout, i) => {
    mesh.setColorAt(i, colourOf(layout.key));
    return {
      ...layout,
      delay: hash(i * 13) * cfg.stagger,
      spin: new Euler(hash(i * 3 + 11) * 6.3, hash(i * 3 + 12) * 6.3, hash(i * 3 + 13) * 6.3),
      // start above the cloud and fall in
      position: layout.chaos.clone().setY(layout.chaos.y + cfg.intro.drop + hash(i * 7) * cfg.intro.spread),
      velocity: new Vector3(),
      rotation: new Quaternion(),
    };
  });

  // scratch objects reused every frame
  const target = new Vector3();
  const tumble = new Quaternion();
  const euler = new Euler();
  const push = new Vector3();
  const force = new Vector3();
  const matrix = new Matrix4();
  const scale = new Vector3(1, 1, 1);

  return {
    update({ time, dt, scroll, pointer, animated }: FrameState) {
      const stage = clamp01(scroll / sortedAt) * 2;
      const turn = 1 - Math.exp(-8 * dt);

      bricks.forEach((brick, i) => {
        const span = 1 - cfg.stagger;
        const toColumns = smoothstep(clamp01((stage - brick.delay) / span));
        const toTable = smoothstep(clamp01((stage - 1 - brick.delay) / span));

        // cloud (drifting), blended into columns, blended into the table
        const drift = animated ? cfg.chaos.drift * (1 - toColumns) : 0;
        target
          .set(Math.sin(time * 0.5 + i), Math.sin(time * 0.4 + i * 1.7), Math.sin(time * 0.45 + i * 2.3))
          .multiplyScalar(drift)
          .add(brick.chaos)
          .lerp(brick.column, toColumns)
          .lerp(brick.table, toTable);

        euler.set(brick.spin.x + time * 0.2, brick.spin.y, brick.spin.z + time * 0.15);
        tumble.setFromEuler(euler).slerp(IDENTITY, toColumns);

        if (animated) {
          if (pointer) {
            // offset from the cursor ray, perpendicular to it
            push.subVectors(brick.position, pointer.origin);
            push.addScaledVector(pointer.direction, -push.dot(pointer.direction));
            const distance = push.length();
            if (distance > 1e-4 && distance < cfg.pointer.radius) {
              brick.velocity.addScaledVector(
                push,
                ((1 - distance / cfg.pointer.radius) * cfg.pointer.force * dt) / distance,
              );
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
