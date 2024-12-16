import { useEffect } from "react";
import {
  Link,
  NavigateFunction,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Button, Icon } from "@justfixnyc/component-library";

import { useGetBuildingData, useSendGceData } from "../../../api/hooks";
import { BuildingData, GCEUser } from "../../../types/APIDataTypes";
import { FormFields } from "../Form/Form";
import {
  CriteriaEligibility,
  Determination,
  EligibilityResults,
  useEligibility,
} from "../../../hooks/eligibility";
import {
  determinationToCoverage,
  extractDeterminations,
} from "../../../api/helpers";
import { Address } from "../Home/Home";
import { getDetermination } from "../../../helpers";
import { ContentBox, ContentBoxItem } from "../../ContentBox/ContentBox";
import JFCLLinkInternal from "../../JFCLLinkInternal";
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
  const navigate = useNavigate();
  const { trigger } = useSendGceData();

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
    if (determination && eligibilityResults) {
      try {
        trigger({
          id: user?.id,
          result_coverage: determinationToCoverage(determination),
          result_criteria: extractDeterminations(eligibilityResults),
        });
      } catch (error) {
        console.log({ "tenants2-error": error });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bbl = address.bbl;

  const { data: bldgData, isLoading, error } = useGetBuildingData(bbl);

  const eligibilityResults = useEligibility(fields, bldgData);

  const determination = getDetermination(eligibilityResults);

  const isRentStabilized =
    eligibilityResults?.rentRegulation.determination === "INELIGIBLE";

  return (
    <div id="results-page">
      <Header
        title={
          bldgData && eligibilityResults ? (
            <EligibilityResultHeadline
              address={address?.address}
              determination={determination}
              eligibilityResults={eligibilityResults}
            />
          ) : (
            "Loading your results..."
          )
        }
        subtitle="We'll use your answers to help determine your coverage"
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
          {bldgData && (
            <EligibilityCriteriaTable eligibilityResults={eligibilityResults} />
          )}
        </div>

        {/* <div className="eligibility__table__container__print">
              <ContentBox title="Your results" subtitle="Coverage criteria">
                <EligibilityCriteriaTable
                  eligibilityResults={eligibilityResults}
                />
              </ContentBox>
            </div> */}
      </Header>

      {/* TODO: add to header if we need to keep this */}
      {/* <div className="headline-section__page-type__print">
            Good Cause Eviction Screener
          </div> */}

      <div className="content-section">
        <div className="content-section__content">
          {determination === "UNKNOWN" && bldgData && eligibilityResults && (
            <EligibilityNextSteps
              bldgData={bldgData}
              eligibilityResults={eligibilityResults}
              navigate={navigate}
            />
          )}

          {isRentStabilized && <RentStabilizedProtections />}
          {determination === "UNKNOWN" && (
            <>
              <GoodCauseProtections subtitle="Protections you might have under Good Cause Eviction law" />
              <UniversalProtections />
            </>
          )}
          {determination === "ELIGIBLE" && (
            <>
              <GoodCauseProtections />
              <GoodCauseExercisingRights />
            </>
          )}
          {determination === "INELIGIBLE" && !isRentStabilized && (
            <UniversalProtections />
          )}

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

const EligibilityIcon: React.FC<{ determination?: Determination }> = ({
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

const CriteriaResult: React.FC<CriteriaEligibility> = (props) => {
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

const CoveredPill: React.FC<{
  determination: Determination;
  className: string;
}> = ({ determination, className }) => {
  const longClassName = `${className} ${className}--${determination.toLowerCase()}`;

  if (determination === "ELIGIBLE") {
    return <span className={className}>covered</span>;
  } else if (determination === "INELIGIBLE") {
    return <span className={className}>not covered</span>;
  } else {
    return <span className={longClassName}>might be covered</span>;
  }
};

const EligibilityCriteriaTable: React.FC<{
  eligibilityResults: EligibilityResults | undefined;
}> = ({ eligibilityResults }) => (
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
      {eligibilityResults?.rent && (
        <CriteriaResult {...eligibilityResults.rent} />
      )}
      {eligibilityResults?.rentRegulation && (
        <CriteriaResult {...eligibilityResults.rentRegulation} />
      )}
      {eligibilityResults?.buildingClass && (
        <CriteriaResult {...eligibilityResults.buildingClass} />
      )}
      {eligibilityResults?.certificateOfOccupancy && (
        <CriteriaResult {...eligibilityResults.certificateOfOccupancy} />
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
);

const EligibilityNextSteps: React.FC<{
  bldgData: BuildingData;
  eligibilityResults: EligibilityResults;
  navigate: NavigateFunction;
}> = ({ bldgData, eligibilityResults, navigate }) => {
  const portfolioSizeUnknown =
    eligibilityResults?.portfolioSize?.determination === "UNKNOWN";
  const rentRegulationUnknown =
    eligibilityResults?.rentRegulation?.determination === "UNKNOWN";
  console.log([portfolioSizeUnknown, rentRegulationUnknown]);
  const steps = [portfolioSizeUnknown, rentRegulationUnknown].filter(
    Boolean
  ).length;
  return (
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
            The Good Cause Eviction law only covers tenants whose apartments are
            not rent regulated. You told us that you are unsure of your rent
            regulation status.
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

      <div className="content-box__footer">
        <div className="content-box__section__content">
          <div className="content-box__section__header">
            Have you learned new information about your apartment?
          </div>
          <Button
            labelText="Re-take the Screener Survey"
            labelIcon="arrowsRotateReverse"
            variant="secondary"
            onClick={() => {
              navigate("/form");
            }}
          />
        </div>
      </div>
    </ContentBox>
  );
};

const EligibilityResultHeadline: React.FC<{
  address: string;
  determination: Determination;
  eligibilityResults: EligibilityResults;
}> = ({ address, determination, eligibilityResults }) => {
  if (determination === "UNKNOWN") {
    return (
      <>
        <span className="eligibility__result">
          Your apartment{" "}
          <CoveredPill determination={determination} className="covered-pill" />
        </span>
        <span className="eligibility__result__print">
          {address}{" "}
          <CoveredPill
            determination={determination}
            className="covered-underline"
          />
        </span>
        <span>by Good Cause Eviction Law</span>
      </>
    );
  } else if (determination === "ELIGIBLE") {
    return (
      <>
        <span className="eligibility__result">
          Your apartment is{" "}
          <CoveredPill determination={determination} className="covered-pill" />
        </span>
        <span className="eligibility__result__print">
          {address} is{" "}
          <CoveredPill
            determination={determination}
            className="covered-underline"
          />
        </span>
        <span>by Good Cause Eviction law</span>
      </>
    );
  } else if (eligibilityResults.rentRegulation.determination === "INELIGIBLE") {
    return (
      <>
        <span className="eligibility__result">
          Your apartment is not covered by Good Cause Eviction law but{" "}
          <span className="covered-pill covered-pill--eligible">
            you’re protected
          </span>{" "}
          by rent stabilization laws
        </span>
        <span className="eligibility__result__print">
          {address} is not covered by Good Cause Eviction law but{" "}
          <span className="covered-underline covered-underline--eligible">
            you’re protected
          </span>{" "}
          by rent stabilization laws
        </span>
      </>
    );
  } else if (determination === "INELIGIBLE") {
    return (
      <>
        <span className="eligibility__result">
          Your apartment is{" "}
          <CoveredPill determination={determination} className="covered-pill" />{" "}
        </span>
        <span className="eligibility__result__print">
          {address} is{" "}
          <CoveredPill
            determination={determination}
            className="covered-underline"
          />
        </span>
        <span>by Good Cause Eviction law</span>
      </>
    );
  }
};
