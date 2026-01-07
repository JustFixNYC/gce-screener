import { useRef, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { Trans } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { gtmPush } from "../../google-tag-manager";
import { JFCLLink } from "../JFCLLink";
import "./Navigation.scss";
import { removeLocalePrefix } from "../../i18n";
import { LocaleToggle } from "../LocaleToggle/LocaleToggle";
import { Icon } from "@justfixnyc/component-library";
import { useHideHeader } from "../../hooks/useHideHeader";

export const TopBar: React.FC<{
  isMobileMenuOpen: boolean;
  onMenuClick: () => void;
}> = ({ isMobileMenuOpen, onMenuClick }) => {
  const { i18n, _ } = useLingui();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const hideHeader = useHideHeader(headerRef);
  return (
    <header
      ref={headerRef}
      id="topbar"
      className={classNames({ hide: hideHeader })}
      role="navigation"
      aria-label={_(msg`Main`)}
    >
      <div
        className={classNames("topbar__name", {
          "topbar__name--es": i18n.locale === "es",
        })}
      >
        <h1>
          <Link to={`/${i18n.locale}/`}>
            <Trans>Good Cause NYC</Trans>
          </Link>
        </h1>
      </div>
      <div
        className={classNames("topbar__menu", {
          "topbar__menu--open": isMobileMenuOpen,
        })}
      >
        <button
          ref={menuButtonRef}
          className={classNames("topbar__menu-button", {
            "topbar__menu-button--close": isMobileMenuOpen,
          })}
          onClick={onMenuClick}
          aria-label={isMobileMenuOpen ? _(msg`Close menu`) : _(msg`Open menu`)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="sidebar"
          type="button"
        >
          {isMobileMenuOpen ? (
            <>
              <Icon icon="xmark" aria-hidden="true" />
              <Trans>Close</Trans>
            </>
          ) : (
            <>
              <Icon icon="bars" aria-hidden="true" />
              <Trans>Menu</Trans>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export const Sidebar: React.FC<{
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}> = ({ isMobileMenuOpen = false }) => {
  const { i18n, _ } = useLingui();
  const { pathname } = useLocation();
  const cleanedPathname = pathname.toLowerCase();
  const pathWithoutLocale = removeLocalePrefix(pathname);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(max-width: 1023px)").matches; // tablet-landscape-down breakpoint
  });

  // Listen for viewport size changes, more for testing purposes than actual user behavior
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 1023px)"); // tablet-landscape-down breakpoint

    function handleMobileChange(e: MediaQueryListEvent | MediaQueryList) {
      setIsMobile(e.matches);
    }

    mediaQuery.addListener(handleMobileChange); // For older browsers
    mediaQuery.addEventListener("change", handleMobileChange); // Modern syntax
    handleMobileChange(mediaQuery); // Initial check

    return () => {
      mediaQuery.removeListener(handleMobileChange);
      mediaQuery.removeEventListener("change", handleMobileChange);
    };
  }, []);

  const screenerPath = [
    "survey",
    "results",
    "confirm_address",
    "rent_stabilization",
    "portfolio_size",
  ];
  const isHomeActive =
    pathWithoutLocale === "/" ||
    pathWithoutLocale === "/en" ||
    pathWithoutLocale === "/es" ||
    screenerPath.some((path) => cleanedPathname.includes(path));

  // Move focus to first link when menu opens
  useEffect(() => {
    if (isMobileMenuOpen) {
      setTimeout(() => {
        const firstLink = sidebarRef.current?.querySelector(
          "#site-nav a[href]"
        ) as HTMLAnchorElement;
        if (firstLink) {
          firstLink.focus();
        }
      }, 0);
    }
  }, [isMobileMenuOpen]);

  // Focus trap for sidebar when mobile menu is open
  useEffect(() => {
    if (!isMobileMenuOpen || !sidebarRef.current) return;

    const handleFocusTrap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusableElements = sidebarRef.current?.querySelectorAll(
        'a, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleFocusTrap);
    return () => {
      document.removeEventListener("keydown", handleFocusTrap);
    };
  }, [isMobileMenuOpen]);

  const isHiddenOnMobile = isMobile && !isMobileMenuOpen;

  return (
    <div
      id="sidebar"
      ref={sidebarRef}
      className={classNames({ "mobile-menu-open": isMobileMenuOpen })}
    >
      <div className="sidebar__content">
        <NamePlate />
        <nav
          id="site-nav"
          aria-label={_(msg`Tools`)}
          role="navigation"
          aria-hidden={isHiddenOnMobile}
        >
          <ul>
            <li
              className={classNames(isHomeActive && "active")}
              aria-current={isHomeActive ? "page" : undefined}
            >
              <JFCLLink
                to={`/${i18n.locale}/`}
                tabIndex={isHiddenOnMobile ? -1 : undefined}
              >
                <Icon icon="house" aria-hidden="true" />
                <Trans>Find out if you're covered</Trans>
              </JFCLLink>
            </li>
            <li
              className={classNames(
                cleanedPathname.includes("rent_calculator") && "active"
              )}
              aria-current={
                cleanedPathname.includes("rent_calculator") ? "page" : undefined
              }
            >
              <JFCLLink
                to={`/${i18n.locale}/rent_calculator`}
                onClick={() => {
                  gtmPush("gce_rent_calculator", { from: "navbar" });
                }}
                tabIndex={isHiddenOnMobile ? -1 : undefined}
              >
                <Icon icon="calculatorSimple" aria-hidden="true" />
                <Trans>Calculate your rent increase</Trans>
              </JFCLLink>
            </li>
            <li
              className={classNames(
                cleanedPathname.includes("letter") && "active"
              )}
              aria-current={
                cleanedPathname.includes("letter") ? "page" : undefined
              }
            >
              <JFCLLink
                to={`/${i18n.locale}/letter`}
                onClick={() => {
                  gtmPush("gce_letter_sender", { from: "navbar" });
                }}
                tabIndex={isHiddenOnMobile ? -1 : undefined}
              >
                <Icon icon="mailboxOpenLetter" aria-hidden="true" />
                <Trans>Draft your Good Cause letter</Trans>
              </JFCLLink>
            </li>
            <li
              className={classNames(
                cleanedPathname.includes("tenant_rights") && "active"
              )}
              aria-current={
                cleanedPathname.includes("tenant_rights") ? "page" : undefined
              }
            >
              <JFCLLink
                to={`/${i18n.locale}/tenant_rights`}
                tabIndex={isHiddenOnMobile ? -1 : undefined}
              >
                <Icon icon="shieldCheck" aria-hidden="true" />
                <Trans>Know your rights</Trans>
              </JFCLLink>
            </li>
          </ul>
        </nav>
        <div className="sidebar__locale-toggle" aria-hidden={isHiddenOnMobile}>
          <span>
            <Trans>Language</Trans>:
          </span>
          <LocaleToggle
            tabIndex={isHiddenOnMobile ? -1 : undefined}
            isHiddenOnMobile={isHiddenOnMobile}
          />
        </div>
      </div>
    </div>
  );
};

const NamePlate: React.FC<{ className?: string }> = ({ className }) => {
  const { i18n } = useLingui();
  const isSpanish = i18n.locale === "es";

  return (
    <div
      className={classNames(
        "nameplate",
        className,
        isSpanish && "nameplate-es"
      )}
    >
      <h1>
        <Link to="/">
          <Trans>Good Cause NYC</Trans>
        </Link>
      </h1>
    </div>
  );
};

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
