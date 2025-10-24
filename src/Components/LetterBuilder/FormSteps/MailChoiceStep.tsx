import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
  Button,
  FormGroup,
  Icon,
  RadioButton,
  TextInput,
} from "@justfixnyc/component-library";

import { FormHookProps } from "../../../types/LetterFormTypes";
import { useFieldArray } from "react-hook-form";
import { InfoBox } from "../../InfoBox/InfoBox";
import { Pill } from "../../Pill/Pill";

export const MailChoiceStep: React.FC<FormHookProps> = (props) => {
  const {
    register,
    control,
    formState: { errors },
  } = props;

  const { fields, append, remove } = useFieldArray({
    name: "extra_emails",
    control,
  });

  const { _ } = useLingui();

  return (
    <>
      <FormGroup
        legendText="Do you want us to mail your letter for free via Certified Mail?"
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
              <div>
                <Pill color="black">Recommended</Pill>
                <Pill color="green">Free</Pill>
              </div>
              <p>
                <Trans>
                  We will send your letter for you via USPS Certified Mail ® at
                  no cost to you. We will also provide a PDF for you to download
                  for your records.
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

      <FormGroup
        legendText={_(
          msg`Email a copy to yourself and your landlord or property manager`
        )}
        helperElement={
          <InfoBox>
            <Trans>
              We highly recommend emailing a copy of the letter to yourself and
              your landlord. You can also send a copy to other people you trust.
            </Trans>
          </InfoBox>
        }
      >
        <TextInput
          {...register("user_details.email")}
          id={`form-user-email`}
          labelText={_(msg`Your email`)}
          invalid={!!errors?.user_details?.email}
          invalidText={errors?.user_details?.email?.message}
          // TODO: confirm existing value from user details is pre populated if available
          invalidRole="status"
          type="email"
        />
        <TextInput
          {...register("landlord_details.email")}
          id={`form-landlord-email`}
          labelText={_(msg`Your landlord's email`)}
          invalid={!!errors?.landlord_details?.email}
          invalidText={errors?.landlord_details?.email?.message}
          invalidRole="status"
          type="email"
        />
      </FormGroup>
      {!!fields.length && (
        <FormGroup legendText={_(msg`Additional recipients`)}>
          {fields.map((field, index) => {
            return (
              <section key={field.id}>
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
    </>
  );
};
