import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import {
  FormGroup,
  RadioButton,
  TextInput,
} from "@justfixnyc/component-library";

import { FormHookProps } from "../../../types/LetterFormTypes";
import { Controller } from "react-hook-form";

export const EmailChoiceStep: React.FC<FormHookProps> = (props) => {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = props;

  const { _ } = useLingui();
  console.log({
    email_to_landlord: watch("email_to_landlord"),
    email: watch("landlord_details.email"),
  });
  return (
    <>
      <FormGroup
        legendText={_(
          msg`Would you like us to email a copy of your letter to your landlord?`
        )}
      >
        {errors?.email_to_landlord && (
          <span className="error">{errors?.email_to_landlord?.message}</span>
        )}
        {errors?.landlord_details?.email && (
          <span className="error">
            {errors?.landlord_details?.email?.message}
          </span>
        )}
        <Controller
          name="email_to_landlord"
          control={control}
          render={({ field }) => (
            <RadioButton
              {...field}
              value="true"
              checked={field.value === true}
              onChange={() => field.onChange(true)}
              labelText={_(msg`Yes, email a copy of the letter to my landlord`)}
              id="email-to-landlord__yes"
            />
          )}
        />
        <Controller
          name="email_to_landlord"
          control={control}
          render={({ field }) => (
            <RadioButton
              {...field}
              value="false"
              checked={field.value === false}
              onChange={() => {
                setValue("landlord_details.email", undefined);
                field.onChange(false);
              }}
              labelText={_(msg`No, don't email my landlord`)}
              id="email-to-landlord__no"
            />
          )}
        />
      </FormGroup>
      {watch("email_to_landlord") && (
        <TextInput
          {...register("landlord_details.email")}
          id={`form-landlord-email`}
          labelText={_(msg`Landlord email`)}
          invalid={!!errors.landlord_details?.email}
          invalidText={errors.landlord_details?.email?.message}
          invalidRole="status"
          type="email"
          autoFocus
        />
      )}
    </>
  );
};
