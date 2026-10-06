import {
  CatmullRomCurve3,
  Color,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  ShaderMaterial,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
  NeutralToneMapping,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Three glass panes are pipeline stages (raw, clean, curated).
// Streams enter tangled on the left and leave ordered on the right.

const BG = '#f7f8fc';
const PANE_GAP = 1.5;

const streamVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const streamFrag = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uOffset;
  uniform vec3 uBase;
  uniform vec3 uPulse;
  uniform vec3 uBg;
  varying vec2 vUv;
  void main() {
    float t = fract(vUv.x * 3.0 - uTime * uSpeed + uOffset);
    float pulse = smoothstep(0.0, 0.05, t) * (1.0 - smoothstep(0.05, 0.2, t));
    vec3 col = mix(uBase, uPulse, pulse);
    // opaque fade into the background so the transmission pass still sees the streams
    float edge = smoothstep(0.12, 0.45, vUv.x) * (1.0 - smoothstep(0.86, 1.0, vUv.x));
    gl_FragColor = vec4(mix(uBg, col, edge), 1.0);
    #include <colorspace_fragment>
  }
`;

function rand(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export function mountScene(canvas: HTMLCanvasElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.toneMapping = NeutralToneMapping;

  const scene = new Scene();
  scene.background = new Color(BG);
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.4, 11);

  const rig = new Group();
  scene.add(rig);

  // panes
  const glass = new MeshPhysicalMaterial({
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
  const paneGeo = new RoundedBoxGeometry(0.28, 2.9, 2.2, 6, 0.12);
  const panes = [-1, 0, 1].map((i) => {
    const m = new Mesh(paneGeo, glass);
    m.position.x = i * PANE_GAP;
    rig.add(m);
    return m;
  });

  // streams
  const pulse = new Color('#4b3bff');
  const palette = ['#c9c3ff', '#d9dcef', '#b8b0ff', '#e3e1f7'].map((c) => new Color(c));
  const bg = new Color(BG);
  const streamMats: ShaderMaterial[] = [];
  const COUNT = 22;
  for (let s = 0; s < COUNT; s++) {
    const lane = (s / (COUNT - 1) - 0.5) * 2; // -1..1
    const pts: Vector3[] = [];
    for (let k = 0; k <= 16; k++) {
      const x = -9 + (18 * k) / 16;
      // chaos fades as data passes each stage
      const chaos = Math.max(0, Math.min(1, (PANE_GAP * 1.4 - x) / (PANE_GAP * 2.8)));
      const ordered = new Vector3(x, lane * 0.85, (rand(s + 3) - 0.5) * 1.1);
      const wild = new Vector3(x, (rand(s * 17 + k) - 0.5) * 2.6, (rand(s * 31 + k * 7) - 0.5) * 2.4);
      pts.push(ordered.lerp(wild, chaos * chaos));
    }
    const curve = new CatmullRomCurve3(pts, false, 'centripetal');
    const radius = 0.012 + rand(s * 5) * 0.016;
    const geo = new TubeGeometry(curve, 220, radius, 6, false);
    const mat = new ShaderMaterial({
      vertexShader: streamVert,
      fragmentShader: streamFrag,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 0.05 + rand(s * 9) * 0.07 },
        uOffset: { value: rand(s * 13) },
        uBase: { value: palette[s % palette.length] },
        uPulse: { value: s % 3 === 0 ? pulse : pulse.clone().lerp(new Color('#9d94ff'), 0.6) },
        uBg: { value: bg },
      },
    });
    streamMats.push(mat);
    rig.add(new Mesh(geo, mat));
  }

  // layout state
  const state = { scroll: 0, mx: 0, my: 0, intro: reduced ? 1 : 0 };
  const smooth = { scroll: 0, mx: 0, my: 0 };
  let wide = true;

  function resize() {
    const w = innerWidth;
    const h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    wide = w / h > 1.05;
    camera.position.z = wide ? 11 : 18;
  }
  resize();
  addEventListener('resize', () => {
    resize();
    wake();
  });

  addEventListener('pointermove', (e) => {
    state.mx = (e.clientX / innerWidth) * 2 - 1;
    state.my = (e.clientY / innerHeight) * 2 - 1;
  });

  let t = 0;
  let last = performance.now();
  let running = true;

  function frame(now: number) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!reduced) t += dt;

    const k = reduced ? 1 : 1 - Math.pow(0.0015, dt);
    smooth.scroll += (state.scroll - smooth.scroll) * k;
    smooth.mx += (state.mx - smooth.mx) * k;
    smooth.my += (state.my - smooth.my) * k;
    const p = smooth.scroll;
    const intro = 1 - Math.pow(1 - state.intro, 3);

    // hero: panes on the right; on scroll they open up and drift to centre
    const baseX = wide ? 2.3 : 0;
    const baseY = wide ? 0.1 : 2.6;
    rig.position.set(baseX * (1 - Math.min(p * 2.2, 1)), baseY * (1 - Math.min(p * 2.2, 1)) + (1 - intro) * -1.2, 0);
    rig.rotation.y = -0.62 + p * 1.4 + smooth.mx * 0.12 + (1 - intro) * -0.8;
    rig.rotation.x = 0.12 + smooth.my * 0.06 + p * 0.25;
    rig.rotation.z = -0.05;
    const spread = PANE_GAP * (1 + p * 0.9);
    panes.forEach((m, i) => {
      m.position.x = (i - 1) * spread * intro;
      m.rotation.y = Math.sin(t * 0.4 + i) * 0.04 + (i - 1) * p * 0.35;
      m.position.y = Math.sin(t * 0.6 + i * 1.7) * 0.05;
    });
    for (const m of streamMats) m.uniforms.uTime.value = t;

    renderer.render(scene, camera);
    if (!reduced || Math.abs(state.scroll - smooth.scroll) > 1e-4) requestAnimationFrame(frame);
    else idle = true;
  }

  let idle = false;
  const wake = () => {
    if (idle && running) {
      idle = false;
      last = performance.now();
      requestAnimationFrame(frame);
    }
  };

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) {
      last = performance.now();
      requestAnimationFrame(frame);
    }
  });

  requestAnimationFrame(frame);

  return {
    setScroll(v: number) {
      state.scroll = v;
      wake();
    },
    setIntro(v: number) {
      state.intro = v;
    },
    wake,
  };
}
