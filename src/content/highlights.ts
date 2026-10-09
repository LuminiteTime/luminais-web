import type { Localized } from '@/i18n';

/** Current role impact, shown in the "Now" section. Strongest first, two short lines each. */
export interface Highlight {
  id: string;
  l10n: Localized<{ title: string; text: string }>;
}

export const highlights: Highlight[] = [
  {
    id: 'kora-service',
    l10n: {
      en: {
        title: 'New data service',
        text: 'Design doc, architecture review, then a Java/Kora service on Kafka, Iceberg and Arrow Flight. 30+ pipelines moved to it with zero downtime.',
      },
      ru: {
        title: 'Новый сервис данных',
        text: 'Design doc, архитектурное ревью и сервис на Java/Kora поверх Kafka, Iceberg и Arrow Flight. На него без простоя переехали 30+ пайплайнов.',
      },
    },
  },
  {
    id: 'spark-batch',
    l10n: {
      en: {
        title: 'Nightly batch 3× faster',
        text: 'Partition pruning, broadcast joins and skew hints under AQE on the heaviest Spark SQL marts: 5 h down to 1 h 40 min.',
      },
      ru: {
        title: 'Ночной батч в 3 раза быстрее',
        text: 'Partition pruning, broadcast join и skew-хинты под AQE на самых тяжёлых витринах Spark SQL: с 5 ч до 1 ч 40 мин.',
      },
    },
  },
  {
    id: 'reliability',
    l10n: {
      en: {
        title: 'SLOs and on-call',
        text: 'Burn-rate alerts, tracing from Airflow through Spark to Java, idempotent Kafka consumers. Median time to resolve is under 40 minutes.',
      },
      ru: {
        title: 'SLO и дежурства',
        text: 'Алерты по burn rate, трейсинг от Airflow через Spark до Java, идемпотентные консьюмеры Kafka. Медианное время устранения меньше 40 минут.',
      },
    },
  },
  {
    id: 'agents',
    l10n: {
      en: {
        title: 'MCP server for the platform',
        text: 'Coding agents get lineage and run history from Airflow and DLH. Finding why a table is stale takes minutes.',
      },
      ru: {
        title: 'MCP-сервер для платформы',
        text: 'Кодовые агенты получают lineage и историю запусков из Airflow и DLH. Причину устаревшей таблицы теперь находят за минуты.',
      },
    },
  },
];
