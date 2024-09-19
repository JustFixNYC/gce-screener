import "./App.scss";
import { Routes, Route, Outlet } from "react-router";
import { Home } from "./Components/Pages/Home/Home";
import { Form } from "./Components/Pages/Form/Form";
import { useState } from "react";

function App() {
  const [address, setAddress] = useState<{ value: string; label: string }>();
  console.log('address', address)
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home setAddress={setAddress} />} />
        <Route path="form" element={<Form address={address} />} />
        <Route path="*" element={<Home setAddress={setAddress} />} />
      </Route>
    </Routes>
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
