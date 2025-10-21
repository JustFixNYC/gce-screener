import { useState, useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import { Button, FormGroup, TextInput } from "@justfixnyc/component-library";
import { useGetLandlordData } from "../../../api/hooks";
import { LandlordContact, LandlordData } from "../../../types/APIDataTypes";
import { FormFields, FormHookProps } from "../../../types/LetterFormTypes";
import Modal from "../../Modal/Modal";
import { InfoBox } from "../../InfoBox/InfoBox";
import { Trans } from "@lingui/react/macro";
import "./LandlordDetailsStep.scss";

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

const formatLandlordDetailsAddress = (
  ld: FormFields["landlord_details"]
): string => {
  return `${ld.primary_line}${ld.secondary_line ? ld.secondary_line : ""}, ${
    ld.city
  }, ${ld.state} ${ld.zip_code}`;
};

const formatWowContactAddress = (addr: LandlordContact["address"]): string => {
  return `${addr.housenumber} ${addr.streetname}${
    addr.apartment ? " " + addr.apartment : ""
  }, ${addr.city}, ${addr.state} ${addr.zip}`;
};

const wowContactToLandlordDetails = (
  contact: LandlordContact
): FormFields["landlord_details"] => {
  const { address } = contact;
  return {
    name: contact.value,
    primary_line: `${address.housenumber} ${address.streetname}`,
    secondary_line: address.apartment || "", // on load, there is an error without || ""
    city: address.city,
    state: address.state,
    zip_code: address.zip,
  };
};

export const LandlordDetailsStep: React.FC<
  FormHookProps & {
    verifyAddressDeliverable?: (
      data: Omit<FormFields["landlord_details"], "name" | "email">
    ) => Promise<boolean | undefined>;
  }
> = (props) => {
  const {
    control,
    formState: { errors },
    getValues,
    setValue,
    trigger,
    verifyAddressDeliverable,
  } = props;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const hasPrefilledRef = useRef(false);
  const hasInitializedRef = useRef(false);

  const {
    data: landlordData,
    isLoading,
    error,
  } = useGetLandlordData(getValues("user_details.bbl"));

  const owners = getOwnerContacts(landlordData);

  // Prefill form when modal opens
  useEffect(() => {
    if (
      isEditModalOpen &&
      owners &&
      owners.length > 0 &&
      !hasPrefilledRef.current
    ) {
      const details = wowContactToLandlordDetails(owners[0]);

      setValue("landlord_details", details, {
        shouldValidate: true,
        shouldDirty: true,
      });
      hasPrefilledRef.current = true;
    }
  }, [isEditModalOpen, owners, setValue, getValues]);

  // Reset prefill flag when modal closes
  useEffect(() => {
    if (!isEditModalOpen) {
      hasPrefilledRef.current = false;
    }
  }, [isEditModalOpen]);

  // Initialize form with landlord details when component mounts
  useEffect(() => {
    if (owners && owners.length > 0 && !hasInitializedRef.current) {
      const details = wowContactToLandlordDetails(owners[0]);

      setValue("landlord_details", details, {
        shouldValidate: true,
        shouldDirty: true,
      });
      hasInitializedRef.current = true;
    }
  }, [owners, setValue]);

  const showLookup = !isLoading && !error && owners;
  const showManual = !isLoading && !landlordData;
  return (
    <>
      {isLoading && <>Loading...</>}
      {error && <>Failed to lookup landlord information</>}
      {showLookup && (
        <FormGroup
          legendText="Please review your landlord's information"
          key="landlord-details__hpd-lookup"
        >
          {errors?.landlord_details && (
            <span className="error">{errors?.landlord_details?.message}</span>
          )}
          {owners && owners.length > 0 && (
            <div>
              <InfoBox>
                <Trans>
                  This is your landlord's information as registered with the NYC
                  Department of Housing and Preservation (HPD). This may be
                  different than where you send your rent checks. We will use
                  this address to ensure your landlord receives the letter.
                </Trans>
              </InfoBox>

              <div className="landlord-details-step__landlord-info">
                {getValues("landlord_details.name") || owners[0].value}
                <br />
                {getValues("landlord_details.primary_line")
                  ? formatLandlordDetailsAddress(getValues("landlord_details"))
                  : formatWowContactAddress(owners[0].address)}
              </div>

              <Controller
                name="landlord_details"
                control={control}
                render={() => (
                  <Button
                    labelText="Edit"
                    type="button"
                    variant="tertiary"
                    onClick={() => {
                      setIsEditModalOpen(true);
                    }}
                  />
                )}
              />
            </div>
          )}
        </FormGroup>
      )}
      {showManual && <LandlordFormGroup {...props} idPrefix="form" />}

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        header="Edit your landlord's information"
      >
        <LandlordFormGroup {...props} idPrefix="modal-form" />
        <div className="landlord-details-step__modal-buttons">
          <Button
            type="button"
            variant="secondary"
            labelText="Cancel"
            onClick={() => setIsEditModalOpen(false)}
          />
          <Button
            type="button"
            variant="primary"
            labelText="Save"
            onClick={async () => {
              // Validate with form schema
              const isValid = await trigger("landlord_details", {
                shouldFocus: true,
              });
              if (!isValid) {
                return;
              }

              // Then verify address deliverability
              const currentValues = getValues("landlord_details");

              if (verifyAddressDeliverable) {
                const isDeliverable = await verifyAddressDeliverable(
                  currentValues
                );
                if (!isDeliverable) {
                  return; // Don't close modal if address is not deliverable
                }
              }

              setIsEditModalOpen(false);
            }}
          />
        </div>
      </Modal>
    </>
  );
};

const LandlordFormGroup: React.FC<
  FormHookProps & {
    idPrefix?: string;
  }
> = ({
  register,
  formState: { errors },
  getValues,
  setValue,
  idPrefix = "form",
}) => {
  const addressErrors = errors.landlord_details;
  const currentValues = getValues("landlord_details");
  return (
    <FormGroup
      legendText="Please provide your landlord's mailing address"
      invalid={!!errors?.landlord_details}
      invalidText={errors?.landlord_details?.message}
      key={`${idPrefix}-manual-input`}
    >
      <TextInput
        {...register("landlord_details.name")}
        id={`${idPrefix}-landlord-name`}
        labelText="Landlord or property manager name"
        invalid={!!errors.landlord_details?.name}
        invalidText={errors.landlord_details?.name?.message}
        invalidRole="status"
        type="text"
        autoFocus
        defaultValue={currentValues?.name || ""}
        style={{ textTransform: "uppercase" }}
        onBlur={(e) =>
          setValue("landlord_details.name", e.target.value.toUpperCase(), {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
      {/* todo: add autocomplete for primary line */}
      <TextInput
        {...register("landlord_details.primary_line")}
        id={`${idPrefix}-landlord-primary-line`}
        labelText="Primary line"
        invalid={!!addressErrors?.primary_line}
        invalidText={addressErrors?.primary_line?.message}
        invalidRole="status"
        type="text"
        defaultValue={currentValues?.primary_line || ""}
        style={{ textTransform: "uppercase" }}
        onBlur={(e) =>
          setValue(
            "landlord_details.primary_line",
            e.target.value.toUpperCase(),
            { shouldValidate: true, shouldDirty: true }
          )
        }
      />
      <TextInput
        {...register("landlord_details.secondary_line")}
        id={`${idPrefix}-landlord-secondary-line`}
        labelText="Secondary line (optional)"
        invalid={!!addressErrors?.secondary_line}
        invalidText={addressErrors?.secondary_line?.message}
        invalidRole="status"
        type="text"
        defaultValue={currentValues?.secondary_line || ""}
        style={{ textTransform: "uppercase" }}
        onBlur={(e) =>
          setValue(
            "landlord_details.secondary_line",
            e.target.value.toUpperCase(),
            { shouldValidate: true, shouldDirty: true }
          )
        }
      />
      <TextInput
        {...register("landlord_details.city")}
        id={`${idPrefix}-landlord-city`}
        labelText="City/Borough"
        invalid={!!addressErrors?.city}
        invalidText={addressErrors?.city?.message}
        invalidRole="status"
        type="text"
        defaultValue={currentValues?.city || ""}
        style={{ textTransform: "uppercase" }}
        onBlur={(e) =>
          setValue("landlord_details.city", e.target.value.toUpperCase(), {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
      {/* TODO: use dropdown for state to ensure correct format */}
      <TextInput
        {...register("landlord_details.state")}
        id={`${idPrefix}-landlord-state`}
        labelText="State"
        invalid={!!addressErrors?.state}
        invalidText={addressErrors?.state?.message}
        invalidRole="status"
        type="text"
        defaultValue={currentValues?.state || ""}
        style={{ textTransform: "uppercase" }}
        onBlur={(e) =>
          setValue("landlord_details.state", e.target.value.toUpperCase(), {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
      {getValues("landlord_details.state") === "PR" && (
        <TextInput
          {...register("landlord_details.urbanization")}
          id={`${idPrefix}-landlord-urbanization`}
          labelText="Urbanization (Puerto Rico only)"
          invalid={!!addressErrors?.urbanization}
          invalidText={addressErrors?.urbanization?.message}
          invalidRole="status"
          type="text"
          defaultValue={currentValues?.urbanization || ""}
          style={{ textTransform: "uppercase" }}
          onBlur={(e) =>
            setValue(
              "landlord_details.urbanization",
              e.target.value.toUpperCase(),
              { shouldValidate: true, shouldDirty: true }
            )
          }
        />
      )}
      <TextInput
        {...register("landlord_details.zip_code")}
        id={`${idPrefix}-landlord-zip-code`}
        labelText="ZIP Code"
        invalid={!!addressErrors?.zip_code}
        invalidText={addressErrors?.zip_code?.message}
        invalidRole="status"
        type="text"
        defaultValue={currentValues?.zip_code || ""}
        onBlur={(e) =>
          setValue("landlord_details.zip_code", e.target.value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />
    </FormGroup>
  );
};
