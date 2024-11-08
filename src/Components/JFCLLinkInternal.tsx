import React from "react";
import { Link, To } from "react-router-dom";
import { Icon } from "@justfixnyc/component-library";
import classNames from "classnames";

// Creating a version of React Router's Link component styled like our Component
// library's Internal Link.

const JFCLLinkInternal: React.FC<{
  to: To;
  children: React.ReactNode;
  className?: string | undefined;
}> = (props) => {
  return (
    <Link to={props.to} className={classNames(props.className, "jfcl-link")}>
      {props.children} <Icon icon="arrowRight" className="jfcl-link__icon" />
    </Link>
  );
};

export default JFCLLinkInternal;
