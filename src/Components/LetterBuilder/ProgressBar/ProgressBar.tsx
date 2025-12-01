import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { MessageDescriptor } from "@lingui/core";

import "./ProgressBar.scss";

export interface ProgressBarProps {
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
      <div id="progress-bar-title" className="progress-bar__title">
        <h2>
          <Trans>
            <strong>Letter Builder</strong>
          </Trans>
        </h2>
        <span aria-hidden>: </span>
        <h3>
          <strong>{_(stepName)}</strong>
        </h3>
      </div>
      <progress
        id="letter-progress-bar"
        max="100"
        value={progress}
        aria-labelledby="progress-bar-title"
      >
        {progress}%
      </progress>
    </div>
  );
};
