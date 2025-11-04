import { ReactNode } from "react";
import classNames from "classnames";
import "./Pill.scss";

// Copied from Signature Dashboard - replace with JFCL once available.

export type PillColors =
  | "none"
  | "black"
  | "yellow"
  | "orange"
  | "grey"
  | "red"
  | "blue"
  | "green"
  | "pink";

type PillProps = {
  children: ReactNode;
  color: PillColors;
  className?: string;
  circle?: boolean;
};

export const Pill: React.FC<PillProps> = ({
  color,
  children,
  className,
  circle,
}) => (
  <div
    className={classNames(
      `pill pill__${color}`,
      circle && "pill__circle",
      className
    )}
  >
    {children}
  </div>
);
