import useSWR from "swr";
import useSWRMutation, { TriggerWithArgs } from "swr/mutation";
import { BuildingData, GCEPostData, GCEUser } from "../types/APIDataTypes";
import { Tenants2ApiFetcher, WowApiFetcher } from "./helpers";

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
