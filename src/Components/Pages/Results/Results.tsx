import { Button, Icon } from "@justfixnyc/component-library";
import { useGetBuildingEligibilityInfo } from "../../../api/hooks";
import { FormFields } from "../../../App";
import {
  CriteriaEligibility,
  Determination,
  useEligibility,
} from "../../../hooks/eligibility";
import { Address } from "../Home/Home";
import "./Results.scss";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import { getDetermination } from "../../../helpers";
import { LegalDisclaimer } from "../../LegalDisclaimer/LegalDisclaimer";
import { useEffect } from "react";

const CRITERIA_LABELS = {
  portfolioSize: "Landlord portfolio size",
  buildingClass: "Type of building",
  rent: "Rent",
  subsidy: "Subsidy",
  rentRegulation: "Rent regulation",
  yearBuilt: "Year built",
};

const EligibilityIcon: React.FC<{ determination?: Determination }> = ({
  determination,
}) => {
  switch (determination) {
    case "eligible":
      return <Icon icon="check" className={determination} title="Pass" />;
    case "ineligible":
      return <Icon icon="ban" className={determination} title="Fail" />;
    default:
      return <Icon icon="circleExclamation" className="unknown" title="Unsure" />;
  }
};

const CriteriaResult: React.FC<CriteriaEligibility> = (props) => {
  return (
    <li className="eligibility__row">
      <span className="eligibility__row__icon">
        <EligibilityIcon determination={props?.determination} />
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
    </li>
  );
};
const CoveredPill: React.FC<{ determination: Determination }> = ({
  determination,
}) => {
  const className = `covered-pill covered-pill--${determination}`;

  if (determination === "eligible") {
    return <span className={className}>covered</span>;
  } else if (determination === "ineligible") {
    return <span className={className}>not covered</span>;
  } else {
    return <span className={className}>might be covered</span>;
  }
};

export const Results: React.FC = () => {
  const {address, fields} = useLoaderData() as {address: Address, fields: FormFields};
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    // save session state in params
    if (address && fields) {
      setSearchParams({ address: JSON.stringify(address), fields: JSON.stringify(fields) }, {replace: true});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bbl = address?.bbl || "3082320055";

  const { data: bldgData, isLoading, error } = useGetBuildingEligibilityInfo(bbl);

  const eligibilityResults = useEligibility(fields, bldgData);

  const determination = getDetermination(eligibilityResults);

  return (
    <>
      <div className="wrapper eligibility__wrapper">
        <div className="main-content">
          {error && (
            <div className="eligibility__error">
              There was an error loading your results, please try again in a few
              minutes.
            </div>
          )}
          {isLoading && (
            <div className="eligibility__loading">Loading your results...</div>
          )}
          {bldgData &&
            <>
              <h2 className="eligibility__result">
                {determination === "unknown" && (
                  <>
                    <span>
                      Your apartment <CoveredPill determination={determination} />
                    </span>
                    <span>by Good Cause Eviction Law</span>
                  </>
                )}
                {determination === "eligible" && (
                  <>
                    <span>
                      Your apartment is <CoveredPill determination={determination} />
                    </span>
                    <span>by Good Cause Eviction law</span>
                  </>
                )}
                {determination === "ineligible" && (
                  <>
                    <span>
                      Your apartment is <CoveredPill determination={determination} />{" "}
                    </span>
                    <span>by Good Cause Eviction law</span>
                  </>
                )}
              </h2>

              <div className="eligibility__table">
                <div className="eligibility__table__header">
                  <div className="eligibility__table__header-title">
                    COVERAGE RESULTS
                  </div>
                  {determination === "eligible" && (
                    <div className="eligibility__table__header-subtitle">
                      Your apartment meets all of the required criteria.
                    </div>
                  )}
                  {determination === "ineligible" && (
                    <div className="eligibility__table__header-subtitle">
                      Your apartment doesn’t meet all of the requirements.
                    </div>
                  )}
                  {determination === "unknown" && (
                    <div className="eligibility__table__header-subtitle">
                      There are still some things you need to verify.
                    </div>
                  )}
                </div>

                <ul className="eligibility__table__list">
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
                </ul>

                <div className="eligibility__table__footer">
                  Is something not quite right?
                  <div className="eligibility__table__footer__link">
                    <Icon icon="arrowLeft" />
                    <Link to="/form">Back to Screener</Link>
                  </div>
                </div>
              </div>

              <div className="eligibility__footer">
                <h3 className="eligibility__footer__header">
                  Help others understand their coverage
                </h3>
                <Button labelText="Share this screener" />
              </div>
            </>
          }
        </div>
        <LegalDisclaimer />
      </div>
    </>
  );
};
