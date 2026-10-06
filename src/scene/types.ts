/** Per-frame inputs shared by scene parts. All values are already smoothed. */
export interface FrameState {
  /** Seconds since mount, frozen when motion is reduced. */
  time: number;
  /** Page scroll progress, 0..1. */
  scroll: number;
  /** Intro progress, 0..1, eased. */
  intro: number;
}

export interface ScenePart {
  update(frame: FrameState): void;
  dispose(): void;
}
