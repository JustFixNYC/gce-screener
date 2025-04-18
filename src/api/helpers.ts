import { FormFields } from "../Components/Pages/Form/Survey";
import { Address } from "../Components/Pages/Home/Home";
import { CriteriaDetails } from "../hooks/useCriteriaResults";
import {
  CriteriaResults,
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
  portfolioSize,
}: FormFields): FormAnswers => {
  return {
    bedrooms: bedrooms || undefined,
    rent: rent === null ? undefined : parseFloat(rent),
    owner_occupied: landlord || undefined,
    rent_stab: rentStabilized || undefined,
    subsidy: housingType?.includes("SUBSIDIZED")
      ? "SUBSIDIZED"
      : housingType || undefined,
    portfolio_size: portfolioSize || undefined,
  };
};

export const cleanAddressFields = (address: Address) => {
  return {
    bbl: address.bbl,
    house_number: address.houseNumber,
    street_name: address.streetName,
    borough: address.borough,
    zipcode: address.zipcode,
  };
};

// Restructures criteria eligibility for database model
export const getCriteriaResults = (
  criteriaDetails?: CriteriaDetails
): CriteriaResults => {
  return {
    rent: criteriaDetails?.rent?.determination,
    rent_stab: criteriaDetails?.rentStabilized?.determination,
    building_class: criteriaDetails?.buildingClass?.determination,
    c_of_o: criteriaDetails?.certificateOfOccupancy?.determination,
    subsidy: criteriaDetails?.subsidy?.determination,
    portfolio_size: criteriaDetails?.portfolioSize?.determination,
    landlord: criteriaDetails?.landlord?.determination,
  };
};
