import React from "react";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { Address } from "../Pages/Home/Home";
import { BackLink } from "../JFCLLink";
import { abbreviateBoro, ProgressStep, toTitleCase } from "../../helpers";

type HeaderProps = {
  title: string | React.ReactNode;
  subtitle?: string;
  address?: Address;
  isGuide?: boolean;
  showProgressBar?: boolean;
  lastStepReached?: ProgressStep;
  children?: React.ReactNode;
};

export const Header: React.FC<HeaderProps> = ({
  address,
  title,
  subtitle,
  isGuide = false,
  showProgressBar = true,
  lastStepReached,
  children,
}) => {
  return (
    <div className="headline-section">
      <div className="headline-section__content">
        {isGuide && (
          <nav className="headline-section__back-link">
            <BackLink to="/results">Back to Result</BackLink>
          </nav>
        )}
        <div
          className={
            isGuide
              ? "headline-section__address"
              : "headline-section__address__print"
          }
        >
          {toTitleCase(`${address?.houseNumber} ${address?.streetName}, `) +
            (address && abbreviateBoro(address?.borough))}
        </div>
        {showProgressBar && (
          <ProgressBar address={address} lastStepReached={lastStepReached} />
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
