import { Header } from "../../Header/Header";
import { MultiStepForm } from "./MultiStepForm";
import { GraphqlExample } from "./LocForm";
// import { PhoneNumberForm } from "./PhoneNumberForm";
// import { PhoneNumberFormControlled } from "./PhoneNumberFormControlled";

import "./LetterSender.scss";

export const LetterSender: React.FC = () => {
  return (
    <div id="letter-sender-page">
      <Header
        title="Send a free letter asserting your rights under Good Cause"
        showProgressBar={false}
        isGuide
      />

      <div className="content-section">
        <div className="content-section__content">
          {/* <PhoneNumberForm />
          <hr style={{ width: "100%" }} />
          <PhoneNumberFormControlled />
          <hr style={{ width: "100%" }} /> */}
          <MultiStepForm />
          <GraphqlExample />
        </div>
      </div>
    </div>
  );
};
