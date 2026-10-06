// Per-stream params arrive as attributes: all streams share one merged geometry and draw call.
attribute float aSpeed;
attribute float aOffset;
attribute vec3 aBase;
attribute vec3 aPulse;

varying vec2 vUv;
varying float vSpeed;
varying float vOffset;
varying vec3 vBase;
varying vec3 vPulse;

void main() {
  vUv = uv;
  vSpeed = aSpeed;
  vOffset = aOffset;
  vBase = aBase;
  vPulse = aPulse;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
