import React from "react";
import { Icon } from "@justfixnyc/component-library";
import "./Accordion.scss";
import classNames from "classnames";

type AccordionProps = {
  summary: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  className?: string;
};
export const Accordion: React.FC<AccordionProps> = ({
  summary,
  children,
  open = false,
  className,
}) => (
  <details className={classNames("accordion", className)} open={open}>
    <summary className="accordion__summary">
      {summary}
      <Icon icon="chevronDown" className="accordion__chevron" />
    </summary>
    <div className="accordion__content">{children}</div>
  </details>
);
