import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";

import { Header } from "../../Header/Header";
import { LetterBuilderForm } from "../../LetterBuilder/LetterBuilderForm";
import "./LetterSender.scss";

export const LetterSender: React.FC = () => {
  const { _ } = useLingui();

  return (
    <div id="letter-sender-page">
      <Header
        title={_(
          msg`Send a free letter asserting your rights under Good Cause`
        )}
        showProgressBar={false}
        isGuide
      />

      <div className="content-section">
        <div className="content-section__content">
          <LetterBuilderForm />
        </div>
      </div>
    </div>
  );
};
