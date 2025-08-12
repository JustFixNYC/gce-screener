import classNames from "classnames";

import "./ProgressBar.scss";

interface ProgressBarProps {
  steps: { id: string; name: string }[];
  currentStep: number;
}
export const ProgressBar: React.FC<ProgressBarProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="progress-bar">
      {steps.map((step, index) => (
        <div
          className={classNames(
            "progress-bar__step",
            index === currentStep && "active"
          )}
          key={index}
        >
          <span className="progress-bar__step__id">{step.id}:</span>
          <br />
          <span className="progress-bar__step__name">{step.name}</span>
        </div>
      ))}
    </div>
  );
};
