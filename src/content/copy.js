export const socials = [
  { label: 'GitHub', href: 'https://github.com/LuminiteTime', key: 'gh' },
  { label: 'Telegram', href: 'https://t.me/LuminiteTime', key: 'tg' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mikhailtrifonov28', key: 'li' },
  { label: 'Email', href: 'mailto:trifonov2812@gmail.com', key: 'mail' },
  { label: 'WeChat', href: null, key: 'wechat', id: 'wxid_iduyrsvt6j1622', qr: '/images/wechat.jpg' },
]

export const copy = {
  en: {
    heroName: 'Mikhail Trifonov',
    heroAlias: 'aka Luminais',
    heroRole: 'Java Backend Developer',
    introTitle: 'Hey!',
    intro1:
      'I’m Mikhail Trifonov from Kazan / Innopolis. I build backend systems on Java and Scala, focused on integrations, reliability, and developer experience.',
    intro2: 'Feel free to get in touch or take a look at my past work.',
    nav: { home: 'Home', exp: 'Experience', contact: 'Contact' },
    timelineTitle: 'Timeline',
    contactTitle: 'Contact',
    wechatScan: 'scan with wechat',
    diveHint: 'entering the machine…',
    scrollHint: 'scroll',
  },
  ru: {
    heroName: 'Михаил Трифонов',
    heroAlias: 'aka Luminais',
    heroRole: 'Java Backend разработчик',
    introTitle: 'Привет!',
    intro1:
      'Я Михаил Трифонов из Казани / Иннополиса. Делаю бэкенд на Java и Scala, фокус на интеграции, надёжность и удобство для разработчиков.',
    intro2: 'Пишите, если нужен надёжный бэкенд или хотите обсудить опыт.',
    nav: { home: 'Главная', exp: 'Опыт', contact: 'Контакты' },
    timelineTitle: 'Таймлайн',
    contactTitle: 'Контакты',
    wechatScan: 'сканируй в wechat',
    diveHint: 'входим в машину…',
    scrollHint: 'листай',
  },
}

export const timelines = {
  en: [
    {
      period: 'Sep 2025 — present',
      title: 'Java Software Engineer — T-Bank',
      detail: 'Building microservices and reliable integrations for T-Bank.',
    },
    {
      period: 'Jan 2025 — Apr 2025',
      title: 'Scala Developer — Yandex',
      detail:
        'Developed and maintained microservices with gRPC for internal calls and REST for external clients. Optimized gRPC performance to cut response times. Designed GraphQL schemas for frontend, coordinated integrations, and documented solutions.',
    },
    {
      period: 'Jun 2024 — Aug 2024',
      title: 'Java Software Engineer — Hirus',
      detail:
        'Implemented REST controllers and business logic, crafted JDBC queries for PostgreSQL, participated in CI/CD, and covered services with integration tests using Testcontainers.',
    },
    {
      period: 'Jun 2024 — Jul 2024',
      title: 'Python Developer — Ragnar (AI app)',
      detail:
        'Developed FastAPI endpoints for AI interactions with solid error handling. Tuned RAG configuration to improve answers on uploaded docs. Refactored OpenWebUI codebase, removing redundant components to slim the app.',
    },
    {
      period: '2023 — 2027',
      title: 'Bachelor — Innopolis University',
      detail: 'Computer Science | 2023 — 2027',
    },
  ],
  ru: [
    {
      period: 'Сен 2025 — present',
      title: 'Java-разработчик — Т-Банк',
      detail: 'Строю микросервисы и надёжные интеграции для Т-Банка.',
    },
    {
      period: 'Янв 2025 — Апр 2025',
      title: 'Scala Developer — Яндекс',
      detail:
        'Разрабатывал и поддерживал микросервисы: gRPC для внутренних вызовов, REST для внешних. Оптимизировал gRPC, снижая время отклика. Проектировал GraphQL-схемы для фронта, согласовывал интеграции и писал документацию.',
    },
    {
      period: 'Июн 2024 — Авг 2024',
      title: 'Java-разработчик — Hirus',
      detail:
        'Реализовывал REST-контроллеры и бизнес-логику, писал JDBC-запросы в PostgreSQL, участвовал в CI/CD и покрывал сервисы интеграционными тестами на Testcontainers.',
    },
    {
      period: 'Июн 2024 — Июл 2024',
      title: 'Python Developer — Ragnar (AI приложение)',
      detail:
        'Писал эндпоинты FastAPI для AI с корректной обработкой ошибок. Настраивал RAG, улучшая ответы по загруженным документам. Рефакторил OpenWebUI, убирая лишние компоненты и уменьшая размер приложения.',
    },
    {
      period: '2023 — 2027',
      title: 'Бакалавриат — Университет Иннополис',
      detail: 'Информатика и вычислительная техника | 2023 — 2027',
    },
  ],
}

// Short labels rendered on the 3D sticky notes (long text lives in the DOM panels).
export const noteLabels = {
  en: ['T-Bank · now', 'Yandex · 2025', 'Hirus · 2024', 'Ragnar · 2024', 'IU · 2023→27'],
  ru: ['Т-Банк · now', 'Яндекс · 2025', 'Hirus · 2024', 'Ragnar · 2024', 'ИУ · 2023→27'],
}
