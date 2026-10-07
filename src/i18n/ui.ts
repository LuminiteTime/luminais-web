// Interface strings. `en` defines the shape, every other locale must match it.

export const en = {
  localeName: 'English',
  meta: {
    title: 'Mikhail Trifonov, Software Engineer at T-Bank Data Platform',
    description:
      'Mikhail Trifonov (Luminais), software engineer at T-Bank Data Platform. Spark SQL, Airflow, Java and Python pipelines, React and TypeScript frontends.',
    jobTitle: 'Software Engineer, Data Platform',
    ogImage: '/og.jpg',
    ogImageAlt: 'Mikhail Trifonov, software engineer. A cloud of white, graphite and green blocks about to be sorted.',
  },
  nav: {
    label: 'Sections',
    switchTo: 'Русская версия',
    items: { now: 'Now', experience: 'Experience', work: 'Work', stack: 'Stack', contact: 'Contact' },
  },
  hero: {
    firstName: 'Mikhail',
    lastName: 'Trifonov',
    alias: 'aka Luminais',
    role: 'Software engineer at T-Bank, Data Platform',
    lead: 'I move bank-scale data through Spark and Airflow and build the Java services and React interfaces that sit on top of it.',
    facts: ['Innopolis, UTC+3', '3+ years in production'],
    status: 'Open to interesting offers',
    primary: 'Get in touch',
    secondary: 'See projects',
  },
  now: {
    title: 'At T-Bank',
    role: 'Software engineer, Data Platform',
    since: 'Since September 2025',
    text: 'Our team runs the bank’s Data Lake House. Analysts, ML teams and product services all read from what we build. I work on ingestion, orchestration and the services around them.',
  },
  experience: { title: 'Experience', details: 'Details', present: 'now' },
  work: { title: 'Selected work', more: 'Everything else is on GitHub' },
  stack: { title: 'Stack', languages: 'Russian is native, English is B2.' },
  contact: {
    title: 'Write to me',
    text: 'Telegram gets the fastest reply. Email works for anything formal.',
    copy: 'Copy email',
    copied: 'Copied',
    wechatHint: 'Scan in WeChat',
    wechatAlt: 'WeChat QR code',
  },
  notFound: { title: 'Page not found', text: 'This address leads nowhere.', back: 'Go to the main page' },
};

export type UiStrings = typeof en;

export const ru: UiStrings = {
  localeName: 'Русский',
  meta: {
    title: 'Михаил Трифонов, разработчик в Т-Банке, Data Platform',
    description:
      'Михаил Трифонов (Luminais), разработчик в Т-Банке, Data Platform. Пайплайны на Spark SQL, Airflow, Java и Python, фронтенд на React и TypeScript.',
    jobTitle: 'Разработчик, Data Platform',
    ogImage: '/og-ru.jpg',
    ogImageAlt: 'Михаил Трифонов, разработчик. Облако белых, графитовых и зелёных блоков перед сортировкой.',
  },
  nav: {
    label: 'Разделы',
    switchTo: 'English version',
    items: { now: 'Сейчас', experience: 'Опыт', work: 'Проекты', stack: 'Стек', contact: 'Контакты' },
  },
  hero: {
    firstName: 'Михаил',
    lastName: 'Трифонов',
    alias: 'aka Luminais',
    role: 'Разработчик в Т-Банке, Data Platform',
    lead: 'Прогоняю банковские объёмы данных через Spark и Airflow и строю поверх них сервисы на Java и интерфейсы на React.',
    facts: ['Иннополис, UTC+3', '3+ года в продакшене'],
    status: 'Открыт к интересным предложениям',
    primary: 'Написать мне',
    secondary: 'Смотреть проекты',
  },
  now: {
    title: 'В Т-Банке',
    role: 'Разработчик, Data Platform',
    since: 'С сентября 2025',
    text: 'Наша команда отвечает за Data Lake House банка. Из него читают аналитики, ML-команды и продуктовые сервисы. Я занимаюсь загрузкой данных, оркестрацией и сервисами вокруг них.',
  },
  experience: { title: 'Опыт', details: 'Подробнее', present: 'сейчас' },
  work: { title: 'Проекты', more: 'Остальное на GitHub' },
  stack: { title: 'Стек', languages: 'Русский родной, английский B2.' },
  contact: {
    title: 'Напишите мне',
    text: 'Быстрее всего отвечаю в Telegram. Для официального лучше почта.',
    copy: 'Скопировать почту',
    copied: 'Скопировано',
    wechatHint: 'Отсканируйте в WeChat',
    wechatAlt: 'QR-код WeChat',
  },
  notFound: { title: 'Страница не найдена', text: 'По этому адресу ничего нет.', back: 'На главную' },
};
