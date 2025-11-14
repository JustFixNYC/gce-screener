import { Outlet } from "react-router-dom";

import { LetterBuilderForm } from "../../LetterBuilder/LetterBuilderForm";
import "./LetterSender.scss";

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
