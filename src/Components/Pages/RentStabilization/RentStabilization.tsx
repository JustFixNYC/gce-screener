import { useLoaderData } from "react-router-dom";

import {
  ContentBox,
  ContentBoxFooter,
  ContentBoxItem,
} from "../../ContentBox/ContentBox";
import JFCLLinkExternal from "../../JFCLLinkExternal";
import { Address } from "../Home/Home";
import { Header } from "../../Header/Header";
import { useEffect } from "react";
import { openAccordionsPrint, closeAccordionsPrint } from "../../../helpers";
import { ShareButtons } from "../../ShareButtons/ShareButtons";
import "./RentStabilization.scss";

const EMAIL_SUBJECT =
  "Good Cause NYC | Find out if your apartment is rent stabilized";
const EMAIL_BODY = "...";

export const RentStabilization: React.FC = () => {
  const { address } = useLoaderData() as {
    address: Address;
  };

  useEffect(() => {
    window.addEventListener("beforeprint", openAccordionsPrint);
    window.addEventListener("afterprint", closeAccordionsPrint);
    return () => {
      window.removeEventListener("beforeprint", openAccordionsPrint);
      window.removeEventListener("afterprint", closeAccordionsPrint);
    };
  }, []);

  return (
    <div id="rent-stabilization-page">
      <Header
        title="Find out if your apartment is rent stabilized"
        address={address}
        showProgressBar={false}
        isGuide
      >
        <ShareButtons
          buttonsInfo={[
            ["bookmark", "Bookmark this page"],
            ["email", "Email this page"],
          ]}
          emailSubject={EMAIL_SUBJECT}
          emailBody={EMAIL_BODY}
        />
      </Header>

      <div className="content-section">
        <div className="content-section__content"></div>
        <ContentBox
          title="Why you need to know"
          subtitle="Good Cause Eviction only applies to tenants who are not rent stabilized."
        >
          <ContentBoxItem accordion={false}>
            <p>
              If your apartment is rent stabilized, you are not covered by Good
              Cause Eviction law because you already have stronger existing
              protections through rent stabilization law.
            </p>
          </ContentBoxItem>
        </ContentBox>
        <div className="divider__print" />
        <ContentBox subtitle="How to find out if your apartment is rent stabilized">
          <ContentBoxItem title="Request your rent history">
            <p>
              Request your rent history to help find out if your apartment is
              rent stabilized and if you're being overcharged.
            </p>
            <br />
            <p>
              If your apartment has ever been rent stabilized, you’ll receive a
              document showing the rents that your landlord has registered since
              1984.
            </p>
            <br />
            <p>
              If your apartment is not rent stabilized, you will get an email
              the day after you submit your request, saying your apartment
              doesn't have a registration on file. This means your apartment has
              never been rent stabilized, and therefore you may be eligible for
              Good Cause Eviction coverage.
            </p>
            <br />
            <JFCLLinkExternal href="https://portal.hcr.ny.gov/app/ask">
              Fill out the form
            </JFCLLinkExternal>
          </ContentBoxItem>

          <ContentBoxItem title="Attend a walk-in Clinic hosted by the Met Council on Housing">
            <p>
              Met Council on Housing’s free clinic offers tenants assistance
              with understanding their rent stabilization status and
              landlord-tenant disputes.
            </p>
            <br />
            <JFCLLinkExternal href="https://www.metcouncilonhousing.org/program/met-council-on-housings-weekly-tenants-rights-walk-in-clinic/">
              Tenants’ Rights Walk-In Clinic
            </JFCLLinkExternal>
          </ContentBoxItem>
          <ContentBoxFooter
            message="Update your coverage result"
            linkText="Adjust survey answers"
            linkTo="/survey"
          />
        </ContentBox>
        <div className="divider__print" />
      </div>
    </div>
  );
};
