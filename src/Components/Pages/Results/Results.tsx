import {
  Link,
  NavigateFunction,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Button, Icon } from "@justfixnyc/component-library";
import classNames from "classnames";

import { useGetBuildingData, useSendGceData } from "../../../api/hooks";
import { BuildingData, GCEUser } from "../../../types/APIDataTypes";
import { FormFields } from "../Form/Form";
import {
  CriteriaEligibility,
  Determination,
  EligibilityResults,
  useEligibility,
} from "../../../hooks/eligibility";
import { Address } from "../Home/Home";
import { getDetermination } from "../../../helpers";
import { LegalDisclaimer } from "../../LegalDisclaimer/LegalDisclaimer";
import { useEffect, useLayoutEffect, useState } from "react";
import { ContentBox, ContentBoxProps } from "../../ContentBox/ContentBox";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import JFCLLinkExternal from "../../JFCLLinkExternal";
import JFCLLinkInternal from "../../JFCLLinkInternal";
import "./Results.scss";

export const Results: React.FC = () => {
  const { address, fields, user } = useLoaderData() as {
    address: Address;
    fields: FormFields;
    user: GCEUser;
  };
  const [, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { trigger } = useSendGceData();

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

  useEffect(() => {
    // TODO: still need to check this
    if (user && determination) {
      trigger({ id: user.id, result_coverage_initial: determination });
    }    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bbl = address.bbl;

  const { data: bldgData, isLoading, error } = useGetBuildingData(bbl);

  const eligibilityResults = useEligibility(fields, bldgData);

  const determination = getDetermination(eligibilityResults);

  const isRentStabilized =
    eligibilityResults?.rentRegulation.determination === "ineligible";

  const [showTable, setShowTable] = useState<boolean>();

  // TODO: not sure this is right way to handle this. Should we get and store
  // eligibility data on submission of the from on the previous page instead?
  useLayoutEffect(() => {
    if (determination && isRentStabilized !== undefined) {
      setShowTable(
        determination && determination === "ineligible" && !isRentStabilized
      );
    }
  }, [determination, isRentStabilized]);

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
                based on the data we have about your apartment and the
                information you’ve provided.
              </div>
            </>
          )}
          {showTable !== undefined && (
            <>
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
                <EligibilityCriteriaTable
                  eligibilityResults={eligibilityResults}
                />
              )}
            </>
          )}
        </div>
      </div>

      <div className="content-section">
        <div className="content-section__content">
          {determination === "unknown" && bldgData && eligibilityResults && (
            <EligibilityNextSteps
              bldgData={bldgData}
              eligibilityResults={eligibilityResults}
              navigate={navigate}
            />
          )}

          {isRentStabilized && rentStabilizedProtections}

          {determination === "unknown" && (
            <GoodCauseProtections
              headerTitle="KNOW YOUR RIGHTS"
              headerSubtitle="Protections you might have under Good Cause Eviction law"
            />
          )}

          {determination === "eligible" && (
            <>
              <GoodCauseProtections
                headerTitle="KNOW YOUR RIGHTS"
                headerSubtitle="Protections you have under Good Cause Eviction law"
              />
              {goodCauseExercisingRights}
            </>
          )}

          {determination === "ineligible" &&
            !isRentStabilized &&
            universalProtections}

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
        <LegalDisclaimer />
      </div>
    </>
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
    case "eligible":
      return <Icon icon="check" className={determination} title="Pass" />;
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
      <div className="eligibility__row__userValue">{props?.userValue}</div>
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
    eligibilityResults?.portfolioSize?.determination === "unknown";
  const rentRegulationUnknown =
    eligibilityResults?.rentRegulation?.determination === "unknown";
  const steps = [portfolioSizeUnknown, rentRegulationUnknown].filter(
    Boolean
  ).length;
  return (
    <ContentBox
      headerTitle="What this means for you"
      headerSubtitle={
        steps == 1
          ? "There is still one thing you need to verify"
          : `There are still ${steps} things you need to verify`
      }
    >
      {rentRegulationUnknown && (
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
            <JFCLLinkInternal to="/rent_stabilization">
              Lean how to find out
            </JFCLLinkInternal>
          </div>
        </div>
      )}

      {portfolioSizeUnknown && (
        <div className="content-box__section">
          <span className="eligibility__icon">
            <EligibilityIcon determination="unknown" />
          </span>
          <div className="content-box__section__content">
            <div className="content-box__section__header">
              We need to know if your landlord owns more than 10 units.
            </div>
            {bldgData.wow_portfolio_units > bldgData.unitsres ? (
              <>
                <p>
                  {`Good Cause Eviction law only covers tenants whose landlord owns
                more than 10 units. Your building has only ${bldgData.unitsres} apartments, but
                your landlord may own other buildings.`}
                </p>

                <JFCLLinkInternal to="/portfolio_size">
                  Lean how to find out
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

const GoodCauseProtections = (props: Omit<ContentBoxProps, "children">) => (
  <ContentBox {...props}>
    <div className="content-box__section">
      <div className="content-box__section__content">
        <div className="content-box__section__header">
          Your right to a lease renewal
        </div>
        <p>
          Your landlord will need to provide a good cause reason for ending a
          tenancy. This includes evicting tenants, not renewing a lease, or, if
          the tenant does not have a lease, giving notice that the tenancy will
          end.
        </p>
      </div>
    </div>

    <div className="content-box__section">
      <div className="content-box__section__content">
        <div className="content-box__section__header">
          Your right to limited rent increases
        </div>
        <p>
          Your landlord is not allowed to increase your rent at a rate higher
          than the local standard. The local rent standard is set every year at
          the rate of inflation plus 5%, with a maximum of 10% total.
        </p>
        <br />
        <p>
          As of May 1, 2024, the rate of inflation for the New York City area is
          3.82%, meaning that the current local rent standard is 8.82%. A rent
          increase of more than 8.82% could be found unreasonable by the court
          if the rent was increased after April 20, 2024.
        </p>
      </div>
    </div>

    <div className="content-box__section">
      <div className="content-box__section__content">
        <p className="bold">
          Learn more about Good Cause Eviction Law protections
        </p>
        <JFCLLinkExternal href="https://housingjusticeforall.org/kyr-good-cause">
          Housing Justice for All Good Cause Eviction fact sheet
        </JFCLLinkExternal>
        <JFCLLinkExternal
          href="https://www.metcouncilonhousing.org/help-answers/good-cause-eviction"
          className="has-label"
        >
          Met Council on Housing Good Cause Eviction fact sheet
        </JFCLLinkExternal>
      </div>
    </div>
  </ContentBox>
);

const goodCauseExercisingRights = (
  <ContentBox
    headerTitle="EXERCISING YOUR RIGHTS"
    headerSubtitle="Share your coverage with your landlord"
  >
    <div className="content-box__section">
      <div className="content-box__section__content">
        <p>
          Assert your rights by printing your coverage results and sharing with
          your landlord. You can use these results as an indicator that your
          apartment is covered by Good Cause Eviction Law.
        </p>
      </div>
    </div>

    <div className="content-box__footer">
      <div className="content-box__section__content">
        <Button
          labelText="Print my coverage results"
          labelIcon="print"
          variant="secondary"
          className="disabled"
        />
      </div>
    </div>
  </ContentBox>
);

const rentStabilizedProtections = (
  <ContentBox
    headerTitle="EXERCISING YOUR RIGHTS"
    headerSubtitle="Your right to limited rent increases"
  >
    <div className="content-box__section">
      <div className="content-box__section__content">
        <div className="content-box__section__header">
          Your right to limited rent increases
        </div>
        <p>
          For rent-stabilized leases being renewed between October 1, 2024 and
          September 30, 2025 the legal rent may be increased at the following
          levels: for a one-year renewal there is a 2.75% increase, or for a
          two-year renewal there is a 5.25% increase.
        </p>
        <JFCLLinkExternal href="https://hcr.ny.gov/system/files/documents/2024/10/fact-sheet-26-10-2024.pdf">
          Learn about rent increase rights
        </JFCLLinkExternal>
      </div>
    </div>

    <div className="content-box__section">
      <div className="content-box__section__content">
        <div className="content-box__section__header">
          Your right to a lease renewal
        </div>
        <p>
          If you are rent-stabilized your landlord cannot simply decide they
          don’t want you as a tenant anymore, they are limited to certain
          reasons for evicting you.
        </p>
        <JFCLLinkExternal href="https://rentguidelinesboard.cityofnewyork.us/resources/faqs/leases-renewal-vacancy/#landlord:~:text=If%20your%20apartment%20is%20rent,before%20the%20existing%20lease%20expires">
          Learn about lease renewal rights
        </JFCLLinkExternal>
      </div>
    </div>

    <div className="content-box__section">
      <div className="content-box__section__content">
        <div className="content-box__section__header">
          Your right to succession
        </div>
        <p>
          If you are the immediate family member of a rent-stabilized tenant and
          have been living with them immediately prior to their moving or
          passing away, you might be entitled to take over the lease.
        </p>
        <JFCLLinkExternal href="https://www.metcouncilonhousing.org/help-answers/succession-rights-in-rent-stabilized-and-rent-controlled-apartments/">
          Learn about succession rights
        </JFCLLinkExternal>
      </div>
    </div>
  </ContentBox>
);

const universalProtections = (
  <ContentBox
    headerTitle="KNOW YOUR RIGHTS"
    headerSubtitle="Protections you still have as a tenant in NYC"
  >
    <div className="content-box__section">
      <div className="content-box__section__content">
        <div className="content-box__section__header">
          Your eviction protections
        </div>
        <p>
          The only way your landlord can evict you is through housing court.
          Lockouts (also known as unlawful evictions or self-help evictions) are
          illegal. All tenants, including those in private residential programs,
          have the right to stay in their home unless they choose to leave or
          are evicted through a court process.
        </p>
        <br />
        <p className="bold">Learn more about the eviction process</p>
        <JFCLLinkExternal
          href="https://hcr.ny.gov/eviction"
          className="has-label"
        >
          NY Homes and Community Renewal
        </JFCLLinkExternal>
        <br />
        <br />
        <p className="bold">See if you are eligible for a free attorney</p>
        <JFCLLinkExternal
          href="https://www.evictionfreenyc.org"
          className="has-label"
        >
          Eviction Free NYC
        </JFCLLinkExternal>
      </div>
    </div>

    <div className="content-box__section">
      <div className="content-box__section__content">
        <div className="content-box__section__header">
          Your right to a liveable home
        </div>
        <p>
          Tenants have the right to live in a safe, sanitary, and
          well-maintained apartment, including public areas of the building.
          This right is implied in every residential lease, and any lease
          provision that waives it is void. If your landlord is not providing
          these conditions in your apartment or building, there are actions you
          can take to exercise your rights.
        </p>
        <br />
        <p className="bold">Learn about warranty of habitability</p>
        <JFCLLinkExternal
          href="https://nycourts.gov/courts/nyc/housing/pdfs/warrantyofhabitability.pdf"
          className="has-label"
        >
          NY Courts
        </JFCLLinkExternal>
        <br />
        <br />
        <p className="bold">Learn how tenant associations can help</p>
        <JFCLLinkExternal
          href="https://www.metcouncilonhousing.org/help-answers/forming-a-tenants-association"
          className="has-label"
        >
          Met Council on Housing
        </JFCLLinkExternal>
        <br />
        <br />
        <p className="bold">Notify your landlord of repair issues</p>
        <JFCLLinkExternal
          href="https://app.justfix.org/loc/splash"
          className="has-label"
        >
          JustFix’s Letter of Complaint
        </JFCLLinkExternal>
      </div>
    </div>

    <div className="content-box__section">
      <div className="content-box__section__content">
        <div className="content-box__section__header">
          Your rights if you’re being discriminated against
        </div>
        <p>
          Your landlord can’t evict you based on your race, religion, gender,
          national origin, familial status, or disability. New York State law
          promises protection from discrimination, banning bias based on age,
          sexual orientation, and military status.
        </p>
        <p>
          Source of income discrimination the illegal practice by landlords,
          owners, and real estate brokers of refusing to rent to current or
          prospective tenants seeking to pay for housing with housing assistance
          vouchers, subsidies, or other forms of public assistance.
        </p>
        <br />
        <p className="bold">Learn more about fair housing</p>
        <JFCLLinkExternal
          href="https://www.nyc.gov/site/fairhousing/about/what-is-fair-housing.page"
          className="has-label"
        >
          Fair Housing NYC
        </JFCLLinkExternal>
        <br />
        <br />
        <p className="bold">
          Learn more about lawful source of income discrimination
        </p>
        <JFCLLinkExternal
          href="https://www.nyc.gov/site/fairhousing/renters/lawful-source-of-income.page"
          className="has-label"
        >
          Lawful source of income
        </JFCLLinkExternal>
        <br />
        <br />
        <p className="bold">Report source of income discrimination</p>
        <JFCLLinkExternal href="https://weunlock.nyc" className="has-label">
          Unlock NYC
        </JFCLLinkExternal>
      </div>
    </div>
  </ContentBox>
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
