import "./App.scss";
import { Routes, Route, Outlet } from "react-router";
import { Home } from "./Components/Pages/Home/Home";
import { Form } from "./Components/Pages/Form/Form";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="form" element={<Form />} />
        <Route path="*" element={<Home />} />
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
