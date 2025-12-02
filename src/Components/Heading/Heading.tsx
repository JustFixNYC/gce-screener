import React, { HTMLAttributes } from "react";
import classNames from "classnames";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: "1" | "2" | "3" | "4" | "5" | "6";
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, className, level, ...props }, ref) => {
    const Tag: keyof JSX.IntrinsicElements = `h${level}`;
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
