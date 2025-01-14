import { GeoSearchProperties } from "@justfixnyc/geosearch-requester";
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

export const urlDOB = (bin: string): string => {
  return `https://a810-bisweb.nyc.gov/bisweb/COsByLocationServlet?allbin=${bin}`;
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

export const prioritizeBldgs = (a: RelatedProperty, b: RelatedProperty) => {
  if (a.wow_match_name !== b.wow_match_name) return a.wow_match_name ? -1 : 1;
  if (a.wow_match_bizaddr_unit !== b.wow_match_bizaddr_unit)
    return a.wow_match_bizaddr_unit ? -1 : 1;
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

export const openAccordionsPrint = () => {
  const accordions: NodeListOf<HTMLDetailsElement> =
    document.body.querySelectorAll("details:not([open])");
  accordions.forEach((e) => {
    e.setAttribute("open", "");
    e.dataset.wasclosed = "";
  });
};

export const closeAccordionsPrint = () => {
  const accordions: NodeListOf<HTMLDetailsElement> =
    document.body.querySelectorAll("details[data-wasclosed]");
  accordions.forEach((e) => {
    e.removeAttribute("open");
    delete e.dataset.wasclosed;
  });
};
