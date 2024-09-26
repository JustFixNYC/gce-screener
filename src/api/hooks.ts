import useSWR from "swr";
import {
  BuildingEligibilityInfo,
} from "../types/APIDataTypes";
import { apiFetcher } from "./helpers";

type BuildingInfoSWRResponse = {
  data: BuildingEligibilityInfo | undefined;
  isLoading: boolean;
  error: Error | undefined;
};

export function useGetBuildingEligibilityInfo(bbl: string): BuildingInfoSWRResponse {
  const { data, error, isLoading } = useSWR(
    `/gce/eligibility?bbl=${bbl}`,
    apiFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return {
    data: data?.result[0],
    isLoading,
    error: error,
  };
}
