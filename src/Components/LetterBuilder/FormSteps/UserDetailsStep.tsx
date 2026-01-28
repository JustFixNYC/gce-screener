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
import { SampleLetter } from "../Letter/Letter";

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

  const [showContactInfoModal, setShowContactInfoModal] = useState(false);
  const [showSampleLetterModal, setShowSampleLetterModal] = useState(false);

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
        legendText={
          <h4>
            <Trans>Your mailing address</Trans>
          </h4>
        }
        helperElement={
          <MailingAddressHelperText
            onClick={() => setShowSampleLetterModal(true)}
          />
        }
        invalid={anyAddressErrors}
      >
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
                invalid={!!userErrors?.secondary_line}
              />
            )}
          />
        </FormGroup>
      </FormGroup>
      <FormGroup
        legendText={
          <h4>
            <Trans>Your contact information</Trans>
          </h4>
        }
        helperElement={
          <ContactInfoHelperText
            onClick={() => setShowContactInfoModal(true)}
          />
        }
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
      </FormGroup>
      <BackNextButtons backStepName={prevStep} />

      <Modal
        isOpen={showSampleLetterModal}
        onClose={() => setShowSampleLetterModal(false)}
        hasCloseBtn={true}
        header={_(msg`Sample letter to landlord`)}
      >
        <section>
          <InfoBox color="blue">
            <Trans>
              Below is an example of the letter we will send to your landlord if
              they are trying to raise your rent. The official letter will
              include your name, your address, your landlord’s name, and your
              landlord’s address.
            </Trans>
          </InfoBox>
        </section>
        <section>
          <div className="callout-box">
            <SampleLetter reason={watch("reason")} />
          </div>
        </section>

        <Button
          variant="secondary"
          labelText={_(msg`Close`)}
          onClick={() => setShowSampleLetterModal(false)}
        />
      </Modal>
      <Modal
        isOpen={showContactInfoModal}
        onClose={() => setShowContactInfoModal(false)}
        hasCloseBtn={true}
        header={_(msg`Why we ask for your contact information`)}
      >
        <section>
          <Trans>
            <strong>Phone number</strong>
          </Trans>
          <p>
            <Trans>
              We’ll text you with your USPS tracking number. We will also check
              in after your letter is mailed. We will never call you or share
              your phone number.
            </Trans>
          </p>
        </section>
        <section>
          <Trans>
            <strong>Email</strong>
          </Trans>
          <p>
            <Trans>
              We’ll email you a PDF copy of your letter, and include your email
              in the letter to help keep communication with your landlord
              documented. We will never share your email outside of the letter.
            </Trans>
          </p>
        </section>
        <Button
          variant="secondary"
          labelText={_(msg`Close`)}
          onClick={() => setShowContactInfoModal(false)}
        />
      </Modal>
    </LetterStepForm>
  );
};

const MailingAddressHelperText: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <InfoBox>
      <Trans>
        We’ll include this info in your letter, and use it to lookup your
        landlord’s official mailing address.{" "}
        <button
          type="button"
          className="text-link-button jfcl-link"
          onClick={onClick}
        >
          <Trans>Preview a sample letter</Trans>
        </button>
      </Trans>
    </InfoBox>
  );
};

const ContactInfoHelperText: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <InfoBox>
      <Trans>
        We’ll text you with your USPS tracking number and check in after your
        letter is mailed. We’ll also email you a pdf copy of your letter.{" "}
        <button
          type="button"
          className="text-link-button jfcl-link"
          onClick={onClick}
        >
          <Trans>Learn More</Trans>
        </button>
      </Trans>
    </InfoBox>
  );
};
