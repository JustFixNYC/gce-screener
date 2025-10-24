import { Controller, FieldPath } from "react-hook-form";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Checkbox, FormGroup, TextInput } from "@justfixnyc/component-library";

import {
  formatPhoneNumber,
  parseFormattedPhoneNumber,
} from "../../../form-utils";
import { InfoBox } from "../../InfoBox/InfoBox";
import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";
import { FormFields, FormHookProps } from "../../../types/LetterFormTypes";
import { Address } from "../../Pages/Home/Home";

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

export const UserDetailsStep: React.FC<FormHookProps> = (props) => {
  const {
    register,
    setValue,
    setError,
    control,
    formState: { errors },
  } = props;

  const userErrors = errors.user_details;

  const { _ } = useLingui();

  return (
    <>
      <FormGroup
        legendText={_(msg`Your mailing address`)}
        helperElement={
          <InfoBox>
            <Trans>
              Please use the address that is associated with your lease. This is
              the address that we will use as the return address in your letter.
            </Trans>
          </InfoBox>
        }
      >
        <div>
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
        </div>
        <GeoSearchInput
          onChange={(addr) => {
            geosearchToLOBAddressWithBBL(addr).forEach(
              ({ fieldPath, value }) => {
                setValue(fieldPath, value);
              }
            );
          }}
          labelText={_(msg`Street address`)}
          invalidText={userErrors?.primary_line?.message}
          invalid={!!userErrors}
          setInvalid={(isError) => {
            if (isError) {
              setError("user_details.primary_line", {
                type: "custom",
                message: "Error with address selection",
              });
            }
          }}
        />
        <FormGroup legendText={_(msg`Unit Number`)}>
          <TextInput
            {...register("user_details.secondary_line")}
            id="form-secondary_line"
            labelText=""
            aria-label={_(msg`Unit number`)}
            invalid={!!userErrors?.secondary_line}
            invalidText={userErrors?.secondary_line?.message}
            invalidRole="status"
            type="text"
          />

          <Controller
            name="user_details.no_unit"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                value="true"
                checked={field.value === true}
                onChange={() => field.onChange(!field.value)}
                labelText={_(msg`I do not have a unit number`)}
                id="no_unit"
              />
            )}
          />
        </FormGroup>
      </FormGroup>
      <FormGroup legendText={_(msg`Your contact information`)}>
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
      </FormGroup>
    </>
  );
};
