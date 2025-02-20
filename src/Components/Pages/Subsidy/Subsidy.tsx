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
import "./Subsidy.scss";
import { JFCLLinkExternal } from "../../JFCLLink";
import { urlMyGov } from "../../../helpers";

const EMAIL_SUBJECT =
  "Good Cause NYC | Find out if your apartment is subsidized";
const EMAIL_BODY = "...";

export const Subsidy: React.FC = () => {
  const { user, address, fields } = useLoaderData() as {
    user: GCEUser;
    address: Address;
    fields: FormFields;
  };
  const [, setSearchParams] = useSearchParams();

  useAccordionsOpenForPrint();
  useSearchParamsURL(setSearchParams, address, fields, user);

  return (
    <div id="subsidy-page">
      <Header
        title="Find out if your building is subsidized"
        address={address}
        showProgressBar={false}
        isGuide
      >
        <ShareButtons
          buttonsInfo={[["email", "Email this page"]]}
          emailSubject={EMAIL_SUBJECT}
          emailBody={EMAIL_BODY}
        />
      </Header>

      <div className="content-section">
        <div className="content-section__content"></div>
        <ContentBox subtitle="Good Cause Eviction only applies to tenants whose apartments are not part of subsidized housing.">
          <ContentBoxItem accordion={false}>
            <p>
              If you live in subsidized housing, you are not covered by Good
              Cause because you already have existing eviction protections
              through your building’s housing subsidy.
            </p>
          </ContentBoxItem>
        </ContentBox>
        <div className="divider__print" />
        <ContentBox subtitle="How to find out if your building is subsidized">
          <ContentBoxItem title="Check your lease">
            <p>
              Look for mentions of programs like HDFC (Housing Development Fund
              Corporation), Mitchell-Lama, LIHTC (Low-Income Housing Tax
              Credit), or NYCHA (New York City Housing Authority) in your lease.
            </p>
          </ContentBoxItem>

          <ContentBoxItem title="Ask your landlord or management company">
            <p>
              Your landlord or property management company should be able to
              tell you if your apartment is part of a subsidy program.
            </p>
          </ContentBoxItem>
          <ContentBoxItem title="Find out if you got your apartment through NYC Housing Connect">
            <p>
              If you got your apartment through NYC Housing Connect, you can be
              sure that your apartment is subsidized.
            </p>
          </ContentBoxItem>
          <ContentBoxItem title="Connect with a tenant advocate">
            <p>
              Ask your local City Council member’s office if they can help you
              learn if your building is subsidized.
            </p>
            <JFCLLinkExternal to={urlMyGov(address.longLat)}>
              Reach out to your local city council member
            </JFCLLinkExternal>
          </ContentBoxItem>
          <ContentBoxFooter
            message="Have you learned something new?"
            linkText="Adjust survey answers"
            linkTo="/survey"
          />
        </ContentBox>
        <div className="divider__print" />
      </div>
    </div>
  );
};
