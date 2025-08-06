import { i18n } from "@lingui/core";

export const locales = {
  en: "English",
  es: "Español",
};
export const defaultLocale = "en";

export async function dynamicActivate(locale: string) {
  const { messages } = await import(`./locales/${locale}/messages`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}
