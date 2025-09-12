/** Our supported locales. */
export type SupportedLocale = "en" | "es";

/** A type that maps locales to language names. */
type LocaleLanguages = {
  [P in SupportedLocale]: string;
};

/**
 * A mapping from supported locale codes to their user-facing names, in their
 * respective languages.
 */
export const languageNames: LocaleLanguages = {
  en: "English",
  es: "Español",
};

/**
 * The fallback default locale to use if we don't support the
 * browser's preferred locale.
 */
export const defaultLocale: SupportedLocale = "en";

/** Return whether the given string is a supported locale. */
export function isSupportedLocale(code: string): code is SupportedLocale {
  return code in languageNames;
}
