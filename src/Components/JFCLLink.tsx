import React from "react";
import { Link, LinkProps, To } from "react-router-dom";
import { Icon, IconNames } from "@justfixnyc/component-library";
import classNames from "classnames";
import { useLingui } from "@lingui/react";
import { removeLocalePrefix } from "../i18n";

// Creating versions of React Router's Link component styled like our Component
// library's Link.

interface JFCLLinkProps extends LinkProps {
  icon?: IconNames;
}

export const JFCLLink: React.FC<JFCLLinkProps> = ({
  to,
  className,
  icon,
  children,
  ...props
}) => (
  <Link {...props} to={to} className={classNames(className, "jfcl-link")}>
    {children}
    {icon && (
      <span className="jfcl-link__icon-wrapper">
        &#xfeff;
        <Icon icon={icon} className="jfcl-link__icon" />
      </span>
    )}
  </Link>
);

export const JFCLLocaleLink: React.FC<JFCLLinkProps> = (props) => {
  const { i18n } = useLingui();

  let to: To;
  if (typeof props.to === "string") {
    to = props.to.startsWith("/")
      ? `/${i18n.locale}${removeLocalePrefix(props.to)}`
      : props.to;
  } else {
    to = {
      ...props.to,
      pathname: props.to.pathname?.startsWith("/")
        ? `/${i18n.locale}${removeLocalePrefix(props.to.pathname)}`
        : props.to.pathname,
    };
  }

  return <JFCLLink {...props} to={to} />;
};

export const JFCLLinkInternal: React.FC<Omit<JFCLLinkProps, "icon">> = (
  props
) => <JFCLLocaleLink icon="arrowRight" {...props} />;

export const JFCLLinkExternal: React.FC<Omit<JFCLLinkProps, "icon">> = (
  props
) => (
  <JFCLLink
    icon="squareArrowUpRight"
    target="_blank"
    rel="noopener noreferrer"
    {...props}
  />
);

export const BackLink: React.FC<JFCLLinkProps> = (props) => (
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
