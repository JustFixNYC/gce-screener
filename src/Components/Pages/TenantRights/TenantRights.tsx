import { ContentBoxFooter } from "../../ContentBox/ContentBox";
import { Header } from "../../Header/Header";
import JFCLLinkInternal from "../../JFCLLinkInternal";
import {
  GoodCauseProtections,
  NYCHAProtections,
  RentStabilizedProtections,
  UniversalProtections,
} from "../../KYRContent/KYRContent";
import "./TenantRights.scss";

export const TenantRights: React.FC = () => {
  return (
    <div id="tenant-rights-page">
      <Header
        title="Understanding your rights"
        subtitle="All NYC tenants are protected by certain rights. Use this page as a guide to understand the protections you have as a New Yorker."
        pageType="Tenant rights in NYC"
        showBreadcrumbs={false}
      />

      <div className="content-section">
        <div className="content-section__content">
          <UniversalProtections />

          <GoodCauseProtections subtitle="Protections you have if you’re covered by Good Cause Eviction">
            <ContentBoxFooter
              title="Find out if you’re covered by Good Cause Eviction"
              link={<JFCLLinkInternal to="/">Take the survey</JFCLLinkInternal>}
            />
          </GoodCauseProtections>

          <RentStabilizedProtections subtitle="Protections you have if you live in a rent stabilized apartment">
            <ContentBoxFooter
              title="Find out if you’re covered by Good Cause Eviction"
              link={
                <JFCLLinkInternal to="/rent_stabilization">
                  View the guide
                </JFCLLinkInternal>
              }
            />
          </RentStabilizedProtections>

          <NYCHAProtections />
        </div>
      </div>
    </div>
  );
};
