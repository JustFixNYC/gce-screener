import { ReactNode } from "react";
import './FormStep.scss';

type FormStepProps = {
  children: ReactNode;
  step: number;
  total: number;
  question: string;
  description?: string;
};

export const FormStep: React.FC<FormStepProps> = ({
  children,
  description,
  step,
  total,
  question,
}) => {
  return (
    <fieldset className="form-step">
      <p className="form-step-number">
        Question {step} of {total}
      </p>
      <p className="form-step-question">{question}</p>
      {description && <p className="form-step-description">{description}</p>}
      <div className="form-step-input">{children}</div>
    </fieldset>
  );
};
