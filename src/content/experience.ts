import type { Localized } from '@/i18n';

/** Timeline entry. Dates are `YYYY-MM` or `YYYY`; omit `end` for the current role. */
export interface Position {
  id: string;
  start: string;
  end?: string;
  l10n: Localized<{ org: string; role: string; summary: string; points: string[] }>;
}

export const experience: Position[] = [
  {
    id: 'tbank',
    start: '2025-09',
    l10n: {
      en: {
        org: 'T-Bank',
        role: 'Software Engineer, Data Platform',
        summary: 'Ingestion, orchestration and services for the bank’s Data Lake House.',
        points: [
          'Spark SQL tuning on nightly marts: batch window down from 5 h to 1 h 40 min.',
          'Shared Airflow operator library for 60+ DAGs with data quality checks built in.',
          'Java/Kora data service shipped end to end and supported in production.',
          'Legacy GitOps file pipeline migrated and wired to the GitLab API, results stream into DLH with access groups I designed.',
          'OpenTelemetry tracing across all platform services.',
        ],
      },
      ru: {
        org: 'Т-Банк',
        role: 'Разработчик, Data Platform',
        summary: 'Загрузка данных, оркестрация и сервисы для Data Lake House банка.',
        points: [
          'Тюнинг Spark SQL на ночных витринах: окно батча сократилось с 5 ч до 1 ч 40 мин.',
          'Общая библиотека операторов Airflow для 60+ DAG со встроенными проверками качества данных.',
          'Сервис данных на Java/Kora от модели до поддержки в продакшене.',
          'Мигрировал заброшенный GitOps-пайплайн обработки файлов, подключил GitLab API, результаты льются в DLH с моей схемой групп доступа.',
          'Сквозной трейсинг на OpenTelemetry во всех сервисах платформы.',
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
        points: [
          'Reworked the in-house gRPC client and server to hedge requests correctly. Hedged calls became 75% faster.',
          'Designed GraphQL schemas for the frontend team.',
          'Kept REST integrations with external partners running.',
        ],
      },
      ru: {
        org: 'Яндекс, Авто.ру',
        role: 'Бэкенд-разработчик, Scala',
        summary: 'Микросервисы отзывов и пользовательского контента Авто.ру.',
        points: [
          'Переделал внутренний gRPC клиент и сервер, чтобы хеджирование запросов работало правильно. Хеджированные вызовы ускорились на 75%.',
          'Проектировал GraphQL-схемы для фронтенда.',
          'Поддерживал REST-интеграции с внешними партнёрами.',
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
        summary: 'Software for medical clinics: Spring backend and the React admin the staff works in.',
        points: [
          'REST controllers and business logic on Spring Web.',
          'Rewrote JDBC queries to PostgreSQL and cut database load by 68%.',
          'Built admin screens in React and TypeScript on top of the same API.',
          'Extended CI with linters and deploy steps, covered services with JUnit and Testcontainers.',
        ],
      },
      ru: {
        org: 'Hirus',
        role: 'Fullstack-разработчик',
        summary: 'Софт для медицинских клиник: бэкенд на Spring и админка на React, в которой работает персонал.',
        points: [
          'REST-контроллеры и бизнес-логика на Spring Web.',
          'Переписал JDBC-запросы к PostgreSQL и снизил нагрузку на базу на 68%.',
          'Собирал экраны админки на React и TypeScript поверх того же API.',
          'Расширял CI линтерами и шагами деплоя, покрывал сервисы тестами на JUnit и Testcontainers.',
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
        points: [
          'FastAPI endpoints for model calls with proper error handling.',
          'Tuned RAG retrieval for better answers on uploaded files.',
          'Trimmed an OpenWebUI fork down to what the product needed.',
        ],
      },
      ru: {
        org: 'Ragnar',
        role: 'Python-разработчик',
        summary: 'AI-ассистент, который отвечает по документам компании.',
        points: [
          'Эндпоинты FastAPI для вызовов модели с аккуратной обработкой ошибок.',
          'Настроил RAG, чтобы ответы по загруженным файлам стали точнее.',
          'Урезал форк OpenWebUI до того, что реально нужно продукту.',
        ],
      },
    },
  },
  {
    id: 'innopolis',
    start: '2023',
    end: '2027',
    l10n: {
      en: { org: 'Innopolis University', role: 'B.Sc. Computer Science', summary: 'GPA 4.77 out of 5.', points: [] },
      ru: {
        org: 'Университет Иннополис',
        role: 'Бакалавриат, Computer Science',
        summary: 'Средний балл 4.77 из 5.',
        points: [],
      },
    },
  },
];
