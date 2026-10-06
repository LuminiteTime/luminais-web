// Language-neutral facts about the site and its owner.

export const site = {
  url: 'https://luminais.tech',
  author: 'Mikhail Trifonov',
  handle: 'Luminais',
  employer: 'T-Bank',
  repo: 'https://github.com/LuminiteTime/luminais-web',
  ogImage: '/og.jpg',
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

/** Page sections in render order. Ids double as URL anchors and nav keys. */
export const sections = ['now', 'experience', 'work', 'stack', 'contact'] as const;
export type SectionId = (typeof sections)[number];
