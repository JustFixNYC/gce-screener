import React from "react";
import {
  ContentBox,
  ContentBoxItem,
  ContentBoxProps,
} from "../ContentBox/ContentBox";
import JFCLLinkExternal from "../JFCLLinkExternal";
import { Button } from "@justfixnyc/component-library";

type ContentBoxHeaderProps = Omit<ContentBoxProps, "children">;

export const UniversalProtections: React.FC<ContentBoxHeaderProps> = ({
  title = "UNIVERSAL TENANT RIGHTS",
  subtitle: headerSubtitle = "Protections that all New Yorkers have",
}) => (
  <ContentBox title={title} subtitle={headerSubtitle}>
    <ContentBoxItem title="Your eviction protections">
      <p>
        The only way your landlord can evict you is through housing court.
        Lockouts (also known as unlawful evictions or self-help evictions) are
        illegal. All tenants, including those in private residential programs,
        have the right to stay in their home unless they choose to leave or are
        evicted through a court process.
      </p>
      <br />
      <p className="bold">Learn more about the eviction process</p>
      <JFCLLinkExternal
        href="https://hcr.ny.gov/eviction"
        className="has-label"
      >
        NY Homes and Community Renewal
      </JFCLLinkExternal>
      <br />
      <br />
      <p className="bold">See if you are eligible for a free attorney</p>
      <JFCLLinkExternal
        href="https://www.evictionfreenyc.org"
        className="has-label"
      >
        Eviction Free NYC
      </JFCLLinkExternal>
    </ContentBoxItem>

    <ContentBoxItem title="Your right to a liveable home">
      <p>
        Tenants have the right to live in a safe, sanitary, and well-maintained
        apartment, including public areas of the building. This right is implied
        in every residential lease, and any lease provision that waives it is
        void. If your landlord is not providing these conditions in your
        apartment or building, there are actions you can take to exercise your
        rights.
      </p>
      <br />
      <p className="bold">Learn about warranty of habitability</p>
      <JFCLLinkExternal
        href="https://nycourts.gov/courts/nyc/housing/pdfs/warrantyofhabitability.pdf"
        className="has-label"
      >
        NY Courts
      </JFCLLinkExternal>
      <br />
      <br />
      <p className="bold">Learn how tenant associations can help</p>
      <JFCLLinkExternal
        href="https://www.metcouncilonhousing.org/help-answers/forming-a-tenants-association"
        className="has-label"
      >
        Met Council on Housing
      </JFCLLinkExternal>
      <br />
      <br />
      <p className="bold">Notify your landlord of repair issues</p>
      <JFCLLinkExternal
        href="https://app.justfix.org/loc/splash"
        className="has-label"
      >
        JustFix’s Letter of Complaint
      </JFCLLinkExternal>
    </ContentBoxItem>
    <ContentBoxItem title="Your rights if you’re being discriminated against">
      <p>
        Your landlord can’t evict you based on your race, religion, gender,
        national origin, familial status, or disability. New York State law
        promises protection from discrimination, banning bias based on age,
        sexual orientation, and military status.
      </p>
      <p>
        Source of income discrimination the illegal practice by landlords,
        owners, and real estate brokers of refusing to rent to current or
        prospective tenants seeking to pay for housing with housing assistance
        vouchers, subsidies, or other forms of public assistance.
      </p>
      <br />
      <p className="bold">Learn more about fair housing</p>
      <JFCLLinkExternal
        href="https://www.nyc.gov/site/fairhousing/about/what-is-fair-housing.page"
        className="has-label"
      >
        Fair Housing NYC
      </JFCLLinkExternal>
      <br />
      <br />
      <p className="bold">
        Learn more about lawful source of income discrimination
      </p>
      <JFCLLinkExternal
        href="https://www.nyc.gov/site/fairhousing/renters/lawful-source-of-income.page"
        className="has-label"
      >
        Lawful source of income
      </JFCLLinkExternal>
      <br />
      <br />
      <p className="bold">Report source of income discrimination</p>
      <JFCLLinkExternal href="https://weunlock.nyc" className="has-label">
        Unlock NYC
      </JFCLLinkExternal>
    </ContentBoxItem>
  </ContentBox>
);

export const GoodCauseProtections: React.FC<ContentBoxHeaderProps> = ({
  title = "KNOW YOUR RIGHTS",
  subtitle = "Protections you have under Good Cause Eviction law",
}) => (
  <ContentBox title={title} subtitle={subtitle}>
    <ContentBoxItem title="Your right to a lease renewal">
      <p>
        Your landlord will need to provide a good cause reason for ending a
        tenancy. This includes evicting tenants, not renewing a lease, or, if
        the tenant does not have a lease, giving notice that the tenancy will
        end.
      </p>
    </ContentBoxItem>

    <ContentBoxItem title="Your right to limited rent increases">
      <p>
        Your landlord is not allowed to increase your rent at a rate higher than
        the local standard. The local rent standard is set every year at the
        rate of inflation plus 5%, with a maximum of 10% total.
      </p>
      <br />
      <p>
        As of May 1, 2024, the rate of inflation for the New York City area is
        3.82%, meaning that the current local rent standard is 8.82%. A rent
        increase of more than 8.82% could be found unreasonable by the court if
        the rent was increased after April 20, 2024.
      </p>
    </ContentBoxItem>

    <ContentBoxItem title="Learn more about Good Cause Eviction Law protections">
      <JFCLLinkExternal href="https://housingjusticeforall.org/kyr-good-cause">
        Housing Justice for All Good Cause Eviction fact sheet
      </JFCLLinkExternal>
      <JFCLLinkExternal
        href="https://www.metcouncilonhousing.org/help-answers/good-cause-eviction"
        className="has-label"
      >
        Met Council on Housing Good Cause Eviction fact sheet
      </JFCLLinkExternal>
    </ContentBoxItem>
  </ContentBox>
);

export const GoodCauseExercisingRights: React.FC<ContentBoxHeaderProps> = ({
  title = "EXERCISING YOUR RIGHTS",
  subtitle: headerSubtitle = "Share your coverage with your landlord",
}) => (
  <ContentBox title={title} subtitle={headerSubtitle}>
    <div className="content-box__section">
      <div className="content-box__section__content">
        <p>
          Assert your rights by printing your coverage results and sharing with
          your landlord. You can use these results as an indicator that your
          apartment is covered by Good Cause Eviction Law.
        </p>
      </div>
    </div>

    <div className="content-box__footer">
      <div className="content-box__section__content">
        <Button
          labelText="Print my coverage results"
          labelIcon="print"
          variant="secondary"
          className="disabled"
        />
      </div>
    </div>
  </ContentBox>
);

export const RentStabilizedProtections: React.FC<ContentBoxHeaderProps> = ({
  title = "EXERCISING YOUR RIGHTS",
  subtitle = "Your right to limited rent increases",
}) => (
  <ContentBox title={title} subtitle={subtitle}>
    <ContentBoxItem title="Your right to limited rent increases">
      <p>
        For rent-stabilized leases being renewed between October 1, 2024 and
        September 30, 2025 the legal rent may be increased at the following
        levels: for a one-year renewal there is a 2.75% increase, or for a
        two-year renewal there is a 5.25% increase.
      </p>
      <JFCLLinkExternal href="https://hcr.ny.gov/system/files/documents/2024/10/fact-sheet-26-10-2024.pdf">
        Learn about rent increase rights
      </JFCLLinkExternal>
    </ContentBoxItem>

    <ContentBoxItem title="Your right to a lease renewal">
      <p>
        If you are rent-stabilized your landlord cannot simply decide they don’t
        want you as a tenant anymore, they are limited to certain reasons for
        evicting you.
      </p>
      <JFCLLinkExternal href="https://rentguidelinesboard.cityofnewyork.us/resources/faqs/leases-renewal-vacancy/#landlord:~:text=If%20your%20apartment%20is%20rent,before%20the%20existing%20lease%20expires">
        Learn about lease renewal rights
      </JFCLLinkExternal>
    </ContentBoxItem>

    <ContentBoxItem title="Your right to succession">
      <p>
        If you are the immediate family member of a rent-stabilized tenant and
        have been living with them immediately prior to their moving or passing
        away, you might be entitled to take over the lease.
      </p>
      <JFCLLinkExternal href="https://www.metcouncilonhousing.org/help-answers/succession-rights-in-rent-stabilized-and-rent-controlled-apartments/">
        Learn about succession rights
      </JFCLLinkExternal>
    </ContentBoxItem>
  </ContentBox>
);
