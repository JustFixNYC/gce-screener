import { Link, useLocation } from "react-router-dom";
import { Icon } from "@justfixnyc/component-library";
import { Address } from "../Pages/Home/Home";
import { toTitleCase } from "../../helpers";
import "./BreadCrumbs.scss";

type Crumb = { path?: string; name?: string; active?: boolean };

type BreadCrumbs = {
  address?: Address;
};

export const BreadCrumbs: React.FC<BreadCrumbs> = ({ address }) => {
  const location = useLocation();
  const crumbs = makeBreadCrumbs(location.pathname, address);

  const crumbpath = crumbs.flatMap((crumb, index, array) => {
    const CrumbElement = crumb.active ? (
      <span key={index} className="breadCrumbs__crumb__active">
        {crumb.name}
      </span>
    ) : (
      <Link
        key={index}
        to={crumb.path ?? "/"}
        className="jfcl-link breadCrumbs__crumb"
      >
        {crumb.name}
      </Link>
    );

    if (index !== array.length - 1) {
      return [
        CrumbElement,
        <span key={index + "caret"} className="breadCrumbs__caret">
          <Icon icon="caretRight" />
        </span>,
      ];
    } else {
      return CrumbElement;
    }
  });
  return <div className="breadCrumbs">{crumbpath}</div>;
};

const makeBreadCrumbs = (pathname: string, address?: Address) => {
  const crumbs: Crumb[] = [
    { path: "/", name: "Home" },
    {
      path: "/confirm_address",
      name: breadCrumbAddress(address),
    },
    { path: "/form", name: "Survey" },
    { path: "/results", name: "Result" },
  ];

  if (["/portfolio_size", "/rent_stabilization"].includes(pathname)) {
    crumbs.push({ path: pathname, name: "Guide", active: true });
    return crumbs;
  } else {
    return crumbs.map((crumb) => {
      return { ...crumb, active: crumb.path == pathname };
    });
  }
};

function breadCrumbAddress(address?: Address, maxLength = 45) {
  if (!address) return "Your address";
  const addrShort = toTitleCase(
    `${address?.houseNumber} ${address?.streetName}`
  );
  return addrShort.length > maxLength
    ? `${addrShort.substring(0, maxLength)}\u2026`
    : addrShort;
}
