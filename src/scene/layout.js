// Room layout in meters. The desk stands against the back wall (z = WALL_BACK_Z),
// sticky notes hang above it, window is on the right half of the back wall.
export const ROOM = {
  width: 9,
  depth: 10,
  height: 3.4,
  wallBackZ: -2.2,
  wallLeftX: -3.4,
}

export const DESK = {
  topY: 0.78,
  centerX: 0.3,
  centerZ: -1.35,
  width: 2.6,
  depth: 1.0,
  thickness: 0.05,
}

export const LAPTOP = {
  x: 0.35,
  z: -1.3,
  screenZ: -1.42, // plane the camera eventually crosses
  screenY: 1.06,
}

export const NOTES = {
  z: -2.16,
  // Five timeline notes, left to right, matching the camera's wall sweep.
  xs: [-1.35, -0.62, 0.12, 0.86, 1.58],
  ys: [1.95, 2.05, 1.9, 2.02, 1.92],
  size: 0.34,
}

export const WINDOW = {
  x: 2.6,
  y: 1.7,
  z: -2.19,
  width: 1.5,
  height: 1.6,
}

export const SHELF = {
  x: -3.32,
  y: 1.7,
  z: -0.6,
  books: 9,
}
