import { Header } from "../../Header/Header";
import { ContentfulPage } from "../../../contentful/ContentfulPage";
import privacyPolicy from "../../../data/privacy-policy.en.json";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import "./Legal.scss";

export const PrivacyPolicy: React.FC = () => {
  const { _ } = useLingui();

  return (
    <div id="privacy-policy-page">
      <Header
        title={_(msg`Privacy policy`)}
        subtitle={_(msg`Last modified: Jan 24, 2025`)}
        showProgressBar={false}
      />

      <div className="content-section">
        <div className="content-section__content">
          <ContentfulPage pageFields={privacyPolicy} />
        </div>
      </div>
    </div>
  );
};
