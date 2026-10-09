import type { Localized } from '@/i18n';

export interface StackGroup {
  id: string;
  label: Localized<string>;
  items: string[];
}

export const stack: StackGroup[] = [
  {
    id: 'data',
    label: { en: 'Data', ru: 'Данные' },
    items: ['Spark SQL', 'PySpark', 'Airflow', 'Iceberg', 'Arrow Flight', 'Kafka Streams', 'ClickHouse', 'Trino'],
  },
  {
    id: 'backend',
    label: { en: 'Backend', ru: 'Бэкенд' },
    items: [
      'Java 21',
      'Kora',
      'Spring Boot',
      'Scala',
      'Go',
      'FastAPI',
      'Kafka',
      'RabbitMQ',
      'gRPC',
      'GraphQL',
      'PostgreSQL',
      'Oracle',
      'Redis',
    ],
  },
  {
    id: 'frontend',
    label: { en: 'Frontend', ru: 'Фронтенд' },
    items: ['TypeScript', 'React', 'Next.js', 'Astro', 'React Native', 'Three.js', 'Zustand', 'Tailwind'],
  },
  {
    id: 'infra',
    label: { en: 'Infra', ru: 'Инфраструктура' },
    items: [
      'Docker',
      'Kubernetes',
      'Terraform',
      'GitLab CI',
      'GitHub Actions',
      'Helm',
      'OpenTelemetry',
      'Prometheus',
      'Grafana',
      'Loki, Tempo',
      'k6',
    ],
  },
  {
    id: 'ai',
    label: { en: 'AI agents', ru: 'AI-агенты' },
    items: ['Claude Code', 'MCP servers', 'Agent skills', 'Evals, LLM judge', 'RAG, pgvector', 'OpenRouter'],
  },
];
