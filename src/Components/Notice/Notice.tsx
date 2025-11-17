import React from "react";
import classNames from "classnames";
import { Icon, IconNames } from "@justfixnyc/component-library";

import "./Notice.scss";

interface NoticeProps {
  icon?: IconNames;
  color?: "yellow" | "green" | "off-white";
  header?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const Notice: React.FC<NoticeProps> = ({
  icon,
  color,
  header,
  children,
  className,
}) => {
  return (
    <div
      className={classNames("notice", color && `notice__${color}`, className)}
    >
      {icon && (
        <div className="notice__icon-container">
          <Icon icon={icon} />
        </div>
      )}
      <section className="notice__content-container">
        {header && <h3 className="notice__header">{header}</h3>}
        <div className="notice__body">{children}</div>
      </section>
    </div>
  );
};
