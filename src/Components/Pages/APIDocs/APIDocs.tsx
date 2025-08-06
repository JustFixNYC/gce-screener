import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import spec from "./APISpec.json";
import { Link } from "react-router-dom";
import "./style.scss";

// Type assertion to fix React 18 compatibility
const SwaggerUIComponent = SwaggerUI as React.ComponentType<{
  spec: object | string;
}>;

export const APIDocs: React.FC = () => {
  return (
    <>
      <Link className="home-link" to="/">
        Back to Good Cause Screener
      </Link>
      <SwaggerUIComponent spec={spec} />
    </>
  );
};
