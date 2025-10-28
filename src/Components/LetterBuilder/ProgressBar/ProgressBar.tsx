import classNames from "classnames";

import "./ProgressBar.scss";

interface ProgressBarProps {
  steps: { id: string; name: string }[];
  currentStep: number;
  progressOverride?: number; // percentage
}
export const ProgressBar: React.FC<ProgressBarProps> = ({
  steps,
  currentStep,
  progressOverride,
}) => {
  const progress =
    progressOverride !== undefined
      ? progressOverride
      : ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="progress-bar">
      <h3 className="progress-bar__title">Build your letter</h3>
      <div className="progress-bar__container">
        <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-bar__steps">
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
    </div>
  );
};
