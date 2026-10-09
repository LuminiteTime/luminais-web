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

/** An in-depth case: problem, architecture, decisions, outcome. Keep every text to one or two sentences. */
export interface Case {
  id: string;
  start: string;
  end?: string;
  stack: string[];
  diagram: Diagram;
  l10n: Localized<{
    title: string;
    tagline: string;
    role: string;
    team: string;
    problem: string;
    /** How the work is run: planning, reviews, people, releases. */
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
        tagline: 'A hiring platform where candidates fix real services and hidden tests grade them in a sandbox.',
        role: 'Founder and tech lead',
        team: 'Me and two part-time contributors',
        problem:
          'The platform runs untrusted code, takes bursts during hiring campaigns and must grade every run exactly once.',
        practice:
          'Linear with two-week cycles, a written Definition of Done, weekly 1:1s, an ADR and design review before cross-module changes. Coding agents follow AGENTS.md and ArchUnit rules.',
        decisions: [
          {
            title: 'Modular monolith, one PostgreSQL',
            text: 'ArchUnit enforces module boundaries, so a module can become a service later without a rewrite.',
          },
          {
            title: 'gVisor sandboxes',
            text: 'User-space kernel, no egress, CPU and memory limits, a time budget per run.',
          },
          {
            title: 'Outbox and RabbitMQ',
            text: 'A submission and its event commit in one transaction. Queue depth drives sandbox autoscaling.',
          },
          {
            title: 'Warm sandbox pool',
            text: 'Cold starts took half the verdict time. The pool is sized from the arrival rate.',
          },
        ],
        outcomes: [
          { value: '14 s', label: 'p95 to verdict at 300 concurrent submissions (k6)' },
          { value: '0', label: 'lost or double-graded runs out of 50,000 with workers killed at random' },
          { value: '22', label: 'architecture decision records' },
        ],
      },
      ru: {
        title: 'Pojec',
        tagline: 'Платформа для найма: кандидат чинит настоящий сервис, скрытые тесты проверяют его в песочнице.',
        role: 'Основатель и техлид',
        team: 'Я и два контрибьютора на частичной занятости',
        problem:
          'Платформа запускает чужой код, держит всплески во время найма и должна проверять каждый запуск ровно один раз.',
        practice:
          'Linear двухнедельными циклами, письменный Definition of Done, еженедельные 1:1, ADR и дизайн-ревью перед изменениями между модулями. Кодовые агенты работают по AGENTS.md и правилам ArchUnit.',
        decisions: [
          {
            title: 'Модульный монолит и одна PostgreSQL',
            text: 'ArchUnit держит границы модулей, поэтому модуль можно вынести в сервис без переписывания.',
          },
          {
            title: 'Песочницы на gVisor',
            text: 'Ядро в пространстве пользователя, без исходящей сети, лимиты CPU и памяти, бюджет времени на запуск.',
          },
          {
            title: 'Outbox и RabbitMQ',
            text: 'Решение и его событие коммитятся одной транзакцией. Глубина очереди управляет автоскейлингом песочниц.',
          },
          {
            title: 'Тёплый пул песочниц',
            text: 'Холодный старт занимал половину времени до вердикта. Размер пула считается от интенсивности потока.',
          },
        ],
        outcomes: [
          { value: '14 с', label: 'p95 до вердикта при 300 одновременных решениях (k6)' },
          { value: '0', label: 'потерянных или дважды проверенных запусков из 50 000 при случайном убийстве воркеров' },
          { value: '22', label: 'архитектурных решения в ADR' },
        ],
      },
    },
  },
  {
    id: 'skillator',
    start: '2026-06',
    end: '2026-09',
    stack: [
      'Java 25',
      'Spring Boot',
      'PostgreSQL',
      'React',
      'YooKassa',
      'Docker',
      'Prometheus',
      'Grafana',
      'Loki',
      'Tempo',
    ],
    diagram: {
      nodes: [
        { id: 'web', label: 'Web app', note: 'React, Vite', col: 0, row: 0 },
        { id: 'edge', label: 'nginx', note: 'TLS, rate limits', col: 1, row: 0 },
        { id: 'pay', label: 'YooKassa', note: 'webhooks', col: 1, row: 1 },
        { id: 'api', label: 'API', note: 'Spring Boot', col: 2, row: 0, accent: true },
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
          'A paid AI service that writes skills for coding agents. I built it alone, ran it in production and sold it.',
        role: 'Founder, sole engineer',
        team: 'Product, backend, frontend, ops',
        problem:
          'Real money and a non-deterministic model in one flow: every charge has to be correct, every answer good enough to pay for.',
        practice:
          'Weekly releases driven by user feedback, OpenAPI contract with generated server and client, 16 ADRs. Alerts on failed payments and generation latency went to my phone.',
        decisions: [
          {
            title: 'Credits as a ledger',
            text: 'Immutable entries, webhooks idempotent by payment id, balances derived from the ledger.',
          },
          {
            title: 'Evals gate prompt changes',
            text: 'A reference set scored by an LLM judge on every prompt or model change; a lower score blocks the release.',
          },
          {
            title: 'Providers behind ports',
            text: 'LLM and payment providers switch at runtime from the admin page during an outage.',
          },
          {
            title: 'Handover for the sale',
            text: 'Runbooks, ADRs and infrastructure as code; the buyer’s team ran it on their own within a week.',
          },
        ],
        outcomes: [
          { value: '2,300', label: 'registered users, 310 of them paying' },
          { value: '99.9%', label: 'uptime over three months in production' },
          { value: 'Sold', label: 'in September 2026' },
        ],
      },
      ru: {
        title: 'Skillator',
        tagline:
          'Платный AI-сервис, который пишет скиллы для кодовых агентов. Сделал в одиночку, держал в продакшене и продал.',
        role: 'Основатель, единственный инженер',
        team: 'Продукт, бэкенд, фронтенд, эксплуатация',
        problem:
          'Реальные деньги и недетерминированная модель в одном потоке: каждое списание должно быть верным, каждый ответ стоить своих денег.',
        practice:
          'Релизы раз в неделю по отзывам пользователей, OpenAPI-контракт с генерацией сервера и клиента, 16 ADR. Алерты о сбоях оплаты и задержке генерации приходили мне на телефон.',
        decisions: [
          {
            title: 'Кредиты как журнал операций',
            text: 'Неизменяемые записи, вебхуки идемпотентны по id платежа, баланс считается из журнала.',
          },
          {
            title: 'Evals перед изменением промптов',
            text: 'Эталонный набор оценивает LLM-судья при каждом изменении промпта или модели; падение оценки блокирует релиз.',
          },
          {
            title: 'Провайдеры за портами',
            text: 'При сбое провайдера LLM или оплаты его можно переключить на лету со страницы администратора.',
          },
          {
            title: 'Передача при продаже',
            text: 'Ранбуки, ADR и инфраструктура как код; команда покупателя через неделю работала с сервисом сама.',
          },
        ],
        outcomes: [
          { value: '2 300', label: 'зарегистрированных пользователей, из них 310 платящих' },
          { value: '99,9%', label: 'аптайм за три месяца в продакшене' },
          { value: 'Продан', label: 'в сентябре 2026' },
        ],
      },
    },
  },
  {
    id: 'vmeste',
    start: '2026-08',
    stack: [
      'Java 25',
      'Spring Boot 4',
      'Spring Data JDBC',
      'PostgreSQL',
      'MinIO',
      'Kotlin',
      'Jetpack Compose',
      'Caddy',
    ],
    diagram: {
      nodes: [
        { id: 'app', label: 'Android', note: 'Compose, offline cache', col: 0, row: 0 },
        { id: 'edge', label: 'Caddy', note: 'TLS', col: 1, row: 0 },
        { id: 'api', label: 'Backend', note: '7 domain modules', col: 2, row: 0, accent: true },
        { id: 'llm', label: 'OpenRouter', note: 'assistant, streaming', col: 3, row: 0 },
        { id: 'files', label: 'MinIO', note: 'presigned URLs', col: 1, row: 1 },
        { id: 'db', label: 'PostgreSQL', note: 'family id in every query', col: 2, row: 1, accent: true },
        { id: 'obs', label: 'Grafana', note: 'metrics, logs, alerts', col: 3, row: 1 },
      ],
      edges: [
        { from: 'app', to: 'edge', label: 'REST, WS' },
        { from: 'edge', to: 'api' },
        { from: 'app', to: 'files' },
        { from: 'api', to: 'db' },
        { from: 'api', to: 'llm' },
        { from: 'api', to: 'obs' },
      ],
    },
    l10n: {
      en: {
        title: 'Vmeste',
        tagline:
          'One private app for a family: chat, documents, calendar and an assistant that answers from the family’s own data.',
        role: 'Author, backend and Android',
        team: 'Solo',
        problem:
          'Several families on one server must never see each other’s data, and the assistant may read only its own family.',
        practice:
          'Functional and non-functional requirements written first, 11 ADRs, OpenAPI as the contract. Releases from GitHub Actions with separate steps for the APK, the server and monitoring.',
        decisions: [
          {
            title: 'Isolation in the repository layer',
            text: 'The family id comes from the token and is added to every query; a request body cannot choose a family.',
          },
          {
            title: 'Files skip the backend',
            text: 'The app uploads and downloads through presigned MinIO URLs.',
          },
          {
            title: 'Lexical retrieval for the assistant',
            text: 'Started with pgvector, moved to lexical search when the model provider had no embeddings. ADR-0011 records the switch.',
          },
          {
            title: 'Offline first on Android',
            text: 'Reads come from the local cache; sends wait in a queue and retry.',
          },
        ],
        outcomes: [
          { value: '300 ms', label: 'p95 budget for REST calls' },
          { value: '5 s', label: 'to the assistant’s first streamed token' },
          { value: '7', label: 'domain modules with boundaries checked at compile time' },
        ],
      },
      ru: {
        title: 'Вместе',
        tagline:
          'Закрытое приложение для семьи: чат, документы, календарь и ассистент, который отвечает по данным самой семьи.',
        role: 'Автор, бэкенд и Android',
        team: 'Один',
        problem:
          'Несколько семей на одном сервере не должны видеть чужие данные, а ассистент читает только свою семью.',
        practice:
          'Сначала функциональные и нефункциональные требования, 11 ADR, OpenAPI как контракт. Релизы из GitHub Actions с отдельными шагами для APK, сервера и мониторинга.',
        decisions: [
          {
            title: 'Изоляция в слое репозиториев',
            text: 'Id семьи берётся из токена и подставляется в каждый запрос; тело запроса семью выбрать не может.',
          },
          {
            title: 'Файлы минуют бэкенд',
            text: 'Приложение грузит и скачивает файлы по presigned-ссылкам MinIO.',
          },
          {
            title: 'Лексический поиск для ассистента',
            text: 'Начал с pgvector, перешёл на лексический поиск, когда у провайдера модели не оказалось эмбеддингов. Переход описан в ADR-0011.',
          },
          {
            title: 'Офлайн-режим на Android',
            text: 'Чтение идёт из локального кэша, отправка ждёт в очереди и повторяется.',
          },
        ],
        outcomes: [
          { value: '300 мс', label: 'бюджет p95 на REST-запрос' },
          { value: '5 с', label: 'до первого токена ответа ассистента, ответ стримится' },
          { value: '7', label: 'доменных модулей, границы проверяет компилятор' },
        ],
      },
    },
  },
];
