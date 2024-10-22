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
import { Link } from "react-router-dom";
import { getDetermination, splitBBL } from "../../../helpers";
import { LegalDisclaimer } from "../../LegalDisclaimer/LegalDisclaimer";

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
      return <Icon icon="check" className={determination} />;
    case "ineligible":
      return <Icon icon="ban" className={determination} />;
    default:
      return <Icon icon="circleExclamation" className="unknown" />;
  }
};

const CriteriaResult: React.FC<CriteriaEligibility> = (props) => {
  return (
    <div className="eligibility__row">
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
    </div>
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

type ResultsProps = {
  address?: Address;
  fields: FormFields;
};
export const Results: React.FC<ResultsProps> = ({ address, fields }) => {
  const bbl = address?.bbl || "3082320055";

  const { data: bldgData } = useGetBuildingEligibilityInfo(bbl);

  const eligibilityResults = useEligibility(fields, bldgData);

  const determination = getDetermination(eligibilityResults);

  const { boro, block, lot } = splitBBL(bbl);

  return (
    <>
      <div className="eligibility__wrapper">
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

        <div className="eligibility__footer">
          <h3 className="eligibility__footer__header">
            Help others understand their coverage
          </h3>
          <Button labelText="Share this screener" />
        </div>

        {bldgData?.acris_data && (
          <div className="eligibility__footer">
            <h3 className="eligibility__footer__header">
              Properties that appear with your own in joint
              mortgages/agreements:
            </h3>
            <a
              href={`http://a836-acris.nyc.gov/bblsearch/bblsearch.asp?borough=${boro}&block=${block}&lot=${lot}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              See all documents on ACRIS
            </a>
            {bldgData.acris_data.map((row, i) => (
              <div key={i}>
                <ul>
                  <li>bbl: {row.bbl}</li>
                  <li>apartments: {row.unitsres}</li>
                  <li>
                    <a
                      href={`https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentImageView?doc_id=${row.doc_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      See document on ACRIS
                    </a>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
      <LegalDisclaimer />
    </>
  );
};
