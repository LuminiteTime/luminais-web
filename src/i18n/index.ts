import { en, ru, type UiStrings } from './ui';

export const locales = ['en', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** A value that must exist in every locale. The compiler catches a missing translation. */
export type Localized<T> = Record<Locale, T>;

const dictionaries: Localized<UiStrings> = { en, ru };

export const useTranslations = (locale: Locale): UiStrings => dictionaries[locale];

export const localePath = (locale: Locale): string => (locale === defaultLocale ? '/' : `/${locale}/`);

export const otherLocales = (locale: Locale): Locale[] => locales.filter((l) => l !== locale);

/** Formats `YYYY` or `YYYY-MM` for a timeline: "Sep 2025", "Сент 2025", "2023". */
export function formatPeriod(value: string, locale: Locale): string {
  const [year = '', month] = value.split('-');
  if (!month) return year;
  const name = new Intl.DateTimeFormat(locale, { month: 'short' })
    .format(new Date(Number(year), Number(month) - 1))
    .replace('.', '');
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`;
}
