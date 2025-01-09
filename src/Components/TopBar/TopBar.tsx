import { Link } from "react-router-dom";
import "./TopBar.scss";

export const TopBar: React.FC = () => {
  return (
    <header id="topbar">
      <div className="topbar__name">
        <h1>
          <Link to="/">Good Cause NYC</Link>
        </h1>
      </div>
      <div className="topbar__collab">
        By{" "}
        <a
          href="https://housingjusticeforall.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          HJ4A
        </a>{" "}
        &{" "}
        <a
          href="https://justfix.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          JustFix
        </a>
      </div>
      <div className="topbar__search">
        <Link to="/">New Search</Link>
      </div>
    </header>
  );
};
