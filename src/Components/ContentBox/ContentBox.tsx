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
  icon,
  accordion = true,
  open = false,
  className,
  children,
}) => {
  const headerSection = (
    <>
      {icon}
      {title && <div className="content-box__section__header">{title}</div>}
    </>
  );

  const containerClass = classNames("content-box__section", className);

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
