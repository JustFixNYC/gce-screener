import React, { useEffect } from "react";
import { Navigate, NavLink, useLocation } from "react-router-dom";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";

import { messages as catalogEn } from "./locales/en/messages";
import { messages as catalogEs } from "./locales/es/messages";
import { SupportedLocale, defaultLocale, isSupportedLocale } from "./i18n-base";

// Load all catalogs
i18n.load({
  en: catalogEn,
  es: catalogEs,
});

// Activate default locale initially
i18n.activate(defaultLocale);

/**
 * Return the best possible guess at what the default locale
 * should be, taking into account the current browser's language
 * preferences and the locales we support.
 */
function getBestDefaultLocale(): SupportedLocale {
  const preferredLocale = navigator.language.slice(0, 2);
  if (isSupportedLocale(preferredLocale)) {
    return preferredLocale;
  }

  return defaultLocale;
}

/**
 * Given a path (e.g. `/en/boop`), return the locale of the first
 * component of the path if it's a supported locale.
 *
 * Return null if there is no locale, or if it's an unsupported one.
 */
export function parseLocaleFromPath(path: string): SupportedLocale | null {
  const localeMatch = path.match(/^\/([a-z][a-z])/);
  if (localeMatch) {
    const code = localeMatch[1];
    if (isSupportedLocale(code)) {
      return code;
    }
  }

  return null;
}

/**
 * Return the current locale from the current location, throwing an
 * assertion failure if the current pathname doesn't have a
 * locale prefix.
 */
export function localeFromLocation(pathname: string): SupportedLocale {
  const locale = parseLocaleFromPath(pathname);

  if (!locale) {
    throw new Error(`"${pathname}" does not start with a valid locale!`);
  }

  return locale;
}

/**
 * A wrapper for lingui's `<I18nProvider>` that activates a localization based on the
 * current path.
 *
 * If the current path contains no localization information, the component will redirect
 * to a new URL that consists of the best possible default locale, followed by the current
 * path (e.g. it will redirect from `/boop` to `/es/boop` for browsers that indicate their
 * language preference is Spanish).
 */
export function I18n({ children }: { children: React.ReactNode }): JSX.Element {
  const location = useLocation();
  const { pathname, search } = location;
  const locale = parseLocaleFromPath(pathname);

  // Activate the locale when it changes
  useEffect(() => {
    if (locale) {
      i18n.activate(locale);
    }
  }, [locale]);

  if (!locale) {
    return (
      <Navigate to={`/${getBestDefaultLocale()}${pathname}${search}`} replace />
    );
  }

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}

/**
 * Given a locale-prefixed path (e.g. `/en/boop`), return the same path
 * without the locale prefix (e.g. `/boop`).
 */
export function removeLocalePrefix(path: string): string {
  const pathParts = path.split("/");
  pathParts.splice(1, 1);
  return pathParts.join("/");
}

/**
 * A UI affordance that allows the user to switch locales.
 *
 * Since we currently only have two locales, this just offers a toggle to the
 * other language.
 */
export function LocaleSwitcher() {
  const location = useLocation();
  const to = (toLocale: SupportedLocale) =>
    `/${toLocale}${removeLocalePrefix(location.pathname)}`;

  return (
    <span className="language-toggle">
      <NavLink to={to("en")}>EN</NavLink>/<NavLink to={to("es")}>ES</NavLink>
    </span>
  );
}

