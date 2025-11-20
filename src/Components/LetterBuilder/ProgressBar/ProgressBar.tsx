import "./ProgressBar.scss";

interface ProgressBarProps {
  percentage: number;
}
export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  return (
    <div className="progress-bar">
      <h3 className="progress-bar__title">Build your letter</h3>
      <div className="progress-bar__container">
        <div
          className="progress-bar__fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
