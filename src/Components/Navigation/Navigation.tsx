import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";
import { gtmPush } from "../../google-tag-manager";
import { JFCLLink, JFCLLinkInternal } from "../JFCLLink";
import "./Navigation.scss";
import { removeLocalePrefix } from "../../i18n";
import { LocaleToggle } from "../LocaleToggle/LocaleToggle";
import { Icon } from "@justfixnyc/component-library";
import { useHideHeader } from "../../hooks/useHideHeader";

export const TopBar: React.FC = () => {
  const { i18n } = useLingui();
  const headerRef = useRef<HTMLElement>(null);
  const hideHeader = useHideHeader(headerRef);

  return (
    <header
      ref={headerRef}
      id="topbar"
      className={classNames({ hide: hideHeader })}
    >
      <div className="topbar__name">
        <h1>
          <Link to={`/${i18n.locale}`}>
            <Trans>Good Cause NYC</Trans>
          </Link>
        </h1>
      </div>
      <div className="topbar__rent-calculator">
        <JFCLLinkInternal
          to={`/${i18n.locale}/rent_calculator`}
          onClick={() => gtmPush("gce_rent_calculator", { from: "navbar" })}
        >
          <Trans>Rent increase calculator</Trans>
        </JFCLLinkInternal>
      </div>
    </header>
  );
};

export const Sidebar: React.FC = () => {
  const { i18n } = useLingui();
  const { pathname } = useLocation();

  const scrollToTop = () => {
    const mainElement = document.getElementById("main");
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div id="sidebar">
      <div className="sidebar__content">
        <NamePlate />
        <nav id="site-nav">
          <ul>
            <li
              className={classNames(
                removeLocalePrefix(pathname) === "/" && "active"
              )}
            >
              <JFCLLink to={`/${i18n.locale}/`} onClick={scrollToTop}>
                <Icon icon="house" />
                <Trans>Find out if you're covered</Trans>
              </JFCLLink>
            </li>
            <li
              className={classNames(
                pathname.includes("rent_calculator") && "active"
              )}
            >
              <JFCLLink
                to={`/${i18n.locale}/rent_calculator`}
                onClick={() => {
                  scrollToTop();
                  gtmPush("gce_rent_calculator", { from: "navbar" });
                }}
              >
                <Icon icon="calculatorSimple" />
                <Trans>Calculate your rent increase</Trans>
              </JFCLLink>
            </li>
            <li className={classNames(pathname.includes("letter") && "active")}>
              <JFCLLink
                to={`/${i18n.locale}/letter`}
                onClick={() => {
                  scrollToTop();
                  gtmPush("gce_letter_sender", { from: "navbar" });
                }}
              >
                <Icon icon="mailboxOpenLetter" />
                <Trans>Draft your Good Cause letter</Trans>
              </JFCLLink>
            </li>
            <li
              className={classNames(
                pathname.includes("tenant_rights") && "active"
              )}
            >
              <JFCLLink
                to={`/${i18n.locale}/tenant_rights`}
                onClick={scrollToTop}
              >
                <Icon icon="shieldCheck" />
                <Trans>Know your rights</Trans>
              </JFCLLink>
            </li>
          </ul>
        </nav>
        <div className="sidebar__locale-toggle">
          <span>
            <Trans>Language</Trans>:
          </span>
          <LocaleToggle />
        </div>
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

export const CollabHeader: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={classNames("collab-header", className)}>
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
      <a href="https://justfix.org/" target="_blank" rel="noopener noreferrer">
        JustFix
      </a>
    </Trans>
  </div>
);
