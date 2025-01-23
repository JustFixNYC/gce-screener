import { useEffect, useRef, useState } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { Button, Icon, TextInput } from "@justfixnyc/component-library";
import { useRollbar } from "@rollbar/react";

import { useGetBuildingData, useSendGceData } from "../../../api/hooks";
import {
  BuildingData,
  CoverageResult,
  CriteriaResults,
  GCEUser,
} from "../../../types/APIDataTypes";
import { FormFields } from "../Form/Survey";
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
  NYCHAProtections,
  RentStabilizedProtections,
  UniversalProtections,
} from "../../KYRContent/KYRContent";
import { Header } from "../../Header/Header";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import {
  closeAccordionsPrint,
  openAccordionsPrint,
  ProgressStep,
} from "../../../helpers";
import { ShareButtons } from "../../ShareButtons/ShareButtons";
import "./Results.scss";
import classNames from "classnames";

export const Results: React.FC = () => {
  const { address, fields, user } = useLoaderData() as {
    address: Address;
    fields: FormFields;
    user?: GCEUser;
  };
  const [, setSearchParams] = useSearchParams();
  const { trigger } = useSendGceData();
  const rollbar = useRollbar();
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
      if (import.meta.env.MODE === "production") {
        try {
          trigger({
            id: user?.id,
            result_coverage: coverageResult,
            result_criteria: criteriaResults,
          });
        } catch {
          rollbar.error("Cannot connect to tenant platform");
        }
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
            <GoodCauseProtections
              subtitle="Protections you might have under Good Cause Eviction"
              rent={Number(fields.rent)}
            />
          )}
          {coverageResult === "COVERED" && (
            <>
              <GoodCauseExercisingRights
                shareButtons={
                  <ShareButtons
                    buttonsInfo={[
                      ["email", "Email coverage"],
                      ["download", "Download coverage"],
                      ["print", "Print coverage"],
                    ]}
                    emailSubject={EMAIL_SUBJECT}
                    emailBody={EMAIL_BODY}
                  />
                }
              />
              <PhoneNumberCallout />
              <GoodCauseProtections />
            </>
          )}
          {coverageResult === "NYCHA" && <NYCHAProtections />}
          <UniversalProtections />
          {!(coverageResult === "COVERED") && <PhoneNumberCallout />}
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
    return (
      <Icon
        icon="checkDouble"
        className="criteria-icon green"
        title="Stronger protections"
      />
    );
  } else if (determination === "ELIGIBLE") {
    return (
      <Icon icon="check" className="criteria-icon green" title="Eligible" />
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
      <div className="criteria-table__row__desktop">
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
      </div>
      <ContentBoxItem
        className="criteria-table__row__mobile"
        title={CRITERIA_LABELS[props?.criteria]}
        subtitle={props?.requirement}
        icon={<EligibilityIcon {...props} />}
      >
        <div className="callout-box">{props?.userValue}</div>
      </ContentBoxItem>
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
      linkTo="/survey"
      className="criteria-table__footer"
    />
  </ContentBox>
);

const EligibilityNextSteps: React.FC<{
  bldgData: BuildingData;
  criteriaDetails: CriteriaDetails;
}> = ({ bldgData, criteriaDetails }) => {
  const rentStabilizedUnknown =
    criteriaDetails?.rentStabilized?.determination === "UNKNOWN";
  const subsidyUnknown = criteriaDetails?.subsidy?.determination === "UNKNOWN";
  const portfolioSizeUnknown =
    criteriaDetails?.portfolioSize?.determination === "UNKNOWN";
  const steps = [
    rentStabilizedUnknown,
    subsidyUnknown,
    portfolioSizeUnknown,
  ].filter(Boolean).length;
  const isMobile = window.innerWidth < 599 ? "closed" : "open"; // same as mixin for-phone-only breakpoint
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
        subtitle={
          steps == 1
            ? "There is still one thing you need to verify"
            : `There are still ${steps} things you need to verify`
        }
      >
        {rentStabilizedUnknown && (
          <ContentBoxItem
            title="We need to know if your apartment is rent stabilized"
            icon={unsureIcon}
            className={classNames("next-step", isMobile)}
          >
            <p>
              The Good Cause Eviction law only covers tenants whose apartments
              are not rent stabilized. You told us that you are unsure of your
              rent stabilization status.
            </p>
            <br />
            <JFCLLinkInternal to="/rent_stabilization">
              Find out if you are rent stabilized
            </JFCLLinkInternal>
          </ContentBoxItem>
        )}

        {subsidyUnknown && (
          <ContentBoxItem
            title="We need to know if your apartment is part of NYCHA or subsidized housing"
            icon={unsureIcon}
            className={classNames("next-step", isMobile)}
          >
            <p>
              The Good Cause Eviction law only covers tenants whose apartments
              are not part of NYCHA or subsidized housing. You told us that that
              you are not sure if you live in subsidized or public housing, and
              there is no indication from public data that your building is
              public housing or subsidized.
            </p>
            <br />
            <p>
              To most accurately understand your apartment’s subsidy status, we
              recommend asking your landlord if your apartment is part of any
              subsidies.
            </p>
          </ContentBoxItem>
        )}

        {portfolioSizeUnknown && (
          <ContentBoxItem
            title="We need to know if your landlord owns more than 10 units"
            icon={unsureIcon}
            className={classNames("next-step", isMobile)}
          >
            <p>
              {`Good Cause Eviction law only covers tenants whose landlord owns
                more than 10 units. Your building has only ${bldgData.unitsres} apartments, but
                your landlord may own other buildings.`}
            </p>
            <br />

            <JFCLLinkInternal to="/portfolio_size">
              Find your landlord’s other buildings
            </JFCLLinkInternal>
          </ContentBoxItem>
        )}
        <ContentBoxFooter
          message="Update your coverage result"
          linkText="Back to survey"
          linkTo="/survey"
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

const PhoneNumberCallout: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showError, setShowError] = useState(false);
  const VALID_PHONE_NUMBER_LENGTH = 10;

  const { user } = useLoaderData() as {
    user?: GCEUser;
  };
  const { trigger } = useSendGceData();
  const rollbar = useRollbar();

  const formatPhoneNumber = (value: string): string => {
    // remove all non-digit characters
    const cleaned = value.replace(/\D/g, "");
    // limit to 10 characters
    const limited = cleaned.slice(0, 10);

    // format with parentheses and dashes e.g. (555) 666-7777
    const match = limited.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      const [, part1, part2, part3] = match;
      const formatted = [
        part1 ? `(${part1}` : "",
        part2 ? `) ${part2}` : "",
        part3 ? `-${part3}` : "",
      ]
        .join("")
        .trim();
      return formatted;
    }
    return value;
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = formatPhoneNumber(e.target.value);
    setPhoneNumber(value);
  };

  const handleSubmit = () => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length === VALID_PHONE_NUMBER_LENGTH) {
      try {
        trigger({
          id: user?.id,
          phone_number: parseInt(cleaned),
        });
        setShowError(false);
      } catch (error) {
        rollbar.critical("Cannot connect to tenant platform");
      }
    } else {
      setShowError(true);
    }
  };

  return (
    <div className="callout-box">
      <div className="callout-box__column">
        <span className="callout-box__header">
          Help build tenant power in NYC
        </span>
        <p>
          We’ll text you once a year to ask about your housing conditions. We’ll
          use that information to better advocate for your rights.
        </p>
      </div>
      <div className="callout-box__column">
        <div className="phone-number-input-container">
          <TextInput
            labelText="Phone number"
            invalid={showError}
            invalidText="Enter a valid phone number"
            id="phone-number-input"
            name="phone-number-input"
            value={phoneNumber}
            onChange={handleInputChange}
          />
          <Button
            className="phone-number-submit__desktop"
            labelText="Submit"
            variant="secondary"
            size="small"
            onClick={handleSubmit}
          />
        </div>
        <div className="phone-number-description">
          Your phone number will never be saved or used outside of this message
        </div>
        <div className="phone-number-submit__mobile">
          <Button
            labelText="Submit"
            variant="secondary"
            size="small"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};
