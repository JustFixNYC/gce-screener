import { Link } from "react-router-dom";
import { Icon } from "@justfixnyc/component-library";
import "./BreadCrumbs.scss";
import { Address } from "../Pages/Home/Home";
import { toTitleCase } from "../../helpers";

interface BreadCrumbs {
  crumbs: { path?: string; name?: string; active?: boolean }[];
}
export const BreadCrumbs: React.FC<BreadCrumbs> = ({ crumbs }) => {
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

export function breadCrumbAddress(address?: Address, maxLength = 45) {
  if (!address) return "Your address";
  const addrShort = toTitleCase(
    `${address?.houseNumber} ${address?.streetName}`
  );
  return addrShort.length > maxLength
    ? `${addrShort.substring(0, maxLength)}\u2026`
    : addrShort;
}
