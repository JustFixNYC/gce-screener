import { useContext } from "react";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Button, ButtonProps } from "@justfixnyc/component-library";

import { FormContext } from "../../../types/LetterFormTypes";
import { StepRouteName } from "../LetterSteps";
import "./BackNextButtons.scss";

interface BackNextButtonProps {
  // TODO: make backStepName not required if hideButon1
  backStepName: StepRouteName;
  button1Props?: Partial<ButtonProps>;
  button2Props?: Partial<ButtonProps>;
  hideButton1?: boolean;
  hideButton2?: boolean;
}

export const BackNextButtons: React.FC<BackNextButtonProps> = ({
  backStepName,
  button1Props,
  button2Props,
  hideButton1 = false,
  hideButton2 = false,
}) => {
  const { back } = useContext(FormContext);
  const { _ } = useLingui();
  return (
    <div className="letter-form__buttons">
      {!hideButton1 && (
        <Button
          labelText={_(msg`Back`)}
          labelIcon="chevronLeft"
          variant="tertiary"
          onClick={() => back(backStepName)}
          className="back-link jfcl-link"
          {...button1Props}
        />
      )}
      {!hideButton2 && (
        <Button labelText={_(msg`Next`)} type="submit" {...button2Props} />
      )}
    </div>
  );
};
