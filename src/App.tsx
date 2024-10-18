import "./App.scss";
import { Routes, Route, Outlet, useLocation } from "react-router";
import { Home } from "./Components/Pages/Home/Home";
import { Form } from "./Components/Pages/Form/Form";
import { ReactNode, useLayoutEffect, useState } from "react";
import { Results } from "./Components/Pages/Results/Results";
import { APIDocs } from "./Components/Pages/APIDocs/APIDocs";
import { ConfirmAddress } from "./Components/Pages/ConfirmAddress/ConfirmAddress";
import { Link } from "react-router-dom";

export type FormFields = {
  bedrooms: "studio" | "1" | "2" | "3" | "4+" | null;
  rent: "$5,846" | "$6,005" | "$6,742" | "$8,413" | "$9,065" | ">$9,065" | null;
  landlord: "yes" | "no" | "maybe" | null;
  rentStabilized: "yes" | "no" | "maybe" | null;
  housingType: "public" | "subsidized" | "none" | "not-sure" | null;
};

const initialFields: FormFields = {
  bedrooms: null,
  rent: null,
  landlord: null,
  rentStabilized: null,
  housingType: null,
};

const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    // Scroll to the top of the page when the route changes
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return children;
};

function App() {
  const [fields] = useState<FormFields>(initialFields);
  return (
    <>
      <Wrapper>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="confirm_address" element={<ConfirmAddress />} />
            <Route
              path="form"
              element={<Form />}
            />
            <Route path="results" element={<Results fields={fields} />} />
            <Route path="api_docs" element={<APIDocs />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </Wrapper>
    </>
  );
}

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

      <div id="main">
        <div id="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default App;
