import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";
import { FormFields, FormHookProps } from "../../../types/LetterFormTypes";
import { Address } from "../../Pages/Home/Home";

const geosearchToLOBAddressWithBBL = (
  addr: Address
): Pick<
  FormFields["user_details"],
  "primary_line" | "city" | "zip_code" | "state" | "bbl"
> => {
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
    reset,
    getValues,
    setError,
    formState: { errors },
  } = props;
  return (
    <GeoSearchInput
      onChange={(addr) =>
        reset({
          user_details: {
            ...getValues("user_details"),
            ...geosearchToLOBAddressWithBBL(addr),
          },
        })
      }
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
