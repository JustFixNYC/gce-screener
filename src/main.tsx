import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary, Provider as RollbarProvider } from "@rollbar/react";
import App from "./App.tsx";
import "./index.scss";
import { i18n } from "@lingui/core";
import { messages } from "./locales/en/messages";
import { I18nProvider } from "@lingui/react";

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.MODE,
  enabled:
    !!import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN &&
    import.meta.env.MODE === "production",
};

i18n.load("en", messages);
i18n.activate("en");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <I18nProvider i18n={i18n}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </I18nProvider>
    </RollbarProvider>
  </StrictMode>
);
