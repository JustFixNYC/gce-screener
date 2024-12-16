import { ReactNode } from "react";
import "./ContentBox.scss";
import { Accordion } from "../Accordion/Accordion";
import classNames from "classnames";

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
      {title && (
        <div className="content-box__header">
          <div className="content-box__header-title">{title}</div>
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
  step?: number;
  icon?: ReactNode;
  children?: ReactNode;
  accordion?: boolean;
  open?: boolean;
  className?: string;
};

export const ContentBoxItem: React.FC<ContentBoxItemProps> = ({
  title,
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
  title: string;
  subtitle?: string;
  className?: string;
  link?: ReactNode;
};

export const ContentBoxFooter: React.FC<ContentBoxFooterProps> = ({
  title,
  subtitle,
  className,
  link,
}) => {
  return (
    <div className={classNames("content-box__footer", className)}>
      <div className="content-box__footer__title">{title}</div>
      <p className="content-box__footer__subtitle">{subtitle}</p>
      <div className="content-box__footer__link">{link}</div>
    </div>
  );
};
