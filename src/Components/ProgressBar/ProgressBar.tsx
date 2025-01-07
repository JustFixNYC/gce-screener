import { Link, useLocation } from "react-router-dom";
import { Icon } from "@justfixnyc/component-library";
import { Address } from "../Pages/Home/Home";
import { toTitleCase } from "../../helpers";
import "./ProgressBar.scss";

type Step = { path?: string; name?: string; active?: boolean };

export const ProgressBar: React.FC<{ address?: Address }> = ({ address }) => {
  const location = useLocation();
  const steps = makeProgressSteps(location.pathname, address);

  const progressBarSteps = steps.flatMap((step, index, array) => {
    const StepElement = step.active ? (
      <span key={index} className="progress-bar__crumb__active">
        {step.name}
      </span>
    ) : (
      <Link
        key={index}
        to={step.path ?? "/"}
        className="jfcl-link progress-bar__crumb"
      >
        {step.name}
      </Link>
    );

    if (index !== array.length - 1) {
      return [
        StepElement,
        <span key={index + "caret"} className="progress-bar__caret">
          <Icon icon="caretRight" />
        </span>,
      ];
    } else {
      return StepElement;
    }
  });
  return <div className="progress-bar">{progressBarSteps}</div>;
};

const makeProgressSteps = (pathname: string, address?: Address) => {
  const steps: Step[] = [
    { path: "/", name: "Home" },
    {
      path: "/confirm_address",
      name: progressBarAddress(address),
    },
    { path: "/form", name: "Survey" },
    { path: "/results", name: "Result" },
  ];

  if (["/portfolio_size", "/rent_stabilization"].includes(pathname)) {
    steps.push({ path: pathname, name: "Guide", active: true });
    return steps;
  } else {
    return steps.map((step) => {
      return { ...step, active: step.path == pathname };
    });
  }
};

function progressBarAddress(address?: Address, maxLength = 45) {
  if (!address) return "Your address";
  const addrShort = toTitleCase(
    `${address?.houseNumber} ${address?.streetName}`
  );
  return addrShort.length > maxLength
    ? `${addrShort.substring(0, maxLength)}\u2026`
    : addrShort;
}
