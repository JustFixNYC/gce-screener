import { useLingui } from "@lingui/react";
import { dynamicActivate } from "../../i18n";
import "./LocaleToggle.scss";

export const LocaleToggle: React.FC = () => {
  const { i18n } = useLingui();
  return (
    <div className="locale-toggle">
      <button
        type="button"
        onClick={() => dynamicActivate("en")}
        disabled={i18n.locale == "en"}
      >
        English
      </button>{" "}
      /{" "}
      <button
        type="button"
        onClick={() => dynamicActivate("es")}
        disabled={i18n.locale == "es"}
      >
        Español
      </button>
    </div>
  );
};
