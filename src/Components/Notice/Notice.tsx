import React from "react";
import classNames from "classnames";
import { Icon, IconNames } from "@justfixnyc/component-library";

import { Heading } from "../Heading/Heading";
import "./Notice.scss";

type NoticeAll = {
  icon?: IconNames;
  color?: "yellow" | "green" | "white" | "off-white-100" | "off-white-200";
  header?: React.ReactNode;
  headingLevel?: number;
  children?: React.ReactNode;
  className?: string;
};

// enforces title and headingLevel as jointly required (or both missing)
export type NoticeProps =
  | (Required<Pick<NoticeAll, "header" | "headingLevel">> &
      Omit<NoticeAll, "header" | "headingLevel">)
  | (Omit<NoticeAll, "header" | "headingLevel"> &
      Partial<Record<"header" | "headingLevel", never>>);

export const Notice: React.FC<NoticeProps> = ({
  icon,
  color,
  header,
  headingLevel,
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
        {header && (
          <Heading level={headingLevel} className="notice__header">
            {header}
          </Heading>
        )}
        <div className="notice__body">{children}</div>
      </section>
    </div>
  );
};
