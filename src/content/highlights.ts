import type { Localized } from '@/i18n';

/** Current role impact, shown in the "Now" section. Strongest first. */
export interface Highlight {
  id: string;
  l10n: Localized<{ title: string; text: string }>;
}

export const highlights: Highlight[] = [
  {
    id: 'kora-service',
    l10n: {
      en: {
        title: 'A data service from design doc to production',
        text: 'Load estimate, failure modes and API in a design doc defended at the architecture review, then a Java/Kora service on Kafka, Iceberg and Arrow Flight that 30+ pipelines moved to without downtime.',
      },
      ru: {
        title: 'Сервис данных от design doc до продакшена',
        text: 'Оценка нагрузки, сценарии отказов и API в design doc, защищённом на архитектурном ревью, а затем сервис на Java/Kora поверх Kafka, Iceberg и Arrow Flight, на который без простоя переехали 30+ пайплайнов.',
      },
    },
  },
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
    id: 'reliability',
    l10n: {
      en: {
        title: 'On-call that gets quieter',
        text: 'SLOs with burn-rate alerts, one trace from an Airflow task through Spark to a Java call, idempotent Kafka consumers with a dead-letter topic. Median time to resolve dropped under 40 minutes.',
      },
      ru: {
        title: 'Дежурства, которые становятся тише',
        text: 'SLO с алертами по burn rate, один трейс от задачи в Airflow через Spark до вызова в Java, идемпотентные консьюмеры Kafka с dead-letter топиком. Медианное время устранения меньше 40 минут.',
      },
    },
  },
  {
    id: 'agents',
    l10n: {
      en: {
        title: 'Agents that know the platform',
        text: 'An MCP server over Airflow and DLH metadata plus shared agent skills: the team’s coding agents see lineage and run history, so “why is this table stale” takes minutes instead of an hour of digging.',
      },
      ru: {
        title: 'Агенты, которые знают платформу',
        text: 'MCP-сервер над метаданными Airflow и DLH и общие скиллы для агентов: кодовые агенты команды видят lineage и историю запусков, и вопрос «почему таблица устарела» решается за минуты, а не за час раскопок.',
      },
    },
  },
];
