# luminais.tech

[![CI / Deploy](https://github.com/LuminiteTime/luminais-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/LuminiteTime/luminais-web/actions/workflows/deploy.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fluminais.tech&label=luminais.tech)](https://luminais.tech)
![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)
![three.js](https://img.shields.io/badge/three.js-r186-000000?logo=threedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white)
![Lighthouse](https://img.shields.io/badge/Lighthouse_performance-100%20desktop%20%C2%B7%2099%20mobile-0CCE6B?logo=lighthouse&logoColor=white)

Personal site of Mikhail Trifonov (Luminais), software engineer at T-Bank Data Platform.
A static, bilingual (EN/RU) one-pager with a WebGL backdrop: matte blocks act out the data lifecycle while you
scroll: a raw cloud, an ingestion stream, sorted partitions, a curated table and an orbit around the contact card.

## Stack

| Concern   | Choice                                                                               |
| --------- | ------------------------------------------------------------------------------------ |
| Framework | [Astro 7](https://astro.build), static output, zero JS by default                    |
| 3D        | [three.js](https://threejs.org), vanilla, loaded lazily in its own chunk             |
| Motion    | [GSAP](https://gsap.com) with SplitText, [Lenis](https://lenis.darkroom.engineering) |
| Type      | [Geologica Variable](https://fontsource.org/fonts/geologica), self-hosted            |
| Quality   | TypeScript strict, ESLint, Prettier, `astro check`                                   |
| Hosting   | GitHub Pages via GitHub Actions, custom domain                                       |

## Quick start

Requires Node 22.12+ (see `.nvmrc`) and pnpm 11.

```bash
pnpm install
pnpm dev          # http://localhost:4321
```

| Script         | What it does                                        |
| -------------- | --------------------------------------------------- |
| `pnpm dev`     | Dev server with HMR                                 |
| `pnpm build`   | Static build into `dist/`                           |
| `pnpm preview` | Serves `dist/` locally                              |
| `pnpm check`   | Type checks `.astro` and `.ts`                      |
| `pnpm lint`    | ESLint                                              |
| `pnpm format`  | Prettier, writes changes                            |
| `pnpm verify`  | Format check, lint, type check and build, as in CI  |
| `pnpm icons`   | Renders PNG and ICO icons from `public/favicon.svg` |

## Project structure

```
src/
├── config/site.ts          site facts, contacts, section order
├── i18n/                   locales, UI strings, date formatting
├── content/                experience, projects, highlights, stack (data + translations)
├── styles/
│   ├── tokens.css          design tokens, the single source of truth
│   └── global.css          reset, base elements, utilities (.glass, .wrap, .sr-only)
├── layouts/BaseLayout.astro  <html>, head, fonts, backdrop, smooth scroll
├── components/
│   ├── ui/                 primitives: Button, Heading, Section, ExternalIcon
│   ├── layout/             Seo, SiteNav, SiteFooter, Backdrop
│   └── sections/           Hero, Now, Experience, Work, Stack, Contact
├── scene/                  WebGL backdrop: config, layouts, bricks, palette
├── scripts/                client behaviour: backdrop, hero-name, scroll-spy, copy-text, smooth-scroll
├── lib/                    env helpers, schema.org graph, llms.txt builders
└── pages/
    ├── [...locale].astro   one route per locale: / and /ru/
    ├── 404.astro           noindex
    ├── robots.txt.ts       generated from config
    ├── llms.txt.ts         llmstxt.org index for language models
    ├── llms-full.txt.ts    the whole profile as Markdown
    └── manifest.webmanifest.ts
```

## Architecture

Dependencies point one way: `pages → sections → ui`, all of them read `config`, `content` and `i18n`.
Nothing reads upward.

- **Content is data.** Components never hold copy. Language-neutral facts (dates, stack, links) live next to
  an `l10n` object typed as `Localized<T>`, so a missing translation fails the type check.
- **Components own their markup and scoped styles.** Behaviour lives in `src/scripts/*` as small init
  functions; a component only wires them to its DOM.
- **The scene is isolated.** `src/scene` knows nothing about the page. `scripts/backdrop.ts` mounts it when the
  browser is idle and feeds it scroll progress. Each scene part implements `ScenePart { update, dispose }`.
- **Progressive enhancement.** The page is complete HTML and CSS. WebGL, smooth scroll and the hero animation
  are optional layers; `<html data-scene="off">` switches to a CSS gradient when WebGL2 or bandwidth is missing.

## Design system

All visual decisions are tokens in [`src/styles/tokens.css`](src/styles/tokens.css). Components use only
`var(--…)`; no raw colours or magic sizes outside the token file.

| Group   | Tokens                                                                        |
| ------- | ----------------------------------------------------------------------------- |
| Colour  | `--color-bg` `--color-ink` `--color-ink-muted` `--color-accent` …             |
| Surface | `--surface-glass` `--surface-raised` `--blur-glass` `--shadow-glass`          |
| Scene   | `--scene-brick-1…3` plus `--color-accent` (read by WebGL at runtime)          |
| Type    | `--text-xs … --text-hero`, `--weight-thin … --weight-bold`, `--font-sharp-on` |
| Space   | `--space-1 … --space-8` on a 4px base, `--space-section`, `--space-panel`     |
| Shape   | `--radius-s` `--radius-m` `--radius-l` `--radius-pill`                        |
| Motion  | `--ease-out` `--duration-fast` `--duration-base`                              |

Geologica is variable on `wght`, `SHRP`, `CRSV` and `slnt`. Headings use sharp terminals (`SHRP 100`), body
text stays soft (`SHRP 0`). The hero name tweens `wght` and `SHRP` per letter.

## Editing content

| Task                              | File                                                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Add a T-Bank achievement          | `src/content/highlights.ts`, and a bullet in `src/content/experience.ts`                                                  |
| Add a job                         | `src/content/experience.ts` (`start: 'YYYY-MM'`, omit `end` for current)                                                  |
| Add a project                     | `src/content/projects.ts` (`featured: true` for a wide tile)                                                              |
| Change stack                      | `src/content/stack.ts`                                                                                                    |
| Change interface text             | `src/i18n/ui.ts`                                                                                                          |
| Change contacts                   | `src/config/site.ts`                                                                                                      |
| Page title, description, OG image | `meta` in `src/i18n/ui.ts`                                                                                                |
| Add a section                     | component in `components/sections`, id in `config/site.ts`, label in `i18n/ui.ts`                                         |
| Add a locale                      | `locales` in `src/i18n/index.ts` and `astro.config.mjs`, a dictionary in `ui.ts`; the compiler lists every missing string |

Dates are formatted with `Intl.DateTimeFormat`, so `2025-09` renders as "Sep 2025" and "Сент 2025".

## Scene

Data as physical material. A few hundred matte blocks act out the data lifecycle as the page scrolls, one stage
per section:

| Section     | Stage     | What the blocks do                                                       |
| ----------- | --------- | ------------------------------------------------------------------------ |
| Hero        | `cloud`   | Raw data: odd shapes in a mixed, drifting cloud                          |
| Now         | `stream`  | Ingestion: a turning helix across the whole screen                       |
| Experience  | `columns` | Sorted by colour into partitions of uneven size, normalised to one shape |
| Work, Stack | `table`   | One curated table, sorted keys show as stripes                           |
| Contact     | `ring`    | Served: a slow orbit framing the contact card                            |

Every block rides a damped spring, so moves overshoot and settle, and the cursor pushes blocks along the line of
sight. Sections declare their stage through `data-stage` (mapped in `sectionStages`, `src/config/site.ts`);
`scripts/backdrop.ts` turns the reading position into a continuous stage value, so the choreography follows the
content however long it gets.

| File         | Role                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------- |
| `config.ts`  | Stages (layout, tumble, raw shape, rig placement for wide and narrow screens) and all tunables |
| `layouts.ts` | Layout maths: where each block sits in every stage, moving layouts animate with time           |
| `bricks.ts`  | One `InstancedMesh`, a damped spring per block, cursor repulsion                               |
| `index.ts`   | Renderer, lights and shadows, camera, rig blending between stages, frame loop                  |
| `palette.ts` | Block colours from design tokens                                                               |

- Phones get their own staging: formations turn upright (`roll` in a stage's `narrow` placement), so the stream
  runs top to bottom and the ring frames the screen, and taller gaps between sections (`--space-section`) leave
  clear windows onto the scene.
- All blocks are one instanced mesh: a single draw call.
- Shaders compile with `renderer.compileAsync`, so the first frame does not block input.
- Phones and coarse pointers get the `low` tier: fewer blocks, no shadows, lower pixel ratio.
- Glass panels use `contrast()` and `brightness()` in `backdrop-filter`, so shapes stay visible behind text without
  hurting contrast.
- The loop pauses in background tabs. With `prefers-reduced-motion` blocks snap to place and the scene renders only
  on scroll or resize.

## Performance and accessibility

Lighthouse on the production build:

| Profile | Performance | Accessibility | Best practices | SEO |
| ------- | ----------- | ------------- | -------------- | --- |
| Desktop | 100         | 100           | 77             | 100 |
| Mobile  | 99          | 100           | 77             | 100 |

Best practices loses points only for third-party cookies set by the Yandex Metrika tag; without the counter it is 100.

- CSS is inlined, fonts for the current locale are preloaded, images go through `astro:assets` (WebP, 1x/2x).
- Initial JS is ~36 KB gzip (Lenis, GSAP, page scripts). three.js (~136 KB gzip) loads after first paint and only when WebGL2 is available and Save-Data is off.
- Semantic landmarks, visible focus, `aria-current` in the nav, native `<details>` and `popover`.
- Sitemap with hreflang, canonical URLs, Open Graph, JSON-LD `Person`.

## SEO

- Per-locale `<title>`, description, canonical, `hreflang` (with `x-default`) and Open Graph image.
- JSON-LD graph: `WebSite`, `ProfilePage` and `Person` (employer, university, location, languages,
  `knowsAbout` from the stack, `sameAs` profiles). Built in `src/lib/structured-data.ts`.
- Sitemap with `lastmod` and hreflang alternates, `robots.txt`, web manifest, favicon set
  (SVG, ICO, Apple touch, 192 and 512 PNG). Icons are rendered by `tools/generate-icons.mjs`.
- `llms.txt` and `llms-full.txt` give language models a clean Markdown profile. Both are generated from
  `src/content`, so they never drift from the page.

## Analytics

[Yandex Metrika](https://metrika.yandex.ru) is wired but stays off until a counter id is set:

1. Create a counter for `luminais.tech` at metrika.yandex.ru.
2. Put its number into `services.yandexMetrikaId` in `src/config/site.ts`.
3. Webvisor, click map and link tracking flags live next to it in `services.yandexMetrika`.

The tag loads when the browser is idle (earlier calls are queued), so it does not affect first paint.
Clicks on elements with `data-goal` are sent as goals. Create goals of type "JavaScript event" in Metrika
with these identifiers:

| Goal            | Fired by                           | Parameter              |
| --------------- | ---------------------------------- | ---------------------- |
| `cta_contact`   | Hero "Get in touch"                |                        |
| `cta_projects`  | Hero "See projects"                |                        |
| `email_click`   | Email link                         |                        |
| `email_copy`    | "Copy email" button                |                        |
| `social`        | Telegram, GitHub, LinkedIn, WeChat | `label`: network       |
| `project_open`  | Project tile with a link           | `label`: project id    |
| `locale_switch` | EN/RU switch                       | `label`: target locale |

Search console verification codes go into `services.verification` (`yandex`, `google`); the meta tags render
automatically.

## Deployment

Every push to `main` runs `pnpm verify` and deploys `dist/` to GitHub Pages
([workflow](.github/workflows/deploy.yml)). Pull requests run the same checks without deploying.

The custom domain comes from `public/CNAME`. DNS: four `A` records on the apex to GitHub Pages
(`185.199.108.153` to `185.199.111.153`) and a `CNAME` for `www` to `luminitetime.github.io`.
