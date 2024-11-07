import { ReactNode } from "react";
import "./ContentBox.scss";

export type ContentBoxProps = {
  headerTitle?: ReactNode;
  headerSubtitle?: ReactNode;
  children: ReactNode;
};

export const ContentBox: React.FC<ContentBoxProps> = ({
  headerTitle,
  headerSubtitle,
  children,
}) => {
  //   const arrayChildren = Children.toArray(children);
  return (
    <div className="content-box">
      {headerTitle && (
        <div className="content-box__header">
          <div className="content-box__header-title">{headerTitle}</div>
          {headerSubtitle && (
            <div className="content-box__header-subtitle">{headerSubtitle}</div>
          )}
        </div>
      )}
      {/* {Children.map(arrayChildren, (child, index) => {})} */}
      {children}
    </div>
  );
};

export type ContentBoxItemProps = {
  title?: ReactNode;
  step?: number;
  icon?: ReactNode;
  children?: ReactNode;
};

export const ContentBoxItem: React.FC<ContentBoxItemProps> = ({
  title,
  step,
  icon,
  children,
}) => {
  return (
    <div className="content-box__section">
      {icon && <span className="eligibility__icon">{icon}</span>}
      {step && (
        <div className="content-box__section__step">{`step ${step}`}</div>
      )}
      {title && <div className="content-box__section__header">{title}</div>}
      {children}
    </div>
  );
};
