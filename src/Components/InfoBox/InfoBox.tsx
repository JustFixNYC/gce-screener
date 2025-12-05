import { ReactNode } from "react";
import classNames from "classnames";
import { Icon } from "@justfixnyc/component-library";
import "./InfoBox.scss";

type InfoBoxProps = {
  children: ReactNode;
  color?: "white" | "blue" | "orange";
  role?: string;
  className?: string;
  id?: string;
};

export const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  color = "white",
  role,
  className,
  id,
}) => (
  <div id={id} className={classNames("info-box", color, className)}>
    <div className="info-box__icon-container">
      <Icon icon={color === "orange" ? "circleExclamation" : "circleInfo"} />
    </div>
    <div className="info-box__content-container" role={role}>
      {children}
    </div>
  </div>
);
