import React, { HTMLAttributes } from "react";
import classNames from "classnames";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type Int = number;

function isInteger(value: number): value is Int {
  return Number.isInteger(value);
}

function isHeadingLevel(value: number): value is HeadingLevel {
  return [1, 2, 3, 4, 5, 6].includes(value);
}

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: Int;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, className, level, ...props }, ref) => {
    if (!isInteger(level)) {
      console.error("Heading level must be integer");
    }

    const Tag: keyof JSX.IntrinsicElements = isHeadingLevel(level)
      ? `h${level}`
      : "span";

    const classes = classNames(
      "jfcl-heading",
      `jfcl-heading--h${level}`,
      className
    );

    return (
      <Tag {...props} className={classes} ref={ref}>
        {children}
      </Tag>
    );
  }
);
