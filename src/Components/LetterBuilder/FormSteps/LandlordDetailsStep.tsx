import React, { useState, useEffect, useContext, useCallback } from "react";
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

import {
  FormContext,
  FormFields,
  LobAddressFields,
} from "../../../types/LetterFormTypes";
import Modal from "../../Modal/Modal";
import { InfoBox } from "../../InfoBox/InfoBox";
import { BackNextButtons } from "../BackNextButtons/BackNextButtons";
import { LetterStepForm } from "../LetterBuilderForm";
import { anyErrors } from "../../../form-utils";
import { AddressConfirmationModal } from "../../AddressConfirmationModal/AddressConfirmationModal";
import { StateSelect } from "../../StateSelect/StateSelect";
import { stateOptions } from "../../StateSelect/stateOptions";
import {
  Deliverability,
  getVerifiedHpdLandlord,
  verifyAddress,
} from "../landlordAddressHelpers";
import { toTitleCase } from "../../../helpers";
import { Notice } from "../../Notice/Notice";
import "./LandlordDetailsStep.scss";

export const LandlordDetailsStep: React.FC = () => {
  const nextStep = "preview";
  const {
    next,
    formMethods: {
      formState: { errors },
      getValues,
      setValue,
      trigger,
      clearErrors,
    },
  } = useContext(FormContext);

  const { _ } = useLingui();

  const [isLoading, setIsLoading] = useState(true);
  const [hpdLandlord, setHpdLandlord] =
    useState<FormFields["landlord_details"]>();
  const [showManual, setShowManual] = useState<boolean>();
  const [showOverwrite, setShowOverwrite] = useState(false);
  const [showHpdInvalidModal, setShowHpdInvalidModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lobDeliverability, setLobDeliverability] = useState<Deliverability>();

  // Update current form state for landlord_details. If landlordDetails is
  // undefined, reset all landlord fields except email
  const updateLandlordDetails = useCallback(
    (
      landlordDetails?: LobAddressFields &
        Partial<FormFields["landlord_details"]>,
      override?: Partial<FormFields["landlord_details"]>
    ) => {
      clearErrors("landlord_details");
      setValue("landlord_details", {
        ...getValues("landlord_details"),
        ...(landlordDetails || DEFAULT_LANDLORD_RESET),
        ...override,
      });
    },
    [clearErrors, getValues, setValue]
  );

  // Check for HPD reg landlord and set values if available
  useEffect(() => {
    const fetchAndSetHpdLandlord = async () => {
      const hpdLandlordFields = await getVerifiedHpdLandlord(
        getValues("user_details.bbl")
      );

      setHpdLandlord(hpdLandlordFields);
      updateLandlordDetails(hpdLandlordFields);
      setShowManual(!hpdLandlordFields);
      setIsLoading(false);
    };
    fetchAndSetHpdLandlord();
  }, [getValues, updateLandlordDetails, setValue]);

  const onSubmit = async () => {
    const isValid = await trigger("landlord_details", { shouldFocus: true });
    if (!isValid) {
      console.warn(errors);
      const anyAddressErrors = anyErrors(
        [
          "primary_line",
          "city",
          "state",
          "zip_code",
          "no_unit",
          "name",
          "urbanization",
          "secondary_line",
        ],
        errors.landlord_details
      );
      if (!showManual && anyAddressErrors) {
        setShowHpdInvalidModal(true);
      }
      return;
    }

    // No need to run verify again if just confirming prior verification result
    if (showConfirmModal) {
      next(nextStep);
      return;
    }

    const { deliverability, verifiedAddress } = await verifyAddress(
      getValues("landlord_details")
    );

    updateLandlordDetails(verifiedAddress);
    setLobDeliverability(deliverability);
    if (deliverability !== "deliverable") {
      setShowConfirmModal(true);
      return;
    }

    next(nextStep);
  };

  const onBackToHpdLookup = () => {
    setShowManual(false);
    setShowOverwrite(false);
    updateLandlordDetails(hpdLandlord);
  };

  return (
    <LetterStepForm onSubmit={onSubmit} className="landlord-details-step">
      {isLoading && (
        <Notice
          className="loading-notice"
          color="off-white-200"
          header={
            <Trans>
              Checking city records for your landlord’s information...
            </Trans>
          }
          headingLevel={4}
        >
          <p>
            <Trans>
              This can take a few seconds. Please don’t refresh the page.
            </Trans>
          </p>
        </Notice>
      )}
      {hpdLandlord && !showManual && (
        <>
          <FormGroup
            legendText={
              <h4>
                <Trans>Your landlord’s information</Trans>
              </h4>
            }
            key="landlord-details__hpd-lookup"
          >
            <InfoBox>
              <Trans>
                This is your landlord’s information as registered with the NYC
                Department of Housing and Preservation (HPD). This may be
                different than where you send your rent checks.
              </Trans>
            </InfoBox>

            <FormattedLandlordAddress landlordDetails={hpdLandlord} />

            <div className="landlord-details-step__edit-address">
              <Trans>
                If you feel strongly that this address is incorrect or
                incomplete, you can{" "}
                <button
                  type="button"
                  className="jfcl-link text-link-button"
                  onClick={() => {
                    setShowManual(true);
                    setShowOverwrite(true);
                  }}
                >
                  edit the address
                </button>
                .
              </Trans>
            </div>
          </FormGroup>
          <LandlordEmailFormGroup />
        </>
      )}
      {!isLoading && showManual && (
        <LandlordFormGroup
          isOverwrite={showOverwrite}
          onBackToHpdLookup={onBackToHpdLookup}
        />
      )}
      {!isLoading && (
        <BackNextButtons
          {...(hpdLandlord && showManual
            ? { button1Props: { onClick: onBackToHpdLookup } }
            : { backStepName: "contact_info" })}
        />
      )}
      <Modal
        isOpen={showHpdInvalidModal}
        onClose={() => setShowHpdInvalidModal(false)}
        hasCloseBtn={true}
        header={_(
          msg`There is an issue with your landlord’s information on record with the city`
        )}
        className="hpd-invalid-modal"
      >
        <Trans>
          Please make any necessary corrections to your landlord’s information
        </Trans>
        <div className="modal__buttons">
          <Button
            labelText={_(msg`Edit address`)}
            onClick={() => {
              setShowHpdInvalidModal(false);
              setShowManual(true);
            }}
          />
        </div>
      </Modal>
      <AddressConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        type={lobDeliverability}
      />
    </LetterStepForm>
  );
};

const LandlordFormGroup: React.FC<{
  isOverwrite?: boolean;
  onBackToHpdLookup?: () => void;
}> = ({ isOverwrite = false, onBackToHpdLookup = () => {} }) => {
  const {
    formMethods: {
      register,
      setValue,
      control,
      watch,
      formState: { errors },
    },
  } = useContext(FormContext);

  const landlordErrors = errors.landlord_details;

  const { _ } = useLingui();

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
    <>
      <FormGroup
        legendText={
          <h4>
            <Trans>Your landlord’s mailing address</Trans>
          </h4>
        }
        invalid={anyLandlordInfoErrors}
        invalidText={errors?.landlord_details?.message}
        helperElement={
          isOverwrite ? (
            <InfoBox color="blue">
              <Trans>
                You have chosen to overwrite the landlord information on record
                with the city. Please provide your own details below, or{" "}
                <button
                  type="button"
                  className="text-link-button"
                  onClick={onBackToHpdLookup}
                >
                  use the recommended landlord information.
                </button>
              </Trans>
            </InfoBox>
          ) : (
            <InfoBox color="white">
              <Trans>
                This is where we will send your letter. We recommend using the
                best address you can find whether it is on your lease, where you
                send your rent to, or other.
              </Trans>
            </InfoBox>
          )
        }
      >
        <TextInput
          {...register("landlord_details.name")}
          id="landlord-name"
          labelText={_(msg`Landlord name`)}
          invalid={!!errors.landlord_details?.name}
          invalidText={errors.landlord_details?.name?.message}
          invalidRole="status"
          type="text"
        />
        <TextInput
          {...register("landlord_details.primary_line")}
          id="landlord-primary-line"
          labelText={_(msg`Street address`)}
          invalid={!!landlordErrors?.primary_line}
          invalidText={landlordErrors?.primary_line?.message}
          invalidRole="status"
          type="text"
        />
        <FormGroup
          legendText={_(msg`Unit Number`)}
          className="unit-number-input-group"
        >
          <TextInput
            {...register("landlord_details.secondary_line")}
            id="landlord-secondary-line"
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
                invalid={!!landlordErrors?.secondary_line}
              />
            )}
          />
        </FormGroup>
        <TextInput
          {...register("landlord_details.city")}
          id="landlord-city"
          className="landlord-city-input"
          labelText={_(msg`City`)}
          invalid={!!landlordErrors?.city}
          invalidText={landlordErrors?.city?.message}
          invalidRole="status"
          type="text"
        />

        <Controller
          name="landlord_details.state"
          control={control}
          render={({ field }) => (
            <div id="landlord-state">
              <StateSelect
                labelText={_(msg`State`)}
                invalid={!!landlordErrors?.state}
                invalidText={landlordErrors?.state?.message}
                invalidRole="status"
                value={stateOptions.find(({ value }) => value === field.value)}
                // @ts-expect-error We need to update the JFCL onChange props to match react-select
                onChange={({ value }) => {
                  field.onChange(value);
                }}
              />
            </div>
          )}
        />
        {watch("landlord_details.state") === "PR" && (
          <TextInput
            {...register("landlord_details.urbanization")}
            id="landlord-urbanization"
            labelText="Urbanization (Puerto Rico only)"
            invalid={!!landlordErrors?.urbanization}
            invalidText={landlordErrors?.urbanization?.message}
            invalidRole="status"
            type="text"
          />
        )}
        <TextInput
          {...register("landlord_details.zip_code")}
          id="landlord-zip-code"
          labelText={_(msg`ZIP code`)}
          invalid={!!landlordErrors?.zip_code}
          invalidText={landlordErrors?.zip_code?.message}
          invalidRole="status"
          type="text"
        />
      </FormGroup>
      <LandlordEmailFormGroup />
    </>
  );
};

const LandlordEmailFormGroup: React.FC = () => {
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
        legendText={
          <h4>
            <Trans>Your landlord’s email address</Trans>
          </h4>
        }
        className="form-group__section-header landlord-email-group"
        invalid={!!errors.landlord_details?.email}
      >
        <TextInput
          {...register("landlord_details.email")}
          id={`landlord-email`}
          labelText={_(msg`Email`) + " " + _(msg`(optional)`)}
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
        header={_(msg`Why we ask for your landlord’s email`)}
        className="email-modal"
      >
        <p>
          <Trans>
            We ask for your landlord’s email address so that we can send them a
            PDF copy of your letter. This helps ensure that the landlord sees
            your letter.
          </Trans>
        </p>
        <p>
          <Trans>
            We highly recommend providing your landlord’s email, especially if
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

export const FormattedLandlordAddress: React.FC<{
  landlordDetails: FormFields["landlord_details"];
}> = ({ landlordDetails: ld }) => {
  return (
    <div className="landlord-address">
      <span className="landlord-address__name">{toTitleCase(ld.name)}</span>
      <span className="landlord-address__line-1">
        {toTitleCase(ld.primary_line)}
        {ld.secondary_line ? " " + toTitleCase(ld.secondary_line) : ""}
      </span>
      <span className="landlord-address__line-2">
        {toTitleCase(ld.city)}, {ld.state} {ld.zip_code}
      </span>
    </div>
  );
};

const DEFAULT_LANDLORD_RESET: Omit<FormFields["landlord_details"], "email"> = {
  primary_line: "",
  city: "",
  state: "",
  zip_code: "",
  no_unit: false,
  name: "",
  urbanization: "",
};
