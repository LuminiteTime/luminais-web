import * as THREE from 'three'
import { NOTES, LAPTOP } from './layout'

// One keyframe per overlay section; the rig reaches keyframe i at the center
// of section i. Positions/targets are meters, t is scroll progress (0..1).
export const SECTION_COUNT = 9

const SECTION_T = (i) => (i + 0.5) / SECTION_COUNT

const noteKeyframe = (i) => ({
  position: [NOTES.xs[i] - 0.28, NOTES.ys[i] - 0.12, 0.72],
  lookAt: [NOTES.xs[i], NOTES.ys[i], NOTES.z],
  fov: 46,
})

export const CAMERA_KEYFRAMES = [
  // Hero — wide establishing shot from the room's front-right corner.
  { position: [3.4, 2.2, 4.6], lookAt: [0.2, 1.0, -1.5], fov: 50 },
  // Intro — low crane across the room toward the desk surface.
  { position: [-2.6, 1.35, 1.6], lookAt: [0.0, 0.85, -1.35], fov: 50 },
  // Timeline — dolly along the wall, pausing on each sticky note.
  noteKeyframe(0),
  noteKeyframe(1),
  noteKeyframe(2),
  noteKeyframe(3),
  noteKeyframe(4),
  // Dive — push into the laptop screen.
  {
    position: [LAPTOP.x, 1.15, -0.55],
    lookAt: [LAPTOP.x, LAPTOP.screenY + 0.02, LAPTOP.screenZ],
    fov: 56,
  },
  // Void — drifting inside the machine.
  { position: [0.35, 1.3, -7.5], lookAt: [0.5, 1.3, -12], fov: 62 },
].map((kf, i) => ({ ...kf, t: SECTION_T(i) }))

// Progress at which the camera pierces the laptop screen plane.
export const SCREEN_CROSS_T = 0.875

function toCurve(points) {
  return new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...p)),
    false,
    'centripetal'
  )
}

// Maps keyframe t (0..1 across keyframe slots) to a curve parameter.
function makeSampler(keyframes, pick) {
  const curve = toCurve(keyframes.map(pick))
  const ts = keyframes.map((kf) => kf.t)
  const first = ts[0]
  const last = ts[ts.length - 1]

  return (progress, out) => {
    const clamped = THREE.MathUtils.clamp(progress, first, last)
    // Normalize keyframe t-range to the curve's 0..1 parameter space.
    const u = (clamped - first) / (last - first)
    return curve.getPoint(u, out)
  }
}

export function createCameraSampler() {
  const samplePosition = makeSampler(CAMERA_KEYFRAMES, (kf) => kf.position)
  const sampleLookAt = makeSampler(CAMERA_KEYFRAMES, (kf) => kf.lookAt)
  const fovs = CAMERA_KEYFRAMES.map((kf) => kf.fov)
  const ts = CAMERA_KEYFRAMES.map((kf) => kf.t)

  const sampleFov = (progress) => {
    if (progress <= ts[0]) return fovs[0]
    for (let i = 1; i < ts.length; i++) {
      if (progress <= ts[i]) {
        const span = ts[i] - ts[i - 1]
        const local = (progress - ts[i - 1]) / span
        return THREE.MathUtils.lerp(fovs[i - 1], fovs[i], local)
      }
    }
    return fovs[fovs.length - 1]
  }

  return { samplePosition, sampleLookAt, sampleFov }
}
