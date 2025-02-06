import React from "react";
import { Link, To } from "react-router-dom";
import { Icon } from "@justfixnyc/component-library";
import classNames from "classnames";

// Creating a version of React Router's Link component styled like our Component
// library's External Link.

type JFCLLinkExternalProps = {
  to: To;
  children: React.ReactNode;
  className?: string | undefined;
};

const JFCLLinkExternal: React.FC<JFCLLinkExternalProps> = (props) => (
  <Link
    to={props.to}
    className={classNames(props.className, "jfcl-link")}
    target="_blank"
    rel="noopener noreferrer"
  >
    {props.children}
    <span className="jfcl-link__icon-wrapper">
      &#xfeff;
      <Icon icon="squareArrowUpRight" className="jfcl-link__icon" />
    </span>
  </Link>
);

export default JFCLLinkExternal;
