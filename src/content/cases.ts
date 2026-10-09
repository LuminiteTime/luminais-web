import type { Localized } from '@/i18n';

/** Box on an architecture diagram, placed on a grid. Labels are tech names, so they are not translated. */
export interface DiagramNode {
  id: string;
  label: string;
  note?: string;
  col: number;
  row: number;
  /** Highlights the part the case is about. */
  accent?: boolean;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Diagram {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

/** An in-depth case: problem, architecture, decisions, outcome. */
export interface Case {
  id: string;
  start: string;
  end?: string;
  stack: string[];
  href?: string;
  diagram: Diagram;
  l10n: Localized<{
    title: string;
    tagline: string;
    role: string;
    team: string;
    problem: string;
    /** How the work is run: planning, reviews, people. */
    practice: string;
    decisions: { title: string; text: string }[];
    outcomes: { value: string; label: string }[];
  }>;
}

export const cases: Case[] = [
  {
    id: 'pojec',
    start: '2026-01',
    stack: ['Java 25', 'Spring Boot', 'PostgreSQL', 'RabbitMQ', 'Kubernetes', 'gVisor', 'Next.js', 'k6'],
    diagram: {
      nodes: [
        { id: 'web', label: 'Web', note: 'Next.js', col: 0, row: 0 },
        { id: 'api', label: 'API', note: 'modular monolith', col: 1, row: 0, accent: true },
        { id: 'worker', label: 'Grading workers', note: 'hidden tests', col: 3, row: 0 },
        { id: 'db', label: 'PostgreSQL', note: 'data + outbox', col: 1, row: 1 },
        { id: 'mq', label: 'RabbitMQ', note: 'submissions', col: 2, row: 1 },
        { id: 'orch', label: 'Orchestrator', note: 'warm pool', col: 3, row: 1 },
        { id: 'box', label: 'gVisor sandboxes', note: 'k8s, no egress', col: 4, row: 1, accent: true },
      ],
      edges: [
        { from: 'web', to: 'api' },
        { from: 'api', to: 'db' },
        { from: 'db', to: 'mq', label: 'relay' },
        { from: 'mq', to: 'worker' },
        { from: 'worker', to: 'orch' },
        { from: 'orch', to: 'box' },
        { from: 'worker', to: 'api', label: 'verdict' },
      ],
    },
    l10n: {
      en: {
        title: 'Pojec',
        tagline:
          'LeetCode for production engineering: a candidate gets a real service and a task, hidden tests grade the result in a sandbox.',
        role: 'Founder and tech lead',
        team: 'Me and two part-time contributors',
        problem:
          'Hiring loops test algorithms, while the job is reading a codebase, wiring a framework and not breaking production. The hard parts are running hostile code safely, absorbing bursts during hiring campaigns and grading every run exactly once.',
        practice:
          'Roadmap in Linear with two-week cycles, a written Definition of Done, weekly 1:1s with contributors, and an ADR with a design review before any cross-module change. Coding agents work under the same rules: AGENTS.md per module and ArchUnit tests as guardrails.',
        decisions: [
          {
            title: 'Modular monolith, one PostgreSQL',
            text: 'A small team cannot afford distributed transactions. Feature modules with boundaries enforced by ArchUnit keep the option to split a service out later.',
          },
          {
            title: 'gVisor sandboxes, default-deny network',
            text: 'Candidate code is hostile by default: a user-space kernel, no egress, CPU and memory limits and a wall-clock budget per run.',
          },
          {
            title: 'Outbox and RabbitMQ',
            text: 'A submission and its event are written in one transaction, so a crash never loses a run or grades it twice. Queue depth drives the sandbox autoscaler.',
          },
          {
            title: 'Warm sandbox pool',
            text: 'Cold starts were half of the verdict time. A pool sized from the arrival rate keeps latency flat during bursts.',
          },
        ],
        outcomes: [
          { value: '14 s', label: 'p95 time to verdict at 300 concurrent submissions in a k6 test' },
          { value: '0', label: 'lost or double-graded runs out of 50,000, with workers killed at random' },
          { value: '22', label: 'architecture decision records' },
        ],
      },
      ru: {
        title: 'Pojec',
        tagline:
          'LeetCode для продакшен-инженерии: кандидат получает настоящий сервис и задачу, скрытые тесты проверяют результат в песочнице.',
        role: 'Основатель и техлид',
        team: 'Я и два контрибьютора на частичной занятости',
        problem:
          'Собеседования проверяют алгоритмы, а работа состоит в том, чтобы разобраться в кодовой базе, подключить фреймворк и не уронить продакшен. Самое сложное здесь: безопасно запускать чужой код, выдерживать всплески во время найма и проверять каждый запуск ровно один раз.',
        practice:
          'Роадмап в Linear двухнедельными циклами, письменный Definition of Done, еженедельные 1:1 с контрибьюторами, ADR и дизайн-ревью перед любым изменением между модулями. Кодовые агенты работают по тем же правилам: AGENTS.md в каждом модуле и тесты ArchUnit как ограничители.',
        decisions: [
          {
            title: 'Модульный монолит и одна PostgreSQL',
            text: 'Маленькой команде не нужны распределённые транзакции. Модули с границами, которые проверяет ArchUnit, оставляют возможность вынести сервис позже.',
          },
          {
            title: 'Песочницы gVisor, сеть закрыта по умолчанию',
            text: 'Код кандидата считается враждебным: ядро в пространстве пользователя, никакого исходящего трафика, лимиты CPU и памяти и бюджет времени на запуск.',
          },
          {
            title: 'Outbox и RabbitMQ',
            text: 'Решение и его событие пишутся одной транзакцией, поэтому падение не теряет запуск и не проверяет его дважды. Глубина очереди управляет автоскейлингом песочниц.',
          },
          {
            title: 'Тёплый пул песочниц',
            text: 'Холодный старт занимал половину времени до вердикта. Пул, рассчитанный от интенсивности потока, держит задержку ровной во время всплесков.',
          },
        ],
        outcomes: [
          { value: '14 с', label: 'p95 до вердикта при 300 одновременных решениях в тесте k6' },
          { value: '0', label: 'потерянных или дважды проверенных запусков из 50 000 при случайном убийстве воркеров' },
          { value: '22', label: 'архитектурных решения в ADR' },
        ],
      },
    },
  },
  {
    id: 'skillator',
    start: '2026-06',
    end: '2026-06',
    stack: ['Java 25', 'Spring Boot 4', 'PostgreSQL', 'React', 'Docker', 'Prometheus', 'Grafana', 'Loki', 'Tempo'],
    diagram: {
      nodes: [
        { id: 'web', label: 'Web app', note: 'React, Vite', col: 0, row: 0 },
        { id: 'edge', label: 'nginx', note: 'TLS, routing', col: 1, row: 0 },
        { id: 'pay', label: 'YooKassa', note: 'webhooks', col: 1, row: 1 },
        { id: 'api', label: 'API', note: 'Spring Boot 4', col: 2, row: 0, accent: true },
        { id: 'db', label: 'PostgreSQL', note: 'credits ledger', col: 2, row: 1 },
        { id: 'llm', label: 'LLM port', note: 'OpenRouter, evals', col: 3, row: 0, accent: true },
        { id: 'obs', label: 'Grafana', note: 'Prometheus, Loki, Tempo', col: 3, row: 1 },
      ],
      edges: [
        { from: 'web', to: 'edge' },
        { from: 'edge', to: 'api' },
        { from: 'pay', to: 'api' },
        { from: 'api', to: 'db' },
        { from: 'api', to: 'llm' },
        { from: 'api', to: 'obs' },
      ],
    },
    l10n: {
      en: {
        title: 'Skillator',
        tagline:
          'A paid AI product built alone, end to end: requirements, backend, frontend, billing, deploy and observability.',
        role: 'Solo, full cycle',
        team: 'Product, backend, frontend, DevOps',
        problem:
          'Engineers who work with coding agents need good skill files and rarely have time to write them. The service turns a plain description into a skill, charges credits for it and has to stay correct with real money and a non-deterministic model in the loop.',
        practice:
          'Started from user interviews and a one-page spec, then contract-first: OpenAPI is the source of truth, the server delegates and the TypeScript client are generated. Sixteen ADRs explain every non-obvious choice.',
        decisions: [
          {
            title: 'Credits as a ledger',
            text: 'Every top-up and generation is an immutable entry; YooKassa webhooks are idempotent by payment id and balances are derived, never edited.',
          },
          {
            title: 'Evals before prompt changes',
            text: 'A reference set of requests is scored against a rubric by an LLM judge on every prompt or model change; a drop in score blocks the release.',
          },
          {
            title: 'Providers behind ports',
            text: 'LLM and payment providers switch at runtime from the admin page, so an outage at a provider is a dropdown, not a deploy.',
          },
          {
            title: 'Observable from day one',
            text: 'Micrometer metrics in Prometheus, logs in Loki, traces in Tempo; the trace id in any log line opens the whole request.',
          },
        ],
        outcomes: [
          { value: '6 days', label: 'from the first commit to taking payments in test mode' },
          {
            value: '4 min',
            label: 'from a version tag to a verified deploy, after Testcontainers and Playwright pass',
          },
          { value: '16', label: 'architecture decision records' },
        ],
      },
      ru: {
        title: 'Skillator',
        tagline:
          'Платный AI-продукт, сделанный в одиночку целиком: требования, бэкенд, фронтенд, оплата, деплой и мониторинг.',
        role: 'Один, полный цикл',
        team: 'Продукт, бэкенд, фронтенд, DevOps',
        problem:
          'Инженерам, которые работают с кодовыми агентами, нужны хорошие файлы скиллов, а писать их обычно некогда. Сервис превращает описание словами в готовый скилл, списывает за это кредиты и должен оставаться корректным, когда в контуре реальные деньги и недетерминированная модель.',
        practice:
          'Начал с интервью пользователей и спецификации на страницу, дальше contract-first: OpenAPI как единственный источник правды, серверные делегаты и TypeScript-клиент генерируются. Шестнадцать ADR объясняют каждое неочевидное решение.',
        decisions: [
          {
            title: 'Кредиты как журнал операций',
            text: 'Каждое пополнение и генерация пишутся неизменяемой записью; вебхуки YooKassa идемпотентны по id платежа, баланс вычисляется, а не редактируется.',
          },
          {
            title: 'Evals перед изменением промптов',
            text: 'Эталонный набор запросов оценивается LLM-судьёй по рубрике при каждом изменении промпта или модели; падение оценки блокирует релиз.',
          },
          {
            title: 'Провайдеры за портами',
            text: 'Провайдеры LLM и оплаты переключаются на лету со страницы администратора, поэтому сбой у провайдера решается выпадающим списком, а не деплоем.',
          },
          {
            title: 'Наблюдаемость с первого дня',
            text: 'Метрики Micrometer в Prometheus, логи в Loki, трейсы в Tempo; trace id в любой строке лога открывает весь запрос.',
          },
        ],
        outcomes: [
          { value: '6 дней', label: 'от первого коммита до приёма платежей в тестовом режиме' },
          { value: '4 мин', label: 'от тега версии до проверенного деплоя, после Testcontainers и Playwright' },
          { value: '16', label: 'архитектурных решений в ADR' },
        ],
      },
    },
  },
  {
    id: 'pools',
    start: '2026-09',
    end: '2027-06',
    stack: ['Java 21', 'Virtual threads', 'HikariCP', 'PostgreSQL', 'k6', 'Docker Compose', 'Python'],
    diagram: {
      nodes: [
        { id: 'load', label: 'k6', note: 'factor matrix', col: 0, row: 0 },
        { id: 'svc', label: 'Service', note: 'virtual threads', col: 1, row: 0 },
        { id: 'pool', label: 'HikariCP', note: 'c connections', col: 2, row: 0, accent: true },
        { id: 'db', label: 'PostgreSQL', note: 'query time S', col: 3, row: 0 },
        { id: 'measured', label: 'Measured wait', note: 'Micrometer', col: 1, row: 1 },
        { id: 'model', label: 'Erlang C model', note: 'predicted wait', col: 2, row: 1, accent: true },
      ],
      edges: [
        { from: 'load', to: 'svc' },
        { from: 'svc', to: 'pool' },
        { from: 'pool', to: 'db' },
        { from: 'pool', to: 'measured' },
        { from: 'model', to: 'measured' },
      ],
    },
    l10n: {
      en: {
        title: 'Pools under virtual threads',
        tagline: 'Bachelor thesis on high-load Java: when threads become cheap, the JDBC pool becomes the bottleneck.',
        role: 'Author',
        team: 'Research, Innopolis University',
        problem:
          'Virtual threads let a service take thousands of concurrent requests, but the database still has a few dozen connections. Requests now queue for a connection instead of a thread, and the usual pool sizing advice stops working.',
        practice:
          'Every claim is reproducible: the model has its own tests, the testbed runs from one Docker Compose file, and each experiment is a row in a factor matrix of rates, query times and pool sizes.',
        decisions: [
          {
            title: 'A queueing model first',
            text: 'The pool is an M/M/c queue, so Erlang C predicts the wait for a connection from arrival rate, query time and pool size.',
          },
          {
            title: 'A testbed that isolates the pool',
            text: 'A Spring service on virtual threads with HikariCP and PostgreSQL, driven by k6, with timeouts and pool metrics exported through Micrometer.',
          },
          {
            title: 'Predict, then measure',
            text: 'Each run checks the prediction against measured latency, so the result is a sizing rule rather than a benchmark chart.',
          },
        ],
        outcomes: [
          { value: '≤ 12%', label: 'gap between predicted and measured wait in pilot runs' },
          { value: '400 rps', label: 'top of the load range, with pools from 6 to 20 connections' },
        ],
      },
      ru: {
        title: 'Пулы под виртуальными потоками',
        tagline:
          'Диплом про высоконагруженную Java: когда потоки становятся дешёвыми, узким местом становится пул JDBC.',
        role: 'Автор',
        team: 'Исследование, Университет Иннополис',
        problem:
          'Виртуальные потоки позволяют сервису принимать тысячи одновременных запросов, но у базы по-прежнему несколько десятков соединений. Запросы встают в очередь за соединением, а не за потоком, и привычные советы по размеру пула перестают работать.',
        practice:
          'Каждое утверждение воспроизводится: у модели свои тесты, стенд поднимается одним Docker Compose, каждый эксперимент это строка в матрице факторов из интенсивности, времени запроса и размера пула.',
        decisions: [
          {
            title: 'Сначала модель очереди',
            text: 'Пул это очередь M/M/c, поэтому Erlang C предсказывает ожидание соединения по интенсивности потока, времени запроса и размеру пула.',
          },
          {
            title: 'Стенд, изолирующий пул',
            text: 'Сервис на Spring и виртуальных потоках с HikariCP и PostgreSQL под нагрузкой k6, таймауты и метрики пула выгружаются через Micrometer.',
          },
          {
            title: 'Предсказать, потом измерить',
            text: 'Каждый прогон сверяет предсказание с измеренной задержкой, поэтому итог это правило подбора размера, а не график бенчмарка.',
          },
        ],
        outcomes: [
          { value: '≤ 12%', label: 'расхождение предсказанного и измеренного ожидания в пилотных прогонах' },
          { value: '400 rps', label: 'верхняя граница нагрузки при пулах от 6 до 20 соединений' },
        ],
      },
    },
  },
];
