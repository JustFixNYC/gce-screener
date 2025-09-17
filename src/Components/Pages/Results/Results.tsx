import { useEffect, useRef, useState } from "react";
import { useLoaderData, useLocation, useSearchParams } from "react-router-dom";
import { Button, Icon } from "@justfixnyc/component-library";
import { useRollbar } from "@rollbar/react";
import { Trans } from "@lingui/react/macro";
import { msg, plural } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";

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
} from "../../../hooks/useCriteriaResults";
import {
  cleanAddressFields,
  cleanFormFields,
  getCriteriaResults,
} from "../../../api/helpers";
import { Address } from "../Home/Home";
import {
  ContentBox,
  ContentBoxFooter,
  ContentBoxItem,
} from "../../ContentBox/ContentBox";
import {
  GoodCauseExercisingRights,
  GoodCauseProtections,
  NYCHAProtections,
  RentStabilizedProtections,
  SubsidizedProtections,
  UniversalProtections,
  UnknownProtections,
} from "../../KYRContent/KYRContent";
import { Header } from "../../Header/Header";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import {
  getCookie,
  ProgressStep,
  setCookie,
  toTitleCase,
} from "../../../helpers";
import { ShareButtons } from "../../ShareButtons/ShareButtons";
import "./Results.scss";
import { useAccordionsOpenForPrint } from "../../../hooks/useAccordionsOpenForPrint";
import { useSearchParamsURL } from "../../../hooks/useSearchParamsURL";
import { JFCLLinkInternal } from "../../JFCLLink";
import { gtmPush } from "../../../google-tag-manager";
import {
  PhoneNumberCallout,
  PhoneNumberModal,
} from "../../PhoneNumberCallout/PhoneNumberCallout";

export const Results: React.FC = () => {
  const { _ } = useLingui();
  const { address, fields, user } = useLoaderData() as {
    address: Address;
    fields: FormFields;
    user?: GCEUser;
  };
  const [, setUser] = useSessionStorage<GCEUser>("user");
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const [, setSearchParams] = useSearchParams();
  const { trigger } = useSendGceData();
  const rollbar = useRollbar();
  const bbl = address.bbl;
  const { data: bldgData, isLoading, error } = useGetBuildingData(bbl);
  const criteriaDetails = useCriteriaDetails(fields, searchParams, bldgData);
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
  const { emailSubject, emailBody } = getEmailSubjectBody(
    address,
    searchParams,
    coverageResult
  );
  const EMAIL_SUBJECT = `${address.address}`;
  const EMAIL_BODY = headlineRef?.current?.textContent;

  useAccordionsOpenForPrint();
  useSearchParamsURL(setSearchParams, address, fields, user);

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [hasShownPhoneModal, setHasShownPhoneModal] = useState(false);

  useEffect(() => {
    if (hasShownPhoneModal || getCookie("phone_modal_shown")) return;
    const contentSection = document.querySelector(".content-section__content");
    if (!contentSection) return;
    // Checks if user has scrolled down at least a bit before showing modal
    // Without this, the modal renders on page load
    const hasScrolled = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      return scrollY > 100; // user has scrolled down at least 100px
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasScrolled()) {
            setShowPhoneModal(true);
            setHasShownPhoneModal(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.15, // Trigger when 15% of the element is visible
      }
    );

    observer.observe(contentSection);

    return () => observer.disconnect();
  }, [hasShownPhoneModal]);

  // When modal closes, set cookie
  const handlePhoneModalClose = () => {
    setShowPhoneModal(false);
    setCookie("phone_modal_shown", "1");
  };

  const resultDataReady = !!coverageResult && !!criteriaResults?.building_class;
  useEffect(() => {
    if (!resultDataReady) return;
    try {
      const sendData = async () => {
        const postData = {
          id: user?.id,
          ...cleanAddressFields(address),
          nycdb_results: bldgData,
          form_answers: cleanFormFields(fields),
          result_coverage: coverageResult,
          result_criteria: criteriaResults,
        };
        const userResp = (await trigger(postData)) as GCEUser;
        if (!user?.id) setUser(userResp);
      };
      sendData();
    } catch {
      rollbar.error("Cannot connect to tenant platform");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultDataReady]);

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
            <Trans>Loading your results...</Trans>
          )
        }
        address={address}
        lastStepReached={lastStepReached}
      >
        {error && (
          <div className="data__error">
            <Trans>
              There was an error loading your results, please try again in a few
              minutes.
            </Trans>
          </div>
        )}
        {isLoading && (
          <div className="data__loading">
            <Trans>Loading your results...</Trans>
          </div>
        )}

        {bldgData && coverageResult && (
          <ShareButtons
            buttonsInfo={[
              ["email", _(msg`Email coverage`)],
              ["download", _(msg`Download coverage`)],
              ["print", _(msg`Print coverage`)],
            ]}
            emailSubject={emailSubject}
            emailBody={emailBody}
          />
        )}

        {bldgData && <CriteriaTable criteria={criteriaDetails} />}
        <div className="protections-on-next-page__print">
          <Trans>View tenant protection information on following pages</Trans>
        </div>
      </Header>
      <PhoneNumberModal
        coverageResult={coverageResult}
        gtmId="results-page-modal"
        modalIsOpen={showPhoneModal}
        modalOnClose={handlePhoneModalClose}
      />
      <div className="content-section">
        <div className="content-section__content">
          {coverageResult === "UNKNOWN" && bldgData && criteriaDetails && (
            <>
              <EligibilityNextSteps
                bldgData={bldgData}
                criteriaDetails={criteriaDetails}
                searchParams={searchParams}
              />
              <UnknownProtections
                className="unknown-protections"
                coverageResult={coverageResult}
              />
            </>
          )}
          {coverageResult === "SUBSIDIZED" && (
            <SubsidizedProtections
              lngLat={address.longLat}
              coverageResult={coverageResult}
              className="subsidized-protections"
            />
          )}
          {coverageResult === "RENT_STABILIZED" && (
            <RentStabilizedProtections coverageResult={coverageResult} />
          )}
          {coverageResult === "COVERED" && (
            <>
              <GoodCauseProtections rent={Number(fields.rent)} />
              <GoodCauseExercisingRights
                coverageResult={coverageResult}
                shareButtons={
                  <ShareButtons
                    buttonsInfo={[
                      ["email", _(msg`Email coverage`)],
                      ["download", _(msg`Download coverage`)],
                      ["print", _(msg`Print coverage`)],
                    ]}
                    emailSubject={EMAIL_SUBJECT}
                    emailBody={EMAIL_BODY}
                  />
                }
              />
            </>
          )}
          {coverageResult === "NYCHA" && (
            <NYCHAProtections coverageResult={coverageResult} />
          )}
          {coverageResult !== "UNKNOWN" && coverageResult !== "NOT_COVERED" && (
            <UniversalProtections coverageResult={coverageResult} />
          )}
          {coverageResult === "NOT_COVERED" && (
            <UniversalProtections
              coverageResult={coverageResult}
              subtitle={_(
                msg`Even though you may not be covered by Good Cause Eviction, all NYC tenants are guaranteed the following rights`
              )}
            />
          )}
          <PhoneNumberCallout
            coverageResult={coverageResult}
            gtmId="results-page"
          />
          <div className="share-footer">
            <h3 className="share-footer__header">
              <Trans>Share this site with your neighbors</Trans>
            </h3>
            <CopyURLButton />
          </div>
        </div>
      </div>
    </div>
  );
};

const CRITERIA_LABELS = {
  portfolioSize: msg`Landlord portfolio size`,
  buildingClass: msg`Type of building`,
  landlord: msg`Live-in landlord`,
  rent: msg`Rent Amount`,
  subsidy: msg`Subsidized housing`,
  rentStabilized: msg`Rent stabilization`,
  certificateOfOccupancy: msg`Certificate of occupancy`,
};

const EligibilityIcon: React.FC<Pick<CriterionDetails, "determination">> = ({
  determination,
}) => {
  const { _ } = useLingui();
  switch (determination) {
    case "OTHER_PROTECTION":
      return (
        <Icon
          icon="checkDouble"
          className="criteria-icon green"
          title={_(msg`Stronger protections`)}
        />
      );
    case "ELIGIBLE":
      return (
        <Icon
          icon="check"
          className="criteria-icon green"
          title={_(msg`Eligible`)}
        />
      );
    case "INELIGIBLE":
      return (
        <Icon
          icon="circleExclamation"
          type="regular"
          className="criteria-icon orange"
          title={_(msg`Ineligible`)}
        />
      );
    case "UNKNOWN":
      return (
        <Icon
          icon="circleExclamation"
          type="regular"
          className="criteria-icon yellow"
          title={_(msg`Unknown`)}
        />
      );
    default:
      break;
  }
};

const CriterionRow: React.FC<CriterionDetails> = (props) => {
  const { _ } = useLingui();
  return (
    <li className="criteria-table__row">
      <div className="criteria-table__row__desktop">
        <EligibilityIcon {...props} />
        <div className="criteria-table__row__info">
          <span className="criteria-table__row__criteria">
            {_(CRITERIA_LABELS[props?.criteria])}
          </span>
          <span className="criteria-table__row__requirement">
            {props?.requirement}
          </span>
        </div>
        <div className="criteria-table__row__userValue">{props?.userValue}</div>
      </div>
      <ContentBoxItem
        className="criteria-table__row__mobile"
        title={_(CRITERIA_LABELS[props?.criteria])}
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
}> = ({ criteria }) => {
  const { _, i18n } = useLingui();
  return (
    <ContentBox className="criteria-table">
      <div className="criteria-table__header">
        <span className="criteria-table__header__title">
          <Trans>How we determined your coverage</Trans>
        </span>
        <p>
          <Trans>
            Results are based on publicly available data about your building and
            the answers you provided. This does not constitute legal advice.
          </Trans>
        </p>
      </div>
      <ul className="criteria-table__list">
        {criteria?.rent && <CriterionRow {...criteria.rent} />}
        {criteria?.rentStabilized && (
          <CriterionRow {...criteria.rentStabilized} />
        )}
        {criteria?.buildingClass && (
          <CriterionRow {...criteria.buildingClass} />
        )}
        {criteria?.certificateOfOccupancy && (
          <CriterionRow {...criteria.certificateOfOccupancy} />
        )}
        {criteria?.subsidy && <CriterionRow {...criteria.subsidy} />}
        {criteria?.landlord && <CriterionRow {...criteria.landlord} />}
        {criteria?.portfolioSize && (
          <CriterionRow {...criteria.portfolioSize} />
        )}
      </ul>
      <ContentBoxFooter
        message={_(msg`Need to update your information?`)}
        linkText={_(msg`Back to survey`)}
        linkTo={`/${i18n.locale}/survey`}
        linkOnClick={() =>
          gtmPush("gce_return_survey", { from: "results-page_criteria-table" })
        }
        className="criteria-table__footer"
      />
    </ContentBox>
  );
};

const EligibilityNextSteps: React.FC<{
  bldgData: BuildingData;
  criteriaDetails: CriteriaDetails;
  searchParams: URLSearchParams;
}> = ({ bldgData, criteriaDetails, searchParams }) => {
  const { _, i18n } = useLingui();
  const rentStabilizedUnknown =
    criteriaDetails?.rentStabilized?.determination === "UNKNOWN";
  const portfolioSizeUnknown =
    criteriaDetails?.portfolioSize?.determination === "UNKNOWN";
  const steps = [rentStabilizedUnknown, portfolioSizeUnknown].filter(
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
        subtitle={_(
          msg`There ${plural(steps, {
            one: "is # thing",
            other: "are # things",
          })} you need to verify to confirm your coverage`
        )}
      >
        {rentStabilizedUnknown && (
          <ContentBoxItem
            title={_(
              msg`We need to confirm if your apartment is rent stabilized`
            )}
            icon={unsureIcon}
            className="next-step"
            gtmId="next-step_rs"
          >
            <p>
              <Trans>
                You told us that you are unsure if you are rent stabilized. If
                your apartment is rent stabilized, you are not covered by Good
                Cause Eviction law, but rent stabilized protections are even
                stronger than the Good Cause Eviction law.
              </Trans>
            </p>
            <JFCLLinkInternal
              to={`/${
                i18n.locale
              }/rent_stabilization?${searchParams.toString()}`}
            >
              <Trans>Find out if your apartment is rent stabilized</Trans>
            </JFCLLinkInternal>
          </ContentBoxItem>
        )}

        {portfolioSizeUnknown && (
          <ContentBoxItem
            title={_(
              msg`We need to confirm if your landlord owns more than 10 apartments`
            )}
            icon={unsureIcon}
            className="next-step"
            gtmId="next-step_portfolio"
          >
            <p>
              <Trans>
                Good Cause Eviction law only covers tenants whose landlord owns
                more than 10 apartments. Your building has only{" "}
                {bldgData.unitsres} apartments, but your landlord may own other
                buildings.
              </Trans>
            </p>
            <JFCLLinkInternal
              to={`/${i18n.locale}/portfolio_size?${searchParams.toString()}`}
            >
              <Trans>Find other buildings your landlord owns</Trans>
            </JFCLLinkInternal>
          </ContentBoxItem>
        )}

        <ContentBoxFooter
          message={_(msg`Have you learned something new?`)}
          linkText={_(msg`Adjust survey answers`)}
          linkTo={`${i18n.locale}/survey`}
          linkOnClick={() =>
            gtmPush("gce_return_survey", { from: "results-page_next-steps" })
          }
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
  } else if (fields?.housingType?.includes("SUBSIDIZED")) {
    return "SUBSIDIZED";
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
        <Trans>
          <span className="result-headline__top">You</span>{" "}
          <span className="coverage-pill yellow">might be covered</span> by Good
          Cause Eviction
        </Trans>
      );
      break;
    case "NOT_COVERED":
      headlineContent = (
        <Trans>
          <span className="result-headline__top">You are</span>{" "}
          <span className="coverage-pill orange">likely not covered</span>{" "}
          <br />
          by Good Cause Eviction
        </Trans>
      );
      break;
    case "RENT_STABILIZED":
      headlineContent = (
        <Trans>
          <span className="result-headline__top">Your apartment is</span>{" "}
          <span className="coverage-pill green">rent stabilized</span> which
          provides stronger protections than Good Cause Eviction
        </Trans>
      );
      break;
    case "COVERED":
      headlineContent = (
        <Trans>
          <span className="result-headline__top">You are</span>{" "}
          <span className="coverage-pill green">likely covered</span> by Good
          Cause Eviction
        </Trans>
      );
      break;
    case "NYCHA":
      headlineContent = (
        <Trans>
          <span className="result-headline__top">
            Your apartment is part of
          </span>{" "}
          <span className="coverage-pill green">NYCHA or PACT/RAD</span> which
          provides stronger protections than Good Cause Eviction
        </Trans>
      );
      break;
    case "SUBSIDIZED":
      headlineContent = (
        <Trans>
          <span className="result-headline__top">Your building is</span>{" "}
          <span className="coverage-pill green">subsidized</span> which provides
          existing eviction protections
        </Trans>
      );
      break;
  }
  return (
    <span className="result-headline" ref={headlineRef}>
      {headlineContent}
    </span>
  );
};

const CopyURLButton: React.FC = () => {
  const { _ } = useLingui();
  const successDuration = 3000;
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(window.location.origin);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, successDuration);
    gtmPush("gce_copy_url");
  };

  return (
    <>
      <Button
        className="copy-url-button"
        labelText={_(msg`Copy goodcausenyc.org`)}
        labelIcon="copy"
        onClick={handleClick}
        size="small"
      />
      {showSuccess && (
        <div className="success-message">
          <Icon icon="check" />
          <Trans>Copied</Trans>
        </div>
      )}
    </>
  );
};

// TODO: translate results email copy
const getEmailSubjectBody = (
  address: Address,
  searchParams: URLSearchParams,
  coverageResult?: CoverageResult
) => {
  const addrShort = `${toTitleCase(
    `${address?.houseNumber || ""} ${address?.streetName}`
  )}, ${toTitleCase(address.borough)}`;
  const aptCoverage =
    coverageResult &&
    ["NOT_COVERED", "RENT_STABILIZED"].includes(coverageResult);
  const encodedSearchParams = searchParams.toString().replace("&", "%26");
  const emailSubject =
    coverageResult === "COVERED"
      ? `${addrShort} is likely covered by Good Cause.`
      : coverageResult === "NOT_COVERED"
      ? "My apartment is likely not covered by Good Cause."
      : coverageResult === "NYCHA"
      ? `${addrShort} is part of NYCHA or PACT/RAD, which provides stronger protections than Good Cause.`
      : coverageResult === "RENT_STABILIZED"
      ? "My apartment’s rent stabilization status provides stronger eviction protections than Good Cause."
      : coverageResult === "SUBSIDIZED"
      ? `${addrShort} is subsidized, which provides existing eviction protections.`
      : `${addrShort} might be covered by Good Cause.`;
  const rentStabilizedAddition =
    coverageResult === "RENT_STABILIZED"
      ? "Learn more about rent stabilization %0D%0A" +
        `${window.location.origin}/rent_stabilization?${encodedSearchParams}`
      : "";
  const emailBody =
    "I used the Good Cause NYC screener, to see if my building is covered by the new Good Cause Eviction law in New York.%0D%0A%0D%0A" +
    "Based on publicly available data about the building, and information I provided, " +
    `${
      emailSubject.charAt(0).toLowerCase() + emailSubject.slice(1)
    }%0D%0A%0D%0A` +
    `See coverage details for ${
      aptCoverage ? "my apartment at " : ""
    }${addrShort} %0D%0A` +
    `${window.location.origin}${window.location.pathname}?${encodedSearchParams} %0D%0A%0D%0A` +
    "Find out if you’re covered by Good Cause %0D%0A" +
    `${window.location.origin} %0D%0A%0D%0A` +
    "Learn more about Good Cause Eviction %0D%0A" +
    "https://www.nyc.gov/site/hpd/services-and-information/good-cause-eviction.page %0D%0A%0D%0A" +
    rentStabilizedAddition;

  return { emailSubject, emailBody };
};
