import { Link } from "react-router-dom";
import { Icon } from "@justfixnyc/component-library";
import "./BreadCrumbs.scss";

interface BreadCrumbs {
  crumbs: { path?: string; name?: string }[];
}
export const BreadCrumbs: React.FC<BreadCrumbs> = ({ crumbs }) => {
  const crumbpath = crumbs.flatMap((crumb, index, array) => {
    if (index !== array.length - 1) {
      return [
        <Link
          key={index}
          to={crumb.path ?? "/"}
          className="jfcl-link breadCrumbs__crumb"
        >
          {crumb.name}
        </Link>,
        <span key={index + "caret"} className="breadCrumbs__caret">
          <Icon icon="caretRight" />
        </span>,
      ];
    }
    return (
      <span key={index} className="breadCrumbs__last-crumb">
        {crumb.name}
      </span>
    );
  });
  return <div className="breadCrumbs">{crumbpath}</div>;
};

export const BackToResults: React.FC = () => (
  <Link to="/results" className="jfcl-link back-to-results">
    <Icon icon="chevronLeft" className="jfcl-link__icon" />
    Back to coverage result
  </Link>
);
