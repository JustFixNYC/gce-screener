import { useEffect } from "react";
import { ContentBoxFooter } from "../../ContentBox/ContentBox";
import { Header } from "../../Header/Header";
import {
  GoodCauseProtections,
  NYCHAProtections,
  RentStabilizedProtections,
  UniversalProtections,
} from "../../KYRContent/KYRContent";
import { openAccordionsPrint, closeAccordionsPrint } from "../../../helpers";
import "./TenantRights.scss";

export const TenantRights: React.FC = () => {
  useEffect(() => {
    window.addEventListener("beforeprint", openAccordionsPrint);
    window.addEventListener("afterprint", closeAccordionsPrint);
    return () => {
      window.removeEventListener("beforeprint", openAccordionsPrint);
      window.removeEventListener("afterprint", closeAccordionsPrint);
    };
  }, []);

  return (
    <div id="tenant-rights-page">
      <Header
        title="Understanding your rights"
        subtitle="All NYC tenants are protected by certain rights. Use this page as a guide to understand the protections you have as a New Yorker."
        showProgressBar={false}
      />

      <div className="content-section">
        <div className="content-section__content">
          <UniversalProtections />

          <GoodCauseProtections subtitle="Protections you have if you’re covered by Good Cause">
            <ContentBoxFooter
              message="Find out if you’re covered by Good Cause"
              linkText="Take the survey"
              linkTo="/"
            />
          </GoodCauseProtections>

          <RentStabilizedProtections subtitle="Protections you have if you live in a rent stabilized apartment">
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
