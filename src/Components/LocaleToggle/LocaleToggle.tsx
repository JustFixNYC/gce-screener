import { useLingui } from "@lingui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { removeLocalePrefix } from "../../i18n";
import type { SupportedLocale } from "../../i18n-base";
import "./LocaleToggle.scss";

export const LocaleToggle: React.FC = () => {
  const { i18n } = useLingui();
  const navigate = useNavigate();
  const location = useLocation();

  const switchToLocale = (locale: SupportedLocale) => {
    const pathWithoutLocale = removeLocalePrefix(location.pathname);
    navigate(`/${locale}${pathWithoutLocale}${location.search}`);
  };

  return (
    <div className="locale-toggle">
      <button
        className="jfcl-link"
        type="button"
        onClick={() => switchToLocale("en")}
        disabled={i18n.locale === "en"}
      >
        English
      </button>{" "}
      /{" "}
      <button
        className="jfcl-link"
        type="button"
        onClick={() => switchToLocale("es")}
        disabled={i18n.locale === "es"}
      >
        Español
      </button>
    </div>
  );
};
