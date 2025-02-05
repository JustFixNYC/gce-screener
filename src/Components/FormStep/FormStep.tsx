import { ReactNode } from "react";
import classNames from "classnames";
import "./FormStep.scss";

type FormStepProps = {
  children: ReactNode;
  invalid?: boolean;
  fieldsetRef?: React.MutableRefObject<HTMLFieldSetElement | null>;
};

export const FormStep: React.FC<FormStepProps> = ({
  children,
  invalid,
  fieldsetRef,
}) => (
  <fieldset
    className={classNames("form-step", invalid && "invalid")}
    ref={fieldsetRef}
  >
    {children}
  </fieldset>
);
