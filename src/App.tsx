import {
  Route,
  Outlet,
  redirect,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  ScrollRestoration,
} from "react-router-dom";
import { SWRConfig } from "swr";
import { useRollbar } from "@rollbar/react";

import { I18n } from "./i18n";
import { Home } from "./Components/Pages/Home/Home";
import { Survey } from "./Components/Pages/Form/Survey";
import { Results } from "./Components/Pages/Results/Results";
import { APIDocs } from "./Components/Pages/APIDocs/APIDocs";
import { ConfirmAddress } from "./Components/Pages/ConfirmAddress/ConfirmAddress";
import { RentStabilization } from "./Components/Pages/RentStabilization/RentStabilization";
import { PortfolioSize } from "./Components/Pages/PortfolioSize/PortfolioSize";
import { Footer } from "./Components/Footer/Footer";
import { TenantRights } from "./Components/Pages/TenantRights/TenantRights";
import { TopBar } from "./Components/TopBar/TopBar";
import { NetworkError } from "./api/error-reporting";
import { PrivacyPolicy } from "./Components/Pages/Legal/PrivacyPolicy";
import { TermsOfUse } from "./Components/Pages/Legal/TermsOfUse";
import { decodeFromURI } from "./helpers";
import { RentCalculator } from "./Components/Pages/RentCalculator/RentCalculator";
import { LetterLanding } from "./Components/Pages/LetterLanding/LetterLanding";
import {
  LetterLayout,
  LetterSender,
} from "./Components/Pages/LetterSender/LetterSender";
import "./App.scss";

const Layout = () => {
  return (
    <I18n>
      <div id="container">
        <TopBar />

        <main id="main">
          <div id="content">
            <Outlet />
          </div>
        </main>

        <Footer />
        <ScrollRestoration />
      </div>
    </I18n>
  );
};

function isJsonString(str: string | null) {
  if (!str) return false;

  try {
    JSON.parse(str);
  } catch {
    return false;
  }
  return true;
}

const LoadAddressAndUserSession = () => {
  const sessionAddress = window.sessionStorage.getItem("address");
  const sessionUser = window.sessionStorage.getItem("user");
  if (!isJsonString(sessionAddress)) {
    return redirect("/");
  }
  return {
    address: JSON.parse(sessionAddress as string),
    user: !isJsonString(sessionUser)
      ? undefined
      : JSON.parse(sessionUser as string),
  };
};

const LoadURLSessionRequired = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const userParam = url.searchParams.get("user");
  const addressParam = url.searchParams.get("address");
  const fieldsParam = url.searchParams.get("fields");
  const sessionUser = window.sessionStorage.getItem("user");
  const sessionAddress = window.sessionStorage.getItem("address");
  const sessionFields = window.sessionStorage.getItem("fields");

  // If we session values, and they are valid JSON, return those in the loader data
  // otherwise, if we have don't have session values but we do have search params,
  // then put those search param values into session storage and
  // return them in the loader data.
  // otherwise, if we don't have session values or search params, redirect to the homepage
  if (isJsonString(sessionAddress) && isJsonString(sessionFields)) {
    return {
      // to satisfy typescript, since JSON.parse() only takes strings
      user: !isJsonString(sessionUser)
        ? undefined
        : JSON.parse(sessionUser as string),
      address: JSON.parse(sessionAddress as string),
      fields: JSON.parse(sessionFields as string),
    };
  } else if (addressParam && fieldsParam) {
    const addressParamDecoded = decodeFromURI(addressParam);
    const fieldsParamDecoded = decodeFromURI(fieldsParam);
    const userParamDecoded = userParam ? decodeFromURI(userParam) : undefined;
    // set session values
    if (userParam) {
      window.sessionStorage.setItem("user", userParamDecoded);
    }
    window.sessionStorage.setItem("address", addressParamDecoded);
    window.sessionStorage.setItem("fields", fieldsParamDecoded);
    return {
      user: userParamDecoded,
      address: addressParamDecoded,
      fields: fieldsParamDecoded,
    };
  } else {
    return redirect("/");
  }
};

const LoadURLSessionOptional = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const userParam = url.searchParams.get("user");
  const addressParam = url.searchParams.get("address");
  const fieldsParam = url.searchParams.get("fields");
  const sessionUser = window.sessionStorage.getItem("user");
  const sessionAddress = window.sessionStorage.getItem("address");
  const sessionFields = window.sessionStorage.getItem("fields");

  // If we session values, and they are valid JSON, return those in the loader data
  // otherwise, if we have don't have session values but we do have search params,
  // then put those search param values into session storage and
  // return them in the loader data.
  // otherwise, if we don't have session values or search params, return undefined
  if (isJsonString(sessionAddress) || isJsonString(sessionFields)) {
    return {
      // to satisfy typescript, since JSON.parse() only takes strings
      user: !isJsonString(sessionUser)
        ? undefined
        : JSON.parse(sessionUser as string),
      address: !isJsonString(sessionAddress)
        ? undefined
        : JSON.parse(sessionAddress as string),
      fields: !isJsonString(sessionFields)
        ? undefined
        : JSON.parse(sessionFields as string),
    };
  } else {
    const addressParamDecoded = addressParam
      ? decodeFromURI(addressParam)
      : undefined;
    const fieldsParamDecoded = fieldsParam
      ? decodeFromURI(fieldsParam)
      : undefined;
    const userParamDecoded = userParam ? decodeFromURI(userParam) : undefined;
    // set session values
    if (addressParamDecoded)
      window.sessionStorage.setItem("user", addressParamDecoded);
    if (fieldsParamDecoded)
      window.sessionStorage.setItem("address", fieldsParamDecoded);
    if (userParamDecoded)
      window.sessionStorage.setItem("fields", userParamDecoded);
    return {
      user: userParamDecoded,
      address: addressParamDecoded,
      fields: fieldsParamDecoded,
    };
  }
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes with locale prefix */}
      <Route path="/:locale" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="confirm_address"
          element={<ConfirmAddress />}
          loader={LoadAddressAndUserSession}
        />
        <Route
          path="survey"
          element={<Survey />}
          loader={LoadAddressAndUserSession}
        />
        <Route
          path="results"
          element={<Results />}
          loader={LoadURLSessionRequired}
        />
        <Route
          path="rent_stabilization"
          element={<RentStabilization />}
          loader={LoadURLSessionOptional}
        />
        <Route
          path="portfolio_size"
          element={<PortfolioSize />}
          loader={LoadURLSessionRequired}
        />
        <Route
          path="rent_calculator"
          element={<RentCalculator />}
          loader={LoadURLSessionOptional}
        />
        <Route path="letter" element={<LetterLayout />}>
          <Route index element={<LetterLanding />} />
          <Route path="reason" element={<LetterSender />} />
          <Route path="reason-details" element={<LetterSender />} />
          <Route path="contact-info" element={<LetterSender />} />
          <Route path="address" element={<LetterSender />} />
          <Route path="mail-choice" element={<LetterSender />} />
          <Route path="landlord-details" element={<LetterSender />} />
          <Route path="preview" element={<LetterSender />} />
          <Route path="confirmation" element={<LetterSender />} />
        </Route>
        <Route path="tenant_rights" element={<TenantRights />} />
        <Route path="privacy_policy" element={<PrivacyPolicy />} />
        <Route path="terms_of_use" element={<TermsOfUse />} />
        <Route path="api_docs" element={<APIDocs />} />
      </Route>
      {/* Catch-all route for paths without locale - will redirect */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<Home />} />
      </Route>
    </>
  )
);

function App() {
  const rollbar = useRollbar();

  return (
    <SWRConfig
      value={{
        onError: (error) => {
          if (error instanceof NetworkError && !error.shouldReport) return;
          rollbar.error(error);
        },
      }}
    >
      <RouterProvider router={router} />
    </SWRConfig>
  );
}

export default App;
