import "./App.scss";
import { Routes, Route, Outlet } from "react-router";
import { Home } from "./Components/Pages/Home/Home";
import { Form } from "./Components/Pages/Form/Form";
import { useState } from "react";

export type FormFields = {
  bedrooms: "studio" | "0" | "1" | "2" | "3" | "4+" | null;
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
  const [address, setAddress] = useState<{ value: string; label: string }>();
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
            path="form"
            element={
              <Form address={address} fields={fields} setFields={setFields} />
            }
          />
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
