import { ReactNode } from "react";
import classNames from "classnames";
import "./Pill.scss";

// Copied from Signature Dashboard - replace with JFCL once available.

export type PillColors =
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
};

export const Pill: React.FC<PillProps> = ({ color, children, className }) => (
  <div className={classNames(`pill pill-${color}`, className)}>{children}</div>
);
