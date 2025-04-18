import { useRef } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { gtmPush } from "../../google-tag-manager";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import useInViewPort from "../../hooks/useInViewport";
import "./TopBar.scss";
import { JFCLLinkInternal } from "../JFCLLink";

export const TopBar: React.FC = () => {
  const isScrollingUp = useScrollDirection() === "up";
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const placeholderInViewport = useInViewPort(placeholderRef);
  const hideTopbar = !(isScrollingUp || placeholderInViewport);

  return (
    <>
      <header id="topbar" className={classNames(hideTopbar && "hide")}>
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
        <div className="topbar__rent-calculator">
          <JFCLLinkInternal
            to="/rent_calculator"
            onClick={() => gtmPush("gce_rent_calculator")}
          >
            Rent increase calculator
          </JFCLLinkInternal>
        </div>
      </header>
      <div
        ref={placeholderRef}
        id="topbar-placeholder"
        className={classNames(!hideTopbar && "hide")}
      />
    </>
  );
};
