import { useContext } from "react";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { useFieldArray } from "react-hook-form";
import {
  Button,
  FormGroup,
  Icon,
  RadioButton,
  TextInput,
} from "@justfixnyc/component-library";

import { InfoBox } from "../../InfoBox/InfoBox";
import { Pill } from "../../Pill/Pill";
import { FormContext } from "../../../types/LetterFormTypes";
import { BackNextButtons } from "../BackNextButtons/BackNextButtons";
import "./MailChoiceStep.scss";

export const MailChoiceStep: React.FC = () => {
  const {
    formMethods: {
      register,
      control,
      formState: { errors },
    },
  } = useContext(FormContext);

  const { fields, append, remove } = useFieldArray({
    name: "extra_emails",
    control,
  });

  const { _ } = useLingui();

  return (
    <div id="mail-choice-step">
      <div className="mail-choice-step__header">
        <h3>
          <Trans>How do you want to send your letter?</Trans>
        </h3>
        <p>
          <Trans>
            Select a mailing method and provide email addresses to receive a
            copy of your letter.
          </Trans>
        </p>
      </div>
      <FormGroup
        legendText={_(msg`Select a mailing method`)}
        invalid={!!errors?.mail_choice}
        invalidText={errors?.mail_choice?.message}
      >
        <RadioButton
          {...register("mail_choice", { required: true })}
          aria-label={_(msg`We will mail the letter for you`)}
          value="WE_WILL_MAIL"
          id="we-will-mail"
          labelElement={
            <div>
              <strong>
                <Trans>We will mail the letter for you</Trans>
              </strong>
              <div className="mail-choice__pills">
                <Pill color="black">Recommended</Pill>
                <Pill color="green">Free</Pill>
              </div>
              <p>
                <Trans>
                  We will send your letter for you via USPS Certified Mail in
                  1-2 business days, at no cost to you. We will also provide a
                  PDF for you to download for your records.
                </Trans>
              </p>
            </div>
          }
        />
        <RadioButton
          {...register("mail_choice")}
          aria-label={_(msg`Mail the letter yourself`)}
          value="USER_WILL_MAIL"
          id="user-will-mail"
          labelElement={
            <div>
              <strong>
                <Trans>Mail the letter yourself</Trans>
              </strong>
              <p>
                <Trans>
                  We will provide a PDF for you to download, print, and mail to
                  your landlord or property manager.
                </Trans>
              </p>
            </div>
          }
        />
      </FormGroup>
      <div className="mail-choice__email">
        <FormGroup
          legendText={_(
            msg`Email a copy to yourself and your landlord or property manager`
          )}
          helperElement={
            <InfoBox>
              <Trans>
                We highly recommend emailing a copy of the letter to yourself
                and your landlord, especially if your normally correspond to
                your landlord via email. You can also send a copy to other
                people you trust.
              </Trans>
            </InfoBox>
          }
          className="email-form-group"
        >
          <TextInput
            {...register("user_details.email")}
            id={`form-user-email`}
            labelText={_(msg`Your email`) + " " + _(msg`(optional)`)}
            invalid={!!errors?.user_details?.email}
            invalidText={errors?.user_details?.email?.message}
            // TODO: confirm existing value from user details is pre populated if available
            invalidRole="status"
            type="email"
          />
          <TextInput
            {...register("landlord_details.email")}
            id={`form-landlord-email`}
            labelText={_(msg`Your landlord's email`) + " " + _(msg`(optional)`)}
            invalid={!!errors?.landlord_details?.email}
            invalidText={errors?.landlord_details?.email?.message}
            invalidRole="status"
            type="email"
          />
        </FormGroup>
        {!!fields.length && (
          <FormGroup
            legendText={
              _(msg`Additional recipients`) + " " + _(msg`(optional)`)
            }
            className="additional-email-form-group"
          >
            {fields.map((field, index) => {
              return (
                <section key={field.id} className="additional-email-input">
                  <TextInput
                    {...register(`extra_emails.${index}.email`)}
                    id={`form-extra_emails-${index}`}
                    labelText=""
                    aria-label={_(msg`Additional email ${index + 1}`)}
                    invalid={!!errors?.extra_emails?.[index]?.email}
                    invalidText={errors?.extra_emails?.[index]?.email?.message}
                    invalidRole="status"
                    type="email"
                  />
                  <Button
                    labelText="Remove"
                    labelIcon="xmark"
                    variant="tertiary"
                    size="small"
                    type="button"
                    onClick={() => remove(index)}
                  />
                </section>
              );
            })}
          </FormGroup>
        )}
        <button
          className="text-link-button jfcl-link"
          type="button"
          onClick={() => append({ email: "" })}
        >
          <Icon icon="plus" /> Add recipients
        </button>
      </div>
      <BackNextButtons button2Props={{ labelText: _(msg`Mail my letter`) }} />
    </div>
  );
};
