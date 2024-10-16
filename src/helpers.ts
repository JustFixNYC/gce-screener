import { GeoSearchProperties } from "@justfixnyc/geosearch-requester";
import { EligibilityResults, Determination } from "./hooks/eligibility";

function toTitleCase(x: string) {
  return x.replace(
    /\w\S*/g,
    (text: string) =>
      text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

export const formatGeosearchAddress = (
  properties: GeoSearchProperties | undefined
): string =>
  properties
    ? `${toTitleCase(properties.name)}, ${properties.borough}, ${
        properties.postalcode
      }`
    : "";

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
