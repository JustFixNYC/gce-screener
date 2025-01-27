import { ContentfulPage } from "../../../contentful/ContentfulPage";
import { Header } from "../../Header/Header";
import privacyPolicy from "../../../data/terms-of-use.en.json";
import "./Legal.scss";

export const TermsOfUse: React.FC = () => {
  return (
    <div id="terms-of-use-page">
      <Header
        title="Terms of use"
        subtitle="Last modified: August 16, 2024"
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
