// All copy lives here. Add T-Bank achievements to `now.items` and `experience[0].points`.

export type Lang = 'en' | 'ru';

export const links = {
  email: 'trifonov2812@gmail.com',
  telegram: 'https://t.me/LuminiteTime',
  github: 'https://github.com/LuminiteTime',
  linkedin: 'https://www.linkedin.com/in/mikhailtrifonov28',
  wechat: 'wxid_iduyrsvt6j1622',
  source: 'https://github.com/LuminiteTime/luminais-web',
};

type Entry = { org: string; role: string; from: string; to: string; summary: string; points: string[] };
type Work = {
  title: string;
  context: string;
  award?: string;
  text: string;
  stack: string[];
  href?: string;
  featured?: boolean;
};

const work = (en: Work[], ru: Work[]) => ({ en, ru });

const projects = work(
  [
    {
      title: 'Docs with live tables',
      context: 'MTS True Tech Hack, 2026',
      award: 'Best solution, MWS Tables track',
      text: 'A Confluence-style editor with real-time co-editing and native MWS Tables embeds. I owned the metadata backend and the tables integration and wrote a good half of the React client.',
      stack: ['React', 'TypeScript', 'Java', 'Spring', 'Node.js', 'PostgreSQL'],
      featured: true,
    },
    {
      title: 'The Sleepy Knight',
      context: 'AdventureX, Hangzhou, 2026',
      award: '800+ participants',
      text: 'A pixel-art tamagotchi that survives only if you sleep on schedule. I built the Go service behind its AI oracle, the game and onboarding screens, and an NFC e-ink card that mirrors the hero.',
      stack: ['React Native', 'Expo', 'TypeScript', 'Go', 'vLLM'],
      featured: true,
    },
    {
      title: 'PingTower',
      context: 'T1 Hackathon, 2025',
      text: 'Uptime monitoring for sites and APIs with alert rules, incident history and SLA reports. I led the backend: Java core, ClickHouse for time series, a Python notifier behind one OpenAPI contract.',
      stack: ['Java 21', 'Spring Boot', 'ClickHouse', 'Python'],
    },
    {
      title: 'Network flow solver',
      context: 'Techarena Kazan, 2025',
      award: '2nd place',
      text: 'Splits flow between consumer nodes under capacity and cost limits. Dynamic programming plus a greedy pass, checked against my own bench of nasty edge cases.',
      stack: ['C++'],
    },
    {
      title: 'Open Labs Share',
      context: 'Team of seven, 2025',
      text: 'A peer-to-peer learning platform. I designed the gateway, auth and user services and a notebook runtime with a sandboxed Python kernel.',
      stack: ['Spring Cloud', 'gRPC', 'FastAPI', 'PostgreSQL'],
      href: 'https://github.com/LuminiteTime/Open-Labs-Share-Docs',
    },
    {
      title: 'Language I compiler',
      context: 'Compilers course, 2025',
      text: 'Compiles a custom imperative language to WebAssembly: JavaCC parser, semantic passes, WAT codegen, programs run through wasmtime.',
      stack: ['Java', 'JavaCC', 'WebAssembly'],
      href: 'https://github.com/LuminiteTime/Compilers-Construction-Hmm',
    },
    {
      title: 'Lime Trade',
      context: 'Client work, 2025',
      text: 'A company website and a Flutter pricing calculator that replaced a fragile Excel workbook. Managers use it every day.',
      stack: ['Flutter', 'Dart', 'JavaScript'],
      href: 'https://limetrade.pro',
    },
  ],
  [
    {
      title: 'Документы с живыми таблицами',
      context: 'MTS True Tech Hack, 2026',
      award: 'Лучшее решение в треке MWS Tables',
      text: 'Редактор в духе Confluence с совместным редактированием в реальном времени и встроенными MWS Tables. На мне был бэкенд метаданных, интеграция с таблицами и добрая половина React-клиента.',
      stack: ['React', 'TypeScript', 'Java', 'Spring', 'Node.js', 'PostgreSQL'],
      featured: true,
    },
    {
      title: 'The Sleepy Knight',
      context: 'AdventureX, Ханчжоу, 2026',
      award: '800+ участников',
      text: 'Пиксельный тамагочи, который выживает, только если ты спишь по режиму. Я сделал Go-сервис для его AI-оракула, игровые экраны, онбординг и NFC-карточку на e-ink, где живёт копия героя.',
      stack: ['React Native', 'Expo', 'TypeScript', 'Go', 'vLLM'],
      featured: true,
    },
    {
      title: 'PingTower',
      context: 'T1 Hackathon, 2025',
      text: 'Мониторинг доступности сайтов и API: правила алертов, история инцидентов, SLA-отчёты. Я вёл бэкенд: ядро на Java, ClickHouse под метрики, нотификатор на Python за общим OpenAPI-контрактом.',
      stack: ['Java 21', 'Spring Boot', 'ClickHouse', 'Python'],
    },
    {
      title: 'Распределение потоков в сети',
      context: 'Techarena Kazan, 2025',
      award: '2 место',
      text: 'Делит поток между узлами-потребителями с учётом пропускной способности и стоимости. Динамика плюс жадный проход, проверенные на моём наборе неприятных краевых случаев.',
      stack: ['C++'],
    },
    {
      title: 'Open Labs Share',
      context: 'Команда из семи человек, 2025',
      text: 'Платформа, где студенты учат друг друга. Я спроектировал gateway, авторизацию, сервис пользователей и рантайм ноутбуков с изолированным Python-ядром.',
      stack: ['Spring Cloud', 'gRPC', 'FastAPI', 'PostgreSQL'],
      href: 'https://github.com/LuminiteTime/Open-Labs-Share-Docs',
    },
    {
      title: 'Компилятор языка I',
      context: 'Курс по компиляторам, 2025',
      text: 'Компилирует собственный императивный язык в WebAssembly: парсер на JavaCC, семантические проходы, генерация WAT, запуск через wasmtime.',
      stack: ['Java', 'JavaCC', 'WebAssembly'],
      href: 'https://github.com/LuminiteTime/Compilers-Construction-Hmm',
    },
    {
      title: 'Lime Trade',
      context: 'Клиентский проект, 2025',
      text: 'Сайт компании и калькулятор цен на Flutter, который заменил хрупкую таблицу в Excel. Менеджеры пользуются им каждый день.',
      stack: ['Flutter', 'Dart', 'JavaScript'],
      href: 'https://limetrade.pro',
    },
  ],
);

const stack = {
  Data: ['Spark SQL', 'PySpark', 'Airflow', 'Iceberg', 'Arrow Flight', 'Kafka', 'ClickHouse', 'Trino'],
  Backend: ['Java 21', 'Kora', 'Spring Boot', 'Scala', 'Go', 'FastAPI', 'gRPC', 'GraphQL', 'PostgreSQL', 'Oracle', 'Redis'],
  Frontend: ['TypeScript', 'React', 'Next.js', 'Astro', 'React Native', 'Three.js', 'Zustand', 'Tailwind'],
  Infra: ['Docker', 'Kubernetes', 'Terraform', 'GitLab CI', 'GitHub Actions', 'OpenTelemetry', 'Prometheus', 'Grafana'],
};

export const content = {
  en: {
    meta: {
      title: 'Mikhail Trifonov, software engineer',
      description:
        'Software engineer at T-Bank Data Platform. Spark SQL, Airflow, Java and Python on the data side, React and TypeScript on the front.',
    },
    nav: { now: 'Now', experience: 'Experience', work: 'Work', stack: 'Stack', contact: 'Contact' },
    hero: {
      first: 'Mikhail',
      last: 'Trifonov',
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
      items: [
        {
          title: 'Nightly batch, three times faster',
          text: 'Rewrote the heaviest Spark SQL marts with partition pruning, broadcast joins and skew hints under AQE. The window went from 5 hours to 1 h 40 min.',
        },
        {
          title: 'Airflow that scales with the team',
          text: 'Moved 60+ DAGs onto a shared operator library with typed configs and built-in data quality checks. Failed runs dropped threefold, a new source lands in a day.',
        },
        {
          title: 'A data service from scratch',
          text: 'Designed and shipped a Java/Kora service end to end: data model, REST contracts, Kafka and DB queues for async work, Iceberg and Arrow Flight for heavy reads.',
        },
        {
          title: 'One trace across the stack',
          text: 'Rolled out OpenTelemetry on every platform service. An incident is followed from an Airflow task through Spark to a Java call in a single Grafana view.',
        },
      ],
    },
    experience: {
      title: 'Experience',
      more: 'Details',
      now: 'now',
      entries: [
        {
          org: 'T-Bank',
          role: 'Software Engineer, Data Platform',
          from: 'Sep 2025',
          to: 'now',
          summary: 'Ingestion, orchestration and services for the bank’s Data Lake House.',
          points: [
            'Spark SQL tuning on nightly marts: batch window down from 5 h to 1 h 40 min.',
            'Shared Airflow operator library for 60+ DAGs with data quality checks built in.',
            'Java/Kora data service shipped end to end and supported in production.',
            'Legacy GitOps file pipeline migrated and wired to the GitLab API, results stream into DLH with access groups I designed.',
            'OpenTelemetry tracing across all platform services.',
          ],
        },
        {
          org: 'Yandex, Auto.ru',
          role: 'Backend Developer, Scala',
          from: 'Jan 2025',
          to: 'Apr 2025',
          summary: 'Microservices behind reviews and user content on Auto.ru.',
          points: [
            'Reworked the in-house gRPC client and server to hedge requests correctly. Hedged calls became 75% faster.',
            'Designed GraphQL schemas for the frontend team.',
            'Kept REST integrations with external partners running.',
          ],
        },
        {
          org: 'Hirus',
          role: 'Fullstack Developer',
          from: 'Jul 2023',
          to: 'Aug 2024',
          summary: 'Software for medical clinics: Spring backend and the React admin the staff works in.',
          points: [
            'REST controllers and business logic on Spring Web.',
            'Rewrote JDBC queries to PostgreSQL and cut database load by 68%.',
            'Built admin screens in React and TypeScript on top of the same API.',
            'Extended CI with linters and deploy steps, covered services with JUnit and Testcontainers.',
          ],
        },
        {
          org: 'Ragnar',
          role: 'Python Developer',
          from: 'Jun 2024',
          to: 'Jul 2024',
          summary: 'AI assistant that answers from company documents.',
          points: [
            'FastAPI endpoints for model calls with proper error handling.',
            'Tuned RAG retrieval for better answers on uploaded files.',
            'Trimmed an OpenWebUI fork down to what the product needed.',
          ],
        },
        {
          org: 'Innopolis University',
          role: 'B.Sc. Computer Science',
          from: '2023',
          to: '2027',
          summary: 'GPA 4.77 out of 5.',
          points: [],
        },
      ] satisfies Entry[],
    },
    work: { title: 'Selected work', open: 'Open', more: 'Everything else is on GitHub', items: projects.en },
    stack: { title: 'Stack', groups: stack, langs: 'Russian is native, English is B2.' },
    contact: {
      title: 'Write to me',
      text: 'Telegram gets the fastest reply. Email works for anything formal.',
      copy: 'Copy email',
      copied: 'Copied',
      wechatHint: 'Scan in WeChat',
    },
    footer: { built: 'Built with Astro and three.js', source: 'Source' },
    switchTo: { label: 'RU', href: '/ru/', name: 'Русская версия' },
  },
  ru: {
    meta: {
      title: 'Михаил Трифонов, разработчик',
      description:
        'Разработчик в Т-Банке, Data Platform. Spark SQL, Airflow, Java и Python в данных, React и TypeScript на фронте.',
    },
    nav: { now: 'Сейчас', experience: 'Опыт', work: 'Проекты', stack: 'Стек', contact: 'Контакты' },
    hero: {
      first: 'Михаил',
      last: 'Трифонов',
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
      items: [
        {
          title: 'Ночной батч в три раза быстрее',
          text: 'Переписал самые тяжёлые витрины на Spark SQL: partition pruning, broadcast join, skew-хинты под AQE. Окно сократилось с 5 часов до 1 ч 40 мин.',
        },
        {
          title: 'Airflow, который растёт вместе с командой',
          text: 'Перевёл 60+ DAG на общую библиотеку операторов с типизированными конфигами и встроенными проверками качества. Падений стало втрое меньше, новый источник подключается за день.',
        },
        {
          title: 'Сервис данных с нуля',
          text: 'Спроектировал и запустил сервис на Java/Kora целиком: модель данных, REST-контракты, Kafka и очереди в БД для асинхронных задач, Iceberg и Arrow Flight для тяжёлых чтений.',
        },
        {
          title: 'Один трейс через весь стек',
          text: 'Внедрил OpenTelemetry во все сервисы платформы. Инцидент теперь видно целиком, от задачи в Airflow через Spark до вызова в Java, в одном окне Grafana.',
        },
      ],
    },
    experience: {
      title: 'Опыт',
      more: 'Подробнее',
      now: 'сейчас',
      entries: [
        {
          org: 'Т-Банк',
          role: 'Разработчик, Data Platform',
          from: 'Сен 2025',
          to: 'сейчас',
          summary: 'Загрузка данных, оркестрация и сервисы для Data Lake House банка.',
          points: [
            'Тюнинг Spark SQL на ночных витринах: окно батча сократилось с 5 ч до 1 ч 40 мин.',
            'Общая библиотека операторов Airflow для 60+ DAG со встроенными проверками качества данных.',
            'Сервис данных на Java/Kora от модели до поддержки в продакшене.',
            'Мигрировал заброшенный GitOps-пайплайн обработки файлов, подключил GitLab API, результаты льются в DLH с моей схемой групп доступа.',
            'Сквозной трейсинг на OpenTelemetry во всех сервисах платформы.',
          ],
        },
        {
          org: 'Яндекс, Авто.ру',
          role: 'Бэкенд-разработчик, Scala',
          from: 'Янв 2025',
          to: 'Апр 2025',
          summary: 'Микросервисы отзывов и пользовательского контента Авто.ру.',
          points: [
            'Переделал внутренний gRPC клиент и сервер, чтобы хеджирование запросов работало правильно. Хеджированные вызовы ускорились на 75%.',
            'Проектировал GraphQL-схемы для фронтенда.',
            'Поддерживал REST-интеграции с внешними партнёрами.',
          ],
        },
        {
          org: 'Hirus',
          role: 'Fullstack-разработчик',
          from: 'Июл 2023',
          to: 'Авг 2024',
          summary: 'Софт для медицинских клиник: бэкенд на Spring и админка на React, в которой работает персонал.',
          points: [
            'REST-контроллеры и бизнес-логика на Spring Web.',
            'Переписал JDBC-запросы к PostgreSQL и снизил нагрузку на базу на 68%.',
            'Собирал экраны админки на React и TypeScript поверх того же API.',
            'Расширял CI линтерами и шагами деплоя, покрывал сервисы тестами на JUnit и Testcontainers.',
          ],
        },
        {
          org: 'Ragnar',
          role: 'Python-разработчик',
          from: 'Июн 2024',
          to: 'Июл 2024',
          summary: 'AI-ассистент, который отвечает по документам компании.',
          points: [
            'Эндпоинты FastAPI для вызовов модели с аккуратной обработкой ошибок.',
            'Настроил RAG, чтобы ответы по загруженным файлам стали точнее.',
            'Урезал форк OpenWebUI до того, что реально нужно продукту.',
          ],
        },
        {
          org: 'Университет Иннополис',
          role: 'Бакалавриат, Computer Science',
          from: '2023',
          to: '2027',
          summary: 'Средний балл 4.77 из 5.',
          points: [],
        },
      ] satisfies Entry[],
    },
    work: { title: 'Проекты', open: 'Открыть', more: 'Остальное на GitHub', items: projects.ru },
    stack: {
      title: 'Стек',
      groups: { Данные: stack.Data, Бэкенд: stack.Backend, Фронтенд: stack.Frontend, Инфраструктура: stack.Infra },
      langs: 'Русский родной, английский B2.',
    },
    contact: {
      title: 'Напишите мне',
      text: 'Быстрее всего отвечаю в Telegram. Для официального лучше почта.',
      copy: 'Скопировать почту',
      copied: 'Скопировано',
      wechatHint: 'Отсканируйте в WeChat',
    },
    footer: { built: 'Сделано на Astro и three.js', source: 'Исходники' },
    switchTo: { label: 'EN', href: '/', name: 'English version' },
  },
} as const;
