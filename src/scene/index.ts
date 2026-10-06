import { Group, NeutralToneMapping, PerspectiveCamera, PMREMGenerator, Scene, WebGLRenderer } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { hasFinePointer, prefersReducedMotion } from '@/lib/env';
import { sceneConfig as cfg, type SceneQuality } from './config';
import { readPalette } from './palette';
import { createPanes } from './panes';
import { createStreams } from './streams';
import type { FrameState, ScenePart } from './types';

export interface SceneHandle {
  /** Page scroll progress, 0..1. */
  setScroll(progress: number): void;
  dispose(): void;
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

const pickQuality = (): SceneQuality => (hasFinePointer() && innerWidth >= 960 ? 'high' : 'low');

/**
 * Mounts the backdrop scene on a full-screen canvas.
 * Shaders compile off the main thread where supported, so the first frame does not block input.
 * Animates continuously unless motion is reduced; then it renders only on input.
 */
export async function mountScene(canvas: HTMLCanvasElement): Promise<SceneHandle> {
  const animated = !prefersReducedMotion();
  const quality = pickQuality();
  const palette = readPalette();

  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, cfg.maxPixelRatio[quality]));
  renderer.toneMapping = NeutralToneMapping;

  const scene = new Scene();
  scene.background = palette.background;
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = environment;
  pmrem.dispose();

  const camera = new PerspectiveCamera(cfg.camera.fov, 1, 0.1, 100);
  const rig = new Group();
  scene.add(rig);

  const parts: ScenePart[] = [createPanes(rig), createStreams(rig, palette, quality)];

  // inputs: target values and their smoothed followers
  const target = { scroll: 0, px: 0, py: 0 };
  const smooth = { ...target };
  let wide = true;
  let time = 0;
  let last = performance.now();
  let frameId = 0;

  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    wide = camera.aspect > 1.05;
    camera.position.set(0, cfg.camera.y, wide ? cfg.camera.distance.wide : cfg.camera.distance.narrow);
    camera.updateProjectionMatrix();
    request();
  }

  function onPointer(e: PointerEvent) {
    target.px = (e.clientX / innerWidth) * 2 - 1;
    target.py = (e.clientY / innerHeight) * 2 - 1;
    request();
  }

  function onVisibility() {
    if (!document.hidden) request();
  }

  function layoutRig(scroll: number, intro: number) {
    const anchor = wide ? cfg.rig.wide : cfg.rig.narrow;
    const settle = 1 - Math.min(scroll * 2.2, 1);
    const { baseRotation: base, scrollRotation: sr, pointerRotation: pr } = cfg.rig;
    rig.position.set(anchor.x * settle, anchor.y * settle - (1 - intro) * 1.2, 0);
    rig.rotation.set(
      base.x + sr.x * scroll + pr.x * smooth.py,
      base.y + sr.y * scroll + pr.y * smooth.px - (1 - intro) * 0.8,
      base.z,
    );
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

    const intro = animated ? easeOutCubic(clamp01((time - cfg.intro.delay) / cfg.intro.duration)) : 1;
    const frame: FrameState = { time, scroll: smooth.scroll, intro };
    layoutRig(frame.scroll, intro);
    for (const part of parts) part.update(frame);
    renderer.render(scene, camera);

    const settled = Math.abs(target.scroll - smooth.scroll) < 1e-4 && Math.abs(target.px - smooth.px) < 1e-3;
    if (animated || !settled) request();
  }

  function request() {
    // after an idle gap dt is clamped in tick, so no clock reset is needed here
    if (frameId || document.hidden) return;
    frameId = requestAnimationFrame(tick);
  }

  await renderer.compileAsync(scene, camera);

  addEventListener('resize', resize);
  addEventListener('pointermove', onPointer, { passive: true });
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
      document.removeEventListener('visibilitychange', onVisibility);
      for (const part of parts) part.dispose();
      environment.dispose();
      renderer.dispose();
    },
  };
}
