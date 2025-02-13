import { useLoaderData, useSearchParams } from "react-router-dom";

import {
  ContentBox,
  ContentBoxFooter,
  ContentBoxItem,
} from "../../ContentBox/ContentBox";
import { Address } from "../Home/Home";
import { Header } from "../../Header/Header";
import { ShareButtons } from "../../ShareButtons/ShareButtons";
import { useAccordionsOpenForPrint } from "../../../hooks/useAccordionsOpenForPrint";
import { GCEUser } from "../../../types/APIDataTypes";
import { FormFields } from "../Form/Survey";
import { useSearchParamsURL } from "../../../hooks/useSearchParamsURL";
import { JFCLLinkExternal } from "../../JFCLLink";
import { gtmPush } from "../../../google-tag-manager";
import "./RentStabilization.scss";

const EMAIL_SUBJECT =
  "Good Cause NYC | Find out if your apartment is rent stabilized";
const EMAIL_BODY = "...";

export const RentStabilization: React.FC = () => {
  const { user, address, fields } = useLoaderData() as {
    user: GCEUser;
    address: Address;
    fields: FormFields;
  };
  const [, setSearchParams] = useSearchParams();

  useAccordionsOpenForPrint();
  useSearchParamsURL(setSearchParams, address, fields, user);

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
        <div className="content-section__content">
          <ContentBox subtitle="Good Cause only applies to tenants who are not rent stabilized">
            <ContentBoxItem accordion={false}>
              <p>
                If your apartment is rent stabilized, you are not covered by
                Good Cause law because you already have stronger existing
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
                If your apartment has ever been rent stabilized, you’ll receive
                a document showing the rents that your landlord has registered
                since 1984.
              </p>
              <br />
              <p>
                If your apartment is not rent stabilized, you will get an email
                the day after you submit your request, saying your apartment
                doesn't have a registration on file. This means your apartment
                has never been rent stabilized, and therefore you may be
                eligible for Good Cause Eviction coverage.
              </p>
              <JFCLLinkExternal to="https://portal.hcr.ny.gov/app/ask">
                Fill out the form
              </JFCLLinkExternal>
            </ContentBoxItem>

            <ContentBoxItem title="Attend a walk-in Clinic hosted by the Met Council on Housing">
              <p>
                Met Council on Housing’s free clinic offers tenants assistance
                with understanding their rent stabilization status and
                landlord-tenant disputes.
              </p>
              <JFCLLinkExternal to="https://www.metcouncilonhousing.org/program/met-council-on-housings-weekly-tenants-rights-walk-in-clinic/">
                Tenants’ Rights Walk-In Clinic
              </JFCLLinkExternal>
            </ContentBoxItem>
            <ContentBoxFooter
              message="Update your coverage result"
              linkText="Adjust survey answers"
              linkTo="/survey"
              linkOnClick={() => gtmPush("gce_return_survey")}
            />
          </ContentBox>
          <div className="divider__print" />
        </div>
      </div>
    </div>
  );
};
