import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";
import { gtmPush } from "../../google-tag-manager";
import { JFCLLink, JFCLLinkExternal, JFCLLinkInternal } from "../JFCLLink";
import "./Navigation.scss";
import { removeLocalePrefix } from "../../i18n";
import { LocaleToggle } from "../LocaleToggle/LocaleToggle";
import { Icon } from "@justfixnyc/component-library";

export type LinkWithLabel = [string, JSX.Element];

const SITE_LINKS = [
  ["rent_calculator", <Trans>Rent increase calculator</Trans>],
  ["letter", <Trans>Letter sender</Trans>],
  ["tenant_rights", <Trans>Tenants rights</Trans>],
] as LinkWithLabel[];

const HeaderLink: React.FC<{ link: LinkWithLabel }> = ({ link }) =>
  link[0].charAt(0) === "/" ? (
    <JFCLLinkInternal
      className="navbar-item jf-menu-page-link px-0 py-3 has-text-white"
      to={link[0]}
    >
      {link[1]}
    </JFCLLinkInternal>
  ) : (
    <JFCLLinkExternal
      className="navbar-item jf-menu-page-link px-0 py-3 has-text-white"
      to={link[0]}
      target="_blank"
      rel="noopener noreferrer"
    >
      {link[1]}
    </JFCLLinkExternal>
  );

export const TopBar: React.FC = () => {
  const [burgerMenuIsOpen, setBurgerMenuStatus] = useState(false);

  return (
    <>
      <header id="topbar">
        <NamePlate />
        <div
          className={classNames(
            "navbar-item is-justify-content-center",
            burgerMenuIsOpen && "is-active"
          )}
        >
          <button
            role="button"
            className={classNames(
              "navbar-burger burger",
              "is-flex is-align-items-center is-justify-content-center",
              burgerMenuIsOpen && "is-active"
            )}
            aria-expanded="false"
            onClick={() => setBurgerMenuStatus(!burgerMenuIsOpen)}
            data-target="navbar"
          >
            {burgerMenuIsOpen ? (
              <Icon icon="xmark" />
            ) : (
              <Icon icon="arrowDown" />
            )}
            <div className="is-inline-block">
              {burgerMenuIsOpen ? <Trans>Close</Trans> : <Trans>Menu</Trans>}
            </div>
          </button>
        </div>
        <div
          id="main-navbar-menu"
          className={
            "navbar-menu has-background-black px-1-mobile " +
            (burgerMenuIsOpen && "is-active")
          }
        >
          <div className="navbar-end is-flex is-flex-direction-column py-3 px-5">
            <div>
              {SITE_LINKS.map((link, i) => (
                <HeaderLink link={link} key={i} />
              ))}
            </div>

            <div className="navbar-item has-dropdown is-hoverable mt-7 mb-4 mb-7-mobile">
              <div className="navbar-dropdown is-right pt-1 pb-0">
                <LocaleToggle />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export const Sidebar: React.FC = () => {
  const { i18n } = useLingui();
  const { pathname } = useLocation();

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
              <JFCLLink to="/">
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
                onClick={() =>
                  gtmPush("gce_rent_calculator", { from: "navbar" })
                }
              >
                <Icon icon="calculatorSimple" />
                <Trans>Calculate your rent increase</Trans>
              </JFCLLink>
            </li>
            <li className={classNames(pathname.includes("letter") && "active")}>
              <JFCLLink
                to={`/${i18n.locale}/letter`}
                onClick={() => gtmPush("gce_letter_sender", { from: "navbar" })}
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
              <JFCLLink to={`/${i18n.locale}/tenant_rights`}>
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
  <div className={classNames("topbar__collab", className)}>
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
