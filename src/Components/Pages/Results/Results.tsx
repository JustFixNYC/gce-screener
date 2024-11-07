import {
  Link,
  NavigateFunction,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Button, Icon } from "@justfixnyc/component-library";
import classNames from "classnames";

import { useGetBuildingEligibilityInfo } from "../../../api/hooks";
import { FormFields } from "../../../App";
import {
  CriteriaEligibility,
  Determination,
  EligibilityResults,
  useEligibility,
} from "../../../hooks/eligibility";
import { Address } from "../Home/Home";
import { getDetermination } from "../../../helpers";
import { LegalDisclaimer } from "../../LegalDisclaimer/LegalDisclaimer";
import { useEffect, useState } from "react";
import { ContentBox } from "../../ContentBox/ContentBox";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import JFCLLinkExternal from "../../JFCLLinkExternal";
import JFCLLinkInternal from "../../JFCLLinkInternal";
import "./Results.scss";

const CRITERIA_LABELS = {
  portfolioSize: "Landlord portfolio size",
  buildingClass: "Type of building",
  rent: "Rent",
  subsidy: "Subsidy",
  rentRegulation: "Rent stabilization",
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
        props.determination === "ineligible" ? (
          <EligibilityIcon determination={"unknown"} />
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
      <span className="eligibility__row__userValue">{props?.userValue}</span>
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

const EligibilityNextSteps: React.FC<{
  eligibilityResults: EligibilityResults | undefined;
  navigate: NavigateFunction;
}> = ({ eligibilityResults, navigate }) => {
  return (
    <ContentBox
      headerTitle="What this means for you"
      headerSubtitle="There are still some things you need to verify"
    >
      {eligibilityResults?.rentRegulation.determination === "unknown" && (
        <div className="content-box__section">
          <span className="eligibility__icon">
            <EligibilityIcon determination="unknown" />
          </span>
          <div className="content-box__section__content">
            <div className="content-box__section__header">
              We need to know if your apartment is rent stabilized.
            </div>
            <p>
              The Good Cause Eviction law only covers tenants whose apartments
              are not rent regulated. You told us that you are unsure of your
              rent regulation status.
            </p>
            <JFCLLinkInternal href="/rent_stabilization">
              Lean how to find out
            </JFCLLinkInternal>
          </div>
        </div>
      )}

      {eligibilityResults &&
        eligibilityResults.portfolioSize &&
        eligibilityResults?.portfolioSize.determination === "unknown" && (
          <div className="content-box__section">
            <span className="eligibility__icon">
              <EligibilityIcon determination="unknown" />
            </span>
            <div className="content-box__section__content">
              <div className="content-box__section__header">
                We need to know if your landlord owns more than 10 units.
              </div>
              <p>
                Good Cause Eviction law only covers tenants whose landlord owns
                more than 10 units. Your building has only 8 apartments, but
                your landlord may own other buildings.
              </p>
              <JFCLLinkInternal href="/portfolio_size">
                Lean how to find out
              </JFCLLinkInternal>
            </div>
          </div>
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

const EligibilityCriteriaTable: React.FC<{
  eligibilityResults: EligibilityResults | undefined;
}> = ({ eligibilityResults }) => (
  <div className="eligibility__table">
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
);

const potentialProtections = (
  <ContentBox
    headerTitle="WHY GOOD CAUSE MATTERS"
    headerSubtitle="Protections you might have"
  >
    <div className="content-box__section">
      <div className="content-box__section__content">
        <div className="content-box__section__header">
          Your landlord cannot end your tenancy without a “good cause” reason.
        </div>
        <p>
          You can find out if your apartment is rent stabilized by checking your
          lease. Lorem ipsum dolor sit amet.
        </p>
      </div>
    </div>
    <div className="content-box__section">
      <div className="content-box__section__content">
        <div className="content-box__section__header">
          You can challenge rent increases above a certain level if they are
          evicted for nonpayment of rent.
        </div>
        <p>
          You can find out if your apartment is rent stabilized by checking your
          lease. Lorem ipsum dolor sit amet.
        </p>
      </div>
    </div>
  </ContentBox>
);

const coveredGoodCauseProtections = (
  <>
    <ContentBox
      headerTitle="EXERCISING YOUR RIGHTS"
      headerSubtitle="Your right to a lease renewal"
    >
      <div className="content-box__section">
        <div className="content-box__section__content">
          <p>
            Your landlord will need to provide a good cause reason for ending a
            tenancy. This includes evicting tenants, not renewing a lease, or,
            if the tenant does not have a lease, giving notice that the tenancy
            will end.
          </p>
        </div>
      </div>

      <div className="content-box__footer">
        <div className="content-box__section__content">
          <div className="content-box__section__header">
            Learn more about your rights
          </div>
          <JFCLLinkExternal href="">NYC.gov</JFCLLinkExternal>
        </div>
      </div>
    </ContentBox>

    <ContentBox
      headerTitle="EXERCISING YOUR RIGHTS"
      headerSubtitle="Your right to limited rent increases"
    >
      <div className="content-box__section">
        <div className="content-box__section__content">
          <p>
            Your landlord is not allowed to increase your rent at a rate higher
            than the local standard. The local rent standard is set every year
            at the rate of inflation plus 5%, with a maximum of 10% total.
          </p>
          <p>
            As of May 1, 2024, the rate of inflation for the New York City area
            is 3.82%, meaning that the current local rent standard is 8.82%. A
            rent increase of more than 8.82% could be found unreasonable by the
            court if the rent was increased after April 20, 2024.
          </p>
        </div>
      </div>

      <div className="content-box__footer">
        <div className="content-box__section__content">
          <div className="content-box__section__header">
            Learn more about your rights
          </div>
          <JFCLLinkExternal href="">NYC.gov</JFCLLinkExternal>
        </div>
      </div>
    </ContentBox>

    <ContentBox
      headerTitle="EXERCISING YOUR RIGHTS"
      headerSubtitle="Share your coverage with your landlord"
    >
      <div className="content-box__section">
        <div className="content-box__section__content">
          <p>
            You can print your coverage results and show to your landlord Lorem
            ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      <div className="content-box__footer">
        <div className="content-box__section__content">
          <Button
            labelText="Print results"
            labelIcon="print"
            variant="secondary"
          />
        </div>
      </div>
    </ContentBox>
  </>
);

const rentStabilizedProtections = (
  <>
    <ContentBox
      headerTitle="EXERCISING YOUR RIGHTS"
      headerSubtitle="Your right to limited rent increases"
    >
      <div className="content-box__section">
        <div className="content-box__section__content">
          <p>
            For rent-stabilized leases being renewed between October 1, 2024 and
            September 30, 2025 the legal rent may be increased at the following
            levels: for a one-year renewal there is a 2.75% increase, or for a
            two-year renewal there is a 5.25% increase.
          </p>
        </div>
      </div>

      <div className="content-box__footer">
        <div className="content-box__section__content">
          <div className="content-box__section__header">
            Learn more about your rights
          </div>
          <JFCLLinkExternal href="">Met Council on Housing</JFCLLinkExternal>
        </div>
      </div>
    </ContentBox>

    <ContentBox
      headerTitle="EXERCISING YOUR RIGHTS"
      headerSubtitle="Your right to a lease renewal"
    >
      <div className="content-box__section">
        <div className="content-box__section__content">
          <p>
            If you are rent-stabilized your landlord cannot simply decide they
            don’t want you as a tenant anymore, they are limited to certain
            reasons for evicting you.
          </p>
        </div>
      </div>

      <div className="content-box__footer">
        <div className="content-box__section__content">
          <div className="content-box__section__header">
            Learn more about your rights
          </div>
          <JFCLLinkExternal href="">Met Council on Housing</JFCLLinkExternal>
        </div>
      </div>
    </ContentBox>

    <ContentBox
      headerTitle="EXERCISING YOUR RIGHTS"
      headerSubtitle="Your right to succession"
    >
      <div className="content-box__section">
        <div className="content-box__section__content">
          <p>
            If you are the immediate family member of a rent-stabilized tenant
            and have been living with them immediately prior to their moving or
            passing away, you might be entitled to take over the lease.
          </p>
        </div>
      </div>

      <div className="content-box__footer">
        <div className="content-box__section__content">
          <div className="content-box__section__header">
            Learn more about your rights
          </div>
          <JFCLLinkExternal href="">Met Council on Housing</JFCLLinkExternal>
        </div>
      </div>
    </ContentBox>
  </>
);

const EligibilityResultHeadline: React.FC<{
  determination: Determination;
  eligibilityResults: EligibilityResults;
}> = ({ determination, eligibilityResults }) => {
  if (determination === "unknown") {
    return (
      <>
        <span>
          Your apartment <CoveredPill determination={determination} />
        </span>
        <span>by Good Cause Eviction Law</span>
      </>
    );
  } else if (determination === "eligible") {
    return (
      <>
        <span>
          Your apartment is <CoveredPill determination={determination} />
        </span>
        <span>by Good Cause Eviction law</span>
      </>
    );
  } else if (eligibilityResults.rentRegulation.determination === "ineligible") {
    return (
      <>
        <span>
          Your apartment is not covered by Good Cause Eviction law but{" "}
          <span className="covered-pill covered-pill--eligible">
            you’re protected
          </span>{" "}
          by rent stabilization laws
        </span>
      </>
    );
  } else if (determination === "ineligible") {
    return (
      <>
        <span>
          Your apartment is <CoveredPill determination={determination} />{" "}
        </span>
        <span>by Good Cause Eviction law</span>
      </>
    );
  }
};

export const Results: React.FC = () => {
  const { address, fields } = useLoaderData() as {
    address: Address;
    fields: FormFields;
  };
  const [, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    // save session state in params
    if (address && fields) {
      setSearchParams(
        { address: JSON.stringify(address), fields: JSON.stringify(fields) },
        { replace: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bbl = address.bbl;

  const {
    data: bldgData,
    isLoading,
    error,
  } = useGetBuildingEligibilityInfo(bbl);

  const eligibilityResults = useEligibility(fields, bldgData);

  const determination = getDetermination(eligibilityResults);

  const isRentStabilized =
    eligibilityResults?.rentRegulation.determination === "ineligible";

  return (
    <>
      <div className="headline-section">
        {error && (
          <div className="eligibility__error">
            There was an error loading your results, please try again in a few
            minutes.
          </div>
        )}
        {isLoading && (
          <div className="eligibility__loading">Loading your results...</div>
        )}

        <div className="headline-section__content">
          <BreadCrumbs
            crumbs={[
              { path: "/home", name: "Home" },
              {
                path: "/confirm_address",
                name: address?.address || "Your address",
              },
              { path: "/form", name: "Screener survey" },
              { path: "/results", name: "Coverage result" },
            ]}
          />
          <div className="headline-section__page-type">Coverage Result</div>
          {bldgData && eligibilityResults && (
            <>
              <h2 className="headline-section__title">
                <EligibilityResultHeadline
                  determination={determination}
                  eligibilityResults={eligibilityResults}
                />
              </h2>

              <div className="headline-section__subtitle">
                {determination === "eligible" && (
                  <>Your apartment meets all of the required criteria.</>
                )}
                {determination === "ineligible" &&
                  eligibilityResults.rentRegulation.determination !==
                    "ineligible" && (
                    <>Your apartment doesn’t meet all of the requirements.</>
                  )}
                {determination === "unknown" && (
                  <>There are still some things you need to verify.</>
                )}
              </div>
            </>
          )}

          <Button
            labelText={showTable ? "Hide details" : "Expand criteria"}
            labelIcon={showTable ? "eyeSlash" : "eye"}
            onClick={() => setShowTable((prev) => !prev)}
            size="small"
            className={classNames(
              "eligibility__toggle",
              showTable ? "open" : "closed"
            )}
          />
          {showTable && bldgData && (
            <EligibilityCriteriaTable eligibilityResults={eligibilityResults} />
          )}
        </div>
      </div>

      <div className="content-section">
        <div className="content-section__content">
          {determination === "unknown" && (
            <EligibilityNextSteps
              eligibilityResults={eligibilityResults}
              navigate={navigate}
            />
          )}

          {isRentStabilized && rentStabilizedProtections}

          {determination === "unknown" && potentialProtections}

          {determination === "eligible" && coveredGoodCauseProtections}

          <div className="eligibility__footer">
            <h3 className="eligibility__footer__header">
              Help others understand their coverage
            </h3>
            <Button
              labelText="Share this screener"
              labelIcon="squareArrowUpRight"
            />
          </div>
        </div>
        <LegalDisclaimer />
      </div>
    </>
  );
};
