import { ReactNode } from "react";
import { Link, To } from "react-router-dom";
import classNames from "classnames";

import { Accordion } from "../Accordion/Accordion";
import { gtmPush } from "../../google-tag-manager";
import { CoverageResult } from "../../types/APIDataTypes";
import { Heading } from "../Heading/Heading";
import "./ContentBox.scss";

type Box = {
  title?: ReactNode;
  headerExtra?: ReactNode;
  className?: string;
  headingLevel?: number;
  children: ReactNode;
};

// enforces title and headingLevel as jointly required (or both missing)
export type ContentBoxProps =
  | (Required<Pick<Box, "title" | "headingLevel">> &
      Omit<Box, "title" | "headingLevel">)
  | (Omit<Box, "title" | "headingLevel"> &
      Partial<Record<"title" | "headingLevel", never>>);

export const ContentBox: React.FC<ContentBoxProps> = ({
  title,
  headerExtra,
  className,
  headingLevel,
  children,
}) => {
  return (
    <div className={classNames("content-box", className)}>
      {(title || headerExtra) && (
        <div className="content-box__header">
          {title && (
            <div className="content-box__header-title">
              <Heading level={headingLevel}>{title}</Heading>
            </div>
          )}
          {headerExtra}
        </div>
      )}
      {children}
    </div>
  );
};

type Item = {
  title?: ReactNode;
  headingLevel?: number;
  subtitle?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  accordion?: boolean;
  open?: boolean;
  className?: string;
  gtmId?: string;
  coverageResult?: CoverageResult;
};

// enforces title and headingLevel as jointly required (or both missing)
export type ContentBoxItemProps =
  | (Required<Pick<Item, "title" | "headingLevel">> &
      Omit<Item, "title" | "headingLevel">)
  | (Omit<Item, "title" | "headingLevel"> &
      Partial<Record<"title" | "headingLevel", never>>);

export const ContentBoxItem: React.FC<ContentBoxItemProps> = ({
  title,
  subtitle,
  icon,
  accordion = true,
  open = false,
  className,
  children,
  gtmId,
  coverageResult,
  headingLevel,
}) => {
  const headerSection = (
    <>
      {icon}
      {(title || subtitle) && (
        <div className="content-box__section__header-container">
          {title && headingLevel && (
            <div className="content-box__section__header">
              <Heading level={headingLevel}>{title}</Heading>
            </div>
          )}
          {subtitle && (
            <div className="content-box__section__header-subtitle">
              {subtitle}
            </div>
          )}
        </div>
      )}
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
