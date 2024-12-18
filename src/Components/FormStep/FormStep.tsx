import { ReactNode } from "react";
import classNames from "classnames";
import "./FormStep.scss";

type FormStepProps = {
  children: ReactNode;
  step: number;
  total: number;
  invalid?: boolean;
  fieldsetRef?: React.MutableRefObject<HTMLFieldSetElement | null>;
};

export const FormStep: React.FC<FormStepProps> = ({
  children,
  step,
  total,
  invalid,
  fieldsetRef,
}) => (
  <fieldset
    className={classNames("form-step", invalid && "invalid")}
    ref={fieldsetRef}
  >
    <p className="form-step-number">{`${step} of ${total}`}</p>
    {children}
  </fieldset>
);
