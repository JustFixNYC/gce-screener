import { useState } from "react";
import { Controller } from "react-hook-form";
import {
  Button,
  FormGroup,
  RadioButton,
  TextInput,
} from "@justfixnyc/component-library";
import { useGetLandlordData } from "../../../api/hooks";
import { LandlordContact, LandlordData } from "../../../types/APIDataTypes";
import {
  defaultFormValues,
  FormFields,
  FormHookProps,
} from "../../../types/LetterFormTypes";

const getOwnerContacts = (
  data?: LandlordData
): LandlordContact[] | undefined => {
  // TODO: review LOC methodology more closely
  // https://github.com/JustFixNYC/tenants2/blob/master/loc/landlord_lookup.py
  if (data === undefined) return;

  const owners = data.allcontacts
    .filter((contact) =>
      ["HeadOfficer", "IndividualOwner", "JointOwner"].includes(contact.title)
    )
    // Sort by title in above order, just happens to be alpha order by default
    .sort((a, b) => a.title.localeCompare(b.title));
  return owners;
};

const formatLandlordAddress = (addr: LandlordContact["address"]): string => {
  return `${addr.housenumber} ${addr.streetname}${
    addr.apartment ? " " + addr.apartment : ""
  }, ${addr.city}, ${addr.state} ${addr.zip}`;
};

const wowContactToLandlordDetails = (
  contact: LandlordContact
): FormFields["landlordDetails"] => {
  const { address } = contact;
  return {
    name: contact.value,
    address: {
      primary_line: `${address.housenumber} ${address.streetname}`,
      secondary_line: address.apartment,
      city: address.city,
      state: address.state,
      zip_code: address.zip,
    },
  };
};

export const LandlordDetailsStep: React.FC<FormHookProps> = (props) => {
  const {
    register,
    control,
    formState: { errors },
    getValues,
  } = props;

  const addressErrors = errors.landlordDetails?.address;

  const [lookupComplete, setLookupComplete] = useState(false);

  const {
    data: landlordData,
    isLoading,
    error,
  } = useGetLandlordData(getValues("userDetails.address.bbl"));

  const owners = getOwnerContacts(landlordData);

  const showLookup = !isLoading && !error && owners && !lookupComplete;
  const showManual = !isLoading && (!landlordData || lookupComplete);

  return (
    <>
      {isLoading && <>Loading...</>}
      {error && <>Failed to lookup landlord information</>}
      {showLookup && (
        <>
          <FormGroup
            legendText="Are any of these your landlord's information?"
            key="lookup-suggestions"
          >
            {errors?.landlordDetails && (
              <span className="error">{errors?.landlordDetails?.message}</span>
            )}
            {owners.map((owner, index) => (
              // TODO: should update JFCL to allow label to be string or ReactNode

              <Controller
                key={index}
                name="landlordDetails"
                control={control}
                render={({ field }) => (
                  <RadioButton
                    {...field}
                    value={JSON.stringify(wowContactToLandlordDetails(owner))}
                    checked={
                      JSON.stringify(field.value) ===
                      JSON.stringify(wowContactToLandlordDetails(owner))
                    }
                    onChange={() =>
                      field.onChange(wowContactToLandlordDetails(owner))
                    }
                    labelText={`${owner.value}: ${formatLandlordAddress(
                      owner.address
                    )}`}
                    id={`landlord-address_${index}`}
                  />
                )}
              />
            ))}
            <Controller
              name="landlordDetails"
              control={control}
              render={({ field }) => (
                <RadioButton
                  {...field}
                  value={JSON.stringify(defaultFormValues.landlordDetails)}
                  checked={
                    JSON.stringify(field.value) ===
                    JSON.stringify(defaultFormValues.landlordDetails)
                  }
                  onChange={() =>
                    field.onChange(defaultFormValues.landlordDetails)
                  }
                  labelText="None of the above"
                  id={`landlord-address_none`}
                  key="none-option"
                />
              )}
            />
          </FormGroup>
          <Button
            labelText="Manually enter"
            type="button"
            onClick={() => setLookupComplete(true)}
          />
        </>
      )}
      {showManual && (
        <FormGroup
          legendText="Please provide your landlord's mailing address"
          invalid={!!errors?.landlordDetails}
          invalidText={errors?.landlordDetails?.message}
          key="manual-input"
        >
          <TextInput
            {...register("landlordDetails.name")}
            id={`form-landlord-name`}
            labelText="Lanldord name"
            invalid={!!errors.landlordDetails?.name}
            invalidText={errors.landlordDetails?.name?.message}
            invalidRole="status"
            type="text"
          />
          <TextInput
            {...register("landlordDetails.address.primary_line")}
            id={`form-landlord-primary-line`}
            labelText="Primary line"
            invalid={!!addressErrors?.primary_line}
            invalidText={addressErrors?.primary_line?.message}
            invalidRole="status"
            type="text"
          />
          <TextInput
            {...register("landlordDetails.address.secondary_line")}
            id={`form-landlord-secondary-line`}
            labelText="Secondary line (optional)"
            invalid={!!addressErrors?.secondary_line}
            invalidText={addressErrors?.secondary_line?.message}
            invalidRole="status"
            type="text"
          />
          <TextInput
            {...register("landlordDetails.address.city")}
            id={`form-landlord-city`}
            labelText="City/Borough"
            invalid={!!addressErrors?.city}
            invalidText={addressErrors?.city?.message}
            invalidRole="status"
            type="text"
          />
          {/* TODO: use dropdown for state to ensure correct format */}
          <TextInput
            {...register("landlordDetails.address.state")}
            id={`form-landlord-state`}
            labelText="State"
            invalid={!!addressErrors?.state}
            invalidText={addressErrors?.state?.message}
            invalidRole="status"
            type="text"
          />
          {getValues("landlordDetails.address.state") === "PR" && (
            <TextInput
              {...register("landlordDetails.address.urbanization")}
              id={`form-landlord-urbanization`}
              labelText="Urbanization (Puerto Rico only)"
              invalid={!!addressErrors?.urbanization}
              invalidText={addressErrors?.urbanization?.message}
              invalidRole="status"
              type="text"
            />
          )}
          <TextInput
            {...register("landlordDetails.address.zip_code")}
            id={`form-landlord-zip-code`}
            labelText="ZIP Code"
            invalid={!!addressErrors?.zip_code}
            invalidText={addressErrors?.zip_code?.message}
            invalidRole="status"
            type="text"
          />
        </FormGroup>
      )}
    </>
  );
};
