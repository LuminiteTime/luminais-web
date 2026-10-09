import type { Localized } from '@/i18n';

/** What a bullet shows about the work. Labels live in `experience.facets` in src/i18n/ui.ts. */
export type Facet = 'architecture' | 'requirements' | 'team' | 'quality' | 'operations' | 'delivery' | 'ai';

interface Point {
  facet: Facet;
  text: string;
}

/** Timeline entry. Dates are `YYYY-MM` or `YYYY`; omit `end` for the current role. */
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
        summary:
          'Ingestion, orchestration and services around the bank’s Data Lake House. I own one service end to end and the ingestion of three source systems.',
        impact: [
          'Nightly batch 3× faster',
          '30+ pipelines migrated with no downtime',
          'Incidents resolved in under 40 min',
        ],
        points: [
          {
            facet: 'architecture',
            text: 'Wrote the design doc for a new Java/Kora data service: peak load estimate of about 1,200 rps and 2 TB a day through Arrow Flight, failure modes, storage and API choices. Defended it at the platform architecture review, then built it.',
          },
          {
            facet: 'architecture',
            text: 'Designed the ingestion events on Kafka: topics keyed by dataset to keep order, idempotent consumers with a dedup table, retries with backoff and a dead-letter topic replayed from a runbook. A broker failover no longer drops or doubles a load.',
          },
          {
            facet: 'requirements',
            text: 'Interviewed analysts and ML teams to turn “we need fresher data” into a spec: a freshness SLO per dataset, access groups and retention. The spec became the backlog for two quarters.',
          },
          {
            facet: 'team',
            text: 'Agreed contracts and a rollout plan with two adjacent teams and the DLH team, then moved 30+ consumer pipelines to the new service without downtime.',
          },
          {
            facet: 'quality',
            text: 'Built the test strategy together with our QA engineer: contract tests generated from OpenAPI, Testcontainers for PostgreSQL and Kafka, and a nightly data quality suite in Airflow.',
          },
          {
            facet: 'operations',
            text: 'On-call in the platform rotation. Introduced SLOs with burn-rate alerts, OpenTelemetry tracing across services and blameless postmortems; median time to resolve went from hours to under 40 minutes.',
          },
          {
            facet: 'operations',
            text: 'Run our services on Kubernetes: Helm charts, readiness and liveness probes, autoscaling on consumer lag, PodDisruptionBudgets, Prometheus metrics and a Grafana dashboard per service.',
          },
          {
            facet: 'delivery',
            text: 'Tuned the heaviest Spark SQL marts (partition pruning, broadcast joins, skew hints under AQE): the nightly window went from 5 h to 1 h 40 min. Moved 60+ DAGs onto a shared Airflow operator library.',
          },
          {
            facet: 'delivery',
            text: 'Moved file-processing workers from a fixed thread pool to virtual threads with a concurrency limit per source, so one slow upstream no longer starves the others. Throughput tripled on the same pods.',
          },
          {
            facet: 'ai',
            text: 'Built an MCP server over Airflow and DLH metadata and a set of shared agent skills, so the team’s coding agents can answer “why is this table stale” and draft a fix with the right lineage in context.',
          },
          {
            facet: 'team',
            text: 'Onboarded two new engineers: wrote the onboarding guide, paired on their first tasks and reviewed their code until they shipped on their own.',
          },
        ],
      },
      ru: {
        org: 'Т-Банк',
        role: 'Разработчик, Data Platform',
        summary:
          'Загрузка данных, оркестрация и сервисы вокруг Data Lake House банка. Целиком веду один сервис и загрузку из трёх систем-источников.',
        impact: [
          'Ночной батч в 3 раза быстрее',
          '30+ пайплайнов переехали без простоя',
          'Инциденты закрываются быстрее 40 мин',
        ],
        points: [
          {
            facet: 'architecture',
            text: 'Написал design doc нового сервиса данных на Java/Kora: оценка пиковой нагрузки около 1 200 rps и 2 ТБ в сутки через Arrow Flight, сценарии отказов, выбор хранилища и API. Защитил его на архитектурном ревью платформы и реализовал.',
          },
          {
            facet: 'architecture',
            text: 'Спроектировал события загрузки на Kafka: ключ топика по датасету ради порядка, идемпотентные консьюмеры с таблицей дедупликации, ретраи с backoff и dead-letter топик, который переигрывается по ранбуку. Переключение брокера больше не теряет и не дублирует загрузки.',
          },
          {
            facet: 'requirements',
            text: 'Провёл интервью с аналитиками и ML-командами и превратил «нам нужны данные посвежее» в спецификацию: SLO свежести на каждый датасет, группы доступа, сроки хранения. Спецификация стала бэклогом на два квартала.',
          },
          {
            facet: 'team',
            text: 'Согласовал контракты и план раскатки с двумя смежными командами и командой DLH, перевёл 30+ пайплайнов-потребителей на новый сервис без простоя.',
          },
          {
            facet: 'quality',
            text: 'Вместе с QA-инженером выстроил стратегию тестирования: контрактные тесты из OpenAPI, Testcontainers для PostgreSQL и Kafka, ночной набор проверок качества данных в Airflow.',
          },
          {
            facet: 'operations',
            text: 'Дежурю в ротации платформы. Ввёл SLO с алертами по burn rate, сквозной трейсинг на OpenTelemetry и разборы инцидентов без поиска виноватых; медианное время устранения сократилось с часов до 40 минут.',
          },
          {
            facet: 'operations',
            text: 'Наши сервисы живут в Kubernetes: Helm-чарты, readiness и liveness пробы, автоскейлинг по лагу консьюмеров, PodDisruptionBudget, метрики в Prometheus и дашборд в Grafana на каждый сервис.',
          },
          {
            facet: 'delivery',
            text: 'Оптимизировал самые тяжёлые витрины на Spark SQL (partition pruning, broadcast join, skew-хинты под AQE): ночное окно сократилось с 5 ч до 1 ч 40 мин. Перевёл 60+ DAG на общую библиотеку операторов Airflow.',
          },
          {
            facet: 'delivery',
            text: 'Перевёл воркеры обработки файлов с фиксированного пула потоков на виртуальные потоки с лимитом параллелизма на источник, чтобы один медленный источник не душил остальные. Пропускная способность выросла втрое на тех же подах.',
          },
          {
            facet: 'ai',
            text: 'Сделал MCP-сервер над метаданными Airflow и DLH и набор общих скиллов для агентов, чтобы кодовые агенты команды отвечали на «почему эта таблица устарела» и предлагали фикс, видя нужный lineage.',
          },
          {
            facet: 'team',
            text: 'Онбордил двух новых инженеров: написал гайд для новичков, работал в паре на первых задачах и ревьюил код, пока они не начали выпускать задачи сами.',
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
        summary: 'Microservices behind reviews and user content on Auto.ru.',
        impact: ['Hedged calls 75% faster at p99', 'One GraphQL query instead of four REST calls'],
        points: [
          {
            facet: 'delivery',
            text: 'Reworked the in-house gRPC client and server so request hedging cancels the losing call. Hedged calls became 75% faster at p99 while backend load stayed flat.',
          },
          {
            facet: 'quality',
            text: 'Checked the change under load at three times peak traffic, then rolled it out behind a feature flag service by service.',
          },
          {
            facet: 'architecture',
            text: 'Designed GraphQL schemas for reviews and user content with the web team, replacing four REST round trips per page with one query.',
          },
        ],
      },
      ru: {
        org: 'Яндекс, Авто.ру',
        role: 'Бэкенд-разработчик, Scala',
        summary: 'Микросервисы отзывов и пользовательского контента Авто.ру.',
        impact: ['Хеджированные вызовы на 75% быстрее по p99', 'Один GraphQL-запрос вместо четырёх REST'],
        points: [
          {
            facet: 'delivery',
            text: 'Переделал внутренний gRPC клиент и сервер, чтобы при хеджировании проигравший запрос отменялся. Хеджированные вызовы стали на 75% быстрее по p99, нагрузка на бэкенды не выросла.',
          },
          {
            facet: 'quality',
            text: 'Проверил изменение под нагрузкой в три раза выше пиковой и раскатывал за фича-флагом, сервис за сервисом.',
          },
          {
            facet: 'architecture',
            text: 'Спроектировал GraphQL-схемы отзывов и пользовательского контента вместе с веб-командой: вместо четырёх REST-запросов на страницу один запрос.',
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
          'Software for private clinics: scheduling, patient records, billing. Spring backend and the React admin the staff works in.',
        impact: ['Owned the scheduling module', 'Database load down 68%'],
        points: [
          {
            facet: 'requirements',
            text: 'Owned appointment scheduling from requirements to production: sat with clinic administrators, mapped their week, wrote the spec and acceptance criteria.',
          },
          {
            facet: 'architecture',
            text: 'Designed the slot model so double booking is impossible at the database level: PostgreSQL exclusion constraints instead of application locks.',
          },
          {
            facet: 'delivery',
            text: 'Rewrote the heaviest JDBC queries and added the missing indexes: database load down 68%. Built the admin screens in React and TypeScript on top of the same API.',
          },
          {
            facet: 'operations',
            text: 'Moved builds to GitLab CI with linters, tests and one-click deploys; handled production support during clinic hours.',
          },
          {
            facet: 'quality',
            text: 'Covered services and controllers with JUnit and Testcontainers, following the testing pyramid.',
          },
        ],
      },
      ru: {
        org: 'Hirus',
        role: 'Fullstack-разработчик',
        summary:
          'Софт для частных клиник: запись, медкарты, оплата. Бэкенд на Spring и админка на React, в которой работает персонал.',
        impact: ['Вёл модуль записи целиком', 'Нагрузка на базу ниже на 68%'],
        points: [
          {
            facet: 'requirements',
            text: 'Вёл модуль записи на приём от требований до продакшена: сидел с администраторами клиник, разобрал их рабочую неделю, написал спецификацию и критерии приёмки.',
          },
          {
            facet: 'architecture',
            text: 'Спроектировал модель слотов так, что двойная запись невозможна на уровне базы: exclusion constraints в PostgreSQL вместо блокировок в приложении.',
          },
          {
            facet: 'delivery',
            text: 'Переписал самые тяжёлые JDBC-запросы и добавил недостающие индексы: нагрузка на базу снизилась на 68%. Собирал экраны админки на React и TypeScript поверх того же API.',
          },
          {
            facet: 'operations',
            text: 'Перевёл сборку в GitLab CI с линтерами, тестами и деплоем в один клик; поддерживал продакшен в часы работы клиник.',
          },
          {
            facet: 'quality',
            text: 'Покрывал сервисы и контроллеры тестами на JUnit и Testcontainers по пирамиде тестирования.',
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
        impact: ['RAG answers grounded in uploaded files'],
        points: [
          { facet: 'delivery', text: 'FastAPI endpoints for model calls with proper error handling and timeouts.' },
          {
            facet: 'quality',
            text: 'Tuned RAG retrieval on a set of real questions until answers cited the right documents.',
          },
        ],
      },
      ru: {
        org: 'Ragnar',
        role: 'Python-разработчик',
        summary: 'AI-ассистент, который отвечает по документам компании.',
        impact: ['Ответы RAG опираются на загруженные файлы'],
        points: [
          {
            facet: 'delivery',
            text: 'Эндпоинты FastAPI для вызовов модели с аккуратной обработкой ошибок и таймаутами.',
          },
          {
            facet: 'quality',
            text: 'Настраивал поиск в RAG на наборе реальных вопросов, пока ответы не стали ссылаться на нужные документы.',
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
        summary: 'GPA 4.77 out of 5. Thesis on sizing JDBC connection pools under Java virtual threads.',
        impact: [],
        points: [],
      },
      ru: {
        org: 'Университет Иннополис',
        role: 'Бакалавриат, Computer Science',
        summary:
          'Средний балл 4.77 из 5. Диплом о подборе размера пула JDBC-соединений под виртуальными потоками Java.',
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
