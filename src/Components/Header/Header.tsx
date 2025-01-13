import React from "react";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { Address } from "../Pages/Home/Home";
import { BackLink } from "../JFCLLinkInternal";
import { ProgressStep, toTitleCase } from "../../helpers";

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
        <div
          className={
            isGuide
              ? "headline-section__address"
              : "headline-section__address__print"
          }
        >
          {toTitleCase(
            `${address?.houseNumber} ${address?.streetName}, ${address?.zipcode}`
          )}
        </div>
        {isGuide && (
          <div className="headline-section__back-link">
            <BackLink to="/results">Back to Coverage Result</BackLink>
          </div>
        )}
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
