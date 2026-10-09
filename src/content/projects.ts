import type { Localized } from '@/i18n';

/** A project tile. `featured` tiles take a wider column. */
export interface Project {
  id: string;
  stack: string[];
  href?: string;
  featured?: boolean;
  l10n: Localized<{ title: string; context: string; award?: string; text: string }>;
}

export const projects: Project[] = [
  {
    id: 'mts-docs',
    featured: true,
    stack: ['React', 'TypeScript', 'Java', 'Spring', 'Node.js', 'PostgreSQL'],
    l10n: {
      en: {
        title: 'Docs with live tables',
        context: 'MTS True Tech Hack, 2026',
        award: 'Best solution, MWS Tables track',
        text: 'A Confluence-style editor with real-time co-editing and native MWS Tables embeds. I owned the metadata backend and the tables integration and wrote half of the React client.',
      },
      ru: {
        title: 'Документы с живыми таблицами',
        context: 'MTS True Tech Hack, 2026',
        award: 'Лучшее решение в треке MWS Tables',
        text: 'Редактор в духе Confluence с совместным редактированием в реальном времени и встроенными MWS Tables. На мне были бэкенд метаданных, интеграция с таблицами и половина React-клиента.',
      },
    },
  },
  {
    id: 'sleepy-knight',
    featured: true,
    stack: ['React Native', 'Expo', 'TypeScript', 'Go', 'vLLM'],
    l10n: {
      en: {
        title: 'The Sleepy Knight',
        context: 'AdventureX, Hangzhou, 2026',
        award: '800+ participants',
        text: 'A pixel-art tamagotchi that survives only if you sleep on schedule. I built the Go service behind its AI oracle, the game and onboarding screens, and an NFC e-ink card that mirrors the hero.',
      },
      ru: {
        title: 'The Sleepy Knight',
        context: 'AdventureX, Ханчжоу, 2026',
        award: '800+ участников',
        text: 'Пиксельный тамагочи, который выживает, только если ты спишь по режиму. Я сделал Go-сервис для его AI-оракула, игровые экраны, онбординг и NFC-карточку на e-ink, где живёт копия героя.',
      },
    },
  },
  {
    id: 'pingtower',
    stack: ['Java 21', 'Spring Boot', 'ClickHouse', 'Python'],
    l10n: {
      en: {
        title: 'PingTower',
        context: 'T1 Hackathon, 2025',
        text: 'Uptime monitoring for sites and APIs with alert rules, incident history and SLA reports. I led the backend and designed it for 10,000 checks a minute: a Java scheduler, ClickHouse for time series, a Python notifier behind one OpenAPI contract.',
      },
      ru: {
        title: 'PingTower',
        context: 'T1 Hackathon, 2025',
        text: 'Мониторинг доступности сайтов и API: правила алертов, история инцидентов, SLA-отчёты. Я вёл бэкенд и спроектировал его на 10 000 проверок в минуту: планировщик на Java, ClickHouse под временные ряды, нотификатор на Python за общим OpenAPI-контрактом.',
      },
    },
  },
  {
    id: 'flow-solver',
    stack: ['C++'],
    l10n: {
      en: {
        title: 'Network flow solver',
        context: 'Techarena Kazan, 2025',
        award: '2nd place',
        text: 'Splits flow between consumer nodes under capacity and cost limits. Dynamic programming plus a greedy pass, checked on my own set of edge cases.',
      },
      ru: {
        title: 'Распределение потоков в сети',
        context: 'Techarena Kazan, 2025',
        award: '2 место',
        text: 'Делит поток между узлами-потребителями с учётом пропускной способности и стоимости. Динамика плюс жадный проход, проверенные на моём наборе краевых случаев.',
      },
    },
  },
  {
    id: 'open-labs-share',
    stack: ['Spring Cloud', 'gRPC', 'FastAPI', 'PostgreSQL'],
    href: 'https://github.com/LuminiteTime/Open-Labs-Share-Docs',
    l10n: {
      en: {
        title: 'Open Labs Share',
        context: 'Backend lead, team of seven, 2025',
        text: 'A peer-to-peer learning platform. I led the backend part of a seven-person team: split the work across three engineers, ran weekly 1:1s and design reviews, and built the gateway, auth and user services myself.',
      },
      ru: {
        title: 'Open Labs Share',
        context: 'Лид бэкенда, команда из семи человек, 2025',
        text: 'Платформа, где студенты учат друг друга. Я вёл бэкенд в команде из семи человек: делил работу между тремя инженерами, проводил еженедельные 1:1 и дизайн-ревью, сам написал gateway, авторизацию и сервис пользователей.',
      },
    },
  },
  {
    id: 'language-i',
    stack: ['Java', 'JavaCC', 'WebAssembly'],
    href: 'https://github.com/LuminiteTime/Compilers-Construction-Hmm',
    l10n: {
      en: {
        title: 'Language I compiler',
        context: 'Compilers course, 2025',
        text: 'Compiles a custom imperative language to WebAssembly: JavaCC parser, semantic passes, WAT codegen, programs run through wasmtime.',
      },
      ru: {
        title: 'Компилятор языка I',
        context: 'Курс по компиляторам, 2025',
        text: 'Компилирует собственный императивный язык в WebAssembly: парсер на JavaCC, семантические проходы, генерация WAT, запуск через wasmtime.',
      },
    },
  },
  {
    id: 'lime-trade',
    stack: ['Flutter', 'Dart', 'JavaScript'],
    href: 'https://limetrade.pro',
    l10n: {
      en: {
        title: 'Lime Trade',
        context: 'Client work, 2025',
        text: 'A company website and a Flutter pricing calculator that replaced a fragile Excel workbook. Managers use it every day.',
      },
      ru: {
        title: 'Lime Trade',
        context: 'Клиентский проект, 2025',
        text: 'Сайт компании и калькулятор цен на Flutter, который заменил хрупкую таблицу в Excel. Менеджеры пользуются им каждый день.',
      },
    },
  },
];
