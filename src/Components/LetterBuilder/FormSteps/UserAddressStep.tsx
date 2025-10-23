import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";
import { FormFields, FormHookProps } from "../../../types/LetterFormTypes";
import { Address } from "../../Pages/Home/Home";
import { FieldPath } from "react-hook-form";

const geosearchToLOBAddressWithBBL = (
  addr: Address
): { fieldPath: FieldPath<FormFields>; value: string }[] => {
  return [
    {
      fieldPath: "user_details.primary_line",
      value: `${addr.houseNumber} ${addr.streetName}`,
    },
    { fieldPath: "user_details.city", value: addr.borough },
    { fieldPath: "user_details.zip_code", value: addr?.zipcode || "" },
    { fieldPath: "user_details.state", value: "NY" },
    { fieldPath: "user_details.bbl", value: addr.bbl },
  ];
};

export const UserAddressStep: React.FC<FormHookProps> = (props) => {
  const {
    setValue,
    setError,
    formState: { errors },
  } = props;
  return (
    <GeoSearchInput
      onChange={(addr) => {
        geosearchToLOBAddressWithBBL(addr).forEach(({ fieldPath, value }) => {
          setValue(fieldPath, value);
        });
      }}
      invalid={!!errors.user_details}
      setInvalid={(isError) => {
        if (isError) {
          setError("user_details", {
            type: "custom",
            message: "Error with address selection",
          });
        }
      }}
    />
  );
};
