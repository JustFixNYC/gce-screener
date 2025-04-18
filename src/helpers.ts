import { GeoSearchProperties } from "@justfixnyc/geosearch-requester";
import LZString from "lz-string";
import { RelatedProperty } from "./types/APIDataTypes";

export enum ProgressStep {
  Home = -1,
  Address = 0,
  Survey = 1,
  Result = 2,
}

export function toTitleCase(x: string) {
  return x.replace(
    /\w\S*/g,
    (text: string) =>
      text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

export function toMacroCase(x: string) {
  return x.replace(/\s+/g, "_").toUpperCase();
}

export const formatGeosearchAddress = (
  properties: GeoSearchProperties | undefined
): string =>
  properties
    ? `${toTitleCase(properties.name)}, ${properties.borough}, ${
        properties.postalcode
      }`
    : "";

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

export const urlZOLA = (bbl: string): string => {
  const { boro, block, lot } = splitBBL(bbl);
  return `https://zola.planning.nyc.gov/l/lot/${parseInt(boro)}/${parseInt(
    block
  )}/${parseInt(lot)}`;
};

export const urlDOBBIN = (bin: string): string => {
  return `https://a810-bisweb.nyc.gov/bisweb/COsByLocationServlet?allbin=${bin}`;
};

export const urlDOBBBL = (bbl: string): string => {
  const { boro, block, lot } = splitBBL(bbl);
  return `https://a810-bisweb.nyc.gov/bisweb/PropertyProfileOverviewServlet?boro=${boro}&block=${block}&lot=${lot}`;
};

export const urlFCSubsidized = (bbl: string): string => {
  return `https://app.coredata.nyc/?ptsb=${bbl}`;
};

export const urlWOWTimelineRS = (bbl: string): string => {
  return `https://whoownswhat.justfix.org/bbl/${bbl}/timeline/rentstabilizedunits`;
};

export const abbreviateBoro = (borough: string): string => {
  switch (borough.toUpperCase()) {
    case "MANHATTAN":
      return "MN";
    case "BRONX":
      return "BX";
    case "BROOKLYN":
      return "BK";
    case "QUEENS":
      return "QN";
    case "STATEN ISLAND":
      return "SI";
    default:
      return "";
  }
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

const prioritizeBldgsWithUnits = (
  a: RelatedProperty,
  b: RelatedProperty,
  unitsNeeded: number
) => {
  if (a.match_ownername !== b.match_ownername)
    return a.match_ownername ? -1 : 1;

  if (a.match_multidoc !== b.match_multidoc) return a.match_multidoc ? -1 : 1;

  if (a.party_name_match !== b.party_name_match)
    return a.party_name_match ? -1 : 1;

  if (a.wow_match_name !== b.wow_match_name) return a.wow_match_name ? -1 : 1;

  if (a.wow_match_bizaddr_unit !== b.wow_match_bizaddr_unit)
    return a.wow_match_bizaddr_unit ? -1 : 1;

  if (a.acris_docs.length !== b.acris_docs.length)
    return a.acris_docs.length ? -1 : 1;

  if (
    unitsNeeded > 0 &&
    a.unitsres >= unitsNeeded !== b.unitsres >= unitsNeeded
  )
    return a.unitsres >= unitsNeeded ? -1 : 1;

  return a.distance_ft - b.distance_ft;
};

// Return the above function with the additional argument pre-filled so we can
// incorporate the number of additional units needed into the sort logic
export const getPrioritizeBldgs = (unitsNeeded: number) => {
  return (a: RelatedProperty, b: RelatedProperty) =>
    prioritizeBldgsWithUnits(a, b, unitsNeeded);
};

export const urlCountyClerkBbl = (bbl: string) => {
  const { block, lot } = splitBBL(bbl);
  return `https://www.richmondcountyclerk.com/Search/ShowResultsBlocks?Block=${block}&Lot=${lot}`;
};

export const urlAcrisBbl = (bbl: string) => {
  const { boro, block, lot } = splitBBL(bbl);
  return `http://a836-acris.nyc.gov/bblsearch/bblsearch.asp?borough=${boro}&block=${block}&lot=${lot}`;
};

export const urlAcrisDoc = (docId: string) => {
  return `https://a836-acris.nyc.gov/DS/DocumentSearch/DocumentImageView?doc_id=${docId}`;
};

export const urlMyGov = (lngLat?: string) => {
  return lngLat
    ? `https://www.mygovnyc.org/?lnglat=${encodeURIComponent(lngLat)}`
    : "https://www.mygovnyc.org";
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
  new Intl.NumberFormat("en-US").format(n);

export const formatMoney = (n: number, decimalDigits?: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: decimalDigits,
  }).format(n);

export const buildingSubsidyLanguage = (subsidyName?: string): string => {
  return subsidyName === "HUD Project-Based"
    ? "receives a HUD Project-Based subsidy"
    : subsidyName === "Low-Income Housing Tax Credit (LIHTC)"
    ? "receives receives the Low-Income Housing Tax Credit (LIHTC)"
    : subsidyName === "Article XI"
    ? "is an Article XI"
    : subsidyName === "HPD program"
    ? "is part of an HPD subsidy program"
    : subsidyName === "Mitchell-Lama"
    ? "is a Mitchell-Lama"
    : subsidyName === "NYCHA"
    ? "is part of NYCHA or PACT/RAD"
    : "";
};

// URL param encoding/compression, copied from signature-dashboard

// given an object, return a compressed, encoded string for adding to the URI
export const encodeForURI = (obj: object) => {
  return LZString.compressToEncodedURIComponent(JSON.stringify(obj));
};

// given an encoded string from the URI, decode it and return the original object
export const decodeFromURI = (str: string) => {
  return JSON.parse(LZString.decompressFromEncodedURIComponent(str));
};

// given a URLSearchParams object and a key, return the original object
export const getObjFromEncodedParam = (
  params: URLSearchParams,
  key: string
) => {
  const encodedStr = params.get(key);
  return encodedStr ? decodeFromURI(encodedStr) : null;
};
