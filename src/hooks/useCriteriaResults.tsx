import { Plural, Trans } from "@lingui/react/macro";
import { I18n } from "@lingui/core";
import { JFCLLinkExternal, JFCLLinkInternal } from "../Components/JFCLLink";
import {
  BuildingSubsidyLanguage,
  FormFields,
} from "../Components/Pages/Form/Survey";
import { BuildingData, CriterionResult } from "../types/APIDataTypes";
import {
  formatMoney,
  formatNumber,
  urlDOBBBL,
  urlDOBBIN,
  urlFCSubsidized,
  urlWOWBldg,
  urlWOWTimelineRS,
  urlZOLA,
} from "../helpers";
import { useLingui } from "@lingui/react";

// These values need to be updated annually. They are published by DHCR on or before August 1 each year
const RENT_CUTOFFS = {
  STUDIO: 5895,
  "1": 6152,
  "2": 6811,
  "3": 8489,
  "4+": 9158,
};

export type Criteria =
  | "portfolioSize"
  | "landlord"
  | "buildingClass"
  | "rent"
  | "subsidy"
  | "rentStabilized"
  | "certificateOfOccupancy";

type CriteriaData = FormFields & BuildingData;

export type CriterionDetails = {
  criteria: Criteria;
  determination?: CriterionResult;
  requirement?: React.ReactNode;
  userValue?: React.ReactNode;
};

export type CriteriaDetails = {
  rent: CriterionDetails;
  rentStabilized: CriterionDetails;
  portfolioSize?: CriterionDetails;
  buildingClass?: CriterionDetails;
  landlord?: CriterionDetails;
  subsidy?: CriterionDetails;
  certificateOfOccupancy?: CriterionDetails;
};

export function useCriteriaResults(
  formFields: FormFields,
  searchParams: URLSearchParams,
  bldgData?: BuildingData
): CriteriaDetails | undefined {
  const { i18n } = useLingui();
  if (!bldgData) return undefined;
  const criteriaData: CriteriaData = { ...formFields, ...bldgData };
  return {
    portfolioSize: eligibilityPortfolioSize(criteriaData, searchParams, i18n),
    landlord: eligibilityLandlord(criteriaData),
    buildingClass: eligibilityBuildingClass(criteriaData),
    rent: eligibilityRent(criteriaData),
    rentStabilized: eligibilityRentStabilized(criteriaData, searchParams, i18n),
    certificateOfOccupancy: eligibilityCertificateOfOccupancy(criteriaData),
    subsidy: eligibilitySubsidy(criteriaData),
  };
}

function eligibilityPortfolioSize(
  criteriaData: CriteriaData,
  searchParams: URLSearchParams,
  i18n: I18n
): CriterionDetails {
  const {
    bbl,
    unitsres,
    related_properties,
    portfolioSize,
    wow_portfolio_bbls,
  } = criteriaData;
  const relatedProperties = related_properties.length || 0;

  const criteria = "portfolioSize";
  const requirement = (
    <Trans>
      The landlord of the building must own more than 10 apartments.
    </Trans>
  );
  let determination: CriterionResult;
  let userValue: React.ReactNode;

  const wowLink = (
    <JFCLLinkExternal to={urlWOWBldg(bbl)} className="source-link">
      <Trans>View source</Trans>
    </JFCLLinkExternal>
  );

  const pluralApartments = (
    <Plural value={unitsres} one="# apartment" other="# apartments" />
  );

  if (unitsres === undefined) {
    determination = "UNKNOWN";
    userValue = (
      <Trans>
        No data available for the number of apartments in your building.
      </Trans>
    );
  } else if (portfolioSize === "YES" && wow_portfolio_bbls) {
    determination = "ELIGIBLE";
    userValue = (
      <Trans>
        Your building has {pluralApartments} and you reported that your landlord
        owns more than 10 apartments across multiple buildings. Additionally,
        your landlord may own other buildings in the city. {wowLink}
      </Trans>
    );
  } else if (portfolioSize === "YES") {
    determination = "ELIGIBLE";
    userValue = (
      <Trans>
        Your building has{" "}
        <Plural value={unitsres} one="# apartment" other="# apartments" />, and
        you reported that your landlord owns more than 10 apartments across
        multiple buildings.
      </Trans>
    );
  } else if (unitsres > 10 && wow_portfolio_bbls) {
    determination = "ELIGIBLE";
    userValue = (
      <Trans>
        Your building has {formatNumber(unitsres)} apartments. Additionally,
        your landlord may own other buildings in the city. {wowLink}
      </Trans>
    );
  } else if (unitsres > 10) {
    determination = "ELIGIBLE";
    userValue = (
      <Trans>Your building has {formatNumber(unitsres)} apartments.</Trans>
    );
  } else if (portfolioSize === "NO") {
    determination = "INELIGIBLE";
    userValue = (
      <Trans>
        Your building has {formatNumber(unitsres)} apartments and you reported
        that your landlord does not own other buildings.
      </Trans>
    );
  } else {
    determination = "UNKNOWN";
    userValue = (
      <>
        <Trans>Your building has only {pluralApartments}, but</Trans>
        {relatedProperties ? (
          <Trans>
            publicly available data sources indicate that your landlord may be
            associated with {formatNumber(relatedProperties)}
          </Trans>
        ) : (
          <Trans>your landlord may own</Trans>
        )}{" "}
        <Trans>other buildings.</Trans>{" "}
        <JFCLLinkInternal
          to={`/${i18n.locale}/portfolio_size?${searchParams.toString()}`}
        >
          <Trans>Find your landlord’s other buildings</Trans>
        </JFCLLinkInternal>
      </>
    );
  }

  return {
    criteria,
    determination,
    requirement,
    userValue,
  };
}

function eligibilityLandlord(criteriaData: CriteriaData): CriterionDetails {
  const { unitsres, landlord, bbl } = criteriaData;

  const criteria = "landlord";
  const requirement = (
    <Trans>
      If the building has 10 or fewer apartments, the landlord must not also
      live in it.
    </Trans>
  );
  let determination: CriterionResult;
  let userValueText: React.ReactNode;

  if (unitsres === undefined) {
    determination = "UNKNOWN";
    userValueText = (
      <Trans>
        No data available for the number of apartments in your building.
      </Trans>
    );
  } else if (unitsres > 10) {
    determination = "ELIGIBLE";
    userValueText = (
      <Trans>Your building has {formatNumber(unitsres)} apartments.</Trans>
    );
  } else if (landlord === "YES") {
    determination = "INELIGIBLE";
    userValueText = (
      <Trans>
        Your building has {formatNumber(unitsres)} apartments and you reported
        that your landlord lives in the building.
      </Trans>
    );
  } else {
    determination = "ELIGIBLE";
    userValueText = (
      <Trans>
        Your building has ${formatNumber(unitsres)} apartments and you reported
        that your landlord does not live in the building.
      </Trans>
    );
  }

  const userValue = (
    <>
      {userValueText}{" "}
      <JFCLLinkExternal to={urlZOLA(bbl)} className="source-link">
        <Trans>View source</Trans>
      </JFCLLinkExternal>
    </>
  );

  return {
    criteria,
    determination,
    requirement,
    userValue,
  };
}

function eligibilityRent(criteriaData: CriteriaData): CriterionDetails {
  const { bedrooms, rent: rentString } = criteriaData;
  const rent = parseFloat(rentString || "");
  const criteria = "rent";
  let determination: CriterionResult;

  // should remove null from type for all form fields, since required
  if (rent === null || bedrooms === null) return { criteria };

  const requirement = (
    <Trans>
      For a{" "}
      {bedrooms === "STUDIO" ? (
        <Trans>studio</Trans>
      ) : (
        <Trans>{bedrooms} bedroom</Trans>
      )}
      , the monthly total rent must be less than{" "}
      {formatMoney(RENT_CUTOFFS[bedrooms], 0)}
    </Trans>
  );

  if (bedrooms === "STUDIO") {
    determination = rent < RENT_CUTOFFS["STUDIO"] ? "ELIGIBLE" : "INELIGIBLE";
  } else if (bedrooms === "1") {
    determination = rent < RENT_CUTOFFS["1"] ? "ELIGIBLE" : "INELIGIBLE";
  } else if (bedrooms === "2") {
    determination = rent < RENT_CUTOFFS["2"] ? "ELIGIBLE" : "INELIGIBLE";
  } else if (bedrooms === "3") {
    determination = rent < RENT_CUTOFFS["3"] ? "ELIGIBLE" : "INELIGIBLE";
  } else {
    determination = rent < RENT_CUTOFFS["4+"] ? "ELIGIBLE" : "INELIGIBLE";
  }

  const userValue = (
    <Trans>You reported that your rent is {formatMoney(rent, 0)}.</Trans>
  );

  return {
    criteria,
    determination,
    requirement,
    userValue,
  };
}

function eligibilityRentStabilized(
  criteriaData: CriteriaData,
  searchParams: URLSearchParams,
  i18n: I18n
): CriterionDetails {
  const {
    rentStabilized,
    post_hstpa_rs_units,
    unitsres,
    end_421a,
    end_j51,
    bbl,
  } = criteriaData;
  const criteria = "rentStabilized";
  let requirement = <Trans>The apartment must not be rent stabilized.</Trans>;
  let determination: CriterionResult;
  let userValue: React.ReactNode;

  const allUnitsRS = unitsres > 0 && post_hstpa_rs_units >= unitsres;
  const active421a = new Date(end_421a) > new Date();
  const activeJ51 = new Date(end_j51) > new Date();
  const wowLink = (
    <JFCLLinkExternal to={urlWOWTimelineRS(bbl)} className="source-link">
      <Trans>View source</Trans>
    </JFCLLinkExternal>
  );
  const subsidyLink = (
    <JFCLLinkExternal to={urlFCSubsidized(bbl)} className="source-link">
      <Trans>View source</Trans>
    </JFCLLinkExternal>
  );
  const guideLink = (
    <JFCLLinkInternal
      to={`/${i18n.locale}/rent_stabilization?${searchParams.toString()}`}
    >
      <Trans>Find out if your apartment is rent stabilized</Trans>
    </JFCLLinkInternal>
  );

  // should remove null from type for all form fields, since required
  if (rentStabilized === null) return { criteria, requirement };

  if (rentStabilized === "YES") {
    determination = "OTHER_PROTECTION";
    requirement = (
      <Trans>
        Rent stabilized apartments are not covered by Good Cause Eviction
        because they already have stronger tenant protections than Good Cause.
      </Trans>
    );
    userValue = (
      <Trans>You reported that your apartment is rent stabilized.</Trans>
    );
  } else {
    determination = rentStabilized === "NO" ? "ELIGIBLE" : "UNKNOWN";
    userValue =
      allUnitsRS || active421a || activeJ51 ? (
        <Trans>
          You reported that{" "}
          {rentStabilized === "NO" ? (
            <Trans>your apartment is not</Trans>
          ) : (
            <Trans>you are not sure if your apartment is</Trans>
          )}{" "}
          rent stabilized, and we are using your answer as part of our coverage
          assessment. Note: publicly available data sources indicate that
          {allUnitsRS ? (
            <Trans>
              all apartments in your building are registered as rent stabilized.
            </Trans>
          ) : (
            <Trans>
              your building receives the {activeJ51 ? "421a" : "J51"} tax
              incentive, which means your apartment should be rent stabilized.
            </Trans>
          )}{" "}
          {allUnitsRS ? wowLink : subsidyLink}
          If those sources are correct, then you may already have stronger
          tenant protections than Good Cause Eviction provides. {guideLink}
        </Trans>
      ) : rentStabilized === "NO" ? (
        <Trans>You reported that your apartment is not rent stabilized.</Trans>
      ) : (
        <Trans>
          You reported that you are not sure if your apartment is rent
          stabilized. {guideLink}
        </Trans>
      );
  }

  return {
    criteria,
    determination,
    requirement,
    userValue,
  };
}

function eligibilityBuildingClass(
  criteriaData: CriteriaData
): CriterionDetails {
  const { bldgclass, bbl } = criteriaData;
  const criteria = "buildingClass";
  const requirement = (
    <Trans>
      The building must not be a condo, co-op, or other exempt building types.
    </Trans>
  );
  let determination: CriterionResult;
  let bldgTypeName;

  if (bbl === "5013920002") {
    // Goethals Park in Staten Island, only manufactured housing site in NYC
    bldgTypeName = <Trans>manufactured housing</Trans>;
    determination = "INELIGIBLE";
  } else if (bldgclass === null || bldgclass === undefined) {
    bldgTypeName = <Trans>missing class information</Trans>;
    determination = "UNKNOWN";
  } else if (bldgclass.match(/^R/g)) {
    bldgTypeName = <Trans>a condo</Trans>;
    determination = "INELIGIBLE";
  } else if (["C6", "C8", "CC", "D0", "DC", "D4"].includes(bldgclass)) {
    bldgTypeName = <Trans>a co-op</Trans>;
    determination = "INELIGIBLE";
  } else if (bldgclass.match(/^W/g)) {
    bldgTypeName = <Trans>classified as an educational building</Trans>;
    determination = "INELIGIBLE";
  } else if (bldgclass.match(/^H/g)) {
    bldgTypeName = <Trans>classified as a hotel</Trans>;
    determination = "INELIGIBLE";
  } else if (bldgclass.match(/^M/g)) {
    bldgTypeName = <Trans>classified as a religious facility</Trans>;
    determination = "INELIGIBLE";
  } else if (bldgclass.match(/^I/g)) {
    bldgTypeName = <Trans>classified as a health facility</Trans>;
    determination = "INELIGIBLE";
  } else {
    determination = "ELIGIBLE";
  }

  const userValue = (
    <>
      {!bldgTypeName ? (
        <Trans>
          Public data sources indicate that your building is not a condo, co-op,
          or other exempt category.
        </Trans>
      ) : (
        <Trans>
          Public data sources indicate that your building is {bldgTypeName}, and
          so is not covered by Good Cause Eviction.
        </Trans>
      )}{" "}
      <JFCLLinkExternal to={urlZOLA(bbl)} className="source-link">
        <Trans>View source</Trans>
      </JFCLLinkExternal>
    </>
  );

  return {
    criteria,
    determination,
    requirement,
    userValue,
  };
}

function eligibilityCertificateOfOccupancy(
  criteriaData: CriteriaData
): CriterionDetails {
  const { co_issued, co_bin, bbl } = criteriaData;
  const cutoffYear = 2009;
  const cutoffDate = new Date(cutoffYear, 1, 1);
  const latestCoDate = new Date(co_issued);
  const latestCoDateFormatted = latestCoDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const criteria = "certificateOfOccupancy";
  const requirement = (
    <Trans>
      The building must have received its certificate of occupancy before 2009.
    </Trans>
  );
  const determination =
    co_issued === null || latestCoDate < cutoffDate ? "ELIGIBLE" : "INELIGIBLE";
  const userValue = (
    <>
      {determination === "ELIGIBLE" ? (
        <Trans>
          Your building has no new recorded certificate of occupancy since 2009.
        </Trans>
      ) : (
        <Trans>
          Your building was issued a certificate of occupancy on{" "}
          {latestCoDateFormatted}.
        </Trans>
      )}{" "}
      <JFCLLinkExternal
        to={determination === "ELIGIBLE" ? urlDOBBBL(bbl) : urlDOBBIN(co_bin)}
        className="source-link"
      >
        <Trans>View source</Trans>
      </JFCLLinkExternal>
    </>
  );

  return {
    criteria,
    determination,
    requirement,
    userValue,
  };
}

function eligibilitySubsidy(criteriaData: CriteriaData): CriterionDetails {
  const { housingType, subsidy_name, bbl } = criteriaData;
  const criteria = "subsidy";
  let requirement: React.ReactNode;
  let determination: CriterionResult;
  let userValue: React.ReactNode;

  const sourceLink = (
    <JFCLLinkExternal to={urlFCSubsidized(bbl)} className="source-link">
      <Trans>View source</Trans>
    </JFCLLinkExternal>
  );

  if (!subsidy_name) {
    if (housingType === "NYCHA") {
      requirement = (
        <Trans>
          The building must not be part of NYCHA, PACT/RAD, or other subsidized
          housing.
        </Trans>
      );
      determination = "OTHER_PROTECTION";
      userValue = (
        <Trans>
          You reported that your building is part of NYCHA or PACT/RAD.
        </Trans>
      );
    } else if (housingType === "SUBSIDIZED") {
      requirement = (
        <Trans>
          NYCHA and PACT/RAD apartments are not covered by Good Cause because
          they already have stronger tenant protections than Good Cause.
        </Trans>
      );
      determination = "OTHER_PROTECTION";
      userValue = <Trans>You reported that your building is subsidized.</Trans>;
    } else {
      requirement = (
        <Trans>
          Subsidized buildings are not covered by Good Cause Eviction because
          they already have similar, and sometimes stronger, existing tenant
          protections.
        </Trans>
      );
      determination = "ELIGIBLE";
      userValue = (
        <Trans>
          You reported that your building is not part of NYCHA, PACT/RAD, or
          other subsidized housing programs.
        </Trans>
      );
    }
  } else if (subsidy_name === "NYCHA") {
    if (housingType === "NYCHA") {
      requirement = (
        <Trans>
          NYCHA and PACT/RAD apartments are not covered by Good Cause because
          they already have stronger tenant protections than Good Cause.
        </Trans>
      );
      determination = "OTHER_PROTECTION";
      userValue = (
        <Trans>
          You reported that your building is part of NYCHA or PACT/RAD.
        </Trans>
      );
    } else if (housingType === "SUBSIDIZED") {
      requirement = (
        <Trans>
          The building must not be part of NYCHA, PACT/RAD, or other subsidized
          housing.
        </Trans>
      );
      determination = "OTHER_PROTECTION";
      userValue = (
        <>
          <Trans>
            You reported that your building is subsidized, and we are using your
            answer as part of our coverage assessment. Note: publicly available
            data sources indicate that your building is part of NYCHA or
            PACT/RAD.
          </Trans>{" "}
          {sourceLink}{" "}
          <Trans>
            If those sources are correct, then you may already have stronger
            tenant protections than other subsidized housing programs.
          </Trans>
        </>
      );
    } else {
      requirement = (
        <Trans>
          The building must not be part of NYCHA, PACT/RAD, or other subsidized
          housing.
        </Trans>
      );
      determination = "ELIGIBLE";
      userValue = (
        <>
          <Trans>
            You reported that your building is not part of any subsidized
            housing programs, and we are using your answer as part of our
            coverage assessment. Note: publicly available data sources indicate
            that your building is part of NYCHA or PACT/RAD.
          </Trans>{" "}
          {sourceLink}{" "}
          <Trans>
            If those sources are correct, you may have existing tenant
            protections through NYCHA or PACT/RAD.
          </Trans>
        </>
      );
    }
  } else {
    if (housingType === "NYCHA") {
      requirement = (
        <Trans>
          NYCHA and PACT/RAD apartments are not covered by Good Cause because
          they already have stronger tenant protections than Good Cause
          provides.
        </Trans>
      );
      determination = "OTHER_PROTECTION";
      userValue = (
        <Trans>
          You reported that your building is part of NYCHA or PACT/RAD, and we
          are using your answer as part of our coverage assessment. Note:
          publicly available data sources indicate that your building{" "}
          <BuildingSubsidyLanguage subsidyName={subsidy_name} />, which is
          considered subsidized housing. {sourceLink} If those sources are
          correct, then your protections may be different than the protections
          of NYCHA or PACT/RAD.
        </Trans>
      );
    } else if (housingType === "SUBSIDIZED") {
      requirement = (
        <Trans>
          Subsidized buildings are not covered by Good Cause Eviction because
          they already have similar, and sometimes stronger, existing tenant
          protections.
        </Trans>
      );
      determination = "OTHER_PROTECTION";
      userValue = <Trans>You reported that your building is subsidized.</Trans>;
    } else {
      requirement = (
        <Trans>
          The building must not be part of NYCHA, PACT/RAD, or other subsidized
          housing.
        </Trans>
      );
      determination = "ELIGIBLE";
      userValue = (
        <>
          <Trans>
            You reported that your building is not part of NYCHA, PACT/RAD, or
            other subsidized housing, and we are using your answer as part of
            our coverage assessment. Note: publicly available data sources
            indicate that your building{" "}
            <BuildingSubsidyLanguage subsidyName={subsidy_name} /> , which is
            considered subsidized housing.
          </Trans>{" "}
          {sourceLink}{" "}
          <Trans>
            If those sources are correct, you may have existing tenant
            protections through your building’s subsidy program.
          </Trans>
        </>
      );
    }
  }

  return {
    criteria,
    determination,
    requirement,
    userValue,
  };
}
