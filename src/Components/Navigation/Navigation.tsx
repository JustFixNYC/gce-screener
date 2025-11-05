import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";
import classNames from "classnames";

import { JFCLLink } from "../JFCLLink";
import { gtmPush } from "../../google-tag-manager";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import useInViewPort from "../../hooks/useInViewport";
import { removeLocalePrefix } from "../../i18n";
import "./Navigation.scss";

export const TopBar: React.FC = () => {
  const isScrollingUp = useScrollDirection() === "up";
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const placeholderInViewport = useInViewPort(placeholderRef);
  const hideTopbar = !(isScrollingUp || placeholderInViewport);

  return (
    <>
      <header id="topbar" className={classNames(hideTopbar && "hide")}>
        <NamePlate />
        <div className="topbar__collab">
          <Trans>
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
          </Trans>
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

export const Nav: React.FC = () => {
  const { i18n } = useLingui();
  const { pathname } = useLocation();
  return (
    <div id="sidebar">
      <div className="sidebar__content">
        <NamePlate />
        <nav id="site-nav">
          <ul>
            <li>
              <JFCLLink
                to="/"
                className={classNames(
                  removeLocalePrefix(pathname) === "/" && "active"
                )}
              >
                <Trans>Home</Trans>
              </JFCLLink>
            </li>
            <li>
              <JFCLLink
                to={`/${i18n.locale}/rent_calculator`}
                className={classNames(
                  pathname.includes("rent_calculator") && "active"
                )}
                onClick={() =>
                  gtmPush("gce_rent_calculator", { from: "navbar" })
                }
              >
                <Trans>Rent increase calculator</Trans>
              </JFCLLink>
            </li>
            <li>
              <JFCLLink
                to={`/${i18n.locale}/letter`}
                className={classNames(pathname.includes("letter") && "active")}
                onClick={() => gtmPush("gce_letter_sender", { from: "navbar" })}
              >
                <Trans>Letter sender</Trans>
              </JFCLLink>
            </li>
            <li>
              <JFCLLink
                to={`/${i18n.locale}/tenant_rights`}
                className={classNames(
                  pathname.includes("tenant_rights") && "active"
                )}
              >
                <Trans>Tenants rights</Trans>
              </JFCLLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

const NamePlate: React.FC<{ className?: string }> = ({ className }) => (
  <div className={classNames("nameplate", className)}>
    <h1>
      <Link to="/">
        <Trans>Good Cause NYC</Trans>
      </Link>
    </h1>
  </div>
);
