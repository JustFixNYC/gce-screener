import { ReactNode } from "react";
import "./ContentBox.scss";
import { Accordion } from "../Accordion/Accordion";
import classNames from "classnames";
import { Link, To } from "react-router-dom";
import { gtmPush } from "../../google-tag-manager";
import { CoverageResult } from "../../types/APIDataTypes";

export type ContentBoxProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  headerExtra?: ReactNode;
  className?: string;
  children: ReactNode;
};

export const ContentBox: React.FC<ContentBoxProps> = ({
  title,
  subtitle,
  headerExtra,
  className,
  children,
}) => {
  return (
    <div className={classNames("content-box", className)}>
      {(title || subtitle || headerExtra) && (
        <div className="content-box__header">
          {title && <div className="content-box__header-title">{title}</div>}
          {subtitle && (
            <div className="content-box__header-subtitle">{subtitle}</div>
          )}
          {headerExtra}
        </div>
      )}
      {children}
    </div>
  );
};

export type ContentBoxItemProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  step?: number;
  icon?: ReactNode;
  children?: ReactNode;
  accordion?: boolean;
  open?: boolean;
  className?: string;
  gtmId?: string;
  coverageResult?: CoverageResult;
};

export const ContentBoxItem: React.FC<ContentBoxItemProps> = ({
  title,
  subtitle,
  step,
  icon,
  accordion = true,
  open = false,
  className,
  children,
  gtmId,
  coverageResult,
}) => {
  const headerSection = (
    <>
      {icon}
      <div className="content-box__section__header-container">
        {step && (
          <div className="content-box__section__step">{`Step ${step}`}</div>
        )}
        {title && <div className="content-box__section__header">{title}</div>}
        {subtitle && (
          <div className="content-box__section__header-subtitle">
            {subtitle}
          </div>
        )}
      </div>
    </>
  );

  const containerClass = classNames(
    "content-box__section",
    !title && "no-title",
    className
  );

  const handleAccordionClick = () => {
    if (!gtmId) return;
    const detailsElement = document.getElementById(gtmId) as HTMLDetailsElement;
    const isOpen = detailsElement.open;
    if (isOpen) return;
    gtmPush("gce_accordion_open", {
      gce_id: gtmId,
      gce_result: coverageResult,
    });
  };

  return accordion ? (
    <Accordion
      summary={headerSection}
      className={containerClass}
      open={open}
      onClick={handleAccordionClick}
      id={gtmId}
    >
      {children}
    </Accordion>
  ) : (
    <div className={containerClass}>
      {headerSection}
      {children}
    </div>
  );
};

export type ContentBoxFooterProps = {
  message: string;
  linkText: string;
  linkTo: To;
  className?: string;
  linkOnClick?: () => void;
};

export const ContentBoxFooter: React.FC<ContentBoxFooterProps> = ({
  message,
  className,
  linkText,
  linkTo,
  linkOnClick,
}) => {
  return (
    <div className={classNames("content-box__footer", className)}>
      <div className="content-box__footer__message">{message}</div>
      <div className="content-box__footer__link">
        <Link to={linkTo} className="jfcl-link" onClick={linkOnClick}>
          {linkText}
        </Link>
      </div>
    </div>
  );
};
