import Lenis from 'lenis';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

// smooth scroll; native anchors keep working through Lenis
const lenis = reduced ? null : new Lenis({ autoRaf: true, anchors: { offset: -88 } });

// scene loads after first paint so text never waits for WebGL
type SceneApi = ReturnType<typeof import('./scene').mountScene>;
let scene: SceneApi | null = null;
const canvas = document.getElementById('scene') as HTMLCanvasElement;

const progress = () => {
  const max = root.scrollHeight - innerHeight;
  return max > 0 ? scrollY / max : 0;
};

function onScroll() {
  const p = progress();
  scene?.setScroll(p);
  // veil fades the scene behind content once past the hero
  root.style.setProperty('--veil', String(Math.min(scrollY / innerHeight, 1)));
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

import('./scene')
  .then(({ mountScene }) => {
    scene = mountScene(canvas);
    scene.setScroll(progress());
    root.classList.add('webgl');
    if (!reduced) gsap.to({ v: 0 }, { v: 1, duration: 2.2, ease: 'power2.out', delay: 0.15, onUpdate() { scene?.setIntro(this.targets()[0].v); } });
  })
  .catch(() => root.classList.add('no-webgl'));

// hero name: split into chars driven by variable font axes
const name = document.querySelector<HTMLElement>('[data-name]');
if (name) {
  const split = SplitText.create(name.querySelectorAll('.line'), { type: 'chars', charsClass: 'ch' });
  const chars = split.chars as HTMLElement[];
  if (!reduced) {
    gsap.fromTo(
      chars,
      { '--w': 820, '--s': 0, opacity: 0, yPercent: 30 },
      { '--w': 160, '--s': 100, opacity: 1, yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.035 },
    );
    gsap.from('.hero .who, .hero .lead, .hero-foot', { opacity: 0, y: 14, duration: 1, ease: 'power3.out', delay: 0.55, stagger: 0.08 });

    // weight swells under the pointer
    const fine = matchMedia('(pointer: fine)').matches;
    if (fine) {
      const setters = chars.map((c) => gsap.quickTo(c, '--w', { duration: 0.5, ease: 'power3.out' }));
      name.addEventListener('pointermove', (e) => {
        chars.forEach((c, i) => {
          const r = c.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          setters[i](160 + 560 * Math.max(0, 1 - d / 220));
        });
      });
      name.addEventListener('pointerleave', () => setters.forEach((s) => s(160)));
    }
  }
}

// active section in nav
const navLinks = new Map(
  [...document.querySelectorAll<HTMLAnchorElement>('[data-nav]')].map((a) => [a.dataset.nav!, a]),
);
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      navLinks.forEach((a, id) => a.toggleAttribute('aria-current', id === e.target.id));
    }
  },
  { rootMargin: '-45% 0px -50% 0px' },
);
navLinks.forEach((_, id) => {
  const el = document.getElementById(id);
  if (el) io.observe(el);
});

// copy email
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
  const label = btn.textContent;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy!);
      btn.textContent = btn.dataset.done!;
      setTimeout(() => (btn.textContent = label), 1800);
    } catch {
      location.href = `mailto:${btn.dataset.copy}`;
    }
  });
});

lenis?.on('scroll', onScroll);
