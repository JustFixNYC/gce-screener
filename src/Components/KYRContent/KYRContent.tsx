import React, { ReactNode } from "react";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import {
  ContentBox,
  ContentBoxItem,
  ContentBoxProps,
} from "../ContentBox/ContentBox";
import { formatMoney, urlMyGov } from "../../helpers";
import { JFCLLinkExternal, JFCLLinkInternal } from "../JFCLLink";
import { CoverageResult } from "../../types/APIDataTypes";
import { CPI } from "../Pages/RentCalculator/RentCalculator";

type KYRContentBoxProps = Omit<ContentBoxProps, "children"> & {
  children?: React.ReactNode;
  coverageResult?: CoverageResult;
  className?: string;
};

export const UniversalProtections: React.FC<KYRContentBoxProps> = ({
  title,
  subtitle,
  children,
  coverageResult,
  className,
}) => {
  const { _ } = useLingui();
  const defaultSubtitle = _(msg`Protections that all NYC tenants have`);
  return (
    <>
      <ContentBox
        title={title}
        subtitle={subtitle || defaultSubtitle}
        className={className}
      >
        <ContentBoxItem
          title={_(msg`Your eviction protections`)}
          gtmId="universal_eviction"
          coverageResult={coverageResult}
        >
          <p>
            <Trans>
              The only way your landlord can legally evict you is through an
              eviction lawsuit in housing court. Lockouts (also known as
              unlawful evictions or self-help evictions) are illegal. All
              tenants, including those in private residential programs, have the
              right to stay in their home unless they choose to leave or are
              evicted through a court process.
            </Trans>
          </p>

          <p className="bold">
            <Trans>Learn more about the eviction process</Trans>
          </p>
          <JFCLLinkExternal
            to="https://hcr.ny.gov/eviction"
            className="has-label"
          >
            <Trans>NY Homes and Community Renewal eviction information</Trans>
          </JFCLLinkExternal>
          <JFCLLinkExternal
            to="https://www.metcouncilonhousing.org/help-answers/nonpayment-of-rent-eviction-cases/"
            className="has-label"
          >
            <Trans>
              Met Council on Housing Nonpayment of Rent Eviction information
            </Trans>
          </JFCLLinkExternal>

          <p className="bold">
            <Trans>Learn more about housing court</Trans>
          </p>
          <JFCLLinkExternal
            to="https://housingcourtanswers.org/answers/for-tenants/"
            className="has-label"
          >
            <Trans>Housing Court Answers</Trans>
          </JFCLLinkExternal>

          <p className="bold">
            <Trans>
              See if you are eligible for a free attorney in housing court
            </Trans>
          </p>
          <JFCLLinkExternal
            to="https://www.evictionfreenyc.org"
            className="has-label"
          >
            <Trans>Eviction Free NYC</Trans>
          </JFCLLinkExternal>
        </ContentBoxItem>

        <ContentBoxItem
          title="Your right to a liveable home"
          gtmId="universal_habitability"
          coverageResult={coverageResult}
        >
          <p>
            <Trans>
              Tenants have the right to live in a safe, sanitary, and
              well-maintained apartment, including public areas of the building.
              This right is implied in every residential lease, and any lease
              provision that waives it is void. If your landlord is not
              providing these conditions in your apartment or building, there
              are actions you can take to exercise your rights.
            </Trans>
          </p>

          <p className="bold">
            <Trans>Learn about Warranty of Habitability</Trans>
          </p>
          <JFCLLinkExternal
            to="https://nycourts.gov/COURTS/nyc//housing/pdfs/warrantyofhabitability.pdf"
            className="has-label"
          >
            <Trans>NY Courts Warranty of Habitability fact sheet</Trans>
          </JFCLLinkExternal>

          <p className="bold">
            <Trans>Learn how tenant associations can help</Trans>
          </p>
          <JFCLLinkExternal
            to="https://www.metcouncilonhousing.org/help-answers/forming-a-tenants-association"
            className="has-label"
          >
            <Trans>
              Met Council on Housing’s Guide to forming a tenant association
            </Trans>
          </JFCLLinkExternal>

          <p className="bold">
            <Trans>Learn more about requesting repairs</Trans>
          </p>
          <JFCLLinkExternal
            to="https://www.metcouncilonhousing.org/help-answers/getting-repairs/"
            className="has-label"
          >
            <Trans>Met Council on Housing guide to getting repairs</Trans>
          </JFCLLinkExternal>
          <JFCLLinkExternal
            to="https://housingcourtanswers.org/answers/for-tenants/hp-actions-tenants/"
            className="has-label"
          >
            <Trans>Housing Court Answers repairs resources</Trans>
          </JFCLLinkExternal>

          <p className="bold">
            <Trans>
              Send a free, legally vetted letter to notify your landlord of
              repair issues
            </Trans>
          </p>
          <JFCLLinkExternal
            to="https://app.justfix.org/loc/splash"
            className="has-label"
          >
            <Trans>JustFix’s Letter of Complaint</Trans>
          </JFCLLinkExternal>
        </ContentBoxItem>
        <ContentBoxItem
          title="Your rights against discrimination"
          gtmId="universal_discrimination"
        >
          <p>
            <Trans>
              Your landlord can’t evict you based on your race, religion,
              gender, national origin, familial status, or disability. New York
              State law promises protection from discrimination, banning bias
              based on age, sexual orientation, and military status.
            </Trans>
          </p>

          <p>
            <Trans>
              Source of income discrimination is the illegal practice by
              landlords, owners, and real estate brokers of refusing to rent to
              current or prospective tenants seeking to pay for housing with
              housing assistance vouchers, subsidies, or other forms of public
              assistance.
            </Trans>
          </p>

          <p className="bold">
            <Trans>Learn more about fair housing</Trans>
          </p>
          <JFCLLinkExternal
            to="https://www.nyc.gov/site/fairhousing/about/what-is-fair-housing.page"
            className="has-label"
          >
            <Trans>Fair Housing NYC</Trans>
          </JFCLLinkExternal>

          <p className="bold">
            <Trans>
              Learn more about lawful source of income discrimination
            </Trans>
          </p>
          <JFCLLinkExternal
            to="https://www.nyc.gov/site/fairhousing/renters/lawful-source-of-income.page"
            className="has-label"
          >
            <Trans>Lawful source of income</Trans>
          </JFCLLinkExternal>

          <p className="bold">
            <Trans>Report source of income discrimination</Trans>
          </p>
          <JFCLLinkExternal to="https://weunlock.nyc" className="has-label">
            <Trans>Unlock NYC</Trans>
          </JFCLLinkExternal>
        </ContentBoxItem>
        <ContentBoxItem
          title={_(msg`Your right to organize`)}
          gtmId="universal_organize"
          coverageResult={coverageResult}
        >
          <p>
            <Trans>
              Has your landlord raised your rent? Is your landlord refusing to
              do basic repairs? Are you worried about getting evicted or
              non-renewed?
            </Trans>
          </p>

          <p>
            <Trans>
              You’re not alone. Too many landlords care more about getting rich
              off our rent money than providing us with decent homes.
            </Trans>
          </p>

          <p>
            <Trans>
              When tenants come together, we have power. Tenants across our
              state are forming tenant unions to fight back. If you’re
              interested in organizing a tenant union with your neighbors, fill
              out this form to get support from a tenant group near you.
            </Trans>
          </p>
          <JFCLLinkExternal to="https://actionnetwork.org/forms/are-you-worried-about-your-housing">
            <Trans>Housing Justice for All tenant organizing form</Trans>
          </JFCLLinkExternal>
        </ContentBoxItem>
        <ContentBoxItem
          title={_(msg`More resources about your rights as an NYC tenant`)}
          gtmId="universal_resources"
          coverageResult={coverageResult}
        >
          <JFCLLinkExternal to="https://ag.ny.gov/publications/residential-tenants-rights-guide">
            <Trans>Residential Tenants Guide</Trans>
          </JFCLLinkExternal>
          <JFCLLinkExternal to="https://www.metcouncilonhousing.org/help-answers/">
            <Trans>Met Council on Housing</Trans>
          </JFCLLinkExternal>
          <JFCLLinkExternal to="https://housingcourtanswers.org/answers/for-tenants/">
            <Trans>Housing Court Answers</Trans>
          </JFCLLinkExternal>
          <JFCLLinkExternal to="https://www.justfix.org/en/learn">
            <Trans>JustFix</Trans>
          </JFCLLinkExternal>
        </ContentBoxItem>
        {children}
      </ContentBox>
      <div className="divider__print" />
    </>
  );
};

export const GoodCauseProtections: React.FC<
  KYRContentBoxProps & { rent?: number }
> = ({ title, subtitle, rent, children, coverageResult, className }) => {
  const { _ } = useLingui();
  const defaultSubtitle = _(msg`Protections if you’re covered by Good Cause`);
  const increase_pct = CPI + 5;
  return (
    <>
      <ContentBox
        title={title}
        subtitle={subtitle || defaultSubtitle}
        className={className}
      >
        <ContentBoxItem
          title={_(msg`Your right to limited rent increases`)}
          gtmId="gce-protections_rent"
          coverageResult={coverageResult}
        >
          <p>
            {_(msg`The state housing agency must publish each year’s Reasonable Rent
          Increase by August. This year the maximum amount your landlord can
          increase your rent by is ${increase_pct}%.`)}
          </p>

          <div className="callout-box">
            <p>
              <Trans>
                If you are offered a new lease after April 20th, 2024, then your
                landlord can’t raise your apartment’s monthly rent higher than:
              </Trans>
            </p>
            <span className="rent-increase">
              <span className="amount">
                {rent ? (
                  <>
                    {_(msg`${formatMoney(rent * (1 + increase_pct / 100))} `)}
                  </>
                ) : (
                  <>{_(msg`Your current monthly rent + ${increase_pct}%`)}</>
                )}
              </span>
              {!!rent && (
                <>
                  <br />
                  <span className="formula">
                    {_(
                      msg`(Your current monthly rent ${formatMoney(
                        rent
                      )} + ${increase_pct}%)`
                    )}
                  </span>
                </>
              )}
            </span>
          </div>
          <p>
            <strong>
              <Trans>Note</Trans>
            </strong>
            <br />
            <Trans>
              Landlords can increase the rent more than the reasonable rent
              increase but they must explain why and must point to increases in
              their costs or substantial repairs they did to the apartment or
              building.
            </Trans>
          </p>
          <JFCLLinkExternal
            className="has-label"
            to="https://legalaidnyc.org/get-help/housing-problems/what-you-need-to-know-about-new-yorks-good-cause-eviction-law/#rent-increases"
          >
            <Trans>Learn more about Reasonable Rent Increase</Trans>
          </JFCLLinkExternal>
        </ContentBoxItem>
        <ContentBoxItem
          title={_(msg`Your right to stay in your home`)}
          gtmId="gce-protections_eviction"
          coverageResult={coverageResult}
        >
          <>
            <p>
              <Trans>
                Your landlord will need to provide a good reason for ending a
                tenancy. Even if your lease expires, your landlord cannot evict
                you, as long as you abide by the terms of your expired lease.
              </Trans>
            </p>
            <ul
              aria-label={_(msg`Under the Good Cause Eviction law, landlords are allowed to evict
              tenants for the following “good cause” reasons:`)}
            >
              <li>
                <Trans>Non payment of rent</Trans>
              </li>
              <li>
                <Trans>Lease violations</Trans>
              </li>
              <li>
                <Trans>Nuisance activity</Trans>
              </li>
              <li>
                <Trans>Illegal Activity</Trans>
              </li>
              <li>
                <Trans>Landlord personal use/removal from market</Trans>
              </li>
              <li>
                <Trans>Demolition</Trans>
              </li>
              <li>
                <Trans>
                  Failure to sign lease renewal or provide access to apartment
                </Trans>
              </li>
            </ul>
            <JFCLLinkExternal
              className="has-label"
              to="https://www.nyc.gov/site/hpd/services-and-information/good-cause-eviction.page#:~:text=What%20are%20the%20“good%20cause”%20reasons%20for%20eviction%2C%20nonrenewal%20of%20lease%2C%20or%20termination%20of%20tenancy%3F"
            >
              <Trans>Learn more about Good Cause reasons for eviction</Trans>
            </JFCLLinkExternal>
          </>
        </ContentBoxItem>

        <ContentBoxItem
          title={_(msg`Learn more about Good Cause Eviction Law protections`)}
          gtmId="gce-protections_learn"
          coverageResult={coverageResult}
        >
          <JFCLLinkExternal to="https://housingjusticeforall.org/kyr-good-cause">
            <Trans>
              Housing Justice for All Good Cause Eviction fact sheet
            </Trans>
          </JFCLLinkExternal>
          <JFCLLinkExternal to="https://www.metcouncilonhousing.org/help-answers/good-cause-eviction">
            <Trans>Met Council on Housing Good Cause Eviction fact sheet</Trans>
          </JFCLLinkExternal>
          <JFCLLinkExternal to="https://www.nyc.gov/site/hpd/services-and-information/good-cause-eviction.page">
            <Trans>
              Housing Preservation and Development Good Cause Eviction overview
            </Trans>
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
  title,
  subtitle,
  shareButtons,
  children,
  coverageResult,
  className,
}) => {
  const { _ } = useLingui();

  const defaultSubtitle = _(msg`How to assert your Good Cause rights`);

  return (
    <>
      <ContentBox
        title={title}
        subtitle={subtitle || defaultSubtitle}
        className={className}
      >
        <ContentBoxItem
          title={_(msg`Use Good Cause to stay in your home`)}
          gtmId="gce-exercise_eviction"
          coverageResult={coverageResult}
        >
          <p>
            <Trans>
              If your landlord refuses to renew your lease, tells you that you
              have to leave for no reason, or tries to evict you for no reason,
              stay in your home!
            </Trans>
          </p>

          <p>
            <Trans>
              Tell your landlord you have a right to stay unless your landlord
              has a “Good Cause” to evict you. If your landlord then tries to
              formally evict you in court, you can raise a Good Cause defense
              and require your landlord to demonstrate they have a “Good Cause”
              to evict you.
            </Trans>
          </p>

          <p>
            <Trans>
              Since your apartment is covered by Good Cause Eviction, there is a
              good chance other apartments in your building are covered as well.
              Organizing with your neighbors can help you assert your rights as
              a group.
            </Trans>
          </p>

          <JFCLLinkExternal to="https://housingjusticeforall.org/resource/fight-your-rent-hike-toolkit/">
            <Trans>
              Tenant Organizing Toolkit from Housing Justice for All
            </Trans>
          </JFCLLinkExternal>
        </ContentBoxItem>
        <ContentBoxItem
          title={_(msg`Use Good Cause to fight your rent hike`)}
          gtmId="gce-exercise_rent"
        >
          <ol>
            <li>
              <strong>
                <Trans>Demand notice</Trans>
              </strong>
              <br />
              <Trans>
                Your landlord must give you written notice to raise your rent
                more than 5% (30 days notice if you’ve lived there less than 1
                year, 60 days if you’ve lived there 1-2 years, and 90 days
                notice if you’ve lived there longer than 2 years). If your
                landlord tries to raise rent without proper notice, inform them
                they are violating{" "}
                <a
                  href="https://www.nysenate.gov/legislation/laws/RPP/226-C"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="jfcl-link"
                >
                  Real Property Law L Section 226-C
                </a>
                . Do not pay any rent increase until they give written notice.
              </Trans>
            </li>
            <li>
              <strong>
                <Trans>Tell them it’s unreasonable</Trans>
              </strong>
              <br />
              {_(msg`If your rent increase is more than ${
                CPI + 5
              }%, tell your landlord it is
            an unreasonable increase and that a judge could force your landlord
            to justify it based on increased costs.`)}
            </li>
            <li>
              <strong>
                <Trans>Withhold the unreasonable increase</Trans>
              </strong>
              <br />
              {_(msg`You can withhold the rent increase above the ‘reasonable’ threshold.
            Pay your old rent plus ${
              CPI + 5
            }%. To be safe, set aside the extra rent
            in a separate escrow account until your negotiations with your
            landlord have totally resolved.`)}
            </li>
            <li>
              <strong>
                <Trans>Invoke “Good Cause” to a judge</Trans>
              </strong>
              <br />
              <Trans>
                If your landlord takes you to court, you can raise a “Good
                Cause” defense. Your landlord would then have to demonstrate to
                the judge that they raised the rent because of increased costs
                (taxes, maintenance costs, etc.) or be forced to lower the
                increase.
              </Trans>
            </li>
          </ol>
        </ContentBoxItem>
        <ContentBoxItem
          title={_(msg`Share your coverage with your landlord`)}
          gtmId="gce-exercise_share"
          coverageResult={coverageResult}
        >
          <p>
            <Trans>
              Assert your rights by printing your coverage results and sharing
              with your landlord. You can use these results as an indicator that
              your apartment is covered by Good Cause Eviction Law.
            </Trans>
          </p>
          {shareButtons}
        </ContentBoxItem>
        <ContentBoxItem
          title={_(msg`Reach out to external resources`)}
          gtmId="gce-exercise_resources"
        >
          <p>
            <Trans>
              The Met Council on Housing helps organize tenants to stand up not
              only for their individual rights, but also for changes to housing
              policies. You can visit the website, or use their hotline to get
              answers to your rights as a tenant, and understand your options
              for dealing with a housing situation.
            </Trans>
          </p>

          <JFCLLinkExternal to="https://www.metcouncilonhousing.org/">
            <Trans>Met Council on Housing</Trans>
          </JFCLLinkExternal>
          <JFCLLinkExternal to="https://www.metcouncilonhousing.org/program/tenants-rights-hotline/">
            <Trans>Call Met Council on Housing Hotline</Trans>
          </JFCLLinkExternal>
        </ContentBoxItem>
        {children}
      </ContentBox>
      <div className="divider__print" />
    </>
  );
};

export const RentStabilizedProtections: React.FC<KYRContentBoxProps> = ({
  title,
  subtitle,
  children,
  coverageResult,
  className,
}) => {
  const { _ } = useLingui();

  const defaultSubtitle = _(
    msg`Protections if you live in a rent stabilized apartment`
  );

  return (
    <>
      <ContentBox
        title={title}
        subtitle={subtitle || defaultSubtitle}
        className={className}
      >
        <ContentBoxItem
          title={_(msg`Your right to limited rent increases`)}
          gtmId="rs_rent"
          coverageResult={coverageResult}
        >
          <p>
            <Trans>
              For rent-stabilized leases being renewed between October 1, 2024
              and September 30, 2025 the legal rent may be increased at the
              following levels: for a one-year renewal there is a 2.75%
              increase, or for a two-year renewal there is a 5.25% increase.
            </Trans>
          </p>
          <JFCLLinkExternal to="https://hcr.ny.gov/system/files/documents/2024/10/fact-sheet-26-10-2024.pdf">
            <Trans>Learn about rent increase rights</Trans>
          </JFCLLinkExternal>
        </ContentBoxItem>

        <ContentBoxItem
          title={_(msg`Your right to a lease renewal`)}
          gtmId="rs_renewal"
          coverageResult={coverageResult}
        >
          <p>
            <Trans>
              If you are rent-stabilized your landlord cannot simply decide they
              don’t want you as a tenant anymore, they are limited to certain
              reasons for evicting you.
            </Trans>
          </p>
          <JFCLLinkExternal to="https://rentguidelinesboard.cityofnewyork.us/resources/faqs/leases-renewal-vacancy/#landlord:~:text=If%20your%20apartment%20is%20rent,before%20the%20existing%20lease%20expires">
            <Trans>Learn about lease renewal rights</Trans>
          </JFCLLinkExternal>
        </ContentBoxItem>

        <ContentBoxItem
          title={-msg`Your right to succession`}
          gtmId="rs_succession"
          coverageResult={coverageResult}
        >
          <p>
            <Trans>
              If you are the immediate family member of a rent-stabilized tenant
              and have been living with them immediately prior to their moving
              or passing away, you might be entitled to take over the lease.
            </Trans>
          </p>
          <JFCLLinkExternal to="https://www.metcouncilonhousing.org/help-answers/succession-rights-in-rent-stabilized-and-rent-controlled-apartments/">
            <Trans>Learn about succession rights</Trans>
          </JFCLLinkExternal>
        </ContentBoxItem>

        <ContentBoxItem
          title={_(msg`Learn more about rent stabilization`)}
          gtmId="rs_learn"
          coverageResult={coverageResult}
        >
          <p>
            <Trans>
              If you are the immediate family member of a rent-stabilized tenant
              and have been living with them immediately prior to their moving
              or passing away, you might be entitled to take over the lease.
            </Trans>
          </p>
          <JFCLLinkExternal to="https://www.metcouncilonhousing.org/help-answers/about-rent-stabilization/">
            <Trans>Met Council on Housing’s Rent Stabilization overview</Trans>
          </JFCLLinkExternal>
        </ContentBoxItem>
        {children}
      </ContentBox>
      <div className="divider__print" />
    </>
  );
};

export const NYCHAProtections: React.FC<KYRContentBoxProps> = ({
  title,
  subtitle,
  children,
  coverageResult,
  className,
}) => {
  const { _ } = useLingui();

  const defaultSubtitle = _(
    msg`Protections if you live in NYCHA or PACT/RAD housing`
  );

  return (
    <>
      <ContentBox
        title={title}
        subtitle={subtitle || defaultSubtitle}
        className={className}
      >
        <ContentBoxItem
          title={_(msg`Your right to repairs`)}
          gtmId="nycha_repairs"
          coverageResult={coverageResult}
        >
          <p>
            <Trans>
              Everyone has the right to live in a safe and habitable
              environment. This includes timely repairs to your apartment. NYCHA
              Residents have the right to request repairs and expect prompt
              action from management. If NYCHA is not responding to ticket
              requests, residents can file housing court cases (HP actions)
              seeking a judicial order requiring NYCHA to make repairs.
            </Trans>
          </p>
        </ContentBoxItem>

        <ContentBoxItem
          title={_(msg`Your right to income-based rent`)}
          gtmId="nycha_rent"
          coverageResult={coverageResult}
        >
          <p>
            <Trans>
              This ensures that housing remains affordable and equitable for all
              residents, regardless of financial circumstances. Residents who
              have recently experienced a change in income can request an
              interim recertification to ensure that their apartment remains
              affordable.
            </Trans>
          </p>
          <JFCLLinkExternal to="https://www.nyc.gov/site/nycha/residents/acop.page">
            <Trans>
              Learn more about income-based rent and recertification
            </Trans>
          </JFCLLinkExternal>
        </ContentBoxItem>

        <ContentBoxItem
          title={_(msg`Your right to grieve management decisions`)}
          gtmId="nycha_grieve"
          coverageResult={coverageResult}
        >
          <p>
            <Trans>
              In instances where residents disagree with management decisions or
              believe their rights have been violated, they have the right to
              grieve these issues through a formal process. Residents can file
              grievances online through the resident portal or on paper by
              visiting the management office.
            </Trans>
          </p>
          <JFCLLinkExternal to="https://www.nyc.gov/site/nycha/residents/acop/chapter-12.page">
            <Trans>Learn more about the grievance procedures</Trans>
          </JFCLLinkExternal>
        </ContentBoxItem>

        <ContentBoxItem
          title={_(msg`Your right to legal representation if facing eviction`)}
          gtmId="nycha_legal"
          coverageResult={coverageResult}
        >
          <p>
            <Trans>
              Legal representation can make a significant difference in ensuring
              a fair and just resolution to housing disputes, protecting
              residents from wrongful eviction or other adverse outcomes. If you
              do not have a lawyer and are facing a termination of tenancy at
              the Office of Impartial Hearings, you can ask for your case to be
              adjourned in order for you to seek counsel.
            </Trans>
          </p>
          <JFCLLinkExternal to="https://www.nyc.gov/site/nycha/residents/acop/chapter-11.page">
            <Trans>Learn more about NYCHA lease terminations</Trans>
          </JFCLLinkExternal>
        </ContentBoxItem>

        <ContentBoxItem
          title={_(
            msg`Learn more about NYCHA and PACT/RAD’s tenant protections`
          )}
          gtmId="nycha_learn"
          coverageResult={coverageResult}
        >
          <JFCLLinkExternal to="https://www.nyc.gov/site/nycha/residents/acop.page">
            <Trans>NYCHA policies</Trans>
          </JFCLLinkExternal>
          <JFCLLinkExternal to="https://nylag.org/tenants-rights/public-housing-justice-project/">
            <Trans>NYLAG's Public Housing Justice Project</Trans>
          </JFCLLinkExternal>
          <JFCLLinkExternal to="https://nylag.org/tenants-rights/public-housing-justice-project/">
            <Trans>PACT Fact Sheet</Trans>
          </JFCLLinkExternal>
          <JFCLLinkExternal to="hhttps://www.nyc.gov/assets/nycha/downloads/pdf/PACT-Rights-Responsibilities-English.pdf">
            <Trans>PACT Rights and Responsibilities Fact Sheet</Trans>
          </JFCLLinkExternal>
        </ContentBoxItem>

        {children}
      </ContentBox>
      <div className="divider__print" />
    </>
  );
};

export const SubsidizedProtections: React.FC<
  KYRContentBoxProps & { lngLat?: string }
> = ({ title, subtitle, children, coverageResult, lngLat, className }) => {
  const { _ } = useLingui();

  const defaultSubtitle = _(
    msg`You are not covered by Good Cause because you have existing eviction protections through your building’s subsidy program`
  );
  return (
    <ContentBox
      title={title}
      subtitle={subtitle || defaultSubtitle}
      className={className}
    >
      <ContentBoxItem
        accordion={false}
        gtmId="subsidized_learn"
        coverageResult={coverageResult}
      >
        <p>
          <Trans>
            You told us that that you live subsidized housing. If your building
            is subsidized then you are not covered by Good Cause Eviction law
            because you should already have important tenant protections
            associated with your building’s subsidy.
          </Trans>
        </p>

        <p>
          <Trans>
            To learn what protections you have through your building’s subsidy
            program we recommend that you speak to your landlord and your
            neighbors. For further assistance you can also try contacting:
          </Trans>
        </p>
        <JFCLLinkExternal to={urlMyGov(lngLat)}>
          <Trans>Your local City Council representative</Trans>
        </JFCLLinkExternal>
        <JFCLLinkExternal to="https://www.metcouncilonhousing.org/program/tenants-rights-hotline/">
          <Trans>Met Council on Housing’s Hotline</Trans>
        </JFCLLinkExternal>
      </ContentBoxItem>
      {children}
    </ContentBox>
  );
};

export const UnknownProtections: React.FC<KYRContentBoxProps> = ({
  title,
  subtitle,
  children,
  coverageResult,
  className,
}) => {
  const { _ } = useLingui();

  const defaultSubtitle = _(
    msg`Whether or not you are covered by Good Cause, you still have important tenant rights`
  );
  return (
    <ContentBox
      title={title}
      subtitle={subtitle || defaultSubtitle}
      className={className}
    >
      <ContentBoxItem
        accordion={false}
        gtmId="unknown_learn"
        coverageResult={coverageResult}
      >
        <p>
          <Trans>
            All tenants in NYC are protected by important rights. This guide
            provides information about many of those rights depending on the
            type of housing you live in.
          </Trans>
        </p>
        <JFCLLinkInternal to="/tenant_rights">
          <Trans>Learn more about your rights</Trans>
        </JFCLLinkInternal>
      </ContentBoxItem>
      {children}
    </ContentBox>
  );
};
