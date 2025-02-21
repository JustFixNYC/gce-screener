import { Link } from "react-router-dom";
import "./TopBar.scss";
import { gtmPush } from "../../google-tag-manager";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import classNames from "classnames";

export const TopBar: React.FC = () => {
  const isScrollingUp = useScrollDirection() === "up";

  return (
    <header id="topbar" className={classNames(isScrollingUp && "scrolling-up")}>
      <div className="topbar__name">
        <h1>
          <Link to="/">Good Cause NYC</Link>
        </h1>
      </div>
      <div className="topbar__collab">
        <span>By</span>{" "}
        <a
          href="https://housingjusticeforall.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Housing Justice for All
        </a>{" "}
        <span>&</span>{" "}
        <a
          href="https://justfix.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          JustFix
        </a>
      </div>
      <div className="topbar__search">
        <Link to="/" onClick={() => gtmPush("gce_new_search")}>
          New Search
        </Link>
      </div>
    </header>
  );
};
