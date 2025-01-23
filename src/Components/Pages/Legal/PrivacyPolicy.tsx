import { ContentfulPage } from "../../../contentful/ContentfulPage";
import { Header } from "../../Header/Header";
import privacyPolicy from "../../../data/privacy-policy.en.json";
import "./Legal.scss";

export const PrivacyPolicy: React.FC = () => {
  return (
    <div id="privacy-policy-page">
      <Header
        title="Privacy policy"
        subtitle="Last modified: May 13, 2024"
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
