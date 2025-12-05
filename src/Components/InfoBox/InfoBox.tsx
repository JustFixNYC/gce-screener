import { AriaRole, ReactNode } from "react";
import classNames from "classnames";
import { Icon } from "@justfixnyc/component-library";
import "./InfoBox.scss";

type InfoBoxProps = {
  children: ReactNode;
  color?: "white" | "blue" | "orange";
  role?: AriaRole;
  className?: string;
};

export const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  color = "white",
  role,
  className,
}) => (
  <div className={classNames("info-box", color, className)} role={role}>
    <div className="info-box__icon-container">
      <Icon
        icon={color === "orange" ? "circleExclamation" : "circleInfo"}
        aria-hidden
      />
    </div>
    <div className="info-box__content-container">{children}</div>
  </div>
);
