import { useRef } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { Trans } from "@lingui/react/macro";

import { gtmPush } from "../../google-tag-manager";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import useInViewPort from "../../hooks/useInViewport";
import { JFCLLinkInternal } from "../JFCLLink";
import "./TopBar.scss";
import { useLingui } from "@lingui/react";

export const TopBar: React.FC = () => {
  const { i18n } = useLingui();
  const isScrollingUp = useScrollDirection() === "up";
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const placeholderInViewport = useInViewPort(placeholderRef);
  const hideTopbar = !(isScrollingUp || placeholderInViewport);

  return (
    <>
      <header id="topbar" className={classNames(hideTopbar && "hide")}>
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
      <div
        ref={placeholderRef}
        id="topbar-placeholder"
        className={classNames(!hideTopbar && "hide")}
      />
    </>
  );
};
