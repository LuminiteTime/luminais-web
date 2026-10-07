import type { Vector3 } from 'three';

/** Per-frame inputs shared by scene parts. */
export interface FrameState {
  /** Seconds since mount, frozen when motion is reduced. */
  time: number;
  /** Seconds since the previous frame, clamped. */
  dt: number;
  /** Smoothed choreography position: 0 is the first stage, 1.5 is halfway from the second to the third. */
  stage: number;
  /** Cursor as a ray in rig space, or null when there is none. */
  pointer: { origin: Vector3; direction: Vector3 } | null;
  /** False when motion is reduced: parts snap to their targets. */
  animated: boolean;
}

export interface ScenePart {
  update(frame: FrameState): void;
  dispose(): void;
}
