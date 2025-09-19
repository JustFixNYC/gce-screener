import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { FormGroup, RadioButton } from "@justfixnyc/component-library";

import { FormHookProps } from "../../../types/LetterFormTypes";

export const MailChoiceStep: React.FC<FormHookProps> = (props) => {
  const {
    register,
    formState: { errors },
  } = props;

  const { _ } = useLingui();

  return (
    <FormGroup legendText="Do you want us to mail your letter for free via Certified Mail?">
      {errors?.mail_choice && (
        <span className="error">{errors?.mail_choice?.message}</span>
      )}
      <RadioButton
        {...register("mail_choice")}
        labelText={_(msg`Yes, mail the letter for me`)}
        value="WE_WILL_MAIL"
        id="we-will-mail"
      />
      <RadioButton
        {...register("mail_choice")}
        labelText={_(msg`No, I will mail the letter myself`)}
        value="USER_WILL_MAIL"
        id="user-will-mail"
      />
    </FormGroup>
  );
};
