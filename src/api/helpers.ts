import { FormFields } from "../Components/Pages/Form/Form";
import { GCEPostData } from "../types/APIDataTypes";
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

  // const body = arg
  //   ? Object.keys(arg)
  //       .map((k: string) => {
  //         const key = k as keyof GCEPostData;
  //         return `${k}=${encodeURIComponent(arg[key] as string)}`;
  //       })
  //       .join("&")
  //   : "";

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
}: FormFields): GCEPostData => {
  const form_bedrooms = bedrooms === null ? undefined : bedrooms;
  const form_rent = rent === null ? undefined : parseFloat(rent);
  const form_owner_occupied = landlord === null ? undefined : landlord;
  const form_rent_stab = rentStabilized === null ? undefined : rentStabilized;
  const form_subsidy = housingType === null ? undefined : housingType;

  return {
    form_bedrooms,
    form_rent,
    form_owner_occupied,
    form_rent_stab,
    form_subsidy,
  };
};
