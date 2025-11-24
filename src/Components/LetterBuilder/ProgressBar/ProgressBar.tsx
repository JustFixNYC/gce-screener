import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { MessageDescriptor } from "@lingui/core";

import "./ProgressBar.scss";

interface ProgressBarProps {
  /** Name of the step for header to, must be <Trans> only */
  stepName: MessageDescriptor;
  /** Number between 0-100 for progress measure */
  progress: number;
}
export const ProgressBar: React.FC<ProgressBarProps> = ({
  stepName,
  progress,
}) => {
  const { _ } = useLingui();

  return (
    <div className="progress-bar">
      <div className="progress-bar__title">
        <h2>
          <Trans>Build your letter</Trans>
        </h2>
        <span>: </span>
        <h3>{_(stepName)}</h3>
      </div>
      <div className="progress-bar__container">
        <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};
