import type { Localized } from '@/i18n';

/** Current role impact, shown in the "Now" section. Newest first. */
export interface Highlight {
  id: string;
  l10n: Localized<{ title: string; text: string }>;
}

export const highlights: Highlight[] = [
  {
    id: 'spark-batch',
    l10n: {
      en: {
        title: 'Nightly batch, three times faster',
        text: 'Rewrote the heaviest Spark SQL marts with partition pruning, broadcast joins and skew hints under AQE. The window went from 5 hours to 1 h 40 min.',
      },
      ru: {
        title: 'Ночной батч в три раза быстрее',
        text: 'Переписал самые тяжёлые витрины на Spark SQL: partition pruning, broadcast join, skew-хинты под AQE. Окно сократилось с 5 часов до 1 ч 40 мин.',
      },
    },
  },
  {
    id: 'airflow-library',
    l10n: {
      en: {
        title: 'Airflow that scales with the team',
        text: 'Moved 60+ DAGs onto a shared operator library with typed configs and built-in data quality checks. Failed runs dropped threefold, a new source lands in a day.',
      },
      ru: {
        title: 'Airflow, который растёт вместе с командой',
        text: 'Перевёл 60+ DAG на общую библиотеку операторов с типизированными конфигами и встроенными проверками качества. Падений стало втрое меньше, новый источник подключается за день.',
      },
    },
  },
  {
    id: 'kora-service',
    l10n: {
      en: {
        title: 'A data service from scratch',
        text: 'Designed and shipped a Java/Kora service end to end: data model, REST contracts, Kafka and DB queues for async work, Iceberg and Arrow Flight for heavy reads.',
      },
      ru: {
        title: 'Сервис данных с нуля',
        text: 'Спроектировал и запустил сервис на Java/Kora целиком: модель данных, REST-контракты, Kafka и очереди в БД для асинхронных задач, Iceberg и Arrow Flight для тяжёлых чтений.',
      },
    },
  },
  {
    id: 'tracing',
    l10n: {
      en: {
        title: 'One trace across the stack',
        text: 'Rolled out OpenTelemetry on every platform service. An incident is followed from an Airflow task through Spark to a Java call in a single Grafana view.',
      },
      ru: {
        title: 'Один трейс через весь стек',
        text: 'Внедрил OpenTelemetry во все сервисы платформы. Инцидент теперь видно целиком, от задачи в Airflow через Spark до вызова в Java, в одном окне Grafana.',
      },
    },
  },
];
