import { Icon } from "@justfixnyc/component-library";
import "./InfoBox.scss";
import { ReactNode } from "react";
import classNames from "classnames";

type InfoBoxProps = {
  children: ReactNode;
  color?: "white" | "blue";
};

export const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  color = "white",
}) => (
  <div className={classNames("info-box", color)}>
    <div className="info-box__icon-container">
      <Icon icon="circleInfo" />
    </div>
    <div className="info-box__content-container">{children}</div>
  </div>
);
