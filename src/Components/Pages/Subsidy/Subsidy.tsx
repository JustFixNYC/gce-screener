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
        title="Find out if your apartment is subsidized"
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
        <ContentBox subtitle="Good Cause Eviction only applies to tenants whose apartments are not part of subsidized housing.">
          <ContentBoxItem accordion={false}>
            <p>
              If you live in subsidized housing, you are not covered by Good
              Cause because you already have stronger existing protections
              through your housing subsidy.
            </p>
          </ContentBoxItem>
        </ContentBox>
        <div className="divider__print" />
        <ContentBox subtitle="How to find out if your apartment is subsidized.">
          <ContentBoxItem title="Check your lease">
            <p>
              Look for mentions of programs like HDFC, Mitchell-Lama, LIHTC
              (Low-Income Housing Tax Credit), or NYCHA (New York City Housing
              Authority) in your lease.
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
              TK If you got your apartment through NYC Housing Connect, you can
              be sure that your apartment is subsidized.
            </p>
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
