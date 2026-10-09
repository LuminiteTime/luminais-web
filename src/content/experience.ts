import type { Localized } from '@/i18n';

/** What a bullet shows about the work. Labels live in `experience.facets` in src/i18n/ui.ts. */
export type Facet = 'architecture' | 'requirements' | 'team' | 'quality' | 'operations' | 'delivery' | 'ai';

interface Point {
  facet: Facet;
  text: string;
}

/** Timeline entry. Dates are `YYYY-MM` or `YYYY`; omit `end` for the current role. Keep points to one or two lines. */
export interface Position {
  id: string;
  start: string;
  end?: string;
  l10n: Localized<{
    org: string;
    role: string;
    summary: string;
    /** Two or three short results, visible without expanding. */
    impact: string[];
    points: Point[];
  }>;
}

export const experience: Position[] = [
  {
    id: 'tbank',
    start: '2025-09',
    l10n: {
      en: {
        org: 'T-Bank',
        role: 'Software Engineer, Data Platform',
        summary: 'Ingestion, orchestration and services around the bank’s Data Lake House.',
        impact: [
          'Nightly batch 3× faster',
          '30+ pipelines moved with zero downtime',
          'Incidents closed in under 40 min',
        ],
        points: [
          {
            facet: 'architecture',
            text: 'Design doc for a new Java/Kora service: about 1,200 rps and 2 TB a day at peak. Passed the architecture review, then built it.',
          },
          {
            facet: 'architecture',
            text: 'Kafka ingestion with idempotent consumers, retries with backoff and a dead-letter topic. Broker failovers stopped dropping or duplicating loads.',
          },
          {
            facet: 'requirements',
            text: 'Turned interviews with analysts and ML teams into a spec: freshness SLO per dataset, access groups, retention.',
          },
          {
            facet: 'team',
            text: 'Agreed contracts with two adjacent teams and the DLH team; moved 30+ consumer pipelines with zero downtime.',
          },
          {
            facet: 'team',
            text: 'Onboarded two engineers: an onboarding guide, pairing on first tasks, code review.',
          },
          {
            facet: 'quality',
            text: 'Test strategy with our QA engineer: contract tests from OpenAPI, Testcontainers for PostgreSQL and Kafka, nightly data checks.',
          },
          {
            facet: 'operations',
            text: 'On-call rotation, SLOs with burn-rate alerts, OpenTelemetry tracing, postmortems. Median time to resolve fell below 40 minutes.',
          },
          {
            facet: 'operations',
            text: 'Kubernetes: Helm charts, probes, autoscaling on consumer lag, a Grafana dashboard for every service.',
          },
          {
            facet: 'delivery',
            text: 'Spark SQL tuning cut the nightly window from 5 h to 1 h 40 min. Workers on virtual threads tripled throughput on the same pods.',
          },
          {
            facet: 'ai',
            text: 'MCP server over Airflow and DLH metadata, plus shared agent skills, so coding agents see lineage and run history.',
          },
        ],
      },
      ru: {
        org: 'Т-Банк',
        role: 'Разработчик, Data Platform',
        summary: 'Загрузка данных, оркестрация и сервисы вокруг Data Lake House банка.',
        impact: [
          'Ночной батч в 3 раза быстрее',
          '30+ пайплайнов переехали без простоя',
          'Инциденты закрываются за 40 мин',
        ],
        points: [
          {
            facet: 'architecture',
            text: 'Design doc нового сервиса на Java/Kora: около 1 200 rps и 2 ТБ в сутки в пике. Прошёл архитектурное ревью и реализовал.',
          },
          {
            facet: 'architecture',
            text: 'Загрузка через Kafka: идемпотентные консьюмеры, ретраи с backoff, dead-letter топик. Переключение брокера больше не теряет и не дублирует загрузки.',
          },
          {
            facet: 'requirements',
            text: 'Собрал требования у аналитиков и ML-команд в спецификацию: SLO свежести на датасет, группы доступа, сроки хранения.',
          },
          {
            facet: 'team',
            text: 'Согласовал контракты с двумя смежными командами и командой DLH, перевёл 30+ пайплайнов без простоя.',
          },
          {
            facet: 'team',
            text: 'Онбордил двух инженеров: гайд для новичков, парная работа на первых задачах, код-ревью.',
          },
          {
            facet: 'quality',
            text: 'Стратегия тестирования вместе с QA: контрактные тесты из OpenAPI, Testcontainers для PostgreSQL и Kafka, ночные проверки данных.',
          },
          {
            facet: 'operations',
            text: 'Дежурства, SLO с алертами по burn rate, трейсинг на OpenTelemetry, разборы инцидентов. Медианное время устранения меньше 40 минут.',
          },
          {
            facet: 'operations',
            text: 'Kubernetes: Helm-чарты, пробы, автоскейлинг по лагу консьюмеров, дашборд в Grafana на каждый сервис.',
          },
          {
            facet: 'delivery',
            text: 'Тюнинг Spark SQL сократил ночное окно с 5 ч до 1 ч 40 мин. Воркеры на виртуальных потоках утроили пропускную способность на тех же подах.',
          },
          {
            facet: 'ai',
            text: 'MCP-сервер над метаданными Airflow и DLH и общие скиллы, чтобы кодовые агенты видели lineage и историю запусков.',
          },
        ],
      },
    },
  },
  {
    id: 'yandex',
    start: '2025-01',
    end: '2025-04',
    l10n: {
      en: {
        org: 'Yandex, Auto.ru',
        role: 'Backend Developer, Scala',
        summary: 'Backend for frontend behind reviews and user content on Auto.ru, web and mobile.',
        impact: ['p99 of hedged calls down 75%', 'One query per page instead of four'],
        points: [
          {
            facet: 'architecture',
            text: 'GraphQL schema for the reviews BFF: a page loads in one query instead of four REST calls.',
          },
          {
            facet: 'delivery',
            text: 'Fixed request hedging in our gRPC client and server: the losing call is cancelled, p99 down 75%.',
          },
          {
            facet: 'operations',
            text: 'Timeouts, retry budgets and fallbacks per downstream. When the ratings service is slow, only its block disappears.',
          },
          {
            facet: 'quality',
            text: 'Load tests at three times peak traffic, then rollout behind feature flags one service at a time.',
          },
          {
            facet: 'team',
            text: 'Agreed field-level contracts with the web and mobile teams and retired the old REST endpoints over two releases.',
          },
        ],
      },
      ru: {
        org: 'Яндекс, Авто.ру',
        role: 'Бэкенд-разработчик, Scala',
        summary: 'BFF для отзывов и пользовательского контента Авто.ру, веб и мобильные приложения.',
        impact: ['p99 хеджированных вызовов ниже на 75%', 'Один запрос на страницу вместо четырёх'],
        points: [
          {
            facet: 'architecture',
            text: 'GraphQL-схема BFF отзывов: страница грузится одним запросом вместо четырёх REST-вызовов.',
          },
          {
            facet: 'delivery',
            text: 'Починил хеджирование в нашем gRPC клиенте и сервере: проигравший запрос отменяется, p99 ниже на 75%.',
          },
          {
            facet: 'operations',
            text: 'Таймауты, бюджет ретраев и фолбэки на каждый нижестоящий сервис. Когда тормозит сервис рейтингов, пропадает только его блок.',
          },
          {
            facet: 'quality',
            text: 'Нагрузочные тесты на тройном пике и раскатка за фича-флагами, сервис за сервисом.',
          },
          {
            facet: 'team',
            text: 'Согласовал контракты полей с веб- и мобильной командами и вывел старые REST-эндпоинты за два релиза.',
          },
        ],
      },
    },
  },
  {
    id: 'hirus',
    start: '2023-07',
    end: '2024-08',
    l10n: {
      en: {
        org: 'Hirus',
        role: 'Fullstack Developer',
        summary:
          'Software for private clinics: scheduling, patient records, billing. Spring backend and a React admin.',
        impact: ['Owned the scheduling module', 'Database load down 68%'],
        points: [
          {
            facet: 'requirements',
            text: 'Owned appointment scheduling: interviews with clinic admins, the spec, acceptance criteria, release.',
          },
          {
            facet: 'architecture',
            text: 'BFF for the admin app over scheduling, records and billing: each screen gets one response shaped for it.',
          },
          {
            facet: 'architecture',
            text: 'Double booking blocked in the database with PostgreSQL exclusion constraints.',
          },
          {
            facet: 'delivery',
            text: 'Rewrote the heaviest JDBC queries and added indexes: database load down 68%. Admin screens in React and TypeScript.',
          },
          {
            facet: 'operations',
            text: 'GitLab CI with linters, tests and one-click deploys; production support during clinic hours.',
          },
        ],
      },
      ru: {
        org: 'Hirus',
        role: 'Fullstack-разработчик',
        summary: 'Софт для частных клиник: запись, медкарты, оплата. Бэкенд на Spring и админка на React.',
        impact: ['Вёл модуль записи', 'Нагрузка на базу ниже на 68%'],
        points: [
          {
            facet: 'requirements',
            text: 'Вёл модуль записи на приём: интервью с администраторами клиник, спецификация, критерии приёмки, релиз.',
          },
          {
            facet: 'architecture',
            text: 'BFF для админки поверх записи, медкарт и оплаты: каждый экран получает один ответ под себя.',
          },
          {
            facet: 'architecture',
            text: 'Двойная запись запрещена на уровне базы через exclusion constraints в PostgreSQL.',
          },
          {
            facet: 'delivery',
            text: 'Переписал самые тяжёлые JDBC-запросы и добавил индексы: нагрузка на базу ниже на 68%. Экраны админки на React и TypeScript.',
          },
          {
            facet: 'operations',
            text: 'GitLab CI с линтерами, тестами и деплоем в один клик, поддержка продакшена в часы работы клиник.',
          },
        ],
      },
    },
  },
  {
    id: 'ragnar',
    start: '2024-06',
    end: '2024-07',
    l10n: {
      en: {
        org: 'Ragnar',
        role: 'Python Developer',
        summary: 'AI assistant that answers from company documents.',
        impact: [],
        points: [
          { facet: 'delivery', text: 'FastAPI endpoints for model calls with error handling and timeouts.' },
          { facet: 'ai', text: 'Tuned RAG retrieval on real questions until answers cited the right documents.' },
        ],
      },
      ru: {
        org: 'Ragnar',
        role: 'Python-разработчик',
        summary: 'AI-ассистент, который отвечает по документам компании.',
        impact: [],
        points: [
          { facet: 'delivery', text: 'Эндпоинты FastAPI для вызовов модели с обработкой ошибок и таймаутами.' },
          {
            facet: 'ai',
            text: 'Настраивал поиск в RAG на реальных вопросах, пока ответы не начали ссылаться на нужные документы.',
          },
        ],
      },
    },
  },
  {
    id: 'innopolis',
    start: '2023',
    end: '2027',
    l10n: {
      en: {
        org: 'Innopolis University',
        role: 'B.Sc. Computer Science',
        summary: 'GPA 4.77 out of 5.',
        impact: [],
        points: [],
      },
      ru: {
        org: 'Университет Иннополис',
        role: 'Бакалавриат, Computer Science',
        summary: 'Средний балл 4.77 из 5.',
        impact: [],
        points: [],
      },
    },
  },
];

/** Groups a role's points by facet, keeping the order in which facets first appear. */
export function groupByFacet(points: Point[]): [Facet, string[]][] {
  const groups = new Map<Facet, string[]>();
  for (const { facet, text } of points) groups.set(facet, [...(groups.get(facet) ?? []), text]);
  return [...groups];
}
