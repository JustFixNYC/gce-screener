import { FormFields } from "../Components/Pages/Form/Survey";
import JFCLLinkInternal from "../Components/JFCLLinkInternal";
import { BuildingData, CriterionResult } from "../types/APIDataTypes";
import JFCLLinkExternal from "../Components/JFCLLinkExternal";
import { formatNumber, urlDOBBBL, urlDOBBIN, urlZOLA } from "../helpers";

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
    subsidy: eligibilitySubsidy(criteriaData),
  };
}

function eligibilityPortfolioSize(
  criteriaData: CriteriaData,
  searchParams: URLSearchParams
): CriterionDetails {
  const { unitsres, related_properties, portfolioSize } = criteriaData;
  const relatedProperties = related_properties.length || 0;

  const criteria = "portfolioSize";
  const requirement = "Landlord must own more than 10 apartments";
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
    userValue = `Your building has ${formatNumber(
      unitsres
    )} apartments, and you reported that your landlord owns more than 10 apartments across multiple buildings.`;
  } else if (portfolioSize === "NO") {
    determination = "INELIGIBLE";
    userValue = `Your building has ${formatNumber(
      unitsres
    )} apartments, and you reported that your landlord does not own other buildings.`;
  } else {
    determination = "UNKNOWN";
    userValue = (
      <>
        {`Your building has only ${formatNumber(
          unitsres
        )} apartments, but your landlord may own
          ${
            relatedProperties ? `${relatedProperties - 1} ` : ""
          }other buildings`}
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
  }, rent must be less than ${rentCutoffs[bedrooms]}`;
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

  const userValue = `Your rent is ${
    determination === "ELIGIBLE" ? "less" : "more"
  } than ${rentCutoffs[bedrooms]}.`;

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
  const { rentStabilized } = criteriaData;
  const criteria = "rentStabilized";
  const requirement = "Your apartment must not be rent stabilized.";
  let determination: CriterionResult;
  let userValue: React.ReactNode;

  // should remove null from type for all form fields, since required
  if (rentStabilized === null) return { criteria, requirement };

  if (rentStabilized === "YES") {
    determination = "INELIGIBLE";
    userValue = "You reported that your apartment is rent stabilized.";
  } else if (rentStabilized === "NO") {
    determination = "ELIGIBLE";
    userValue = "You reported that your apartment is not rent stabilized.";
  } else {
    determination = "UNKNOWN";
    userValue = (
      <>
        You reported that you are not sure if your apartment is rent stabilized.
        <br />
        <JFCLLinkInternal
          to={`/rent_stabilization?${searchParams.toString()}`}
          className="criteria-link"
        >
          Find out if you are rent stabilized
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

function eligibilityBuildingClass(
  criteriaData: CriteriaData
): CriterionDetails {
  const { bldgclass, bbl } = criteriaData;
  const criteria = "buildingClass";
  const requirement = (
    <>Your building must not be a condo, co-op, or other exempt category.</>
  );
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
        ? "Your building is not an exempted type."
        : `Your building is ${bldgTypeName}, and is exempt.`}
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
    "Your building must have received its certificate of occupancy before 2009.";
  const determination =
    co_issued === null || latestCoDate < cutoffDate ? "ELIGIBLE" : "INELIGIBLE";
  const userValue = (
    <>
      {determination === "ELIGIBLE"
        ? "There is no recorded certificate of occupancy for your building since 2009."
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

function eligibilitySubsidy(criteriaData: CriteriaData): CriterionDetails {
  const { housingType } = criteriaData;
  const criteria = "subsidy";
  const requirement = "You must not live in subsidized or public housing.";
  let determination: CriterionResult;
  let userValue: React.ReactNode;

  if (housingType === "NYCHA" || housingType?.includes("SUBSIDIZED")) {
    determination = "INELIGIBLE";
    userValue = `You reported that you live in ${
      housingType === "NYCHA" ? "NYCHA" : "subsidized"
    } housing.`;
  } else {
    determination = "ELIGIBLE";
    userValue =
      "You reported that you do not live in NYCHA or subsidized housing.";
  }

  return {
    criteria,
    determination,
    requirement,
    userValue,
  };
}
