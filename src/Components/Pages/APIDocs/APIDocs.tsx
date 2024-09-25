import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import spec from "./APISpec.json";
import { Link } from "react-router-dom";
import "./style.scss";

export const APIDocs: React.FC = () => {
  return (
    <>
      <Link className="home-link" to="/">
        Back to Good Cause Screener
      </Link>
      <SwaggerUI spec={spec} />
    </>
  );
};
