import { useEffect } from "react";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import { Button, Icon } from "@justfixnyc/component-library";

import { useGetBuildingData, useSendGceData } from "../../../api/hooks";
import {
  BuildingData,
  CoverageResult,
  CriteriaResults,
  CriterionResult,
  GCEUser,
} from "../../../types/APIDataTypes";
import { FormFields } from "../Form/Form";
import {
  CriterionDetails,
  CriteriaDetails,
  useCriteriaResults as useCriteriaDetails,
} from "../../../hooks/eligibility";
import { getCriteriaResults } from "../../../api/helpers";
import { Address } from "../Home/Home";
import {
  ContentBox,
  ContentBoxFooter,
  ContentBoxItem,
} from "../../ContentBox/ContentBox";
import JFCLLinkInternal, { BackLink } from "../../JFCLLinkInternal";
import {
  GoodCauseExercisingRights,
  GoodCauseProtections,
  RentStabilizedProtections,
  UniversalProtections,
} from "../../KYRContent/KYRContent";
import { Header } from "../../Header/Header";
import "./Results.scss";

export const Results: React.FC = () => {
  const { address, fields, user } = useLoaderData() as {
    address: Address;
    fields: FormFields;
    user?: GCEUser;
  };
  const [, setSearchParams] = useSearchParams();
  const { trigger } = useSendGceData();
  const bbl = address.bbl;
  const { data: bldgData, isLoading, error } = useGetBuildingData(bbl);
  const criteriaDetails = useCriteriaDetails(fields, bldgData);
  const criteriaResults = getCriteriaResults(criteriaDetails);
  const coverageResult = getCoverageResult(fields, criteriaResults);

  useEffect(() => {
    // save session state in params
    if (address && fields) {
      setSearchParams(
        {
          ...(!user && { user: JSON.stringify(user) }),
          address: JSON.stringify(address),
          fields: JSON.stringify(fields),
        },
        { replace: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (coverageResult && criteriaResults) {
      try {
        trigger({
          id: user?.id,
          result_coverage: coverageResult,
          result_criteria: criteriaResults,
        });
      } catch (error) {
        console.log({ "tenants2-error": error });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAccordionsPrint = () => {
    const accordions: NodeListOf<HTMLDetailsElement> =
      document.body.querySelectorAll("details:not([open])");
    accordions.forEach((e) => {
      e.setAttribute("open", "");
      e.dataset.wasclosed = "";
    });
  };

  const closeAccordionsPrint = () => {
    const accordions: NodeListOf<HTMLDetailsElement> =
      document.body.querySelectorAll("details[data-wasclosed]");
    accordions.forEach((e) => {
      e.removeAttribute("open");
      delete e.dataset.wasclosed;
    });
  };

  useEffect(() => {
    window.addEventListener("beforeprint", openAccordionsPrint);
    window.addEventListener("afterprint", closeAccordionsPrint);
    return () => {
      window.removeEventListener("beforeprint", openAccordionsPrint);
      window.removeEventListener("afterprint", closeAccordionsPrint);
    };
  }, []);

  return (
    <div id="results-page">
      <Header
        title={
          bldgData && coverageResult ? (
            <CoverageResultHeadline result={coverageResult} />
          ) : (
            "Loading your results..."
          )
        }
        address={address}
      >
        {error && (
          <div className="eligibility__error">
            There was an error loading your results, please try again in a few
            minutes.
          </div>
        )}
        {isLoading && (
          <div className="eligibility__loading">Loading your results...</div>
        )}

        <div className="eligibility__table__container">
          {bldgData && <CriteriaTable criteria={criteriaDetails} />}
        </div>
        <div className="protections-on-next-page__print">
          View tenant protection information on following pages
        </div>
      </Header>

      <div className="content-section">
        <div className="content-section__content">
          {coverageResult === "UNKNOWN" && bldgData && criteriaDetails && (
            <EligibilityNextSteps
              bldgData={bldgData}
              eligibilityResults={criteriaDetails}
            />
          )}

          {coverageResult === "RENT_STABILIZED" && (
            <RentStabilizedProtections />
          )}
          {coverageResult === "UNKNOWN" && (
            <>
              <GoodCauseProtections subtitle="Protections you might have under Good Cause Eviction" />
              <UniversalProtections />
            </>
          )}
          {coverageResult === "COVERED" && (
            <>
              <GoodCauseExercisingRights />
              <GoodCauseProtections />
            </>
          )}
          <UniversalProtections />

          <div className="eligibility__footer">
            <h3 className="eligibility__footer__header">
              Help others understand their coverage
            </h3>
            <Button
              labelText="Share this screener"
              labelIcon="squareArrowUpRight"
              className="disabled"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CRITERIA_LABELS = {
  portfolioSize: "Landlord portfolio size",
  buildingClass: "Type of building",
  rent: "Rent",
  subsidy: "Subsidy",
  rentRegulation: "Rent stabilization",
  certificateOfOccupancy: "Certificate of Occupancy",
};

const EligibilityIcon: React.FC<{ determination?: CriterionResult }> = ({
  determination,
}) => {
  switch (determination) {
    case "ELIGIBLE":
      return <Icon icon="check" className="eligible" title="Pass" />;
    default:
      return (
        <Icon
          icon="circleExclamation"
          type="regular"
          className="unknown"
          title="Unsure"
        />
      );
  }
};

const CriterionRow: React.FC<CriterionDetails> = (props) => {
  return (
    <li className="eligibility__row">
      <span className="eligibility__row__icon">
        {props.criteria === "rentRegulation" &&
        props.determination === "INELIGIBLE" ? (
          <EligibilityIcon determination={"UNKNOWN"} />
        ) : (
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
      <div className="eligibility__row__userValue">{props?.userValue}</div>
    </li>
  );
};

const CriteriaTable: React.FC<{
  criteria?: CriteriaDetails;
}> = ({ criteria }) => (
  <div className="eligibility__table">
    <div className="eligibility__table__header">
      <span className="eligibility__table__header__title">
        How we determined your coverage
      </span>
      <p>
        Assessment of coverage is based on the publicly available data about
        your building and the information you’ve provided.
      </p>
    </div>
    <ul className="eligibility__table__list">
      {criteria?.rent && <CriterionRow {...criteria.rent} />}
      {criteria?.rentRegulation && (
        <CriterionRow {...criteria.rentRegulation} />
      )}
      {criteria?.buildingClass && <CriterionRow {...criteria.buildingClass} />}
      {criteria?.certificateOfOccupancy && (
        <CriterionRow {...criteria.certificateOfOccupancy} />
      )}
      {criteria?.subsidy && <CriterionRow {...criteria.subsidy} />}
      {criteria?.portfolioSize && <CriterionRow {...criteria.portfolioSize} />}
    </ul>

    <div className="eligibility__table__footer">
      Is something not quite right?
      <div className="eligibility__table__footer__link">
        <Icon icon="arrowLeft" />
        <Link to="/form">Back to survey</Link>
      </div>
    </div>
  </div>
);

const EligibilityNextSteps: React.FC<{
  bldgData: BuildingData;
  eligibilityResults: CriteriaDetails;
}> = ({ bldgData, eligibilityResults }) => {
  const portfolioSizeUnknown =
    eligibilityResults?.portfolioSize?.determination === "UNKNOWN";
  const rentRegulationUnknown =
    eligibilityResults?.rentRegulation?.determination === "UNKNOWN";
  const steps = [portfolioSizeUnknown, rentRegulationUnknown].filter(
    Boolean
  ).length;
  return (
    <>
      <ContentBox
        title="What this means for you"
        subtitle={
          steps == 1
            ? "There is still one thing you need to verify"
            : `There are still ${steps} things you need to verify`
        }
      >
        {rentRegulationUnknown && (
          <ContentBoxItem
            title="We need to know if your apartment is rent stabilized."
            icon={
              <span className="eligibility__icon">
                <EligibilityIcon determination="UNKNOWN" />
              </span>
            }
            className="next-step"
            open
          >
            <p>
              The Good Cause Eviction law only covers tenants whose apartments
              are not rent regulated. You told us that you are unsure of your
              rent regulation status.
            </p>
            <JFCLLinkInternal to="/rent_stabilization">
              Learn how to find out
            </JFCLLinkInternal>
          </ContentBoxItem>
        )}

        {portfolioSizeUnknown && (
          <ContentBoxItem
            title="We need to know if your landlord owns more than 10 units."
            icon={
              <span className="eligibility__icon">
                <EligibilityIcon determination="UNKNOWN" />
              </span>
            }
            className="next-step"
            open
          >
            {bldgData.related_properties ? (
              <>
                <p>
                  {`Good Cause Eviction law only covers tenants whose landlord owns
                more than 10 units. Your building has only ${bldgData.unitsres} apartments, but
                your landlord may own other buildings.`}
                </p>

                <JFCLLinkInternal to="/portfolio_size">
                  Learn how to find out
                </JFCLLinkInternal>
              </>
            ) : (
              <>
                <p>
                  {`Good Cause Eviction law only covers tenants whose landlord owns
                more than 10 units. Your building has only ${bldgData.unitsres} apartments.`}
                </p>
                <br />
                <p>
                  We are unable to find other apartments your landlord might own
                  in our records.
                </p>
              </>
            )}
          </ContentBoxItem>
        )}
        <ContentBoxFooter
          title="Update your coverage result"
          subtitle="Adjust your survey answers and receive an updated coverage result"
          link={<BackLink to="/form">Back to survey</BackLink>}
        />
      </ContentBox>
      <div className="divider__print" />
    </>
  );
};

const getCoverageResult = (
  fields?: FormFields,
  criteriaResults?: CriteriaResults
): CoverageResult | undefined => {
  if (!fields || !criteriaResults) {
    return undefined;
  }

  const results = Object.values(criteriaResults);

  if (fields?.housingType === "NYCHA") {
    return "NYCHA";
  } else if (fields?.rentStabilized === "YES") {
    return "RENT_STABILIZED";
  } else if (results.includes("INELIGIBLE")) {
    return "NOT_COVERED";
  } else if (results.includes("UNKNOWN")) {
    return "UNKNOWN";
  } else {
    return "COVERED";
  }
};

const CoverageResultHeadline: React.FC<{
  result: CoverageResult;
}> = ({ result }) => {
  switch (result) {
    case "UNKNOWN":
      return (
        <span>
          Your apartment{" "}
          <span className="coverage-pill yellow">might be covered</span> by Good
          Cause Eviction
        </span>
      );
    case "NOT_COVERED":
      return (
        <span>
          Your apartment is likely{" "}
          <span className="coverage-pill orange">not covered</span> by Good
          Cause Eviction
        </span>
      );
    case "RENT_STABILIZED":
      return (
        <span>
          Your apartment is protected by{" "}
          <span className="coverage-pill green">rent stabilization</span>, which
          provides stronger protections than Good Cause Eviction
        </span>
      );
    case "COVERED":
      return (
        <span>
          Your apartment is likely{" "}
          <span className="coverage-pill green">covered</span> by Good Cause
          Eviction
        </span>
      );
    case "NYCHA":
      return (
        <span>
          Your apartment is part of{" "}
          <span className="coverage-pill green">NYCHA</span>, which provides
          stronger protections than Good Cause Eviction
        </span>
      );
  }
};
