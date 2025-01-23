import { ReactNode } from "react";
import "./ContentBox.scss";
import { Accordion } from "../Accordion/Accordion";
import classNames from "classnames";
import { Link, To } from "react-router-dom";

export type ContentBoxProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  children: ReactNode;
};

export const ContentBox: React.FC<ContentBoxProps> = ({
  title,
  subtitle,
  className,
  children,
}) => {
  return (
    <div className={classNames("content-box", className)}>
      {(title || subtitle) && (
        <div className="content-box__header">
          {title && <div className="content-box__header-title">{title}</div>}
          {subtitle && (
            <div className="content-box__header-subtitle">{subtitle}</div>
          )}
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

  return accordion ? (
    <Accordion summary={headerSection} className={containerClass} open={open}>
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
};

export const ContentBoxFooter: React.FC<ContentBoxFooterProps> = ({
  message,
  className,
  linkText,
  linkTo,
}) => {
  return (
    <div className={classNames("content-box__footer", className)}>
      <div className="content-box__footer__message">{message}</div>
      <div className="content-box__footer__link">
        <Link to={linkTo} className="jfcl-link">
          {linkText}
        </Link>
      </div>
    </div>
  );
};
