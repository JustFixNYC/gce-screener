import { ReactNode } from "react";
import "./ContentBox.scss";
import { Accordion } from "../Accordion/Accordion";

export type ContentBoxProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
};

export const ContentBox: React.FC<ContentBoxProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="content-box">
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
};

export const ContentBoxItem: React.FC<ContentBoxItemProps> = ({
  title,
  icon,
  accordion = true,
  open = false,
  children,
}) => {
  const headerSection = (
    <>
      {icon && <span className="eligibility__icon">{icon}</span>}
      {title && <div className="content-box__section__header">{title}</div>}
    </>
  );

  return accordion ? (
    <Accordion
      summary={headerSection}
      className="content-box__section"
      open={open}
    >
      {children}
    </Accordion>
  ) : (
    <div className="content-box__section">
      {headerSection}
      {children}
    </div>
  );
};
