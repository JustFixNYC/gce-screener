import { ContentBoxFooter } from "../../ContentBox/ContentBox";
import { Header } from "../../Header/Header";
import {
  GoodCauseProtections,
  NYCHAProtections,
  RentStabilizedProtections,
  UniversalProtections,
} from "../../KYRContent/KYRContent";
import { useAccordionsOpenForPrint } from "../../../hooks/useAccordionsOpenForPrint";
import "./TenantRights.scss";

export const TenantRights: React.FC = () => {
  useAccordionsOpenForPrint();

  return (
    <div id="tenant-rights-page">
      <Header
        title="Understanding your rights"
        subtitle="All tenants in NYC are protected by important rights. This guide provides information about many of those rights depending on the type of housing you live in."
        showProgressBar={false}
      />

      <div className="content-section">
        <div className="content-section__content">
          <UniversalProtections />

          <GoodCauseProtections>
            <ContentBoxFooter
              message="Find out if you’re covered by Good Cause"
              linkText="Take the survey"
              linkTo="/"
            />
          </GoodCauseProtections>

          <RentStabilizedProtections>
            <ContentBoxFooter
              message="Find out if your apartment is rent stabilized"
              linkText="View the guide"
              linkTo="/rent_stabilization"
            />
          </RentStabilizedProtections>

          <NYCHAProtections />
        </div>
      </div>
    </div>
  );
};
