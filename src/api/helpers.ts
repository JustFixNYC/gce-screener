import { FormFields } from "../Components/Pages/Form/Form";
import { Determination, EligibilityResults } from "../hooks/eligibility";
import {
  Coverage,
  CriteriaDetermination,
  FormAnswers,
  GCEPostData,
} from "../types/APIDataTypes";
import { HTTPError, NetworkError } from "./error-reporting";

export const WowApiFetcher = async (url: string) => {
  const urlBase = import.meta.env.VITE_WOW_API_BASE_URL;
  const token = import.meta.env.VITE_WOW_API_TOKEN;

  const res = await fetch(`${urlBase}${url}`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return checkApiResponse(res);
};

export const Tenants2ApiFetcher = async (
  url: string,
  { arg }: { arg: GCEPostData }
) => {
  const urlBase = import.meta.env.VITE_TENANTS2_API_BASE_URL;
  const token = import.meta.env.VITE_TENANTS2_API_TOKEN;

  const res = await fetch(`${urlBase}${url}`, {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(arg),
  });

  return checkApiResponse(res);
};

const checkApiResponse = async (res: Response) => {
  const contentType = res.headers.get("Content-Type");
  if (!(contentType && /^application\/json/.test(contentType))) {
    throw new NetworkError(
      `Expected JSON response but got ${contentType} from ${res.url}`,
      true
    );
  }

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new HTTPError(res);
    // Attach extra info to the error object.
    error.info = await res.json();
    throw error;
  }
  try {
    return await res.json();
  } catch (e) {
    if (e instanceof Error) {
      throw new NetworkError(e.message);
    } else {
      throw new Error("Unexpected error");
    }
  }
};

export const cleanFormFields = ({
  bedrooms,
  rent,
  landlord,
  rentStabilized,
  housingType,
}: FormFields): FormAnswers => {
  return {
    bedrooms: bedrooms === null ? undefined : bedrooms,
    rent: rent === null ? undefined : parseFloat(rent),
    owner_occupied: landlord === null ? undefined : landlord,
    rent_stab: rentStabilized === null ? undefined : rentStabilized,
    subsidy: housingType === null ? undefined : housingType,
  };
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
