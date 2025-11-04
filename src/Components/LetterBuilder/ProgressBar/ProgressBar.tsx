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
  const progress = progressOverride || ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="progress-bar">
      <h3 className="progress-bar__title">Build your letter</h3>
      <div className="progress-bar__container">
        <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};
