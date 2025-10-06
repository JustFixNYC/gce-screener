import { Header } from "../../Header/Header";
import { ContentfulPage } from "../../../contentful/ContentfulPage";
import termsOfUse from "../../../data/terms-of-use.en.json";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import "./Legal.scss";

export const TermsOfUse: React.FC = () => {
  const { _ } = useLingui();

  return (
    <div id="terms-of-use-page">
      <Header
        title={_(msg`Terms of use`)}
        subtitle={_(msg`Last modified: August 16, 2024`)}
        showProgressBar={false}
      />

      <div className="content-section">
        <div className="content-section__content">
          <ContentfulPage pageFields={termsOfUse} />
        </div>
      </div>
    </div>
  );
};
