import "./App.scss";
import {
  Route,
  Outlet,
  createRoutesFromElements,
  RouterProvider,
  redirect,
} from "react-router";
import { Home } from "./Components/Pages/Home/Home";
import { Form } from "./Components/Pages/Form/Form";
import { Results } from "./Components/Pages/Results/Results";
import { APIDocs } from "./Components/Pages/APIDocs/APIDocs";
import { ConfirmAddress } from "./Components/Pages/ConfirmAddress/ConfirmAddress";
import { createBrowserRouter, Link, ScrollRestoration } from "react-router-dom";
import { RentStabilization } from "./Components/Pages/RentStabilization/RentStabilization";
import { PortfolioSize } from "./Components/Pages/PortfolioSize/PortfolioSize";

const Layout = () => {
  return (
    <div id="container">
      <header id="header">
        <h1>
          <Link to="/" className="header__link">
            Good Cause Eviction
          </Link>
        </h1>
      </header>

      <main id="main">
        <div id="content">
          <Outlet />
        </div>
      </main>
      <ScrollRestoration />
    </div>
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
  if (!isJsonString(sessionAddress) || !isJsonString(sessionUser)) {
    return redirect("/");
  }
  return {
    address: JSON.parse(sessionAddress as string),
    user: JSON.parse(sessionUser as string),
  };
};

const LoadURLSession = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const addressParam = url.searchParams.get("address");
  const fieldsParam = url.searchParams.get("fields");
  const sessionAddress = window.sessionStorage.getItem("address");
  const sessionFields = window.sessionStorage.getItem("fields");

  // If we session values, and they are valid JSON, return those in the loader data
  // otherwise, if we have don't have session values but we do have search params,
  // then put those search param values into session storage and
  // return them in the loader data.
  // otherwise, if we don't have sesson values or search params, redirect to the homepage
  if (isJsonString(sessionAddress) && isJsonString(sessionFields)) {
    return {
      address: JSON.parse(sessionAddress as string), // to satisfy typescript, since JSON.parse() only takes strings
      fields: JSON.parse(sessionFields as string),
    };
  } else if (addressParam && fieldsParam) {
    // set session values
    window.sessionStorage.setItem("address", addressParam);
    window.sessionStorage.setItem("fields", fieldsParam);
    return {
      address: JSON.parse(addressParam),
      fields: JSON.parse(fieldsParam),
    };
  } else {
    return redirect("/");
  }
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route
        path="confirm_address"
        element={<ConfirmAddress />}
        loader={LoadAddressAndUserSession}
      />
      <Route path="form" element={<Form />} loader={LoadAddressAndUserSession} />
      <Route path="results" element={<Results />} loader={LoadURLSession} />
      <Route
        path="rent_stabilization"
        element={<RentStabilization />}
        loader={LoadAddressAndUserSession}
      />
      <Route
        path="portfolio_size"
        element={<PortfolioSize />}
        loader={LoadURLSession}
      />
      <Route path="api_docs" element={<APIDocs />} />
      <Route path="*" element={<Home />} />
    </Route>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
