import { Button, ButtonProps } from "@justfixnyc/component-library";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { useContext } from "react";
import { FormContext } from "../../../types/LetterFormTypes";

interface BackNextButtonProps {
  button1Props?: Partial<ButtonProps>;
  button2Props?: Partial<ButtonProps>;
  hideButon1?: boolean;
  hideButon2?: boolean;
}

export const BackNextButtons: React.FC<BackNextButtonProps> = ({
  button1Props,
  button2Props,
  hideButon1 = false,
  hideButon2 = false,
}) => {
  const { back } = useContext(FormContext);
  const { _ } = useLingui();
  return (
    <div className="letter-form__buttons">
      {!hideButon1 && (
        <Button
          labelText={_(msg`Back`)}
          variant="secondary"
          onClick={back}
          {...button1Props}
        />
      )}
      {!hideButon2 && (
        <Button labelText={_(msg`Next`)} type="submit" {...button2Props} />
      )}
    </div>
  );
};
