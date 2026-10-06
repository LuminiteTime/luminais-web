import { services } from '@/config/site';

type YandexMetrika = ((id: number, method: string, ...args: unknown[]) => void) & { a?: unknown[]; l?: number };

declare global {
  interface Window {
    ym?: YandexMetrika;
  }
}

const TAG_URL = 'https://mc.yandex.ru/metrika/tag.js';
const counterId = Number(services.yandexMetrikaId);

/**
 * Yandex Metrika with a deferred tag: calls are queued at once, the 60 KB tag loads when the browser is idle,
 * so analytics never competes with first paint. Does nothing until a counter id is configured.
 */
export function initAnalytics(): void {
  if (!counterId) return;

  const queue: YandexMetrika = (...args: unknown[]) => {
    (queue.a ??= []).push(args);
  };
  queue.l = Date.now();
  window.ym ??= queue;
  window.ym(counterId, 'init', { ...services.yandexMetrika, ssr: true });

  const load = () => {
    if (document.querySelector(`script[src="${TAG_URL}"]`)) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = TAG_URL;
    document.head.append(script);
  };
  if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 3000 });
  else setTimeout(load, 1500);

  trackGoals();
}

/**
 * Elements with `data-goal="name"` report a Metrika goal on click.
 * Optional `data-goal-label` is sent as a goal parameter.
 */
function trackGoals(): void {
  document.addEventListener('click', (event) => {
    const target = (event.target as Element | null)?.closest<HTMLElement>('[data-goal]');
    const goal = target?.dataset.goal;
    if (!goal) return;
    const label = target.dataset.goalLabel;
    window.ym?.(counterId, 'reachGoal', goal, label ? { label } : undefined);
  });
}
