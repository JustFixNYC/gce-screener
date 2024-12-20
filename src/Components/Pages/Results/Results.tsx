import { useEffect } from "react";
import { Link, useLoaderData, useSearchParams } from "react-router-dom";
import { Button, Icon } from "@justfixnyc/component-library";
// @ts-expect-error library is missing types
import html2pdf from "html2pdf.js/dist/html2pdf.bundle.min.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
import JFCLLinkInternal, { BackLink } from "../../JFCLLinkInternal";
import {
  GoodCauseExercisingRights,
  GoodCauseProtections,
  RentStabilizedProtections,
  UniversalProtections,
} from "../../KYRContent/KYRContent";
import { Header } from "../../Header/Header";
import "./Results.scss";
import { CheckPlusIcon } from "../../CheckPlusIcon";

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
          <div className="data__error">
            There was an error loading your results, please try again in a few
            minutes.
          </div>
        )}
        {isLoading && (
          <div className="data__loading">Loading your results...</div>
        )}

        {bldgData && <CriteriaTable criteria={criteriaDetails} />}
        <div className="protections-on-next-page__print">
          View tenant protection information on following pages
        </div>

        <Button
          labelText="Download result (jsPDF)"
          onClick={() => {
            const doc = new jsPDF({
              orientation: "portrait",
              unit: "px",
              format: "letter",
              putOnlyUsedFonts: true,
            });
            doc.html(document.body, {
              callback: function (doc) {
                doc.save();
              },
              autoPaging: "text", // Crucial for handling text flow across pages
              html2canvas: {
                allowTaint: true,
                letterRendering: true,
                logging: false,
              },
              width: 460,
              windowWidth: 1000,
            });
          }}
        />

        <Button
          labelText="Download result (html2pdf)"
          onClick={() => {
            const element = document.getElementById("body");
            const options = {
              margin: 1,
              filename: "my-document.pdf",
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            };

            html2pdf().set(options).from(element).save();
          }}
        />

        <Button
          labelText="Download result (html2canvas)"
          onClick={() => {
            html2canvas(document.body).then(function (canvas) {
              console.log(canvas.toDataURL());
            });
          }}
        />
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

          <div className="share-footer">
            <h3 className="share-footer__header">
              Help your neighbors learn if they’re covered{" "}
            </h3>
            <Button
              labelText="Copy the link to this website"
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
    <li className="eligibility__row">
      <EligibilityIcon {...props} />
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
