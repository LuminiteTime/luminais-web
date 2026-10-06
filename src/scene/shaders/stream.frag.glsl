uniform float uTime;
uniform vec3 uBg;

varying vec2 vUv;
varying float vSpeed;
varying float vOffset;
varying vec3 vBase;
varying vec3 vPulse;

void main() {
  // a bright packet travelling along the tube
  float t = fract(vUv.x * 3.0 - uTime * vSpeed + vOffset);
  float pulse = smoothstep(0.0, 0.05, t) * (1.0 - smoothstep(0.05, 0.2, t));
  vec3 color = mix(vBase, vPulse, pulse);

  // fade into the background colour, not alpha: the transmission pass only sees opaque meshes
  float edge = smoothstep(0.12, 0.45, vUv.x) * (1.0 - smoothstep(0.86, 1.0, vUv.x));
  gl_FragColor = vec4(mix(uBg, color, edge), 1.0);

  #include <colorspace_fragment>
}
