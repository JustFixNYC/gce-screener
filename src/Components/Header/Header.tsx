import React from "react";
import { BreadCrumbs } from "../BreadCrumbs/BreadCrumbs";
import { Address } from "../Pages/Home/Home";
import { BackLink } from "../JFCLLinkInternal";

type HeaderProps = {
  title: string | React.ReactNode;
  subtitle?: string;
  pageType?: string;
  address?: Address;
  isGuide?: boolean;
  showBreadcrumbs?: boolean;
  children?: React.ReactNode;
};

export const Header: React.FC<HeaderProps> = ({
  address,
  pageType,
  title,
  subtitle,
  isGuide = false,
  showBreadcrumbs = true,
  children,
}) => {
  return (
    <div className="headline-section">
      <div className="headline-section__content">
        {showBreadcrumbs && <BreadCrumbs address={address} />}
        {isGuide && (
          <div className="headline-section__back-link">
            <BackLink to="/results">Back to Coverage Result</BackLink>
          </div>
        )}
        {pageType && (
          <div className="headline-section__page-type">{pageType}</div>
        )}
        <h2 className="headline-section__title">{title}</h2>
        {subtitle && (
          <div className="headline-section__subtitle">{subtitle}</div>
        )}
        {children}
      </div>
    </div>
  );
};
