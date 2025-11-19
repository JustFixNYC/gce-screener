import { useContext, useState } from "react";
import { Controller, FieldPath } from "react-hook-form";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
  Button,
  Checkbox,
  FormGroup,
  TextInput,
} from "@justfixnyc/component-library";

import {
  anyErrors,
  formatPhoneNumber,
  parseFormattedPhoneNumber,
} from "../../../form-utils";
import { InfoBox } from "../../InfoBox/InfoBox";
import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";
import { FormContext, FormFields } from "../../../types/LetterFormTypes";
import { Address } from "../../Pages/Home/Home";
import Modal from "../../Modal/Modal";
import { BackNextButtons } from "../BackNextButtons/BackNextButtons";
import { LetterStepForm } from "../LetterBuilderForm";
import "./FormSteps.scss";
import "./UserDetailsStep.scss";

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

export const UserDetailsStep: React.FC = () => {
  const {
    formMethods: {
      register,
      setValue,
      setError,
      control,
      watch,
      formState: { errors },
    },
  } = useContext(FormContext);

  const userErrors = errors.user_details;
  const userDetails = watch("user_details");

  const { _ } = useLingui();

  const [showModal, setShowModal] = useState(false);

  const prevStep =
    watch("reason") === "PLANNED_INCREASE" ? "rent_increase" : "non_renewal";

  const anyAddressErrors = anyErrors(
    ["first_name", "last_name", "secondary_line", "no_unit"],
    userErrors
  );
  const anyContactErrors = anyErrors(["phone_number", "email"], userErrors);

  // used to prefill address input when user has clicked back from the next step
  const initialAddress: Address | undefined =
    userDetails?.primary_line && userDetails?.city && userDetails?.bbl
      ? {
          address: `${userDetails.primary_line}, ${userDetails.city}, ${
            userDetails.zip_code || ""
          }`,
          houseNumber: userDetails.primary_line.split(" ")[0] || "",
          streetName:
            userDetails.primary_line.split(" ").slice(1).join(" ") || "",
          borough: userDetails.city,
          zipcode: userDetails.zip_code,
          bbl: userDetails.bbl,
          longLat: "",
        }
      : undefined;

  return (
    <LetterStepForm nextStep="landlord_details" className="user-details-step">
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
        invalid={anyAddressErrors}
      >
        <div className="text-input__two-column">
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
          initialAddress={initialAddress}
          onChange={(addr) => {
            geosearchToLOBAddressWithBBL(addr).forEach(
              ({ fieldPath, value }) => {
                setValue(fieldPath, value);
              }
            );
          }}
          labelText={_(msg`Street address`)}
          invalid={!!userErrors?.primary_line}
          invalidText={userErrors?.primary_line?.message}
          setInvalid={(isError) => {
            if (isError) {
              setError("user_details.primary_line", {
                type: "custom",
                message: _(msg`Error with address selection`),
              });
            }
          }}
        />
        <FormGroup
          legendText={_(msg`Unit Number`)}
          className="unit-number-input-group"
        >
          <TextInput
            {...register("user_details.secondary_line")}
            id="form-secondary_line"
            labelText=""
            helperText={_(
              msg`If your address does not have a unit number, please select “I do not have a unit number” below`
            )}
            aria-label={_(msg`Unit number`)}
            invalid={!!userErrors?.secondary_line}
            invalidText={userErrors?.secondary_line?.message}
            disabled={watch("user_details.no_unit")}
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
                onChange={() => {
                  if (!field.value) {
                    setValue("user_details.secondary_line", undefined);
                  }
                  field.onChange(!field.value);
                }}
                labelText={_(msg`I do not have a unit number`)}
                id="no_unit"
              />
            )}
          />
        </FormGroup>
      </FormGroup>
      <FormGroup
        legendText={_(msg`Your contact information`)}
        className="form-group__section-header"
        invalid={anyContactErrors}
      >
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
              labelText={_(msg`Phone number`)}
              invalid={!!userErrors?.phone_number}
              invalidText={userErrors?.phone_number?.message}
              invalidRole="status"
              type="tel"
            />
          )}
        />
        <TextInput
          {...register("user_details.email")}
          id="form-email"
          labelText={_(msg`Email`) + " " + _(msg`(optional)`)}
          invalid={!!userErrors?.email}
          invalidText={userErrors?.email?.message}
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
      <BackNextButtons backStepName={prevStep} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        hasCloseBtn={true}
        header={_(msg`Why we ask for your phone number and email`)}
      >
        <section>
          <Trans>
            <strong>Phone number</strong>
          </Trans>
          <Trans>
            <p>
              We’ll text you with your USPS tracking number. We will also check
              in after your letter is mailed. We will never call you or share
              your phone number.
            </p>
          </Trans>
        </section>
        <section>
          <Trans>
            <strong>Email</strong>
          </Trans>
          <Trans>
            <p>
              We'll email you a PDF copy of your letter. We'll also include your
              email in the letter to your landlord so they can contact you. We
              will only share your email if you tell us to.
            </p>
          </Trans>
        </section>
        <Button
          variant="secondary"
          labelText={_(msg`Close`)}
          onClick={() => setShowModal(false)}
        />
      </Modal>
    </LetterStepForm>
  );
};
