import { useEffect, useRef } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { Button, Icon } from "@justfixnyc/component-library";

import { useGetBuildingData, useSendGceData } from "../../../api/hooks";
import {
  BuildingData,
  CoverageResult,
  CriteriaResults,
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
import JFCLLinkInternal from "../../JFCLLinkInternal";
import {
  GoodCauseExercisingRights,
  GoodCauseProtections,
  RentStabilizedProtections,
  UniversalProtections,
} from "../../KYRContent/KYRContent";
import { Header } from "../../Header/Header";
import { CheckPlusIcon } from "../../CheckPlusIcon";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import {
  closeAccordionsPrint,
  openAccordionsPrint,
  ProgressStep,
} from "../../../helpers";
import { ShareButtons } from "../../ShareButtons/ShareButtons";
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
  const [lastStepReached, setLastStepReached] =
    useSessionStorage<ProgressStep>("lastStepReached");
  useEffect(() => {
    if (!lastStepReached || lastStepReached < 2) {
      setLastStepReached(ProgressStep.Result);
    }
  }, [lastStepReached, setLastStepReached]);
  const headlineRef = useRef<HTMLSpanElement>(null);
  const EMAIL_SUBJECT = "Good Cause NYC | Your Coverage Result";
  const EMAIL_BODY = headlineRef?.current?.textContent;

  useEffect(() => {
    // save session state in params
    if (address && fields) {
      setSearchParams(
        {
          ...(!!user?.id && { user: JSON.stringify(user) }),
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
            <CoverageResultHeadline
              result={coverageResult}
              headlineRef={headlineRef}
            />
          ) : (
            "Loading your results..."
          )
        }
        address={address}
        lastStepReached={lastStepReached}
      >
        {error && (
          <div className="data__error">
            There was an error loading your results, please try again in a few
            minutes.
          </div>
        )}
        {isLoading && (
          <div className="data__loading">Loading your results...</div>
        )}

        {bldgData && coverageResult && (
          <ShareButtons
            buttonsInfo={[
              ["email", "Email coverage"],
              ["download", "Download coverage"],
              ["print", "Print coverage"],
            ]}
            emailSubject={EMAIL_SUBJECT}
            emailBody={EMAIL_BODY}
          />
        )}

        {bldgData && <CriteriaTable criteria={criteriaDetails} />}
        <div className="protections-on-next-page__print">
          View tenant protection information on following pages
        </div>
      </Header>

      <div className="content-section">
        <div className="content-section__content">
          {coverageResult === "UNKNOWN" && bldgData && criteriaDetails && (
            <EligibilityNextSteps
              bldgData={bldgData}
              criteriaDetails={criteriaDetails}
            />
          )}

          {coverageResult === "RENT_STABILIZED" && (
            <RentStabilizedProtections />
          )}
          {coverageResult === "UNKNOWN" && (
            <>
              <GoodCauseProtections subtitle="Protections you might have under Good Cause Eviction" />
            </>
          )}
          {coverageResult === "COVERED" && (
            <>
              <GoodCauseExercisingRights />
              <GoodCauseProtections />
            </>
          )}
          <UniversalProtections />

          <div className="share-footer">
            <h3 className="share-footer__header">
              Help your neighbors learn if they’re covered{" "}
            </h3>
            <Button
              labelText="Copy goodcausenyc.org"
              labelIcon="copy"
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
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
  rentStabilized: "Rent stabilization",
  certificateOfOccupancy: "Certificate of Occupancy",
};

const EligibilityIcon: React.FC<
  Pick<CriterionDetails, "criteria" | "determination">
> = ({ criteria, determination }) => {
  if (
    ["subsidy", "rentStabilized"].includes(criteria) &&
    determination === "INELIGIBLE"
  ) {
    return <CheckPlusIcon className="criteria-icon green" title="" />;
  } else if (determination === "ELIGIBLE") {
    return (
      <Icon
        icon="check"
        type="regular"
        className="criteria-icon green"
        title="Eligible"
      />
    );
  } else {
    return (
      <Icon
        icon="circleExclamation"
        type="regular"
        className={`criteria-icon ${
          determination === "INELIGIBLE" ? "orange" : "yellow"
        }`}
        title={determination === "INELIGIBLE" ? "Ineligible" : "Unsure"}
      />
    );
  }
};

const CriterionRow: React.FC<CriterionDetails> = (props) => {
  return (
    <li className="criteria-table__row">
      <EligibilityIcon {...props} />
      <div className="criteria-table__row__info">
        <span className="criteria-table__row__criteria">
          {CRITERIA_LABELS[props?.criteria]}
        </span>
        <span className="criteria-table__row__requirement">
          {props?.requirement}
        </span>
      </div>
      <div className="criteria-table__row__userValue">{props?.userValue}</div>
    </li>
  );
};

const CriteriaTable: React.FC<{
  criteria?: CriteriaDetails;
}> = ({ criteria }) => (
  <ContentBox className="criteria-table">
    <div className="criteria-table__header">
      <span className="criteria-table__header__title">
        How we determined your coverage
      </span>
      <p>
        Assessment of coverage is based on the publicly available data about
        your building and the information you’ve provided.
      </p>
    </div>
    <ul className="criteria-table__list">
      {criteria?.rent && <CriterionRow {...criteria.rent} />}
      {criteria?.rentStabilized && (
        <CriterionRow {...criteria.rentStabilized} />
      )}
      {criteria?.buildingClass && <CriterionRow {...criteria.buildingClass} />}
      {criteria?.certificateOfOccupancy && (
        <CriterionRow {...criteria.certificateOfOccupancy} />
      )}
      {criteria?.subsidy && <CriterionRow {...criteria.subsidy} />}
      {criteria?.portfolioSize && <CriterionRow {...criteria.portfolioSize} />}
    </ul>
    <ContentBoxFooter
      message="Need to update your information?"
      linkText="Back to survey"
      linkTo="/form"
      className="criteria-table__footer"
    />
  </ContentBox>
);

const EligibilityNextSteps: React.FC<{
  bldgData: BuildingData;
  criteriaDetails: CriteriaDetails;
}> = ({ bldgData, criteriaDetails }) => {
  const portfolioSizeUnknown =
    criteriaDetails?.portfolioSize?.determination === "UNKNOWN";
  const rentStabilizedUnknown =
    criteriaDetails?.rentStabilized?.determination === "UNKNOWN";
  const steps = [portfolioSizeUnknown, rentStabilizedUnknown].filter(
    Boolean
  ).length;
  const unsureIcon = (
    <Icon
      icon="circleExclamation"
      type="regular"
      className="criteria-icon yellow"
    />
  );
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
        {rentStabilizedUnknown && (
          <ContentBoxItem
            title="We need to know if your apartment is rent stabilized."
            icon={unsureIcon}
            className="next-step"
            open
          >
            <p>
              The Good Cause Eviction law only covers tenants whose apartments
              are not rent stabilized. You told us that you are unsure of your
              rent stabilized status.
            </p>
            <JFCLLinkInternal to="/rent_stabilization">
              Learn how to find out
            </JFCLLinkInternal>
          </ContentBoxItem>
        )}

        {portfolioSizeUnknown && (
          <ContentBoxItem
            title="We need to know if your landlord owns more than 10 units."
            icon={unsureIcon}
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
                  in our records. You can find out if your landlord might own
                  additional buildings that is not in our data.
                </p>
                <JFCLLinkInternal to="/portfolio_size">
                  Learn how to find out
                </JFCLLinkInternal>
              </>
            )}
          </ContentBoxItem>
        )}
        <ContentBoxFooter
          message="Update your coverage result"
          linkText="Back to survey"
          linkTo="/form"
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
  headlineRef: React.RefObject<HTMLSpanElement>;
}> = ({ result, headlineRef }) => {
  let headlineContent = <></>;
  switch (result) {
    case "UNKNOWN":
      headlineContent = (
        <>
          Your apartment{" "}
          <span className="coverage-pill yellow">might be covered</span> by Good
          Cause Eviction
        </>
      );
      break;
    case "NOT_COVERED":
      headlineContent = (
        <>
          Your apartment is likely{" "}
          <span className="coverage-pill orange">not covered</span> by Good
          Cause Eviction
        </>
      );
      break;
    case "RENT_STABILIZED":
      headlineContent = (
        <>
          Your apartment is protected by{" "}
          <span className="coverage-pill green">rent stabilization</span>, which
          provides stronger protections than Good Cause Eviction
        </>
      );
      break;
    case "COVERED":
      headlineContent = (
        <>
          Your apartment is likely{" "}
          <span className="coverage-pill green">covered</span> by Good Cause
          Eviction
        </>
      );
      break;
    case "NYCHA":
      headlineContent = (
        <>
          Your apartment is part of{" "}
          <span className="coverage-pill green">NYCHA</span>, which provides
          stronger protections than Good Cause Eviction
        </>
      );
      break;
  }
  return <span ref={headlineRef}>{headlineContent}</span>;
};
