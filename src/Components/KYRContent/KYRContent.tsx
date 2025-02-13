import React, { ReactNode } from "react";
import {
  ContentBox,
  ContentBoxItem,
  ContentBoxProps,
} from "../ContentBox/ContentBox";
import { formatMoney } from "../../helpers";
import { JFCLLinkExternal } from "../JFCLLink";
import { CoverageResult } from "../../types/APIDataTypes";

const CPI = 3.82;

type KYRContentBoxProps = Omit<ContentBoxProps, "children"> & {
  children?: React.ReactNode;
  coverageResult?: CoverageResult;
};

export const UniversalProtections: React.FC<KYRContentBoxProps> = ({
  title = undefined,
  subtitle: headerSubtitle = "Protections that all New Yorkers have",
  children,
  coverageResult,
}) => (
  <>
    <ContentBox title={title} subtitle={headerSubtitle}>
      <ContentBoxItem
        title="Your eviction protections"
        gtmId="universal_eviction"
        coverageResult={coverageResult}
      >
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
          to="https://hcr.ny.gov/eviction"
          className="has-label"
        >
          NY Homes and Community Renewal
        </JFCLLinkExternal>

        <p className="bold">See if you are eligible for a free attorney</p>
        <JFCLLinkExternal
          to="https://www.evictionfreenyc.org"
          className="has-label"
        >
          Eviction Free NYC
        </JFCLLinkExternal>
      </ContentBoxItem>

      <ContentBoxItem
        title="Your right to a liveable home"
        gtmId="universal_habitability"
        coverageResult={coverageResult}
      >
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
          to="https://nycourts.gov/courts/nyc/housing/pdfs/warrantyofhabitability.pdf"
          className="has-label"
        >
          NY Courts
        </JFCLLinkExternal>

        <p className="bold">Learn how tenant associations can help</p>
        <JFCLLinkExternal
          to="https://www.metcouncilonhousing.org/help-answers/forming-a-tenants-association"
          className="has-label"
        >
          Met Council on Housing
        </JFCLLinkExternal>

        <p className="bold">Notify your landlord of repair issues</p>
        <JFCLLinkExternal
          to="https://app.justfix.org/loc/splash"
          className="has-label"
        >
          JustFix’s Letter of Complaint
        </JFCLLinkExternal>
      </ContentBoxItem>
      <ContentBoxItem
        title="Your rights if you’re being discriminated against"
        gtmId="universal_discrimination"
      >
        <p>
          Your landlord can’t evict you based on your race, religion, gender,
          national origin, familial status, or disability. New York State law
          promises protection from discrimination, banning bias based on age,
          sexual orientation, and military status.
        </p>
        <br />
        <p>
          Source of income discrimination the illegal practice by landlords,
          owners, and real estate brokers of refusing to rent to current or
          prospective tenants seeking to pay for housing with housing assistance
          vouchers, subsidies, or other forms of public assistance.
        </p>
        <br />
        <p className="bold">Learn more about fair housing</p>
        <JFCLLinkExternal
          to="https://www.nyc.gov/site/fairhousing/about/what-is-fair-housing.page"
          className="has-label"
        >
          Fair Housing NYC
        </JFCLLinkExternal>

        <p className="bold">
          Learn more about lawful source of income discrimination
        </p>
        <JFCLLinkExternal
          to="https://www.nyc.gov/site/fairhousing/renters/lawful-source-of-income.page"
          className="has-label"
        >
          Lawful source of income
        </JFCLLinkExternal>

        <p className="bold">Report source of income discrimination</p>
        <JFCLLinkExternal to="https://weunlock.nyc" className="has-label">
          Unlock NYC
        </JFCLLinkExternal>
      </ContentBoxItem>
      <ContentBoxItem
        title="Your right to organize"
        gtmId="universal_organize"
        coverageResult={coverageResult}
      >
        <p>
          Has your landlord raised your rent? Is your landlord refusing to do
          basic repairs? Are you worried about getting evicted or non-renewed?
        </p>
        <br />
        <p>
          You’re not alone. Too many landlords care more about getting rich off
          our rent money than providing us with decent homes.
        </p>
        <br />
        <p>
          When tenants come together, we have power. Tenants across our state
          are forming tenant unions to fight back. If you're interested in
          organizing a tenant union with your neighbors, fill out this form to
          get support from a tenant group near you.
        </p>
        <JFCLLinkExternal to="https://actionnetwork.org/forms/are-you-worried-about-your-housing">
          Housing Justice for All tenant organizing form
        </JFCLLinkExternal>
      </ContentBoxItem>
      {children}
    </ContentBox>
    <div className="divider__print" />
  </>
);

export const GoodCauseProtections: React.FC<
  KYRContentBoxProps & { rent?: number }
> = ({
  title = undefined,
  subtitle = "Protections you have under Good Cause",
  rent,
  children,
  coverageResult,
}) => {
  const increase_pct = CPI + 5;
  return (
    <>
      <ContentBox title={title} subtitle={subtitle}>
        <ContentBoxItem
          title="Your right to stay in your home"
          gtmId="gce-protections_eviction"
          coverageResult={coverageResult}
        >
          <p>
            Your landlord will need to provide a good cause reason for ending a
            tenancy. Even if your lease expires, your landlord cannot evict you,
            as long as you abide by the terms of your expired lease.
          </p>
        </ContentBoxItem>

        <ContentBoxItem
          title="Your right to limited rent increases"
          gtmId="gce-protections_rent"
          coverageResult={coverageResult}
        >
          <p>
            {`The state housing agency must publish each year’s Reasonable Rent
          Increase by August. This year the maximum amount your landlord can
          increase your rent by is ${increase_pct}%.`}
          </p>
          <br />

          <p>
            {rent
              ? `If you are offered a new lease after April 20th, 2024 with an 
              amount higher than ${formatMoney(
                rent * (1 + increase_pct / 100)
              )} (your current rent + ${increase_pct}%) you should ask your
              landlord to provide reasons for the increase beyond the ${increase_pct}% 
              reasonable rent standard.`
              : `If you are offered a new lease after April 20th, 2024 with an amount 
              higher than your current rent + ${increase_pct}%, you should ask your 
              landlord to provide reasons for the increase beyond the ${increase_pct}% 
              reasonable rent standard.`}
          </p>
          <div className="note-box">
            <p>
              <strong>Note</strong>
            </p>
            <p>
              Landlords can increase the rent more than the reasonable rent
              increase but they must explain why and must point to increases in
              their costs or substantial repairs they did to the apartment or
              building.
            </p>
          </div>
          <p>
            <strong>Learn about Reasonable Rent Standard</strong>
          </p>
          <JFCLLinkExternal
            className="has-label"
            to="https://legalaidnyc.org/get-help/housing-problems/what-you-need-to-know-about-new-yorks-good-cause-eviction-law/#rent-increases"
          >
            Reasonable Rent Increase
          </JFCLLinkExternal>
        </ContentBoxItem>
        <ContentBoxItem
          title="Learn more about Good Cause Eviction Law protections"
          gtmId="gce-protections_learn"
          coverageResult={coverageResult}
        >
          <JFCLLinkExternal to="https://housingjusticeforall.org/kyr-good-cause">
            Housing Justice for All Good Cause Eviction fact sheet
          </JFCLLinkExternal>
          <JFCLLinkExternal to="https://www.metcouncilonhousing.org/help-answers/good-cause-eviction">
            Met Council on Housing Good Cause Eviction fact sheet
          </JFCLLinkExternal>
        </ContentBoxItem>
        {children}
      </ContentBox>
      <div className="divider__print" />
    </>
  );
};

export const GoodCauseExercisingRights: React.FC<
  KYRContentBoxProps & { shareButtons: ReactNode }
> = ({
  title = undefined,
  subtitle = "How to assert your rights",
  shareButtons,
  children,
  coverageResult,
}) => (
  <>
    <ContentBox title={title} subtitle={subtitle}>
      <ContentBoxItem
        title="Use Good Cause to stay in your home"
        gtmId="gce-exercise_eviction"
        coverageResult={coverageResult}
      >
        <p>
          If your landlord refuses to renew your lease, tells you that you have
          to leave for no reason, or tries to evict you for no reason, stay in
          your home!
        </p>
        <br />
        <p>
          Tell your landlord you have a right to stay unless your landlord has a
          “Good Cause” to evict you. If your landlord then tries to formally
          evict you in court, you can raise a Good Cause defense and require
          your landlord to demonstrate they have a “Good Cause” to evict you.
        </p>
        <br />
        <p>
          Since your apartment is covered by Good Cause Eviction, there is a
          good chance other apartments in your building are covered as well.
          Organizing with your neighbors can help you assert your rights as a
          group.
        </p>
        <br />
        <JFCLLinkExternal to="https://housingjusticeforall.org/resource/fight-your-rent-hike-toolkit/">
          Tenant Organizing Toolkit from Housing Justice for All
        </JFCLLinkExternal>
      </ContentBoxItem>
      <ContentBoxItem
        title="Use Good Cause to fight your rent hike"
        gtmId="gce-exercise_rent"
      >
        <ol>
          <li>
            <strong>Demand notice</strong>
            <br />
            Your landlord must give you written notice to raise your rent more
            than 5% (30 days notice if you’ve lived there less than 1 year, 60
            days if you’ve lived there 1-2 years, and 90 days notice if you’ve
            lived there longer than 2 years). If your landlord tries to raise
            rent without proper notice, inform them they are violating{" "}
            <a
              href="https://www.nysenate.gov/legislation/laws/RPP/226-C"
              target="_blank"
              rel="noopener noreferrer"
              className="jfcl-link"
            >
              Real Property Law L Section 226-C
            </a>
            . Do not pay any rent increase until they give written notice.
          </li>
          <li>
            <strong>Tell them it’s unreasonable</strong>
            <br />
            If your rent increase is more than 10% (or CPI+5%, whichever is
            lower), tell your landlord it is an unreasonable increase and that a
            judge could force your landlord to justify it based on increased
            costs.
          </li>
          <li>
            <strong>Withhold the unreasonable increase</strong>
            <br />
            You can withhold the rent increase above the ‘reasonable’ threshold.
            Pay your old rent plus CPI+5% or 10%, whichever is lower. To be
            safe, set aside the extra rent in a separate escrow account until
            your negotiations with your landlord have totally resolved.
          </li>
          <li>
            <strong>Invoke Good Cause to a judge</strong>
            <br />
            If your landlord takes you to court, you can raise a Good Cause
            defense. Your landlord would then have to demonstrate to the judge
            that they raised the rent because of increased costs (taxes,
            maintenance costs, etc.) or be forced to lower the increase.
          </li>
        </ol>
      </ContentBoxItem>
      <ContentBoxItem
        title="Share your coverage with your landlord"
        gtmId="gce-exercise_share"
        coverageResult={coverageResult}
      >
        <p>
          Assert your rights by printing your coverage results and sharing with
          your landlord. You can use these results as an indicator that your
          apartment is covered by Good Cause Eviction Law.
        </p>
        {shareButtons}
      </ContentBoxItem>
      <ContentBoxItem
        title="Reach out to external resources"
        gtmId="gce-exercise_resources"
      >
        <p>
          The Met Council on Housing helps organize tenants to stand up not only
          for their individual rights, but also for changes to housing policies.
          You can visit the website, or use their hotline to get answers to your
          rights as a tenant, and understand your options for dealing with a
          housing situation.
        </p>
        <br />
        <JFCLLinkExternal to="https://www.metcouncilonhousing.org/">
          Met Council on Housing
        </JFCLLinkExternal>
        <JFCLLinkExternal to="https://www.metcouncilonhousing.org/program/tenants-rights-hotline/">
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
  coverageResult,
}) => (
  <>
    <ContentBox title={title} subtitle={subtitle}>
      <ContentBoxItem
        title="Your right to limited rent increases"
        gtmId="rs_rent"
        coverageResult={coverageResult}
      >
        <p>
          For rent-stabilized leases being renewed between October 1, 2024 and
          September 30, 2025 the legal rent may be increased at the following
          levels: for a one-year renewal there is a 2.75% increase, or for a
          two-year renewal there is a 5.25% increase.
        </p>
        <JFCLLinkExternal to="https://hcr.ny.gov/system/files/documents/2024/10/fact-sheet-26-10-2024.pdf">
          Learn about rent increase rights
        </JFCLLinkExternal>
      </ContentBoxItem>

      <ContentBoxItem
        title="Your right to a lease renewal"
        gtmId="rs_renewal"
        coverageResult={coverageResult}
      >
        <p>
          If you are rent-stabilized your landlord cannot simply decide they
          don’t want you as a tenant anymore, they are limited to certain
          reasons for evicting you.
        </p>
        <JFCLLinkExternal to="https://rentguidelinesboard.cityofnewyork.us/resources/faqs/leases-renewal-vacancy/#landlord:~:text=If%20your%20apartment%20is%20rent,before%20the%20existing%20lease%20expires">
          Learn about lease renewal rights
        </JFCLLinkExternal>
      </ContentBoxItem>

      <ContentBoxItem
        title="Your right to succession"
        gtmId="rs_succession"
        coverageResult={coverageResult}
      >
        <p>
          If you are the immediate family member of a rent-stabilized tenant and
          have been living with them immediately prior to their moving or
          passing away, you might be entitled to take over the lease.
        </p>
        <JFCLLinkExternal to="https://www.metcouncilonhousing.org/help-answers/succession-rights-in-rent-stabilized-and-rent-controlled-apartments/">
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
  coverageResult,
}) => (
  <>
    <ContentBox title={title} subtitle={subtitle}>
      <ContentBoxItem
        title="Your right to repairs"
        gtmId="nycha_repairs"
        coverageResult={coverageResult}
      >
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

      <ContentBoxItem
        title="Your right to income-based rent"
        gtmId="nycha_rent"
        coverageResult={coverageResult}
      >
        <p>
          This ensures that housing remains affordable and equitable for all
          residents, regardless of financial circumstances. Residents who have
          recently experienced a change in income can request an interim
          recertification to ensure that their apartment remains affordable.
        </p>
      </ContentBoxItem>

      <ContentBoxItem
        title="Your right to grieve management decisions"
        gtmId="nycha_grieve"
        coverageResult={coverageResult}
      >
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

      <ContentBoxItem
        title="Your right to legal representation"
        gtmId="nycha_legal"
        coverageResult={coverageResult}
      >
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

      <ContentBoxItem
        title="Learn more about NYCHA protections"
        gtmId="nycha_learn"
        coverageResult={coverageResult}
      >
        <JFCLLinkExternal to="https://nylag.org/tenants-rights/public-housing-justice-project/">
          NY Legal Assistance Group
        </JFCLLinkExternal>
        <JFCLLinkExternal to="https://www.nyc.gov/assets/nycha/downloads/pdf/pact-factsheet.pdf">
          PACT Fact Sheet
        </JFCLLinkExternal>
      </ContentBoxItem>

      {children}
    </ContentBox>
    <div className="divider__print" />
  </>
);
