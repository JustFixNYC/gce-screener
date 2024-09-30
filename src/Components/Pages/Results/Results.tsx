import { Icon } from "@justfixnyc/component-library";
import { useGetBuildingEligibilityInfo } from "../../../api/hooks";
import { FormFields } from "../../../App";
import {
  CriteriaEligibility,
  Determination,
  useEligibility,
} from "../../../hooks/eligibility";
import { Address } from "../Home/Home";
import "./Results.scss";
import { Link } from "react-router-dom";
import { getDetermination } from "../../../helpers";

const CRITERIA_LABELS = {
  portfolioSize: "Landlord portfolio size",
  buildingClass: "Type of building",
  rent: "Rent",
  subsidy: "Subsidy",
  rentRegulation: "Rent regulation",
  yearBuilt: "Year built",
};

const EligibilityIcon: React.FC<{ determination: Determination }> = ({
  determination,
}) => {
  switch (determination) {
    case "eligible":
      return <Icon icon="check" className={determination} />;
    case "ineligible":
      return <Icon icon="ban" className={determination} />;
    default:
      return <Icon icon="circleExclamation" className={determination} />;
  }
};

const CriteriaResult: React.FC<CriteriaEligibility> = (props) => (
  <div className="eligibility__row">
    <span className="eligibility__row__icon">
      {props?.determination && (
        <EligibilityIcon determination={props?.determination} />
      )}
    </span>

    <div className="eligibility__row__info">
      <span className="eligibility__row__criteria">
        {CRITERIA_LABELS[props?.criteria]}
      </span>
      <span className="eligibility__row__requirement">
        {props?.requirement}
      </span>
    </div>
    <span className="eligibility__row__userValue">{props?.userValue}</span>
    <span className="eligibility__row__moreInfo">More info</span>
  </div>
);

const CoveredPill: React.FC<{ determination: Determination }> = ({
  determination,
}) => {
  const className = `covered-pill covered-pill--${determination}`;

  if (determination === "eligible") {
    return <span className={className}>COVERED</span>;
  } else if (determination === "ineligible") {
    return <span className={className}>NOT COVERED</span>;
  } else {
    return <span className={className}>UNSURE</span>;
  }
};

type ResultsProps = {
  address?: Address;
  fields: FormFields;
};
export const Results: React.FC<ResultsProps> = ({ address, fields }) => {
  const bbl = address?.bbl || "3082320055";

  const { data: bldgData } = useGetBuildingEligibilityInfo(bbl);

  const eligibilityResults = useEligibility(fields, bldgData);

  const determination = getDetermination(eligibilityResults);

  return (
    <div className="eligibility__wrapper">
      <h2 className="eligibility__header">Eligibility</h2>
      <p className="eligibility__result">
        {determination === "unknown" && (
          <>
            We are <CoveredPill determination={determination} /> of if you are
            covered by Good Cause Eviction Law
          </>
        )}
        {determination === "eligible" && (
          <>
            You are <CoveredPill determination={determination} /> by Good Cause
            Eviction law
          </>
        )}
        {determination === "ineligible" && (
          <>
            You are <CoveredPill determination={determination} /> by Good Cause
            Eviction law
          </>
        )}
      </p>
      <p className="eligibility__subheader">
        To be eligible for coverage under the new Good Cause Eviction law, your
        living situation must meet all of the required criteria:
      </p>

      <div className="eligibility__table">
        <div className="eligibility__table__header">
          <div className="eligibility__table__header-requirement">
            REQUIREMENT
          </div>
          <div className="eligibility__table__header-yourhome">YOUR HOME</div>
        </div>

        {eligibilityResults?.rent && (
          <CriteriaResult {...eligibilityResults.rent} />
        )}
        {eligibilityResults?.rentRegulation && (
          <CriteriaResult {...eligibilityResults.rentRegulation} />
        )}
        {eligibilityResults?.buildingClass && (
          <CriteriaResult {...eligibilityResults.buildingClass} />
        )}
        {eligibilityResults?.yearBuilt && (
          <CriteriaResult {...eligibilityResults.yearBuilt} />
        )}
        {eligibilityResults?.subsidy && (
          <CriteriaResult {...eligibilityResults.subsidy} />
        )}
        {eligibilityResults?.portfolioSize && (
          <CriteriaResult {...eligibilityResults.portfolioSize} />
        )}

        <div className="eligibility__table__footer">
          Is something not quite right?
          <div className="eligibility__table__footer__link">
            <Icon icon="arrowLeft" />
            <Link to="/form">Back to Screener</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
