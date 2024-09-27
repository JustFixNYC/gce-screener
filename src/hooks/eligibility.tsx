import { FormFields } from "../App";
import { BuildingEligibilityInfo } from "../types/APIDataTypes";

type Criteria =
  | "portfolioSize"
  | "buildingClass"
  | "rent"
  | "subsidy"
  | "rentRegulation"
  | "yearBuilt";

type CriteriaData = FormFields & BuildingEligibilityInfo;

export type Determination = "eligible" | "ineligible" | "unknown";

export type CriteriaEligibility = {
  criteria: Criteria;
  determination?: Determination;
  requirement?: React.ReactNode;
  userValue?: React.ReactNode;
  moreInfo?: React.ReactNode;
};

export type EligibilityResults = {
  rent: CriteriaEligibility;
  rentRegulation: CriteriaEligibility;
  portfolioSize?: CriteriaEligibility;
  buildingClass?: CriteriaEligibility;
  subsidy?: CriteriaEligibility;
  yearBuilt?: CriteriaEligibility;
};

function eligibilityPortfolioSize(
  criteriaData: CriteriaData
): CriteriaEligibility {
  const { unitsres, wow_portfolio_units, wow_portfolio_bbls, landlord } =
    criteriaData;

  const criteria = "portfolioSize";
  const requirement = <>Landlord must own more than 10 units</>;
  let determination: Determination;
  let userValue: React.ReactNode;

  if (unitsres === undefined) {
    determination = "unknown";
    userValue = <>No data available for number of units in your building.</>;
  } else if (unitsres > 10) {
    determination = "eligible";
    userValue = <>Your building has more than 10 units</>;
  } else if (landlord === "yes") {
    determination = "ineligible";
    userValue = <>Your building has 10 or fewer units and is owner-occupied</>;
  } else {
    determination = "unknown";
    if (wow_portfolio_units !== undefined && wow_portfolio_units > 10) {
      userValue = (
        <>
          Your building has only {unitsres} units, but your landlord may own{" "}
          {wow_portfolio_bbls! - 1} other buildings
        </>
      );
    } else {
      userValue = (
        <>
          Your building has only {unitsres} units, but your landlord may own
          other buildings
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

function eligibilityRent(criteriaData: CriteriaData): CriteriaEligibility {
  const { bedrooms, rent } = criteriaData;
  const rentCutoffs = {
    studio: "$5,846",
    "1": "$6,005",
    "2": "$6,742",
    "3": "$8,413",
    "4+": "$9,065",
  };
  const criteria = "rent";
  let determination: Determination;

  // should remove null from type for all form fields, since required
  if (rent === null || bedrooms === null) return { criteria };

  const requirement = (
    <>
      For a {bedrooms} {bedrooms !== "studio" && "bedroom"}, rent must be less
      than {rentCutoffs[bedrooms]}
    </>
  );
console.log({rent})
  if (bedrooms === "studio") {
    determination = rent === "$5,846" ? "eligible" : "ineligible";
  } else if (bedrooms === "1") {
    determination = ["$5,846", "$6,005"].includes(rent) ? "eligible" : "ineligible";
  } else if (bedrooms === "2") {
    determination = ["$5,846", "$6,005", "$6,742"].includes(rent) ? "eligible" : "ineligible";
  } else if (bedrooms === "3") {
    determination = !["$9,065", ">$9,065"].includes(rent) ? "eligible" : "ineligible";
  } else {
    determination = rent !== ">$9,065" ? "eligible" : "ineligible";
  }

  const userValue = (
    <>
      Your rent is {determination === "eligible" ? "less" : "more"} than{" "}
      {rentCutoffs[bedrooms]}.
    </>
  );

  return {
    criteria,
    determination,
    requirement,
    userValue,
  };
}

function eligibilityRentRegulated(
  criteriaData: CriteriaData
): CriteriaEligibility {
  const { rentStabilized } = criteriaData;
  const criteria = "rentRegulation";
  const requirement = <>Your apartment must not be rent regulated.</>;
  let determination: Determination;
  let userValue: React.ReactNode;
  let moreInfo: React.ReactNode;

  // should remove null from type for all form fields, since required
  if (rentStabilized === null) return { criteria, requirement };

  if (rentStabilized === "yes") {
    determination = "ineligible";
    userValue = <>Your apartment is rent regulated.</>;
    moreInfo = <>Rent regulation provides you even strong protections.</>;
  } else if (rentStabilized === "no") {
    determination = "eligible";
    userValue = <>Your apartment is not rent regulated.</>;
  } else {
    determination = "unknown";
    userValue = <>You don't know if your apartment is rent regulated.</>;
    moreInfo = (
      <>
        You can find out if you are rent regulated by requesting your rent
        history.
      </>
    );
  }

  return {
    criteria,
    determination,
    requirement,
    userValue,
    moreInfo,
  };
}

function eligibilityBuildingClass(
  criteriaData: CriteriaData
): CriteriaEligibility {
  const { bldgclass, bldgclass_desc } = criteriaData;
  const criteria = "buildingClass";
  const requirement = (
    <>Your building must not be a condo, co-op, or other exempt category.</>
  );
  let determination: Determination = "eligible";
  let bldgTypeName = "";

  // should remove null from type for all form fields, since required
  if (bldgclass === null) return { criteria, requirement };

  if (bldgclass === undefined) {
    bldgTypeName = "is missing class information";
    determination = "unknown";
  } else if (bldgclass.match(/^R/g)) {
    bldgTypeName = "a condo";
    determination = "ineligible";
  } else if (["C8", "CC", "D0", "DC"].includes(bldgclass)) {
    bldgTypeName = "a co-op";
    determination = "ineligible";
  } else if (bldgclass.match(/^W/g)) {
    bldgTypeName = "classified as an educational building";
    determination = "ineligible";
  } else if (bldgclass.match(/^H/g)) {
    bldgTypeName = "classified as a hotel";
    determination = "ineligible";
  } else if (bldgclass.match(/^M/g)) {
    bldgTypeName = "classified as a religious facility";
    determination = "ineligible";
  } else if (bldgclass.match(/^I/g)) {
    bldgTypeName = "classified as a health facility";
    determination = "ineligible";
  }

  const userValue =
    bldgTypeName === "" ? (
      <>Your building is not an exempted type.</>
    ) : (
      <>Your building is {bldgTypeName}, and exempt.</>
    );
  const moreInfo = !!bldgclass && (
    <>
      Your building class is {bldgclass}: {bldgclass_desc}
    </>
  );

  return {
    criteria,
    determination,
    requirement,
    userValue,
    moreInfo,
  };
}

export function useEligibility(
  formFields: FormFields,
  bldgData?: BuildingEligibilityInfo
): EligibilityResults | undefined {
  if (!bldgData) return undefined;
  const criteriaData: CriteriaData = { ...formFields, ...bldgData };
  return {
    portfolioSize: eligibilityPortfolioSize(criteriaData),
    buildingClass: eligibilityBuildingClass(criteriaData),
    rent: eligibilityRent(criteriaData),
    rentRegulation: eligibilityRentRegulated(criteriaData),
  };
}
