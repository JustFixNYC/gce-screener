import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";

import { Address } from "../Pages/Home/Home";
import { abbreviateBoro, ProgressStep, toTitleCase } from "../../helpers";
import { Pill } from "../Pill/Pill";
import "./ProgressBar.scss";

type StepInfo = { path?: string; name?: string; active?: boolean };
type ProgressBarProps = {
  address?: Address;
  lastStepReached?: ProgressStep;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  address,
  lastStepReached = ProgressStep.Home,
}) => {
  const location = useLocation();
  const { _ } = useLingui();
  const steps: StepInfo[] = [
    {
      path: "/confirm_address",
      name: progressBarAddress(lastStepReached, address) || _(msg`Address`),
    },
    { path: "/survey", name: _(msg`Survey`) },
    { path: "/results", name: _(msg`Result`) },
  ].map((step) => {
    return { ...step, active: step.path == location.pathname };
  });

  const progressBarSteps = steps.flatMap((step, index, array) => {
    const StepText =
      step.active || index > lastStepReached ? (
        <span>{step.name}</span>
      ) : (
        <Link to={step.path ?? "/"} className="jfcl-link">
          {step.name}
        </Link>
      );

    const Step = (
      <div
        key={index}
        className={classNames(
          "progress-bar__step",
          index <= lastStepReached && "visited"
        )}
      >
        <Pill color={index <= lastStepReached ? "black" : "none"} circle>
          {index + 1}
        </Pill>
        {StepText}
      </div>
    );

    if (index !== array.length - 1) {
      return [Step, <hr key={"hr-" + index} />];
    } else {
      return Step;
    }
  });
  return <nav id="progress-bar">{progressBarSteps}</nav>;
};

function progressBarAddress(
  lastStepReached: ProgressStep,
  address?: Address,
  maxLength = 45
): string | undefined {
  // Can't include the default "Address" here since it needs to be wrapped with lingui
  if (!address || lastStepReached === ProgressStep.Home) return;

  const addrShort = `${toTitleCase(
    `${address?.houseNumber || ""} ${address?.streetName}`
  )}, ${abbreviateBoro(address.borough)}`;
  return addrShort.length > maxLength
    ? `${addrShort.substring(0, maxLength)}\u2026`
    : addrShort;
}
