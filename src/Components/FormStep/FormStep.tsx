import { ReactNode } from "react";
import "./FormStep.scss";

type FormStepProps = {
  children: ReactNode;
  step: number;
  total: number;
};

export const FormStep: React.FC<FormStepProps> = ({
  children,
  step,
  total,
}) => {
  return (
    <fieldset className="form-step">
      <p className="form-step-number">
        Question {step} of {total}
      </p>
      {children}
    </fieldset>
  );
};
