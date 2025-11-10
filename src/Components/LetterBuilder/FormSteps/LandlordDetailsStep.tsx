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
import { FormContext, FormFields } from "../../../types/LetterFormTypes";
import Modal from "../../Modal/Modal";
import { InfoBox } from "../../InfoBox/InfoBox";
import { BackNextButtons } from "../BackNextButtons/BackNextButtons";
import { LetterStepForm } from "../LetterBuilderForm";
import { anyErrors } from "../../../form-utils";
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

export const LandlordDetailsStep: React.FC = () => {
  const {
    formMethods: {
      formState: { errors },
      getValues,
      setValue,
    },
  } = useContext(FormContext);

  const { _ } = useLingui();
  const [showOverwrite, setShowOverwrite] = useState(false);
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
      showOverwrite &&
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
  }, [showOverwrite, owners, setValue]);

  // Reset prefill flag when modal closes
  useEffect(() => {
    if (!showOverwrite) {
      hasPrefilledRef.current = false;
    }
  }, [showOverwrite]);

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

  const showLookup = !isLoading && !error && owners && !showOverwrite;
  const showManual = !isLoading && !landlordData;

  return (
    <LetterStepForm nextStep={"preview"}>
      {isLoading && <>Loading...</>}
      {error && <>Failed to lookup landlord information</>}
      {showLookup && (
        <>
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
                    This is your landlord's information as registered with the
                    NYC Department of Housing and Preservation (HPD). This may
                    be different than where you send your rent checks. We will
                    use this address to ensure your landlord receives the
                    letter.
                  </Trans>
                </InfoBox>

                <div className="landlord-details-step__landlord-info">
                  {getValues("landlord_details.name") || owners[0].value}
                  <br />
                  {getValues("landlord_details.primary_line")
                    ? formatLandlordDetailsAddress(
                        getValues("landlord_details")
                      )
                    : formatWowContactAddress(owners[0].address)}
                </div>

                <div>
                  <Trans>
                    If you feel strongly that this address is incorrect or
                    incomplete, you can{" "}
                    <button
                      type="button"
                      className="jfcl-link text-link-button"
                      onClick={() => setShowOverwrite(true)}
                    >
                      edit the address
                    </button>
                    .
                  </Trans>
                </div>
              </div>
            )}
          </FormGroup>
          <LandlordEmailFormGroup idPrefix={"lookup"} />
        </>
      )}
      {(showManual || showOverwrite) && (
        <LandlordFormGroup idPrefix="form" isOverwrite={showOverwrite} />
      )}
      {showManual && <BackNextButtons backStepName="contact_info" />}
      {showOverwrite && (
        <BackNextButtons
          button1Props={{ onClick: () => setShowOverwrite(false) }}
        />
      )}
    </LetterStepForm>
  );
};

const LandlordFormGroup: React.FC<{
  idPrefix?: string;
  isOverwrite?: boolean;
}> = ({ idPrefix = "form", isOverwrite = false }) => {
  const {
    formMethods: {
      register,
      getValues,
      setValue,
      control,
      watch,
      formState: { errors },
    },
  } = useContext(FormContext);

  const landlordErrors = errors.landlord_details;

  const { _ } = useLingui();
  const currentValues = getValues("landlord_details");

  const anyLandlordInfoErrors = anyErrors(
    [
      "name",
      "primary_line",
      "no_unit",
      "secondary_line",
      "city",
      "state",
      "urbanization",
      "zip_code",
    ],
    landlordErrors
  );

  return (
    <div>
      <FormGroup
        legendText={_(msg`Your landlord's information`)}
        invalid={anyLandlordInfoErrors}
        invalidText={errors?.landlord_details?.message}
        key={`${idPrefix}-manual-input`}
        helperElement={
          isOverwrite && (
            <InfoBox color="blue">
              <Trans>
                You have chosen to overwrite the landlord information
                recommended by JustFix. Please provide your own details below,
                or use the recommended landlord information.
              </Trans>
            </InfoBox>
          )
        }
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
        />
        <TextInput
          {...register("landlord_details.primary_line")}
          id={`${idPrefix}-landlord-primary-line`}
          labelText={_(msg`Street address`)}
          invalid={!!landlordErrors?.primary_line}
          invalidText={landlordErrors?.primary_line?.message}
          invalidRole="status"
          type="text"
          defaultValue={currentValues?.primary_line || ""}
          style={{ textTransform: "uppercase" }}
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
            invalid={!!landlordErrors?.secondary_line}
            invalidText={landlordErrors?.secondary_line?.message}
            disabled={watch("landlord_details.no_unit")}
            invalidRole="status"
            type="text"
            defaultValue={currentValues?.secondary_line || ""}
            style={{ textTransform: "uppercase" }}
          />
          <Controller
            name="landlord_details.no_unit"
            control={control}
            render={({ field }) => (
              <Checkbox
                {...field}
                value="true"
                checked={field.value === true}
                onChange={() => {
                  if (!field.value) {
                    setValue("landlord_details.secondary_line", undefined);
                  }
                  field.onChange(!field.value);
                }}
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
          invalid={!!landlordErrors?.city}
          invalidText={landlordErrors?.city?.message}
          invalidRole="status"
          type="text"
          defaultValue={currentValues?.city || ""}
          style={{ textTransform: "uppercase" }}
        />
        {/* TODO: use dropdown for state to ensure correct format */}
        <TextInput
          {...register("landlord_details.state")}
          id={`${idPrefix}-landlord-state`}
          labelText={_(msg`State`)}
          invalid={!!landlordErrors?.state}
          invalidText={landlordErrors?.state?.message}
          invalidRole="status"
          type="text"
          defaultValue={currentValues?.state || ""}
          style={{ textTransform: "uppercase" }}
        />
        {watch("landlord_details.state") === "PR" && (
          <TextInput
            {...register("landlord_details.urbanization")}
            id={`${idPrefix}-landlord-urbanization`}
            labelText="Urbanization (Puerto Rico only)"
            invalid={!!landlordErrors?.urbanization}
            invalidText={landlordErrors?.urbanization?.message}
            invalidRole="status"
            type="text"
            defaultValue={currentValues?.urbanization || ""}
            style={{ textTransform: "uppercase" }}
          />
        )}
        <TextInput
          {...register("landlord_details.zip_code")}
          id={`${idPrefix}-landlord-zip-code`}
          labelText="ZIP Code"
          invalid={!!landlordErrors?.zip_code}
          invalidText={landlordErrors?.zip_code?.message}
          invalidRole="status"
          type="text"
          defaultValue={currentValues?.zip_code || ""}
        />
      </FormGroup>
      <LandlordEmailFormGroup idPrefix={idPrefix} />
    </div>
  );
};

const LandlordEmailFormGroup: React.FC<{ idPrefix: string }> = ({
  idPrefix,
}) => {
  const {
    formMethods: {
      register,
      formState: { errors },
    },
  } = useContext(FormContext);

  const { _ } = useLingui();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <FormGroup
        legendText={_(msg`Your landlord's contact information`)}
        className="form-group__section-header"
        invalid={!!errors.landlord_details?.email}
      >
        <TextInput
          {...register("landlord_details.email")}
          id={`${idPrefix}-form-email`}
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
    </>
  );
};
