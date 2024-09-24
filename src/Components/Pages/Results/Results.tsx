import { FormFields } from "../../../App";
import { Address } from "../Home/Home";
import "./Results.scss";

type ResultsProps = {
  address?: Address;
  fields: FormFields;
};
export const Results: React.FC<ResultsProps> = ({ address, fields }) => {
  return (
    <>
      <h2>Results</h2>
      <br />
      Address: {address?.label}

      <br />
      <pre>fields:{JSON.stringify(fields, null, 2)}</pre>

    </>
  );
};
