import { FormFields } from "../Components/Pages/Form/Form";
import JFCLLinkInternal from "../Components/JFCLLinkInternal";
import { BuildingData, CriterionResult } from "../types/APIDataTypes";
import JFCLLinkExternal from "../Components/JFCLLinkExternal";
import { urlDOB, urlZOLA } from "../helpers";

export type Criteria =
  | "portfolioSize"
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
  subsidy?: CriterionDetails;
  certificateOfOccupancy?: CriterionDetails;
};

export function useCriteriaResults(
  formFields: FormFields,
  bldgData?: BuildingData
): CriteriaDetails | undefined {
  if (!bldgData) return undefined;
  const criteriaData: CriteriaData = { ...formFields, ...bldgData };
  return {
    portfolioSize: eligibilityPortfolioSize(criteriaData),
    buildingClass: eligibilityBuildingClass(criteriaData),
    rent: eligibilityRent(criteriaData),
    rentStabilized: eligibilityRentStabilized(criteriaData),
    certificateOfOccupancy: eligibilityCertificateOfOccupancy(criteriaData),
    subsidy: eligibilitySubsidy(criteriaData),
  };
}

function eligibilityPortfolioSize(
  criteriaData: CriteriaData
): CriterionDetails {
  const {
    unitsres,
    wow_portfolio_units,
    wow_portfolio_bbls,
    landlord,
    portfolioSize,
    bbl,
  } = criteriaData;

  const criteria = "portfolioSize";
  const requirement = <>Landlord must own more than 10 apartments</>;
  let determination: CriterionResult;
  let userValue: React.ReactNode;

  if (unitsres === undefined) {
    determination = "UNKNOWN";
    userValue = (
      <>No data available for number of apartments in your building.</>
    );
  } else if (unitsres > 10) {
    determination = "ELIGIBLE";
    userValue = <>Your building has more than 10 apartments</>;
  } else if (landlord === "YES") {
    determination = "INELIGIBLE";
    userValue = (
      <>Your building has 10 or fewer apartments and is owner-occupied</>
    );
  } else if (portfolioSize === "YES") {
    determination = "ELIGIBLE";
    userValue = (
      <>
        Your building has 10 or fewer apartments, and you reported that your
        landlord more than 10 apartments across multiple buildings.
      </>
    );
  } else if (portfolioSize === "NO") {
    determination = "INELIGIBLE";
    userValue = (
      <>
        Your building has 10 or fewer apartments, and you reported that your
        landlord does not own other buildings.
        <br />
        <JFCLLinkExternal href={urlZOLA(bbl)} className="data-source">
          View source
        </JFCLLinkExternal>
      </>
    );
  } else {
    determination = "UNKNOWN";
    if (wow_portfolio_units !== undefined && wow_portfolio_units > 10) {
      userValue = (
        <>
          <p>{`Your building has only ${unitsres} apartments, but your landlord may own
          ${wow_portfolio_bbls! - 1} other buildings`}</p>
          <JFCLLinkInternal to="/portfolio_size">
            Find your landlord’s other buildings
          </JFCLLinkInternal>
        </>
      );
    } else {
      userValue = `Your building has only ${unitsres} apartments, but your landlord may own other buildings`;
    }
  }

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

  const userValue = (
    <>
      {`Your rent is ${determination === "ELIGIBLE" ? "less" : "more"} than
      ${rentCutoffs[bedrooms]}.`}
    </>
  );

  return {
    criteria,
    determination,
    requirement,
    userValue,
  };
}

function eligibilityRentStabilized(
  criteriaData: CriteriaData
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
    userValue = "Your apartment is rent stabilized.";
  } else if (rentStabilized === "NO") {
    determination = "ELIGIBLE";
    userValue = "Your apartment is not rent stabilized.";
  } else {
    determination = "UNKNOWN";
    userValue = (
      <>
        <p>You don't know if your apartment is rent stabilized.</p>
        <JFCLLinkInternal to="/rent_stabilization">
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
      <JFCLLinkExternal href={urlZOLA(bbl)} className="data-source">
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
  const { co_issued, co_bin } = criteriaData;
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
  let determination: CriterionResult;
  let userValue: React.ReactNode;

  if (co_issued === null || latestCoDate < cutoffDate) {
    determination = "ELIGIBLE";
    userValue =
      "There is no recorded certificate of occupancy for your building since 2009.";
  } else {
    determination = "INELIGIBLE";
    userValue = (
      <>
        {`Your building was issued a certificate of occupancy on ${latestCoDateFormatted}.`}
        <br />
        <JFCLLinkExternal href={urlDOB(co_bin)} className="data-source">
          View source
        </JFCLLinkExternal>
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

function eligibilitySubsidy(criteriaData: CriteriaData): CriterionDetails {
  const { housingType, is_nycha, is_subsidized } = criteriaData;
  const criteria = "subsidy";
  const requirement = <>You must not live in subsidized or public housing.</>;
  let determination: CriterionResult;
  let userValue: React.ReactNode;

  if (housingType == "UNSURE" || housingType === null) {
    determination = "UNKNOWN";
    if (is_nycha || is_subsidized) {
      userValue = (
        <>
          {`You don't know if you live in subsidized or public housing, but
          available data indicates that your building is
          ${is_nycha ? "public housing" : "subsidized"}.`}
        </>
      );
    } else {
      userValue = (
        <>
          You're not sure if you live in subsidized or public housing, and there
          is no indication from public data that your building is public housing
          or subsidized.
        </>
      );
    }
  } else if (housingType === "NYCHA" || housingType === "SUBSIDIZED") {
    determination = "INELIGIBLE";
    userValue = <>{`You reported that you live in ${housingType} housing.`}</>;
  } else {
    determination = "ELIGIBLE";
    userValue = (
      <>You reported that you do not live in public or subsidized housing.</>
    );
  }

  return {
    criteria,
    determination,
    requirement,
    userValue,
  };
}
