import useSWR from "swr";
import useSWRMutation, { TriggerWithArgs } from "swr/mutation";
import {
  BuildingData,
  GCELetter,
  GCELetterPostData,
  GCEPostData,
  GCEUser,
  LandlordData,
} from "../types/APIDataTypes";
import {
  separateBbl,
  Tenants2ApiFetcher,
  Tenants2ApiFetcherLetter,
  WowApiFetcher,
} from "./helpers";

type BuildingDataSWRResponse = {
  data: BuildingData | undefined;
  isLoading: boolean;
  error: Error | undefined;
};

export function useGetBuildingData(bbl: string): BuildingDataSWRResponse {
  const { data, error, isLoading } = useSWR(
    `/gce/screener?bbl=${bbl}`,
    WowApiFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data: data?.result[0],
    isLoading,
    error: error,
  };
}

type Tenants2SWRResponse = {
  data: GCEUser | undefined;
  error: Error | undefined;
  isMutating: boolean;
  reset: () => void;
  trigger: TriggerWithArgs<GCEUser, unknown, "/gce/upload", GCEPostData>;
};

export function useSendGceData(): Tenants2SWRResponse {
  const { data, error, trigger, reset, isMutating } = useSWRMutation(
    "/gce/upload",
    Tenants2ApiFetcher,
    {
      populateCache: (result: GCEUser) => result,
      revalidate: false,
    }
  );

  return {
    data, // data for the given key returned from fetcher
    error, // error thrown by fetcher (or undefined)
    trigger, // (arg, options) a function to trigger a remote mutation
    reset, // a function to reset the state (data, error, isMutating)
    isMutating, // if there's an ongoing remote mutation
  };
}

type Tenants2LetterSWRResponse = {
  data: GCELetter | undefined;
  error: Error | undefined;
  isMutating: boolean;
  reset: () => void;
  trigger: TriggerWithArgs<
    GCELetter,
    unknown,
    "/gceletter/upload",
    GCELetterPostData
  >;
};

export function useSendGceLetterData(): Tenants2LetterSWRResponse {
  const { data, error, trigger, reset, isMutating } = useSWRMutation(
    "/gceletter/upload",
    Tenants2ApiFetcherLetter,
    {
      populateCache: (result: GCELetter) => result,
      revalidate: false,
    }
  );

  return {
    data, // data for the given key returned from fetcher
    error, // error thrown by fetcher (or undefined)
    trigger, // (arg, options) a function to trigger a remote mutation
    reset, // a function to reset the state (data, error, isMutating)
    isMutating, // if there's an ongoing remote mutation
  };
}

type LandlordDataSWRResponse = {
  data: LandlordData | undefined;
  isLoading: boolean;
  error: Error | undefined;
};

export function useGetLandlordData(
  bbl: string | undefined
): LandlordDataSWRResponse {
  let url: string | null;
  if (!bbl || bbl.length !== 10) {
    url = null;
  } else {
    const { borough, block, lot } = separateBbl(bbl);
    url = `/address/wowza?borough=${borough}&block=${block}&lot=${lot}`;
  }
  const { data, error, isLoading } = useSWR(url, WowApiFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  console.log({ apiData: data });
  return {
    // data: !data ? undefined : data?.addrs[0],
    data: data?.addrs[0],
    isLoading,
    error: error,
  };
}
