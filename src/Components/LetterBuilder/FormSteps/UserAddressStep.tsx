import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";
import { FormFields, FormHookProps } from "../../../types/LetterFormTypes";
import { Address } from "../../Pages/Home/Home";

const geosearchToLOBAddressWithBBL = (
  addr: Address
): FormFields["userDetails"]["address"] => {
  return {
    primary_line: `${addr.houseNumber} ${addr.streetName}`,
    city: addr.borough,
    zip_code: addr?.zipcode || "",
    state: "NY",
    bbl: addr.bbl,
  };
};

export const UserAddressStep: React.FC<FormHookProps> = (props) => {
  const {
    setValue,
    setError,
    formState: { errors },
  } = props;
  return (
    <GeoSearchInput
      onChange={(addr) =>
        setValue("userDetails.address", geosearchToLOBAddressWithBBL(addr))
      }
      invalid={!!errors.userDetails?.address}
      setInvalid={(isError) => {
        if (isError) {
          setError("userDetails.address", {
            type: "custom",
            message: "Error with address selection",
          });
        }
      }}
    />
  );
};
