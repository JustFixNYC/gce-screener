import { useGetBuildingEligibilityInfo } from "../../../api/hooks";
import { FormFields } from "../../../App";
import {
  CriteriaEligibility,
  useEligibility,
} from "../../../hooks/eligibility";
import { Address } from "../Home/Home";
import "./Results.scss";

const CriteriaResult: React.FC<CriteriaEligibility> = (props) => (
  <>
    <h4>{props?.criteria}</h4>
    <ul>
      <li>determination: {props?.determination}</li>
      <li>requirement: {props?.requirement}</li>
      <li>userValue: {props?.userValue}</li>
      <li>moreInfo: {props?.moreInfo}</li>
    </ul>
  </>
);

type ResultsProps = {
  address?: Address;
  fields: FormFields;
};
export const Results: React.FC<ResultsProps> = ({ address, fields }) => {
  const bbl = address?.bbl || "";

  const {
    data: bldgData,
    error: bldgError,
    isLoading: bldgIsLoading,
  } = useGetBuildingEligibilityInfo(bbl);

  const EligibilityResults = useEligibility(fields, bldgData);

  return (
    <>
      <h2>Results</h2>
      API data:{" "}
      <pre>
        {bldgIsLoading ? "loading..." : JSON.stringify(bldgData, null, 2)}
      </pre>
      {bldgError && <pre>Error fetching API data: {bldgError.message}</pre>}
      <br />
      Address: {address?.address}
      <br />
      <pre>fields:{JSON.stringify(fields, null, 2)}</pre>
      <br />
      <h3>Eligibility criteria</h3>
      {EligibilityResults?.rent && (
        <CriteriaResult {...EligibilityResults.rent} />
      )}
      {EligibilityResults?.rentRegulation && (
        <CriteriaResult {...EligibilityResults.rentRegulation} />
      )}
    </>
  );
};
