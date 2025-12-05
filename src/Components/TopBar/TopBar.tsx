import { useRef } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";

import { gtmPush } from "../../google-tag-manager";
import { useHideHeader } from "../../hooks/useHideHeader";
import { JFCLLinkInternal } from "../JFCLLink";
import "./TopBar.scss";

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
