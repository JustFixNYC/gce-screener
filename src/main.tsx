import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary, Provider as RollbarProvider } from "@rollbar/react";
import App from "./App.tsx";
import "./index.scss";

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.MODE,
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </RollbarProvider>
  </StrictMode>
);
