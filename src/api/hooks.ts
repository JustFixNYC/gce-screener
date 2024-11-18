import useSWR from "swr";
import { BuildingData } from "../types/APIDataTypes";
import { apiFetcher } from "./helpers";

type BuildingInfoSWRResponse = {
  data: BuildingData | undefined;
  isLoading: boolean;
  error: Error | undefined;
};

export function useGetBuildingData(
  bbl: string
): BuildingInfoSWRResponse {
  const { data, error, isLoading } = useSWR(
    `/gce/screener?bbl=${bbl}`,
    apiFetcher,
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
