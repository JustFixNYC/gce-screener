import { useState, useEffect, useRef, useContext } from "react";
import { Trans } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Controller } from "react-hook-form";
import {
  Button,
  Checkbox,
  FormGroup,
  TextInput,
} from "@justfixnyc/component-library";

import { useGetLandlordData } from "../../../api/hooks";
import { LandlordContact, LandlordData } from "../../../types/APIDataTypes";
import {
  FormContext,
  FormFields,
  LobAddressFields,
} from "../../../types/LetterFormTypes";
import Modal from "../../Modal/Modal";
import { InfoBox } from "../../InfoBox/InfoBox";
import { BackNextButtons } from "../BackNextButtons/BackNextButtons";
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
  return `${ld.primary_line}${
    ld.secondary_line ? " " + ld.secondary_line : ""
  }, ${ld.city}, ${ld.state} ${ld.zip_code}`;
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
    no_unit: address.apartment == "",
  };
};

export const LandlordDetailsStep: React.FC<{
  verifyAddressDeliverable?: (
    data: LobAddressFields
  ) => Promise<boolean | undefined>;
}> = ({ verifyAddressDeliverable }) => {
  const {
    formMethods: {
      control,
      formState: { errors },
      getValues,
      setValue,
      trigger,
    },
  } = useContext(FormContext);

  const { _ } = useLingui();
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
  }, [isEditModalOpen, owners, setValue]);

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
          legendText={_(msg`Please review your landlord's information`)}
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
                    labelText={_(msg`Edit`)}
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
      {showManual && <LandlordFormGroup idPrefix="form" />}
      <BackNextButtons />

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        header={_(msg`Edit your landlord's information`)}
      >
        <LandlordFormGroup idPrefix="modal-form" />
        <div className="landlord-details-step__modal-buttons">
          <Button
            type="button"
            variant="secondary"
            labelText={_(msg`Cancel`)}
            onClick={() => setIsEditModalOpen(false)}
          />
          <Button
            type="button"
            variant="primary"
            labelText={_(msg`Save`)}
            onClick={async () => {
              // Validate with form schema
              const isValid = await trigger("landlord_details", {
                shouldFocus: true,
              });
              if (!isValid) {
                console.warn(errors);
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

const LandlordFormGroup: React.FC<{ idPrefix?: string }> = ({
  idPrefix = "form",
}) => {
  const {
    formMethods: {
      register,
      getValues,
      setValue,
      control,
      formState: { errors },
    },
  } = useContext(FormContext);

  const addressErrors = errors.landlord_details;

  const { _ } = useLingui();
  const [showModal, setShowModal] = useState(false);
  const currentValues = getValues("landlord_details");

  return (
    <div>
      <FormGroup
        legendText={_(msg`Your landlord's information`)}
        invalid={!!errors?.landlord_details}
        invalidText={errors?.landlord_details?.message}
        key={`${idPrefix}-manual-input`}
      >
        <TextInput
          {...register("landlord_details.name")}
          id={`${idPrefix}-landlord-name`}
          labelText={_(msg`Landlord or property manager name`)}
          invalid={!!errors.landlord_details?.name}
          invalidText={errors.landlord_details?.name?.message}
          invalidRole="status"
          type="text"
          autoFocus
          defaultValue={currentValues?.name || ""}
          style={{ textTransform: "uppercase" }}
          onBlur={(e) =>
            setValue("landlord_details.name", e.target.value.toUpperCase(), {
              shouldValidate: !!errors.landlord_details?.name,
              shouldDirty: true,
            })
          }
        />
        <TextInput
          {...register("landlord_details.primary_line")}
          id={`${idPrefix}-landlord-primary-line`}
          labelText={_(msg`Street address`)}
          invalid={!!addressErrors?.primary_line}
          invalidText={addressErrors?.primary_line?.message}
          invalidRole="status"
          type="text"
          defaultValue={currentValues?.primary_line || ""}
          style={{ textTransform: "uppercase" }}
          onBlur={(e) =>
            // TODO: we may want to try to use onChange instead of onBlur, since
            // the value is never set if use "enter" key to submit, also differs
            // from other inputs which clear errors onChange. We might also want
            // to experiment with watch() instead of watch() in case that
            // helps with the reason this is needed in the first place
            setValue(
              "landlord_details.primary_line",
              e.target.value.toUpperCase(),
              {
                shouldValidate: !!addressErrors?.primary_line,
                shouldDirty: true,
              }
            )
          }
        />
        <FormGroup
          legendText={_(msg`Unit Number`)}
          className="unit-number-input-group"
        >
          <TextInput
            {...register("landlord_details.secondary_line")}
            id={`${idPrefix}-landlord-secondary-line`}
            labelText=""
            aria-label={_(msg`Unit Number`)}
            helperText={_(
              msg`If your landlord’s address does not have a unit number, please select “This address does not have a unit/suite/apartment” below`
            )}
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
                {
                  shouldValidate: !!addressErrors?.secondary_line,
                  shouldDirty: true,
                }
              )
            }
          />
          <Controller
            name="landlord_details.no_unit"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                value="true"
                checked={field.value === true}
                onChange={() => field.onChange(!field.value)}
                labelText={_(
                  msg`This address does not have a unit/suite/apartment`
                )}
                id="no_unit"
              />
            )}
          />
        </FormGroup>
        <TextInput
          {...register("landlord_details.city")}
          id={`${idPrefix}-landlord-city`}
          className="landlord-city-input"
          labelText={_(msg`City/Borough`)}
          invalid={!!addressErrors?.city}
          invalidText={addressErrors?.city?.message}
          invalidRole="status"
          type="text"
          defaultValue={currentValues?.city || ""}
          style={{ textTransform: "uppercase" }}
          onBlur={(e) =>
            setValue("landlord_details.city", e.target.value.toUpperCase(), {
              shouldValidate: !!addressErrors?.city,
              shouldDirty: true,
            })
          }
        />
        {/* TODO: use dropdown for state to ensure correct format */}
        <TextInput
          {...register("landlord_details.state")}
          id={`${idPrefix}-landlord-state`}
          labelText={_(msg`State`)}
          invalid={!!addressErrors?.state}
          invalidText={addressErrors?.state?.message}
          invalidRole="status"
          type="text"
          defaultValue={currentValues?.state || ""}
          style={{ textTransform: "uppercase" }}
          onBlur={(e) =>
            setValue("landlord_details.state", e.target.value.toUpperCase(), {
              shouldValidate: !!addressErrors?.state,
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
                {
                  shouldValidate: !!addressErrors?.urbanization,
                  shouldDirty: true,
                }
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
              shouldValidate: !!addressErrors?.zip_code,
              shouldDirty: true,
            })
          }
        />
      </FormGroup>
      <FormGroup
        legendText={_(msg`Your landlord's contact information`)}
        className="form-group__section-header"
      >
        <TextInput
          {...register("landlord_details.email")}
          id="form-email"
          labelText={_(msg`Email`) + " " + _(msg`(Optional)`)}
          invalid={!!errors.landlord_details?.email}
          invalidText={errors.landlord_details?.email?.message}
          invalidRole="status"
          type="email"
        />
        <div className="form-group__footer">
          <span className="form-group__footer-text">
            <Trans>Why are we asking for this information?</Trans>
          </span>
          <button
            type="button"
            className="text-link-button jfcl-link"
            onClick={() => setShowModal(true)}
          >
            <Trans>Learn more</Trans>
          </button>
        </div>
      </FormGroup>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        hasCloseBtn={true}
        header={_(msg`Why we ask for your landlord's email`)}
      >
        <p>
          <Trans>
            We ask for your landlord's email address so that we can send them a
            PDF copy of your letter. This helps ensure that the landlord sees
            your letter.
          </Trans>
          <br />
          <br />
          <Trans>
            We highly recommend providing your landlord's email, especially if
            you normally correspond with your landlord via email.
          </Trans>
        </p>
        <Button
          variant="secondary"
          labelText={_(msg`Close`)}
          onClick={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
};
