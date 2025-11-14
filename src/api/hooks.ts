import useSWR from "swr";
import useSWRMutation, { TriggerWithArgs } from "swr/mutation";
import {
  BuildingData,
  ComingSoonSignupPostData,
  ComingSoonSignupResponse,
  GCEPostData,
  GCEUser,
} from "../types/APIDataTypes";
import {
  Tenants2ApiFetcher,
  Tenants2ComingSoonApiFetcher,
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

type Tenants2ComingSoonSWRResponse = {
  data: ComingSoonSignupResponse | undefined;
  error: Error | undefined;
  isMutating: boolean;
  reset: () => void;
  trigger: TriggerWithArgs<
    ComingSoonSignupResponse,
    unknown,
    "/gceletter/coming-soon-subscribe",
    ComingSoonSignupPostData
  >;
};

export function useSendComingSoonSignup(): Tenants2ComingSoonSWRResponse {
  const { data, error, trigger, reset, isMutating } = useSWRMutation(
    "/gceletter/coming-soon-subscribe",
    Tenants2ComingSoonApiFetcher,
    {
      populateCache: (result: ComingSoonSignupResponse) => result,
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
