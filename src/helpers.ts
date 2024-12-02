import { GeoSearchProperties } from "@justfixnyc/geosearch-requester";
import { EligibilityResults, Determination } from "./hooks/eligibility";
import {
  Coverage,
  CriteriaDetermination,
  WowBuildings,
} from "./types/APIDataTypes";
import { Address } from "./Components/Pages/Home/Home";

function toTitleCase(x: string) {
  return x.replace(
    /\w\S*/g,
    (text: string) =>
      text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

export function formatAddressShort(address?: Address) {
  if (!address) return;
  return toTitleCase(`${address?.houseNumber} ${address?.streetName}`);
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

// Recodes values for database model
export const determinationToCoverage = (
  determination: Determination
): Coverage => {
  const COVERAGE: { [key in Determination]: Coverage } = {
    eligible: "COVERED",
    ineligible: "NOT_COVERED",
    unknown: "UNKNOWN",
  };
  return COVERAGE[determination];
};

// Restructures criteria eligibility for database model
export const extractDeterminations = (
  eligibilityResults: EligibilityResults
): CriteriaDetermination => {
  const criteriaDeterminations: CriteriaDetermination = {};
  Object.values(eligibilityResults).forEach((x) => {
    criteriaDeterminations[x.criteria] = x.determination!;
  });
  return criteriaDeterminations;
};

export const splitBBL = (
  bbl: string
): {
  boro: string;
  block: string;
  lot: string;
} => {
  const bblArr = bbl.split("");
  const boro = bblArr.slice(0, 1).join("");
  const block = bblArr.slice(1, 6).join("");
  const lot = bblArr.slice(6, 10).join("");
  return { boro, block, lot };
};

export const formatDistance = (distance_ft: number): string => {
  if (distance_ft < 2640) {
    return `${new Intl.NumberFormat("en", {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(distance_ft)} feet`;
  } else {
    return `${new Intl.NumberFormat("en", {
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    }).format(distance_ft / 5280)} miles`;
  }
};

export const prioritizeBldgs = (a: WowBuildings, b: WowBuildings) => {
  if (a.match_name !== b.match_name) return a.match_name ? -1 : 1;
  if (a.match_bizaddr_unit !== b.match_bizaddr_unit)
    return a.match_bizaddr_unit ? -1 : 1;
  if (a.match_bizaddr_nounit !== b.match_bizaddr_nounit)
    return a.match_bizaddr_nounit ? -1 : 1;
  return b.distance_ft - a.distance_ft;
};

export const urlCountyClerkBbl = (bbl: string) => {
  const { block, lot } = splitBBL(bbl);
  return `https://www.richmondcountyclerk.com/Search/ShowResultsBlocks/0?Block=${block}&Lot=8${lot}`;
};

export const urlAcrisBbl = (bbl: string) => {
  const { boro, block, lot } = splitBBL(bbl);
  return `http://a836-acris.nyc.gov/bblsearch/bblsearch.asp?borough=${boro}&block=${block}&lot=${lot}`;
};

export const urlAcrisDoc = (docId: string) => {
  return `https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentImageView?doc_id=${docId}`;
};

export const acrisDocTypeFull = (docType: string) => {
  switch (docType) {
    case "AGMT":
      return "Agreement";
    case "MTGE":
      return "Mortgage";
    case "AL&R":
      return "Assignment of leases & rents";
    default:
      return docType;
  }
};

export const formatNumber = (n: number) =>
  new Intl.NumberFormat("en").format(n);
