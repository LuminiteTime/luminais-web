import type { Group } from 'three';
import { Mesh, MeshPhysicalMaterial } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { sceneConfig } from './config';
import type { FrameState, ScenePart } from './types';

const { panes: cfg } = sceneConfig;

/** Glass panes standing for pipeline stages: raw, clean, curated. */
export function createPanes(parent: Group): ScenePart {
  const geometry = new RoundedBoxGeometry(cfg.size.x, cfg.size.y, cfg.size.z, 6, cfg.radius);
  const material = new MeshPhysicalMaterial({
    color: '#ffffff',
    transmission: 1,
    thickness: 0.5,
    roughness: 0.02,
    ior: 1.5,
    dispersion: 4,
    iridescence: 0.25,
    iridescenceIOR: 1.3,
    clearcoat: 0.6,
    clearcoatRoughness: 0.1,
    envMapIntensity: 0.55,
  });

  const centre = (cfg.count - 1) / 2;
  const meshes = Array.from({ length: cfg.count }, () => {
    const mesh = new Mesh(geometry, material);
    parent.add(mesh);
    return mesh;
  });

  return {
    update({ time, scroll, intro }: FrameState) {
      const spread = cfg.gap * (1 + scroll * cfg.scrollSpread) * intro;
      meshes.forEach((mesh, i) => {
        const offset = i - centre;
        mesh.position.x = offset * spread;
        mesh.position.y = Math.sin(time * 0.6 + i * 1.7) * 0.05;
        mesh.rotation.y = Math.sin(time * 0.4 + i) * 0.04 + offset * scroll * 0.35;
      });
    },
    dispose() {
      meshes.forEach((mesh) => parent.remove(mesh));
      geometry.dispose();
      material.dispose();
    },
  };
}
