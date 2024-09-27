import { EligibilityResults, Determination } from "./hooks/eligibility";

// Address labels from geosearch look like this: "105-47 FLATLANDS SECOND STREET, Brooklyn, NY, USA"
// We don't need the state and country, so we'll clean up the label by removing them
export const cleanLabel = (addressLabel: string) => {
  return addressLabel.replace(", NY, USA", "");
};


export const getDetermination = (
  eligibilityResults?: EligibilityResults
): Determination => {
  if (!eligibilityResults) {
    return "unknown";
  }

  const determinations = Object.values(eligibilityResults).map((criteria) => {
    return criteria.determination;
  });

  if (determinations.includes("ineligible")) {
    return "ineligible";
  } else if (determinations.includes("unknown")) {
    return "unknown";
  } else {
    return "eligible";
  }
};