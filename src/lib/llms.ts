import { contacts, site } from '@/config/site';
import { experience } from '@/content/experience';
import { highlights } from '@/content/highlights';
import { projects } from '@/content/projects';
import { stack } from '@/content/stack';
import { formatPeriod, localePath, locales, useTranslations, type Locale } from '@/i18n';

// Plain-text views of the site for language models, built from the same content as the pages.
// Format: https://llmstxt.org

const LOCALE = 'en' satisfies Locale;
const t = useTranslations(LOCALE);
const url = (path: string) => new URL(path, site.url).href;
const lines = (...parts: (string | false | undefined)[]) =>
  parts.filter((p) => p !== false && p !== undefined).join('\n');

const localeNames: Record<Locale, string> = { en: 'English', ru: 'Russian' };

function facts(): string {
  return lines(
    `- Name: ${site.author} (handle: ${site.handle})`,
    `- Role: ${t.meta.jobTitle} at ${site.employer.name}`,
    `- Location: ${t.hero.facts[0]}`,
    `- Experience: ${t.hero.facts[1]}`,
    `- Education: ${site.alumniOf.name}`,
    `- Languages: ${t.stack.languages}`,
    `- Status: ${t.hero.status}`,
    `- Email: ${contacts.email}`,
  );
}

/** Short index: who, key facts, where to read more. */
export function llmsIndex(): string {
  return lines(
    `# ${site.author} (${site.handle})`,
    '',
    `> ${t.meta.description}`,
    '',
    t.hero.lead,
    '',
    facts(),
    '',
    '## Profile',
    '',
    ...locales.map((l) => `- [Profile page, ${localeNames[l]}](${url(localePath(l))})`),
    `- [Full profile in Markdown](${url('/llms-full.txt')}): current role, experience, projects, stack`,
    '',
    '## Contacts',
    '',
    `- [Email](mailto:${contacts.email})`,
    `- [Telegram](${contacts.telegram})`,
    `- [GitHub](${contacts.github})`,
    `- [LinkedIn](${contacts.linkedin})`,
    '',
    '## Optional',
    '',
    `- [Source code of this site](${site.repo})`,
    '',
  );
}

/** Everything on the page as Markdown. */
export function llmsFull(): string {
  const period = (start: string, end?: string) =>
    `${formatPeriod(start, LOCALE)} to ${end ? formatPeriod(end, LOCALE) : 'present'}`;

  return lines(
    `# ${site.author} (${site.handle})`,
    '',
    `> ${t.meta.description}`,
    '',
    facts(),
    '',
    `## ${t.now.title}`,
    '',
    `${t.now.role}. ${t.now.since}.`,
    '',
    t.now.text,
    '',
    ...highlights.flatMap(({ l10n }) => [`### ${l10n[LOCALE].title}`, '', l10n[LOCALE].text, '']),
    '## Experience',
    '',
    ...experience.flatMap(({ start, end, l10n }) => {
      const e = l10n[LOCALE];
      return [
        `### ${e.org}, ${e.role}`,
        '',
        `${period(start, end)}. ${e.summary}`,
        '',
        ...e.points.map((p) => `- ${p}`),
        '',
      ];
    }),
    '## Projects',
    '',
    ...projects.flatMap(({ href, stack: tech, l10n }) => {
      const p = l10n[LOCALE];
      return [
        `### ${p.title}`,
        '',
        lines(
          `- Context: ${p.context}`,
          p.award && `- Recognition: ${p.award}`,
          `- Stack: ${tech.join(', ')}`,
          href && `- Link: ${href}`,
        ),
        '',
        p.text,
        '',
      ];
    }),
    '## Stack',
    '',
    ...stack.map(({ label, items }) => `- ${label[LOCALE]}: ${items.join(', ')}`),
    '',
    '## Contacts',
    '',
    `- Email: ${contacts.email}`,
    `- Telegram: ${contacts.telegram}`,
    `- GitHub: ${contacts.github}`,
    `- LinkedIn: ${contacts.linkedin}`,
    `- WeChat: ${contacts.wechatId}`,
    '',
  );
}
