import { ReactNode } from "react";
import classNames from "classnames";
import { Icon } from "@justfixnyc/component-library";
import "./InfoBox.scss";

type InfoBoxProps = {
  children: ReactNode;
  color?: "white" | "blue" | "orange";
  role?: string;
};

export const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  color = "white",
  role,
}) => (
  <div className={classNames("info-box", color)}>
    <div className="info-box__icon-container">
      <Icon icon="circleInfo" />
    </div>
    <div className="info-box__content-container" role={role}>
      {children}
    </div>
  </div>
);
