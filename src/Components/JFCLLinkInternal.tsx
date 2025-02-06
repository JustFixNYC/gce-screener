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
};

const JFCLLinkInternal: React.FC<JFCLLinkInternal> = (props) => (
  <Link to={props.to} className={classNames(props.className, "jfcl-link")}>
    {props.children}
    <span className="jfcl-link__icon-wrapper">
      &#xfeff;
      <Icon icon="arrowRight" className="jfcl-link__icon" />
    </span>
  </Link>
);

export const BackLink: React.FC<JFCLLinkInternal> = (props) => (
  <Link
    to={props.to}
    className={classNames(props.className, "jfcl-link back-link")}
  >
    <span className="jfcl-link__icon-wrapper">
      &#xfeff;
      <Icon icon="arrowLeft" className="jfcl-link__icon" />
    </span>
    {props.children}
  </Link>
);

export default JFCLLinkInternal;
