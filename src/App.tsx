import "./App.scss";
import { Routes, Route, Outlet } from "react-router";
import { Address, Home } from "./Components/Pages/Home/Home";
import { Form } from "./Components/Pages/Form/Form";
import { useState } from "react";
import { Results } from "./Components/Pages/Results/Results";
import { APIDocs } from "./Components/Pages/APIDocs/APIDocs";
import { ConfirmAddress } from "./Components/Pages/ConfirmAddress/ConfirmAddress";

export type FormFields = {
  bedrooms: "studio" | "1" | "2" | "3" | "4+" | null;
  rent: "A" | "B" | "C" | "D" | "E" | null;
  landlord: "yes" | "no" | "maybe" | null;
  rentStabilized: "yes" | "no" | "maybe" | null;
  housingType:
    | "public"
    | "subsidized"
    | "manufactured"
    | "none"
    | "not-sure"
    | null;
};

const initialFields: FormFields = {
  bedrooms: null,
  rent: null,
  landlord: null,
  rentStabilized: null,
  housingType: null,
};

function App() {
  const [address, setAddress] = useState<Address>();
  const [fields, setFields] = useState<FormFields>(initialFields);
  return (
    <>
      <br />
      <br />
      {/* <pre>ADDRESS: {JSON.stringify(address, null, 2)}</pre>
      <pre>FIELDS: {JSON.stringify(fields, null, 2)}</pre> */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={<Home address={address} onSelectAddress={setAddress} />}
          />
          <Route
            path="confirm_address"
            element={
              <ConfirmAddress address={address} />
            }
          />
          <Route
            path="form"
            element={
              <Form address={address} fields={fields} setFields={setFields} />
            }
          />
          <Route
            path="results"
            element={<Results address={address} fields={fields} />}
          />
          <Route path="api_docs" element={<APIDocs />} />
          <Route
            path="*"
            element={<Home address={address} onSelectAddress={setAddress} />}
          />
        </Route>
      </Routes>
    </>
  );
}

const Layout = () => {
  return (
    <div id="container">
      <header id="header">
        <h1>Good Cause Eviction</h1>
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
