import React from "react";
import { Link, To } from "react-router-dom";
import { Icon } from "@justfixnyc/component-library";
import classNames from "classnames";

// Creating a version of React Router's Link component styled like our Component
// library's Internal Link.

type JFCLLinkInternal = {
  to: To;
  children: React.ReactNode;
  className?: string | undefined;
  onClick?: () => void;
};

const JFCLLinkInternal: React.FC<JFCLLinkInternal> = (props) => (
  <Link
    to={props.to}
    className={classNames(props.className, "jfcl-link")}
    onClick={props.onClick}
  >
    {props.children} <Icon icon="arrowRight" className="jfcl-link__icon" />
  </Link>
);

export const BackLink: React.FC<JFCLLinkInternal> = (props) => (
  <Link
    to={props.to}
    onClick={props.onClick}
    className={classNames(props.className, "jfcl-link back-link")}
  >
    <Icon icon="chevronLeft" className="jfcl-link__icon" />
    {props.children}
  </Link>
);

export default JFCLLinkInternal;
