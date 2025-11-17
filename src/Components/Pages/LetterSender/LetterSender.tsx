import { Outlet } from "react-router-dom";

import { LetterBuilderForm } from "../../LetterBuilder/LetterBuilderForm";
import "./LetterSender.scss";
import { ConfirmationStep } from "../../LetterBuilder/FormSteps/ConfirmationStep";
import { sampleConfirmationValues } from "../../../types/LetterFormTypes";

export const LetterLayout: React.FC = () => {
  return (
    <div id="letter-sender-page">
      <Outlet />
    </div>
  );
};

export const LetterSender: React.FC = () => {
  return (
    <div className="content-section">
      <div className="content-section__content">
        <LetterBuilderForm />
      </div>
    </div>
  );
};

export const LetterConfirmationTest: React.FC = () => {
  return (
    <div className="content-section">
      <div className="content-section__content">
        <ConfirmationStep confirmationResponse={undefined} />
        <ConfirmationStep confirmationResponse={{ error: true }} />
        <ConfirmationStep confirmationResponse={sampleConfirmationValues} />
      </div>
    </div>
  );
};
