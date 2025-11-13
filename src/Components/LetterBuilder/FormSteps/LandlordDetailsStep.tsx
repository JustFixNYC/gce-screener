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
  LandlordContact,
  LandlordData,
  LOBVerificationResponse,
} from "../../../types/APIDataTypes";
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
import {
  separateBbl,
  Tenants2ApiFetcherVerifyAddress,
  WowApiFetcher,
} from "../../../api/helpers";
import { AddressConfirmationModal } from "../../AddressConfirmationModal/AddressConfirmationModal";
import "./LandlordDetailsStep.scss";

export type Deliverability =
  | "deliverable"
  | "undeliverable"
  | "missing_unit"
  | "incorrect_unit"
  | "unnecessary_unit";

const getVerifiedHpdLandlord = async (
  bbl: FormFields["user_details"]["bbl"]
): Promise<Omit<FormFields["landlord_details"], "email"> | undefined> => {
  if (!bbl) return;

  const { borough, block, lot } = separateBbl(bbl);
  const url = `/address/wowza?borough=${borough}&block=${block}&lot=${lot}`;
  const wowData = await WowApiFetcher(url);
  const owner = getOwnerContact(wowData?.addrs?.[0]);
  if (!owner?.address?.housenumber || !owner.address.streetname) {
    return;
  }

  const wowLandlordDetails = wowContactToLandlordDetails(owner);

  try {
    const verification = await Tenants2ApiFetcherVerifyAddress(
      "/gceletter/verify_address",
      {
        arg: wowLandlordDetails,
      }
    );
    const lobAddress = LobVerificationToLandlordAddress(verification);
    return {
      ...wowLandlordDetails,
      ...lobAddress,
    };
  } catch (e) {
    console.warn(e);
    return wowLandlordDetails;
  }
};

const getOwnerContact = (data?: LandlordData): LandlordContact | undefined => {
  // TODO: review LOC methodology more closely
  // https://github.com/JustFixNYC/tenants2/blob/master/loc/landlord_lookup.py
  if (data === undefined) return;
  console.log(data);
  return (
    data.allcontacts
      .filter((contact) =>
        ["HeadOfficer", "IndividualOwner", "JointOwner"].includes(contact.title)
      )
      // Sort by title in above order, just happens to be alpha order by default
      .sort((a, b) => a.title.localeCompare(b.title))?.[0]
  );
};

const formatLandlordDetailsAddress = (
  ld: FormFields["landlord_details"]
): string => {
  return `${ld.primary_line}${
    ld.secondary_line ? " " + ld.secondary_line : ""
  }, ${ld.city}, ${ld.state} ${ld.zip_code}`;
};

const wowContactToLandlordDetails = (
  contact: LandlordContact
): FormFields["landlord_details"] => {
  const { address } = contact;
  return {
    // on load, there is an error from unexpected "null" without || ""
    name: contact.value || "",
    primary_line: `${address.housenumber} ${address.streetname}`,
    secondary_line: address.apartment || "",
    city: address.city || "",
    state: address.state || "",
    zip_code: address.zip || "",
    no_unit: !address.apartment,
    urbanization: undefined,
  };
};

const LobVerificationToLandlordAddress = (
  verification: LOBVerificationResponse
): LobAddressFields => {
  return {
    primary_line: verification.primary_line,
    secondary_line: verification.secondary_line,
    city: verification.components.city,
    state: verification.components.state,
    urbanization: verification.urbanization,
    zip_code: verification.components.zip_code,
    no_unit: !verification.secondary_line,
  };
};

export const FormattedLandlordAddress: React.FC<{
  landlordDetails: FormFields["landlord_details"];
}> = ({ landlordDetails }) => (
  <>
    {landlordDetails.name}
    <br />
    {formatLandlordDetailsAddress(landlordDetails)}
  </>
);

const verifyAddress = async (
  landlordDetails: FormFields["landlord_details"]
): Promise<{
  verifiedAddress: LobAddressFields;
  deliverability: Deliverability;
}> => {
  // TODO: try/catch
  const verification = await Tenants2ApiFetcherVerifyAddress(
    "/gceletter/verify_address",
    { arg: landlordDetails }
  );

  const verifiedAddress = LobVerificationToLandlordAddress(verification);

  const deliverability: Deliverability =
    verification.deliverability === "undeliverable" &&
    verification.valid_address === false
      ? "undeliverable"
      : verification.deliverability === "deliverable_missing_unit"
      ? "missing_unit"
      : verification.deliverability === "deliverable_incorrect_unit"
      ? "incorrect_unit"
      : verification.deliverability === "deliverable_unnecessary_unit"
      ? "unnecessary_unit"
      : "deliverable";

  return { verifiedAddress, deliverability };
};

export const LandlordDetailsStep: React.FC = () => {
  const nextStep = "preview";
  const { next, formMethods } = useContext(FormContext);
  const {
    formState: { errors },
    getValues,
    setValue,
    trigger,
    clearErrors,
  } = formMethods;

  const { _ } = useLingui();
  const [isLoading, setIsLoading] = useState(true);
  const [hpdLandlord, setHpdLandlord] =
    useState<Omit<FormFields["landlord_details"], "email">>();
  const [showManual, setShowManual] = useState<boolean>();
  const [showOverwrite, setShowOverwrite] = useState(false);
  const [showHpdInvalidModal, setShowHpdInvalidModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [lobDeliverability, setLobDeliverability] = useState<Deliverability>();

  // Update current form state for landlord_details
  const updateLandlordDetails = useCallback(
    (
      landlordDetails?: LobAddressFields &
        Partial<FormFields["landlord_details"]>,
      override?: Partial<FormFields["landlord_details"]>
    ) => {
      clearErrors("landlord_details");
      if (landlordDetails) {
        setValue("landlord_details", {
          ...getValues("landlord_details"),
          ...landlordDetails,
          ...override,
        });
      }
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
      if (hpdLandlordFields) {
        updateLandlordDetails(hpdLandlordFields);
        setShowManual(false);
      } else {
        setShowManual(true);
      }
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
    updateLandlordDetails();
  };

  return (
    <LetterStepForm onSubmit={onSubmit} className="landlord-details-step">
      {isLoading && <>Checking city data for your landlord's information...</>}
      {hpdLandlord && !showManual && (
        <>
          <FormGroup
            legendText={_(msg`Please review your landlord's information`)}
            key="landlord-details__hpd-lookup"
          >
            <InfoBox>
              <Trans>
                This is your landlord's information as registered with the NYC
                Department of Housing and Preservation (HPD). This may be
                different than where you send your rent checks. We will use this
                address to ensure your landlord receives the letter.
              </Trans>
            </InfoBox>

            <div className="landlord-details-step__landlord-info">
              <FormattedLandlordAddress landlordDetails={hpdLandlord} />
            </div>

            <div>
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
        <LandlordFormGroup isOverwrite={showOverwrite} />
      )}
      {!isLoading && (
        <BackNextButtons
          {...(hpdLandlord
            ? { button1Props: { onClick: onBackToHpdLookup } }
            : { backStepName: "contact_info" })}
        />
      )}
      <Modal
        isOpen={showHpdInvalidModal}
        onClose={() => setShowHpdInvalidModal(false)}
        hasCloseBtn={true}
        header={_(
          msg`There is an issue with your landlord's information on record with the city`
        )}
      >
        <Trans>
          Please make any necessary corrections to your landlord's information
        </Trans>
        <Button
          labelText={_(msg`Edit address`)}
          onClick={() => {
            setShowHpdInvalidModal(false);
            setShowManual(true);
          }}
        />
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
        legendText={_(msg`Your landlord's information`)}
        invalid={anyLandlordInfoErrors}
        invalidText={errors?.landlord_details?.message}
        helperElement={
          isOverwrite && (
            <InfoBox color="blue">
              <Trans>
                You have chosen to overwrite the landlord information
                recommended by JustFix. Please provide your own details below,
                or use the{" "}
                <button
                  type="button"
                  className="text-link-button"
                  onClick={onBackToHpdLookup}
                >
                  recommended landlord information
                </button>
                .
              </Trans>
            </InfoBox>
          )
        }
      >
        <TextInput
          {...register("landlord_details.name")}
          id="landlord-name"
          labelText={_(msg`Landlord or property manager name`)}
          invalid={!!errors.landlord_details?.name}
          invalidText={errors.landlord_details?.name?.message}
          invalidRole="status"
          type="text"
          autoFocus
          style={{ textTransform: "uppercase" }}
        />
        <TextInput
          {...register("landlord_details.primary_line")}
          id="landlord-primary-line"
          labelText={_(msg`Street address`)}
          invalid={!!landlordErrors?.primary_line}
          invalidText={landlordErrors?.primary_line?.message}
          invalidRole="status"
          type="text"
          style={{ textTransform: "uppercase" }}
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
          id="landlord-city"
          className="landlord-city-input"
          labelText={_(msg`City/Borough`)}
          invalid={!!landlordErrors?.city}
          invalidText={landlordErrors?.city?.message}
          invalidRole="status"
          type="text"
          style={{ textTransform: "uppercase" }}
        />
        {/* TODO: use dropdown for state to ensure correct format */}
        <TextInput
          {...register("landlord_details.state")}
          id="landlord-state"
          labelText={_(msg`State`)}
          invalid={!!landlordErrors?.state}
          invalidText={landlordErrors?.state?.message}
          invalidRole="status"
          type="text"
          style={{ textTransform: "uppercase" }}
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
            style={{ textTransform: "uppercase" }}
          />
        )}
        <TextInput
          {...register("landlord_details.zip_code")}
          id="landlord-zip-code"
          labelText="ZIP Code"
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
        legendText={_(msg`Your landlord's contact information`)}
        className="form-group__section-header"
        invalid={!!errors.landlord_details?.email}
      >
        <TextInput
          {...register("landlord_details.email")}
          id={`landlord-email`}
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
