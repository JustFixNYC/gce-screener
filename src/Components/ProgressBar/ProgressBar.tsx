import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import { Address } from "../Pages/Home/Home";
import { abbreviateBoro, ProgressStep, toTitleCase } from "../../helpers";
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
  const steps = makeProgressSteps(location.pathname, lastStepReached, address);

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
        className={classNames("progress-bar__step", step.active && "active")}
      >
        <div className="progress-bar__step__number">{index + 1}</div>
        {StepText}
      </div>
    );

    if (index !== array.length - 1) {
      return [Step, <hr key={"hr-" + index} />];
    } else {
      return Step;
    }
  });
  return <div id="progress-bar">{progressBarSteps}</div>;
};

const makeProgressSteps = (
  pathname: string,
  lastStepReached: ProgressStep,
  address?: Address
) => {
  const steps: StepInfo[] = [
    {
      path: "/confirm_address",
      name: progressBarAddress(lastStepReached, address),
    },
    { path: "/survey", name: "Survey" },
    { path: "/results", name: "Result" },
  ];

  return steps.map((step) => {
    return { ...step, active: step.path == pathname };
  });
};

function progressBarAddress(
  lastStepReached: ProgressStep,
  address?: Address,
  maxLength = 45
) {
  if (!address || lastStepReached === ProgressStep.Home) return "Address";
  const addrShort = `${toTitleCase(
    `${address?.houseNumber || ""} ${address?.streetName}`
  )}, ${abbreviateBoro(address.borough)}`;
  return addrShort.length > maxLength
    ? `${addrShort.substring(0, maxLength)}\u2026`
    : addrShort;
}
