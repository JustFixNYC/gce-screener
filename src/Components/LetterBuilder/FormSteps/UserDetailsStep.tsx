import { Controller } from "react-hook-form";
import { TextInput } from "@justfixnyc/component-library";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";

import {
  formatPhoneNumber,
  parseFormattedPhoneNumber,
} from "../../../form-utils";
import { FormHookProps } from "../../../types/LetterFormTypes";

export const UserDetailsStep: React.FC<FormHookProps> = (props) => {
  const {
    register,
    control,
    formState: { errors },
  } = props;

  const userErrors = errors.user_details;

  const { _ } = useLingui();

  return (
    <>
      <TextInput
        {...register("user_details.first_name")}
        id="form-first_name"
        labelText={_(msg`First name`)}
        invalid={!!userErrors?.first_name}
        invalidText={userErrors?.first_name?.message}
        invalidRole="status"
        type="text"
      />
      <TextInput
        {...register("user_details.last_name")}
        id="form-last_name"
        labelText={_(msg`Last name`)}
        invalid={!!userErrors?.last_name}
        invalidText={userErrors?.last_name?.message}
        invalidRole="status"
        type="text"
      />
      <TextInput
        {...register("user_details.email")}
        id="form-email"
        labelText={_(msg`Email`)}
        invalid={!!userErrors?.email}
        invalidText={userErrors?.email?.message}
        invalidRole="status"
        type="email"
      />
      <Controller
        name="user_details.phone_number"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            value={formatPhoneNumber(field.value)}
            onChange={(e) =>
              field.onChange(parseFormattedPhoneNumber(e.target.value))
            }
            id="form-phone_number"
            labelText={_(msg`Phone`)}
            invalid={!!userErrors?.phone_number}
            invalidText={userErrors?.phone_number?.message}
            invalidRole="status"
            type="tel"
          />
        )}
      />
    </>
  );
};
