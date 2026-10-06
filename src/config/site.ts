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
  themeColor: '#f7f8fc',
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
  yandexMetrikaId: '',
  yandexMetrika: { webvisor: true, clickmap: true, trackLinks: true, accurateTrackBounce: true },
  verification: { yandex: '', google: '' },
} as const;

/** Page sections in render order. Ids double as URL anchors and nav keys. */
export const sections = ['now', 'experience', 'work', 'stack', 'contact'] as const;
export type SectionId = (typeof sections)[number];
