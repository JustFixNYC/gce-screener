import React from "react";
import {
  ContentBox,
  ContentBoxItem,
  ContentBoxProps,
} from "../ContentBox/ContentBox";
import JFCLLinkExternal from "../JFCLLinkExternal";

type KYRContentBoxProps = Omit<ContentBoxProps, "children"> & {
  children?: React.ReactNode;
};

export const UniversalProtections: React.FC<KYRContentBoxProps> = ({
  title = undefined,
  subtitle: headerSubtitle = "Protections that all New Yorkers have",
  children,
}) => (
  <>
    <ContentBox title={title} subtitle={headerSubtitle}>
      <ContentBoxItem title="Your eviction protections">
        <p>
          The only way your landlord can evict you is through housing court.
          Lockouts (also known as unlawful evictions or self-help evictions) are
          illegal. All tenants, including those in private residential programs,
          have the right to stay in their home unless they choose to leave or
          are evicted through a court process.
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
          Tenants have the right to live in a safe, sanitary, and
          well-maintained apartment, including public areas of the building.
          This right is implied in every residential lease, and any lease
          provision that waives it is void. If your landlord is not providing
          these conditions in your apartment or building, there are actions you
          can take to exercise your rights.
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
      {children}
    </ContentBox>
    <div className="divider__print" />
  </>
);

export const GoodCauseProtections: React.FC<KYRContentBoxProps> = ({
  title = undefined,
  subtitle = "Protections you have under Good Cause Eviction",
  children,
}) => (
  <>
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
          Your landlord is not allowed to increase your rent at a rate higher
          than the local standard. The local rent standard is set every year at
          the rate of inflation plus 5%, with a maximum of 10% total.
        </p>
        <br />
        <p>
          As of May 1, 2024, the rate of inflation for the New York City area is
          3.82%, meaning that the current local rent standard is 8.82%. A rent
          increase of more than 8.82% could be found unreasonable by the court
          if the rent was increased after April 20, 2024.
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
      {children}
    </ContentBox>
    <div className="divider__print" />
  </>
);

export const GoodCauseExercisingRights: React.FC<KYRContentBoxProps> = ({
  title = undefined,
  subtitle = "How to assert your rights",
  children,
}) => (
  <>
    <ContentBox title={title} subtitle={subtitle}>
      <ContentBoxItem title="Share your coverage with your landlord">
        <p>
          Assert your rights by printing your coverage results and sharing with
          your landlord. You can use these results as an indicator that your
          apartment is covered by Good Cause Eviction Law.
        </p>
        {/* TODO: add email/download/print coverage result buttons */}
      </ContentBoxItem>
      <ContentBoxItem title="Organize with your neighbors">
        <p>
          Since your apartment is covered by Good Cause Eviction, there is a
          good chance other apartments in your building are covered as well.
          Organizing with your neighbors can help you assert your rights as a
          group.
        </p>
        <JFCLLinkExternal href="">
          Tenant Organizing Toolkit from Housing Justice for All
        </JFCLLinkExternal>
      </ContentBoxItem>
      <ContentBoxItem title="Reach out to Met Council on Housing">
        <p>
          The Met Council on Housing helps organize tenants to stand up not only
          for their individual rights, but also for changes to housing policies.
          You can visit the website, or use their hotline to get answers to your
          rights as a tenant, and understand your options for dealing with a
          housing situation.
        </p>
        <JFCLLinkExternal href="">Met Council on Housing</JFCLLinkExternal>
        <JFCLLinkExternal href="">
          Call Met Council on Housing Hotline
        </JFCLLinkExternal>
      </ContentBoxItem>
      {children}
    </ContentBox>
    <div className="divider__print" />
  </>
);

export const RentStabilizedProtections: React.FC<KYRContentBoxProps> = ({
  title = undefined,
  subtitle = "Protections you have as a rent stabilized tenant",
  children,
}) => (
  <>
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
          If you are rent-stabilized your landlord cannot simply decide they
          don’t want you as a tenant anymore, they are limited to certain
          reasons for evicting you.
        </p>
        <JFCLLinkExternal href="https://rentguidelinesboard.cityofnewyork.us/resources/faqs/leases-renewal-vacancy/#landlord:~:text=If%20your%20apartment%20is%20rent,before%20the%20existing%20lease%20expires">
          Learn about lease renewal rights
        </JFCLLinkExternal>
      </ContentBoxItem>

      <ContentBoxItem title="Your right to succession">
        <p>
          If you are the immediate family member of a rent-stabilized tenant and
          have been living with them immediately prior to their moving or
          passing away, you might be entitled to take over the lease.
        </p>
        <JFCLLinkExternal href="https://www.metcouncilonhousing.org/help-answers/succession-rights-in-rent-stabilized-and-rent-controlled-apartments/">
          Learn about succession rights
        </JFCLLinkExternal>
      </ContentBoxItem>
      {children}
    </ContentBox>
    <div className="divider__print" />
  </>
);

export const NYCHAProtections: React.FC<KYRContentBoxProps> = ({
  title = undefined,
  subtitle = "Protections you have as a NYCHA tenant",
  children,
}) => (
  <>
    <ContentBox title={title} subtitle={subtitle}>
      <ContentBoxItem title="Your right to repairs">
        <p>
          Everyone has the right to live in a safe and habitable environment.
          This includes timely repairs to their apartment to address any
          maintenance issues that may arise. NYCHA Residents have the right to
          request repairs and expect prompt action from management.
        </p>
        <br />
        <p>
          If NYCHA is not responding to ticket requests, residents can file
          housing court cases (HP actions) seeking a judicial order requiring
          NYCHA to make prompt repairs.
        </p>
      </ContentBoxItem>

      <ContentBoxItem title="Your right to income-based rent">
        <p>
          This ensures that housing remains affordable and equitable for all
          residents, regardless of financial circumstances. Residents who have
          recently experienced a change in income can request an interim
          recertification to ensure that their apartment remains affordable.
        </p>
      </ContentBoxItem>

      <ContentBoxItem title="Your right to grieve management decisions">
        <p>
          In instances where residents disagree with management decisions or
          believe their rights have been violated, they have the right to grieve
          these issues through a formal process.
        </p>
        <br />
        <p>
          Residents can file grievances online through the resident portal or on
          paper by visiting the management office.
        </p>
      </ContentBoxItem>

      <ContentBoxItem title="Your right to legal representation">
        <p>
          Legal representation can make a significant difference in ensuring a
          fair and just resolution to housing disputes, protecting residents
          from wrongful eviction or other adverse outcomes.
        </p>
        <br />
        <p>
          If you do not have a lawyer and are facing a termination of tenancy at
          the Office of Impartial Hearings, you can ask for your case to be
          adjourned in order for you to seek counsel.
        </p>
      </ContentBoxItem>

      <ContentBoxItem title="Learn more about NYCHA protections">
        <JFCLLinkExternal href="">NY Legal Assistance Group</JFCLLinkExternal>
        <JFCLLinkExternal href="">PACT Fact Sheet</JFCLLinkExternal>
      </ContentBoxItem>

      {children}
    </ContentBox>
    <div className="divider__print" />
  </>
);
