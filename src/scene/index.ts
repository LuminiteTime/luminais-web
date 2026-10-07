import {
  DirectionalLight,
  Group,
  HemisphereLight,
  NeutralToneMapping,
  PCFShadowMap,
  PerspectiveCamera,
  PMREMGenerator,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { hasFinePointer, prefersReducedMotion } from '@/lib/env';
import { createBricks } from './bricks';
import { sceneConfig as cfg, type SceneQuality } from './config';
import { readPalette } from './palette';
import type { FrameState, ScenePart } from './types';

export interface SceneHandle {
  /** Page scroll progress, 0..1. */
  setScroll(progress: number): void;
  dispose(): void;
}

const pickQuality = (): SceneQuality => (hasFinePointer() && innerWidth >= 960 ? 'high' : 'low');

/**
 * Mounts the backdrop scene on a full-screen canvas.
 * Shaders compile off the main thread where supported, so the first frame does not block input.
 * Animates continuously unless motion is reduced; then it renders only on scroll and resize.
 */
export async function mountScene(canvas: HTMLCanvasElement): Promise<SceneHandle> {
  const animated = !prefersReducedMotion();
  const quality = pickQuality();
  const { shadows } = cfg.bricks.quality[quality];
  const palette = readPalette();

  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, cfg.maxPixelRatio[quality]));
  renderer.toneMapping = NeutralToneMapping;
  renderer.shadowMap.enabled = shadows;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  scene.background = palette.background;
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  scene.environmentIntensity = 0.55;
  pmrem.dispose();

  // soft studio light: sky fill plus one key light that casts the shadows
  scene.add(new HemisphereLight('#ffffff', palette.bricks[2], 1.1));
  const key = new DirectionalLight('#ffffff', 2.2);
  key.position.set(4, 9, 6);
  key.castShadow = shadows;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = key.shadow.camera.bottom = -7;
  key.shadow.camera.right = key.shadow.camera.top = 7;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 30;
  key.shadow.radius = 4;
  key.shadow.bias = -0.0005;
  scene.add(key);

  const camera = new PerspectiveCamera(cfg.camera.fov, 1, 0.1, 100);
  const rig = new Group();
  scene.add(rig);

  const parts: ScenePart[] = [createBricks(rig, palette, quality)];

  // inputs: target values and their smoothed followers
  const target = { scroll: 0, px: 0, py: 0 };
  const smooth = { ...target };
  const ndc = new Vector2();
  let pointerActive = false;
  let wide = true;
  let time = 0;
  let last = performance.now();
  let frameId = 0;

  // cursor ray in rig space: bricks anywhere along the line of sight react, not just one depth
  const raycaster = new Raycaster();
  const ray = { origin: new Vector3(), direction: new Vector3() };

  function pointerInRig() {
    if (!pointerActive) return null;
    raycaster.setFromCamera(ndc, camera);
    rig.worldToLocal(ray.origin.copy(raycaster.ray.origin));
    rig.worldToLocal(ray.direction.copy(raycaster.ray.origin).add(raycaster.ray.direction)).sub(ray.origin).normalize();
    return ray;
  }

  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    wide = camera.aspect > 1.05;
    camera.position.set(0, cfg.camera.y, wide ? cfg.camera.distance.wide : cfg.camera.distance.narrow);
    camera.updateProjectionMatrix();
    request();
  }

  function onPointer(e: PointerEvent) {
    ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    target.px = ndc.x;
    target.py = -ndc.y;
    pointerActive = true;
    request();
  }

  function onPointerLeave() {
    pointerActive = false;
  }

  function onVisibility() {
    if (!document.hidden) request();
  }

  function layoutRig(scroll: number) {
    const anchor = wide ? cfg.rig.wide : cfg.rig.narrow;
    const settle = 1 - Math.min(scroll * 2.2, 1);
    const { baseRotation: base, scrollRotation: sr, pointerRotation: pr } = cfg.rig;
    rig.position.set(anchor.x * settle, anchor.y * settle, 0);
    rig.rotation.set(base.x + pr.x * smooth.py, base.y + sr.y * scroll + pr.y * smooth.px, 0);
    rig.scale.setScalar(anchor.scale);
    rig.updateMatrixWorld();
  }

  function tick(now: number) {
    frameId = 0;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (animated) time += dt;

    const k = animated ? 1 - cfg.damping ** dt : 1;
    smooth.scroll += (target.scroll - smooth.scroll) * k;
    smooth.px += (target.px - smooth.px) * k;
    smooth.py += (target.py - smooth.py) * k;

    layoutRig(smooth.scroll);
    const frame: FrameState = { time, dt, scroll: smooth.scroll, pointer: pointerInRig(), animated };
    for (const part of parts) part.update(frame);
    renderer.render(scene, camera);

    const settled = Math.abs(target.scroll - smooth.scroll) < 1e-4;
    if (animated || !settled) request();
  }

  function request() {
    // after an idle gap dt is clamped in tick, so no clock reset is needed here
    if (frameId || document.hidden) return;
    frameId = requestAnimationFrame(tick);
  }

  layoutRig(0);
  await renderer.compileAsync(scene, camera);

  addEventListener('resize', resize);
  addEventListener('pointermove', onPointer, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerLeave);
  document.addEventListener('visibilitychange', onVisibility);
  resize();

  return {
    setScroll(progress) {
      target.scroll = progress;
      request();
    },
    dispose() {
      cancelAnimationFrame(frameId);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      for (const part of parts) part.dispose();
      environment.dispose();
      renderer.dispose();
    },
  };
}
