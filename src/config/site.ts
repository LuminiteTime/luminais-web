// Language-neutral facts about the site and its owner.

export const site = {
  url: 'https://luminais.tech',
  author: 'Mikhail Trifonov',
  givenName: 'Mikhail',
  familyName: 'Trifonov',
  handle: 'Luminais',
  employer: { name: 'T-Bank', url: 'https://www.tbank.ru' },
  alumniOf: { name: 'Innopolis University', url: 'https://innopolis.university' },
  location: { locality: 'Innopolis', region: 'Republic of Tatarstan', country: 'RU' },
  languages: ['ru', 'en'],
  repo: 'https://github.com/LuminiteTime/luminais-web',
  /** Browser UI colour. Keep in sync with --color-bg in src/styles/tokens.css. */
  themeColor: '#f5f7f5',
} as const;

export const contacts = {
  email: 'trifonov2812@gmail.com',
  telegram: 'https://t.me/LuminiteTime',
  github: 'https://github.com/LuminiteTime',
  linkedin: 'https://www.linkedin.com/in/mikhailtrifonov28',
  wechatId: 'wxid_iduyrsvt6j1622',
} as const;

/**
 * Third-party services. Empty values switch a service off.
 * - yandexMetrikaId: counter number from metrika.yandex.ru
 * - verification: codes from Yandex Webmaster and Google Search Console (the `content` of their meta tag)
 */
export const services = {
  yandexMetrikaId: '113487330',
  yandexMetrika: { webvisor: true, clickmap: true, trackLinks: true, accurateTrackBounce: true },
  verification: { yandex: '49d0f0899152690c', google: 'qqgKGZPK_mARVFCmf3X4dEInjqCLVGGkt5UQ9eLkSfU' },
} as const;

/** Page sections in render order. Ids double as URL anchors and nav keys. */
export const sections = ['now', 'experience', 'cases', 'work', 'stack', 'contact'] as const;
export type SectionId = (typeof sections)[number];

/** Backdrop scene stage shown while each part of the page is on screen (see `stages` in src/scene/config.ts). */
export const sectionStages: Record<SectionId | 'hero', number> = {
  hero: 0,
  now: 1,
  experience: 2,
  cases: 3,
  work: 3,
  stack: 3,
  contact: 4,
};
