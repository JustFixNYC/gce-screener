import { useGetBuildingEligibilityInfo } from "../../../api/hooks";
import { FormFields } from "../../../App";
import { Address } from "../Home/Home";
import "./Results.scss";

type ResultsProps = {
  address?: Address;
  fields: FormFields;
};
export const Results: React.FC<ResultsProps> = ({ address, fields }) => {
  const bbl = address?.bbl || '';

  const {
    data: bldgData,
    error: bldgError,
    isLoading: bldgIsLoading,
  } = useGetBuildingEligibilityInfo(bbl);

  return (
    <>
      <h2>Results</h2>
      API data: <pre>{bldgIsLoading? "loading..." : JSON.stringify(bldgData, null, 2)}</pre>
      {bldgError && <pre>Error fetching API data: {bldgError.message}</pre>}
      <br />
      Address: {address?.address}

      <br />
      <pre>fields:{JSON.stringify(fields, null, 2)}</pre>

    </>
  );
};
