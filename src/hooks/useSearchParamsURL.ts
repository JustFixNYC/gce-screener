import { useEffect } from "react";
import { SetURLSearchParams } from "react-router-dom";
import { GCEUser } from "../types/APIDataTypes";
import { Address } from "../Components/Pages/Home/Home";
import { FormFields } from "../Components/Pages/Form/Survey";
import { encodeForURI } from "../helpers";

export const useSearchParamsURL = (
  setSearchParams: SetURLSearchParams,
  address: Address,
  fields: FormFields,
  user?: GCEUser
) => {
  useEffect(() => {
    // save session state in params
    if (address && fields) {
      setSearchParams(
        {
          ...(!!user?.id && { user: encodeForURI(user) }),
          address: encodeForURI(address),
          fields: encodeForURI(fields),
        },
        { replace: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
