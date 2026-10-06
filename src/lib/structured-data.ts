import { contacts, site } from '@/config/site';
import { stack } from '@/content/stack';
import { localePath, useTranslations, type Locale } from '@/i18n';

const absolute = (path: string) => new URL(path, site.url).href;

/**
 * schema.org graph for the profile page: WebSite, ProfilePage and the Person it is about.
 * Search engines use it for the knowledge panel and rich results.
 */
export function profileGraph(locale: Locale, photoUrl: string) {
  const t = useTranslations(locale);
  const pageUrl = absolute(localePath(locale));
  const personId = `${site.url}/#person`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: site.handle,
        inLanguage: ['en', 'ru'],
        publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${pageUrl}#page`,
        url: pageUrl,
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: locale,
        isPartOf: { '@id': `${site.url}/#website` },
        mainEntity: { '@id': personId },
        dateModified: new Date().toISOString(),
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: site.author,
        givenName: site.givenName,
        familyName: site.familyName,
        alternateName: [site.handle, `${t.hero.firstName} ${t.hero.lastName}`],
        url: site.url,
        image: photoUrl,
        jobTitle: t.meta.jobTitle,
        description: t.hero.lead,
        email: `mailto:${contacts.email}`,
        worksFor: { '@type': 'Organization', ...site.employer },
        alumniOf: { '@type': 'CollegeOrUniversity', ...site.alumniOf },
        address: {
          '@type': 'PostalAddress',
          addressLocality: site.location.locality,
          addressRegion: site.location.region,
          addressCountry: site.location.country,
        },
        knowsLanguage: site.languages,
        knowsAbout: stack.flatMap((group) => group.items),
        sameAs: [contacts.github, contacts.linkedin, contacts.telegram],
      },
    ],
  };
}
