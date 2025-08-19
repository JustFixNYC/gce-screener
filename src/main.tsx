import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary, Provider as RollbarProvider } from "@rollbar/react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  // createHttpLink,
} from "@apollo/client";
// import { setContext } from "@apollo/client/link/context";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import App from "./App.tsx";
import "./index.scss";
// import { getCookie } from "./helpers.ts";

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.MODE,
  enabled:
    !!import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN &&
    import.meta.env.MODE === "production",
};

// https://www.apollographql.com/docs/react/networking/authentication
const graphqlLink = new BatchHttpLink({
  uri: "http://localhost:8000/en/graphql",
  credentials: "include",
});

// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   const token = getCookie("csrftoken");
//   console.log(token)
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       "X-CSRFToken": "HwrBY3Fqbj1vSZ3Xs1JHhcWMzbKCoVtRfzVNAV5psxLhPq1X7ck9YRtZpTmmCFq9",
//     },
//   };
// });

const client = new ApolloClient({
  // link: authLink.concat(graphqlLink),
  link: graphqlLink,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <ApolloProvider client={client}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ApolloProvider>
    </RollbarProvider>
  </StrictMode>
);
