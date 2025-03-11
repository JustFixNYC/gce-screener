import { FormFields } from "../Components/Pages/Form/Survey";
import { BuildingData, CriterionResult } from "../types/APIDataTypes";
import {
  buildingSubsidyLanguage,
  formatMoney,
  formatNumber,
  urlDOBBBL,
  urlDOBBIN,
  urlFCSubsidized,
  urlWOWTimelineRS,
  urlZOLA,
} from "../helpers";
import { JFCLLinkExternal, JFCLLinkInternal } from "../Components/JFCLLink";

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
  if (!bldgData) return undefined;
  const criteriaData: CriteriaData = { ...formFields, ...bldgData };
  return {
    portfolioSize: eligibilityPortfolioSize(criteriaData, searchParams),
    landlord: eligibilityLandlord(criteriaData),
    buildingClass: eligibilityBuildingClass(criteriaData),
    rent: eligibilityRent(criteriaData),
    rentStabilized: eligibilityRentStabilized(criteriaData, searchParams),
    certificateOfOccupancy: eligibilityCertificateOfOccupancy(criteriaData),
    subsidy: eligibilitySubsidy(criteriaData, searchParams),
  };
}

function eligibilityPortfolioSize(
  criteriaData: CriteriaData,
  searchParams: URLSearchParams
): CriterionDetails {
  const { unitsres, related_properties, portfolioSize } = criteriaData;
  const relatedProperties = related_properties.length || 0;

  const criteria = "portfolioSize";
  const requirement =
    "The landlord of the building must own more than 10 units.";
  let determination: CriterionResult;
  let userValue: React.ReactNode;

  if (unitsres === undefined) {
    determination = "UNKNOWN";
    userValue =
      "No data available for the number of apartments in your building.";
  } else if (unitsres > 10) {
    determination = "ELIGIBLE";
    userValue = `Your building has ${formatNumber(unitsres)} apartments.`;
  } else if (portfolioSize === "YES") {
    determination = "ELIGIBLE";
    userValue = `Your building has ${formatNumber(unitsres)} ${
      unitsres === 1 ? "apartment" : "apartments"
    }, and you reported that your landlord owns more than 10 apartments across multiple buildings.`;
  } else if (portfolioSize === "NO") {
    determination = "INELIGIBLE";
    userValue = `Your building has ${formatNumber(
      unitsres
    )} apartments and you reported that your landlord does not own other buildings.`;
  } else {
    determination = "UNKNOWN";
    userValue = (
      <>
        {`Your building has only ${formatNumber(unitsres)} ${
          unitsres === 1 ? "apartment" : "apartments"
        }, but ${
          relatedProperties
            ? `publicly available data sources indicate that your landlord may be associated ${formatNumber(
                relatedProperties
              )}`
            : "your landlord may own"
        } other buildings.`}
        <br />
        <JFCLLinkInternal
          to={`/portfolio_size?${searchParams.toString()}`}
          className="criteria-link"
        >
          Find your landlord’s other buildings
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
  const requirement =
    "If the building has 10 or fewer apartments, the landlord must not also live in it.";
  let determination: CriterionResult;
  let userValueText: string;

  if (unitsres === undefined) {
    determination = "UNKNOWN";
    userValueText =
      "No data available for the number of apartments in your building.";
  } else if (unitsres > 10) {
    determination = "ELIGIBLE";
    userValueText = `Your building has ${formatNumber(unitsres)} apartments.`;
  } else if (landlord === "YES") {
    determination = "INELIGIBLE";
    userValueText = `Your building has ${formatNumber(
      unitsres
    )} apartments and you reported that your landlord lives in the building.`;
  } else {
    determination = "ELIGIBLE";
    userValueText = `Your building has ${formatNumber(
      unitsres
    )} apartments and you reported that your landlord does not live in the building.`;
  }

  const userValue = (
    <>
      {userValueText}
      <br />
      <JFCLLinkExternal to={urlZOLA(bbl)} className="criteria-link">
        View source
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

  const rentCutoffs = {
    STUDIO: "$5,846",
    "1": "$6,005",
    "2": "$6,742",
    "3": "$8,413",
    "4+": "$9,065",
  };
  const criteria = "rent";
  let determination: CriterionResult;

  // should remove null from type for all form fields, since required
  if (rent === null || bedrooms === null) return { criteria };

  const requirement = `For a ${
    bedrooms === "STUDIO" ? "studio" : `${bedrooms} bedroom`
  }, the monthly total rent must be less than ${rentCutoffs[bedrooms]}`;
  if (bedrooms === "STUDIO") {
    determination = rent < 5846 ? "ELIGIBLE" : "INELIGIBLE";
  } else if (bedrooms === "1") {
    determination = rent < 6005 ? "ELIGIBLE" : "INELIGIBLE";
  } else if (bedrooms === "2") {
    determination = rent < 6742 ? "ELIGIBLE" : "INELIGIBLE";
  } else if (bedrooms === "3") {
    determination = rent < 8413 ? "ELIGIBLE" : "INELIGIBLE";
  } else {
    determination = rent < 9065 ? "ELIGIBLE" : "INELIGIBLE";
  }

  const userValue = `You reported that your rent is ${formatMoney(rent, 0)}.`;

  return {
    criteria,
    determination,
    requirement,
    userValue,
  };
}

function eligibilityRentStabilized(
  criteriaData: CriteriaData,
  searchParams: URLSearchParams
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
  let requirement = "The apartment must not be rent stabilized.";
  let determination: CriterionResult;
  let userValue: React.ReactNode;

  const allUnitsRS = unitsres > 0 && post_hstpa_rs_units >= unitsres;
  const active421a = new Date(end_421a) > new Date();
  const activeJ51 = new Date(end_j51) > new Date();
  const wowLink = (
    <JFCLLinkExternal to={urlWOWTimelineRS(bbl)} className="criteria-link">
      View source
    </JFCLLinkExternal>
  );
  const subsidyLink = (
    <JFCLLinkExternal to={urlFCSubsidized(bbl)} className="criteria-link">
      View source
    </JFCLLinkExternal>
  );
  const guideLink = (
    <JFCLLinkInternal
      to={`/rent_stabilization?${searchParams.toString()}`}
      className="criteria-link"
    >
      Find out if you are rent stabilized
    </JFCLLinkInternal>
  );

  // should remove null from type for all form fields, since required
  if (rentStabilized === null) return { criteria, requirement };

  if (rentStabilized === "YES") {
    determination = "OTHER_PROTECTION";
    requirement =
      "Rent stabilized apartments are not covered by Good Cause Eviction " +
      "because they already have stronger tenant protections than Good Cause.";
    userValue = "You reported that your apartment is rent stabilized.";
  } else {
    determination = rentStabilized === "NO" ? "ELIGIBLE" : "UNKNOWN";
    userValue =
      allUnitsRS || active421a || activeJ51 ? (
        <>
          {`You reported that ${
            rentStabilized === "NO"
              ? "your apartment is not"
              : "you are not sure if your apartment is"
          } rent stabilized, ` +
            "and we are using your answer as part of our coverage assessment. " +
            "Note: publicly available data sources indicate that " +
            (allUnitsRS
              ? "all apartments in your building are registered as rent stabilized."
              : `your building receives the ${
                  activeJ51 ? "421a" : "J51"
                } tax incentive, which means your apartment should be rent stabilized.`) +
            " If those sources are correct, then you may already have stronger tenant " +
            "protections than Good Cause Eviction provides."}
          <br />
          {allUnitsRS ? wowLink : subsidyLink}
          <br />
          {guideLink}
        </>
      ) : rentStabilized === "NO" ? (
        "You reported that your apartment is not rent stabilized."
      ) : (
        <>
          You reported that you are not sure if your apartment is rent
          stabilized.
          <br />
          {guideLink}
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

function eligibilityBuildingClass(
  criteriaData: CriteriaData
): CriterionDetails {
  const { bldgclass, bbl } = criteriaData;
  const criteria = "buildingClass";
  const requirement =
    "The building must not be a condo, co-op, or other exempt building types.";
  let determination: CriterionResult;
  let bldgTypeName = "";

  if (bbl === "5013920002") {
    // Goethals Park in Staten Island, only manufactured housing site in NYC
    bldgTypeName = "manufactured housing";
    determination = "INELIGIBLE";
  } else if (bldgclass === null || bldgclass === undefined) {
    bldgTypeName = "missing class information";
    determination = "UNKNOWN";
  } else if (bldgclass.match(/^R/g)) {
    bldgTypeName = "a condo";
    determination = "INELIGIBLE";
  } else if (["C6", "C8", "CC", "D0", "DC", "D4"].includes(bldgclass)) {
    bldgTypeName = "a co-op";
    determination = "INELIGIBLE";
  } else if (bldgclass.match(/^W/g)) {
    bldgTypeName = "classified as an educational building";
    determination = "INELIGIBLE";
  } else if (bldgclass.match(/^H/g)) {
    bldgTypeName = "classified as a hotel";
    determination = "INELIGIBLE";
  } else if (bldgclass.match(/^M/g)) {
    bldgTypeName = "classified as a religious facility";
    determination = "INELIGIBLE";
  } else if (bldgclass.match(/^I/g)) {
    bldgTypeName = "classified as a health facility";
    determination = "INELIGIBLE";
  } else {
    determination = "ELIGIBLE";
  }

  const userValue = (
    <>
      {bldgTypeName === ""
        ? "Public data sources indicate that your building is not a condo, co-op, or other exempt category."
        : `Public data sources indicate that your building is ${bldgTypeName}, and so is not covered by Good Cause Eviction.`}
      <br />
      <JFCLLinkExternal to={urlZOLA(bbl)} className="criteria-link">
        View source
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
  const requirement =
    "The building must have received its certificate of occupancy before 2009.";
  const determination =
    co_issued === null || latestCoDate < cutoffDate ? "ELIGIBLE" : "INELIGIBLE";
  const userValue = (
    <>
      {determination === "ELIGIBLE"
        ? "Your building has no recorded certificate of occupancy since 2009."
        : `Your building was issued a certificate of occupancy on ${latestCoDateFormatted}.`}
      <br />
      <JFCLLinkExternal
        to={determination === "ELIGIBLE" ? urlDOBBBL(bbl) : urlDOBBIN(co_bin)}
        className="criteria-link"
      >
        View source
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

function eligibilitySubsidy(
  criteriaData: CriteriaData,
  searchParams: URLSearchParams
): CriterionDetails {
  const { housingType, subsidy_name, bbl } = criteriaData;
  const criteria = "subsidy";
  let requirement =
    "The building must not be part of NYCHA, PACT/RAD, or other subsidized housing.";
  let determination: CriterionResult;
  let userValue: React.ReactNode;

  const subsidyDataNote = `Note: publicly available data sources indicate that your building ${buildingSubsidyLanguage(
    subsidy_name
  )}.`;
  const sourceLink = (
    <JFCLLinkExternal to={urlFCSubsidized(bbl)} className="criteria-link">
      View source
    </JFCLLinkExternal>
  );
  const guideLink = (
    <JFCLLinkInternal
      to={`/subsidy?${searchParams.toString()}`}
      className="criteria-link"
    >
      View subsidy guide
    </JFCLLinkInternal>
  );

  if (housingType === "NYCHA") {
    requirement =
      "NYCHA and PACT/RAD apartments are not covered by Good Cause Eviction because they already have stronger tenant protections than Good Cause.";
    determination = "OTHER_PROTECTION";
    userValue =
      subsidy_name === "NYCHA" ? (
        "You reported that your building is part of NYCHA or PACT/RAD."
      ) : (
        <>
          {"You reported that your building is part of NYCHA or PACT/RAD, " +
            "and we are using your answer as part of our coverage assessment. " +
            subsidyDataNote}
          <br />
          {sourceLink}
        </>
      );
  } else if (housingType?.includes("SUBSIDIZED")) {
    determination = "OTHER_PROTECTION";
    requirement =
      "Subsidized buildings are not covered by Good Cause Eviction because they " +
      "already have similar, and sometimes stronger, existing tenant protections.";
    userValue =
      subsidy_name !== "NYCHA" ? (
        "You reported that your building is subsidized."
      ) : (
        <>
          {"You reported that your building is subsidized. " + subsidyDataNote}
          <br />
          {sourceLink}
        </>
      );
  } else if (housingType === "UNSURE") {
    determination = "UNKNOWN";
    userValue = !subsidy_name ? (
      <>
        You reported that you are not sure if your building is subsidized.
        <br />
        {guideLink}
      </>
    ) : (
      <>
        {"You reported that you are not sure if your apartment is subsidized, and we " +
          "are using your answer as part of our coverage assessment. " +
          subsidyDataNote}
        <br />
        {sourceLink}
        <br />
        {guideLink}
      </>
    );
  } else {
    determination = "ELIGIBLE";
    userValue = !subsidy_name ? (
      "You reported that your building is not part of any subsidized housing programs."
    ) : (
      <>
        {"You reported that your apartment is not subsidized, and we are using your " +
          "answer as part of our coverage assessment." +
          subsidyDataNote +
          " If those sources are correct, then you may already have stronger tenant" +
          "protections than Good Cause Eviction provides."}
        <br />
        {sourceLink}
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
