import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";

import {
  ContentBox,
  ContentBoxItem,
  ContentBoxItemProps,
  ContentBoxProps,
} from "../../ContentBox/ContentBox";
import { Pill } from "../../Pill/Pill";
import { JFCLLinkExternal } from "../../JFCLLink";
import "./LetterNextSteps.scss";
import { Header } from "../../Header/Header";
import classNames from "classnames";

type NextStepItemProps = Partial<Omit<ContentBoxItemProps, "children">>;
type NextStepCollectionProps = Partial<Omit<ContentBoxProps, "children">> & {
  mailChoice?: string;
};

// Common Links

const RentIncreaseCalculatorLink = () => {
  const { i18n } = useLingui();
  return (
    <JFCLLinkExternal
      to={`https://www.goodcausenyc.org/${i18n.locale}/rent_calculator`}
    >
      JustFix Rent Increase Calculator
    </JFCLLinkExternal>
  );
};

const GoodCauseScreenerLink = () => {
  const { i18n } = useLingui();
  return (
    <JFCLLinkExternal to={`https://www.goodcausenyc.org/${i18n.locale}/`}>
      Good Cause Screener
    </JFCLLinkExternal>
  );
};

// Next Steps
export const TextFollowup: React.FC<
  NextStepItemProps & { mailChoice?: string }
> = ({ mailChoice, ...props }) => (
  <ContentBoxItem
    title={
      <>
        <Pill color="black" circle>
          1
        </Pill>
        <Trans>Look out for a text from JustFix</Trans>
      </>
    }
    {...props}
  >
    {!mailChoice && (
      <p>
        <Trans>
          We will text you with a link to download a PDF copy of your letter for
          your records. In addition, we will text you the USPS tracking number
          for the letter if you chose to have JustFix mail the letter for you.
          Keep this for your documentation. It's an important part of asserting
          your rights.
        </Trans>
      </p>
    )}
    {mailChoice === "USER_WILL_MAIL" && (
      <p>
        <Trans>
          We will text you with a link to download a PDF copy of your letter for
          your records. Keep this for your documentation. It's an important part
          of asserting your rights.
        </Trans>
      </p>
    )}
    {mailChoice === "WE_WILL_MAIL" && (
      <>
        <p>
          <Trans>We will text you with:</Trans>
        </p>
        <ul>
          <li>
            <Trans>
              Your USPS tracking number, so you can confirm your letter was
              delivered.
            </Trans>
          </li>
          <li>
            <Trans>
              A link to download a PDF copy of your letter for your records.
            </Trans>
          </li>
        </ul>
        <p>
          <Trans>
            Keep this for your documentation. It's an important part of
            asserting your rights.
          </Trans>
        </p>
      </>
    )}
  </ContentBoxItem>
);

export const PayRentAndWait: React.FC<NextStepItemProps> = (props) => (
  <ContentBoxItem
    title={
      <>
        <Pill color="black" circle>
          2
        </Pill>
        <Trans>Keep paying rent and wait for your landlord’s response</Trans>
      </>
    }
    {...props}
  >
    <p>
      <Trans>
        While you wait for your landlord to reply, you have the right to stay in
        your home under the terms of your most recent lease. This means:
      </Trans>
    </p>
    <ul>
      <li>
        <Trans>
          Continue paying the same rent amount listed on your last signed lease.
        </Trans>
      </li>
      <li>
        <Trans>
          Keep documentation of every rent payment (receipts, screenshots, or
          bank confirmations).
        </Trans>
      </li>
      <li>
        <Trans>
          Give your landlord at least two weeks to respond before following up.
        </Trans>
      </li>
    </ul>
    <p>
      <Trans>
        If they refuse, ignore you, or offer an increase above the legal limit,
        you still retain your Good Cause protections.
      </Trans>
    </p>
  </ContentBoxItem>
);

export const CommunicateInWriting: React.FC<NextStepItemProps> = (props) => (
  <ContentBoxItem
    title={
      <>
        <Pill color="black" circle>
          3
        </Pill>
        <Trans>Keep all communication in writing</Trans>
      </>
    }
    {...props}
  >
    <p>
      <Trans>
        Document all communications with your landlord. This could include
        texts, emails, letters, or notes from conversations.
      </Trans>
    </p>
    <ul>
      <li>
        <Trans>
          If you speak with your landlord by phone or in person, jot down the
          date, time, and what was said.
        </Trans>
      </li>
      <li>
        <Trans>
          This documentation can protect you if your landlord challenges your
          rights or starts a court case.
        </Trans>
      </li>
    </ul>
  </ContentBoxItem>
);

export const TalkToNeighbors: React.FC<NextStepItemProps> = (props) => (
  <ContentBoxItem
    title={
      <>
        <Pill color="black" circle>
          4
        </Pill>
        <Trans>Talk to your neighbors</Trans>
      </>
    }
    {...props}
  >
    <p>
      <Trans>
        If you’re dealing with something that feels unfair, like a large rent
        increase or a sudden non-renewal of your lease, chances are your
        neighbors might be facing similar issues.
      </Trans>
    </p>
    <p>
      <Trans>
        It’s often more effective to approach these problems together, by
        sharing information, comparing experiences, and contacting your landlord
        together.
      </Trans>
    </p>
    <JFCLLinkExternal to="https://www.metcouncilonhousing.org/help-answers/forming-a-tenants-association">
      Met Council on Housing’s Guide to Forming a Tenant Association
    </JFCLLinkExternal>
  </ContentBoxItem>
);

export const WhileYouWait: React.FC<NextStepItemProps> = (props) => (
  <ContentBoxItem
    title={
      <strong>
        <Trans>Need support while you wait?</Trans>
      </strong>
    }
    accordion={false}
    {...props}
    className={classNames("next-step while-you-wait", props.className)}
  >
    <p>
      <Trans>
        Call <strong>311</strong> and ask for the Tenant Helpline. They can
        connect you to the right resource based on your situation.
      </Trans>
    </p>
  </ContentBoxItem>
);

export const LetterNextSteps: React.FC<NextStepCollectionProps> = ({
  mailChoice,
  ...props
}) => (
  <ContentBox subtitle={<Trans>What happens next?</Trans>} {...props}>
    <TextFollowup mailChoice={mailChoice} />
    <PayRentAndWait />
    <CommunicateInWriting />
    <TalkToNeighbors />
    <WhileYouWait />
  </ContentBox>
);

// Universal Landlord Responses

export const NewCompliantLease: React.FC<NextStepItemProps> = (props) => (
  <ContentBoxItem
    title={
      <Trans>
        Your landlord offers a new lease that complies with Good Cause
      </Trans>
    }
    {...props}
  >
    <section>
      <h5>
        <Trans>What to know</Trans>
      </h5>
      <p>
        That’s a good sign, it means your letter worked. The new lease should
        include a Good Cause lease rider and a lawful rent amount.
      </p>
    </section>
    <section>
      <h5>
        <Trans>What to do</Trans>
      </h5>
      <ul>
        <li>
          <Trans>
            Double-check the rent using the <RentIncreaseCalculatorLink />.
          </Trans>
        </li>
        <li>
          <Trans>Review the new lease carefully.</Trans>
        </li>
        <li>
          <Trans>
            Sign and return it to your landlord once you agree to the terms.
          </Trans>
        </li>
      </ul>
    </section>
  </ContentBoxItem>
);

export const ClaimsNotCoveredByGCE: React.FC<NextStepItemProps> = (props) => (
  <ContentBoxItem
    title={<Trans>Your landlord says you’re not covered by Good Cause</Trans>}
    {...props}
  >
    <section>
      <h5>
        <Trans>What to know</Trans>
      </h5>
      <p>
        <Trans>
          Coverage depends on your building type, subsidy status, and other
          factors.
        </Trans>
      </p>
    </section>
    <section>
      <h5>
        <Trans>What to do</Trans>
      </h5>
      <ul>
        <li>
          <Trans>
            Ask your landlord for a written explanation of why they believe
            you’re not covered.
          </Trans>
        </li>
        <li>
          <Trans>
            Use the <GoodCauseScreenerLink /> to check your coverage.
          </Trans>
        </li>
        <li>
          <Trans>Compare your results with </Trans>
          <JFCLLinkExternal to="https://www.nyc.gov/content/tenantprotection/pages/good-cause-eviction-information-for-tenants">
            <Trans>NYC’s Tenant Protection Cabinet’s Good Cause Guide.</Trans>
          </JFCLLinkExternal>
        </li>
      </ul>
    </section>
  </ContentBoxItem>
);

export const NoResponse: React.FC<NextStepItemProps> = (props) => (
  <ContentBoxItem
    title={<Trans>Your landlord doesn’t respond</Trans>}
    {...props}
  >
    <section>
      <h5>
        <Trans>What to know</Trans>
      </h5>
      <p>
        <Trans>
          If your landlord ignores your letter, you still have your Good Cause
          protections.
        </Trans>
      </p>
    </section>
    <section>
      <h5>
        <Trans>What to do</Trans>
      </h5>
      <ul>
        <li>
          <Trans>
            Follow up with your landlord in writing and keep records of all
            attempts to contact them.
          </Trans>
        </li>
        <li>
          <Trans>You can keep paying rent under your current lease.</Trans>
        </li>
        <li>
          <Trans>
            Reach out to a tenant support organization for help navigating next
            steps.
          </Trans>
        </li>
      </ul>
    </section>
  </ContentBoxItem>
);

export const SendsCourtPaper: React.FC<NextStepItemProps> = (props) => (
  <ContentBoxItem
    title={<Trans>Your landlord sends court papers</Trans>}
    {...props}
  >
    <section>
      <h5>
        <Trans>What to know</Trans>
      </h5>
      <p>
        <Trans>
          If your landlord starts a housing court case, don’t ignore it. Your
          landlord has to follow the law if they want to evict you and you have
          rights.
        </Trans>
      </p>
    </section>
    <section>
      <h5>
        <Trans>What to do</Trans>
      </h5>
      <ul>
        <li>
          <Trans>Don’t ignore the court papers.</Trans>
        </li>
        <li>
          <Trans>
            Begin to gather all documentation to defend your case. This could
            include letters, lease, proof of coverage, rent receipts, etc.
          </Trans>
        </li>
        <li>
          <Trans>Respond to the court notice promptly.</Trans>
        </li>
        <li>
          <Trans>
            Contact{" "}
            <JFCLLinkExternal to="https://housingcourtanswers.org/answers/for-tenants/">
              <Trans>Housing Court Answers</Trans>
            </JFCLLinkExternal>{" "}
            or one of the organizations in the “legal advice and assistance”
            section below as soon as you can.
          </Trans>
        </li>
      </ul>
    </section>
  </ContentBoxItem>
);

export const LetterResponsesUniversal: React.FC<NextStepCollectionProps> = (
  props
) => (
  <ContentBox
    subtitle={<Trans>How might your landlord respond?</Trans>}
    {...props}
  >
    <NewCompliantLease />
    <NoResponse />
    <ClaimsNotCoveredByGCE />
    <SendsCourtPaper />
  </ContentBox>
);

// Rent Increase Responses

export const RefuseSmallerIncrease: React.FC<NextStepItemProps> = (props) => (
  <ContentBoxItem
    title={
      <Trans>Your landlord refuses to offer a smaller rent increase</Trans>
    }
    {...props}
  >
    <h5>
      <Trans>What to know</Trans>
    </h5>
    <p>
      Your landlord might reject your request and keep the higher rent increase.
      Even if they refuse, your Good Cause rights still apply. Increases above
      the local rent standard (annual inflation + 5%, or a maximum of 10%) are
      presumed unreasonable unless your landlord can prove a valid reason.
    </p>
    <h5>
      <Trans>What to do</Trans>
    </h5>
    <ul>
      <li>
        <Trans>Document their refusal or lack of response.</Trans>
      </li>
      <li>
        <Trans>
          Keep paying rent under your current lease. You don’t need to accept
          the higher amount.
        </Trans>
      </li>
      <li>
        <Trans>
          Contact a tenant support organization for guidance or help drafting a
          follow-up letter.
        </Trans>
      </li>
    </ul>
  </ContentBoxItem>
);

export const SmallerButUnreasonableIncrease: React.FC<NextStepItemProps> = (
  props
) => (
  <ContentBoxItem
    title={
      <Trans>
        Your landlord offers a smaller rent increase, but it’s still above the
        legal limit
      </Trans>
    }
    {...props}
  >
    <section>
      <h5>
        <Trans>What to know</Trans>
      </h5>
      <p>
        Even if your landlord lowers the increase, it may still be above what
        Good Cause allows.
      </p>
    </section>
    <section>
      <h5>
        <Trans>What to do</Trans>
      </h5>
      <ul>
        <li>
          <Trans>
            Use the <RentIncreaseCalculatorLink /> to check if the new amount is
            legal.
          </Trans>
        </li>
        <li>
          <Trans>
            If it’s still too high, write back citing Good Cause protections and
            request a compliant rent amount.
          </Trans>
        </li>
        <li>
          <Trans>Keep paying rent until you sign a new lease.</Trans>
        </li>
      </ul>
    </section>
  </ContentBoxItem>
);

export const NoSmallerIncreaseBeforeLeaseEnd: React.FC<NextStepItemProps> = (
  props
) => (
  <ContentBoxItem
    title={
      <Trans>
        Your landlord doesn’t offer you a smaller rent increase before your
        current lease ends
      </Trans>
    }
    {...props}
  >
    <h5>
      <Trans>What to know</Trans>
    </h5>
    <p>
      If your lease expires before a new one is offered, your Good Cause rights
      still apply. You have the right to stay in your home.
    </p>
    <h5>
      <Trans>What to do</Trans>
    </h5>
    <ul>
      <li>
        <Trans>
          You can continue to stay in your apartment and abide by the terms of
          your existing or most recent lease. This includes continuing to pay
          the rent amount on your most recent lease.
        </Trans>
      </li>
      <li>
        <Trans>
          If you're comfortable, you can avoid signing a lease with an increase
          above the Good Cause limit.
        </Trans>
      </li>
      <li>
        <Trans>
          Reach out to a tenant support or legal aid organization for advice
          before signing anything new.
        </Trans>
      </li>
    </ul>
  </ContentBoxItem>
);

export const ProvidesReasonForRentIncrease: React.FC<NextStepItemProps> = (
  props
) => (
  <ContentBoxItem
    title={
      <Trans>Your landlord provides a reason for your rent increase</Trans>
    }
    {...props}
  >
    <section>
      <h5>
        <Trans>What to know</Trans>
      </h5>
      <p>
        <Trans>
          Your landlord may reply with an explanation or justification for
          increasing your rent. For example, citing increased maintenance costs,
          property taxes, or improvements to the building.
        </Trans>
      </p>
      <p>
        <Trans>
          Under the Good Cause law, landlords can only raise rent above the
          local rent standard (annual inflation + 5%, or a maximum of 10%) if
          they can prove there’s a legitimate “good cause” reason for doing so.
          The reason must be specific, factual, and reasonable, not just a
          general claim of higher expenses.
        </Trans>
      </p>
    </section>
    <section>
      <h5>
        <Trans>What to do</Trans>
      </h5>
      <ul>
        <li>
          <Trans>
            Ask your landlord to put their reason in writing if they haven’t
            already.
          </Trans>
        </li>
        <li>
          <Trans>Save all communications and documentation they provide.</Trans>
        </li>
        <li>
          <Trans>
            Use the <RentIncreaseCalculatorLink /> to confirm whether the
            proposed increase still exceeds the legal limit.
          </Trans>
        </li>
        <li>
          <Trans>
            Reach out to a tenant support organization or legal aid provider
            listed in Who Can Help? for help reviewing whether the landlord’s
            reason meets the “good cause” standard.
          </Trans>
        </li>
        <li>
          <Trans>
            You can continue to stay in your home and pay rent at your current
            amount while this is being resolved.
          </Trans>
        </li>
      </ul>
    </section>
  </ContentBoxItem>
);

export const LetterResponsesRentIncrease: React.FC<
  NextStepCollectionProps & {
    includeUniversal?: boolean;
  }
> = ({ includeUniversal, ...props }) => (
  <ContentBox
    subtitle={
      includeUniversal ? (
        <Trans>How might your landlord respond?</Trans>
      ) : (
        <Trans>What to do if your landlord raises your rent</Trans>
      )
    }
    {...props}
  >
    {includeUniversal ? (
      <>
        {" "}
        <NewCompliantLease />
        <SmallerButUnreasonableIncrease />
        <NoSmallerIncreaseBeforeLeaseEnd />
        <RefuseSmallerIncrease />
        <ProvidesReasonForRentIncrease />
        <ClaimsNotCoveredByGCE />
        <NoResponse />
        <SendsCourtPaper />{" "}
      </>
    ) : (
      <>
        <RefuseSmallerIncrease />
        <SmallerButUnreasonableIncrease />
        <NoSmallerIncreaseBeforeLeaseEnd />
        <ProvidesReasonForRentIncrease />{" "}
      </>
    )}
  </ContentBox>
);

// Non-Renewal Responses

export const RefusesNewLease: React.FC<NextStepItemProps> = (props) => (
  <ContentBoxItem
    title={<Trans>Your landlord refuses to renew your lease</Trans>}
    {...props}
  >
    <section>
      <h5>
        <Trans>What to know</Trans>
      </h5>
      <p>
        <Trans>
          Under Good Cause, a landlord cannot refuse to renew your lease without
          a legally valid reason.{" "}
        </Trans>
      </p>
      <p>
        <JFCLLinkExternal to="https://www.nyc.gov/content/tenantprotection/pages/good-cause-eviction-information-for-tenants#:~:text=My%20landlord%20is%20threatening%20to%20evict%20me%20or%20refusing%20to%20renew%20my%20lease%2C%20and%20I%20think%20I%E2%80%99m%20covered%20by%20Good%20Cause%20Eviction.%20What%20can%20I%20do%3F">
          <Trans>Learn more about Good Cause reasons for non renewal</Trans>
        </JFCLLinkExternal>
      </p>
    </section>
    <section>
      <h5>
        <Trans>What to do</Trans>
      </h5>
      <ul>
        <li>
          <Trans>
            Save your lease, your letter asserting rights, and all
            communications.
          </Trans>
        </li>
        <li>
          <Trans>Continue paying rent under your most recent lease.</Trans>
        </li>
        <li>
          <Trans>Contact a legal aid provider immediately for advice.</Trans>
        </li>
      </ul>
    </section>
  </ContentBoxItem>
);

export const NewLeaseUnreasonableIncrease: React.FC<NextStepItemProps> = (
  props
) => (
  <ContentBoxItem
    title={
      <Trans>
        Your landlord offers you a new lease with a rent increase above the
        allowable amount
      </Trans>
    }
    {...props}
  >
    <section>
      <h5>
        <Trans>What to know</Trans>
      </h5>
      <p>
        <Trans>
          Renewal leases must also follow Good Cause rules. A rent increase
          above the legal limit is presumed unreasonable.
        </Trans>
      </p>
    </section>
    <section>
      <h5>
        <Trans>What to do</Trans>
      </h5>
      <ul>
        <li>
          <Trans>Review the lease terms carefully.</Trans>
        </li>
        <li>
          <Trans>
            Use the <RentIncreaseCalculatorLink /> to confirm if the increase is
            allowed.
          </Trans>
        </li>
        <li>
          <Trans>
            Respond in writing: note that you’re covered by Good Cause and
            request a rent below the legal limit.
          </Trans>
        </li>
      </ul>
    </section>
  </ContentBoxItem>
);

export const ReasonForNonRenewal: React.FC<NextStepItemProps> = (props) => (
  <ContentBoxItem
    title={
      <Trans>Your landlord provides a reason for not renewing your lease</Trans>
    }
    {...props}
  >
    <section>
      <h5>
        <Trans>What to know</Trans>
      </h5>
      <p>
        <Trans>
          Under the Good Cause law, your landlord can only refuse to renew your
          lease if they have a legally valid reason, known as a “good cause.”
          These reasons are limited and must meet specific criteria. For
          example, if the landlord or their immediate family intends to move in,
          if you’ve violated a substantial lease term, or if you’ve consistently
          failed to pay rent.
        </Trans>
      </p>
      <p>
        <Trans>
          If your landlord provides a reason, that doesn’t automatically mean
          the non-renewal is lawful. Your landlord’s reason must still meet the
          standards defined in the law
        </Trans>
      </p>
      <p>
        <JFCLLinkExternal to="https://www.nyc.gov/content/tenantprotection/pages/good-cause-eviction-information-for-tenants#:~:text=My%20landlord%20is%20threatening%20to%20evict%20me%20or%20refusing%20to%20renew%20my%20lease%2C%20and%20I%20think%20I%E2%80%99m%20covered%20by%20Good%20Cause%20Eviction.%20What%20can%20I%20do%3F">
          <Trans>Learn more about Good Cause reasons for non renewal</Trans>
        </JFCLLinkExternal>
      </p>
    </section>
    <section>
      <h5>
        <Trans>What to do</Trans>
      </h5>
      <ul>
        <li>
          <Trans>
            Ask your landlord to put their reason in writing if they haven’t
            already.
          </Trans>
        </li>
        <li>
          <Trans>
            Save that communication along with your lease and your letter
            asserting your rights.
          </Trans>
        </li>
        <li>
          <Trans>
            Compare your landlord’s stated reason with the list of Good Cause
            reasons to see if it qualifies under the law.
          </Trans>
        </li>
        <li>
          <Trans>
            If you’re unsure whether the reason is valid, reach out to a tenant
            support organization or legal aid provider listed in Who Can Help?.
          </Trans>
        </li>
      </ul>
    </section>
  </ContentBoxItem>
);

export const ProofForNonRenewalReason: React.FC<NextStepItemProps> = (
  props
) => (
  <ContentBoxItem
    title={
      <Trans>
        Your landlord provides proof of a “good cause” reason for not renewing
        your lease
      </Trans>
    }
    {...props}
  >
    <section>
      <h5>
        <Trans>What to know</Trans>
      </h5>
      <p>
        <Trans>
          Your landlord may share documentation or other evidence to support
          their claimed “good cause” reason for not renewing your lease. For
          example, proof that they or an immediate family member intend to move
          in, or that you’ve repeatedly violated the lease.
        </Trans>
      </p>
      <p>
        <Trans>
          Even when your landlord provides proof, you still have the right to
          review and, if needed, challenge whether their reason qualifies as
          lawful under the Good Cause law.
        </Trans>
      </p>
      <p>
        <JFCLLinkExternal to="https://www.nyc.gov/content/tenantprotection/pages/good-cause-eviction-information-for-tenants#:~:text=My%20landlord%20is%20threatening%20to%20evict%20me%20or%20refusing%20to%20renew%20my%20lease%2C%20and%20I%20think%20I%E2%80%99m%20covered%20by%20Good%20Cause%20Eviction.%20What%20can%20I%20do%3F">
          <Trans>Learn more about Good Cause reasons for non renewal</Trans>
        </JFCLLinkExternal>{" "}
      </p>
    </section>
    <section>
      <h5>
        <Trans>What to do</Trans>
      </h5>
      <ul>
        <li>
          <Trans>
            Request copies of any documents your landlord references. These can
            include affidavits, notices, or plans to occupy the unit.
          </Trans>
        </li>
        <li>
          <Trans>
            Save all communications and keep your most recent lease and rent
            payment records.
          </Trans>
        </li>
        <li>
          <Trans>
            Do not move out immediately. You have the right to remain in your
            home unless a court orders otherwise.
          </Trans>
        </li>
        <li>
          <Trans>
            Contact a legal aid provider or tenant support organization right
            away for help reviewing whether the landlord’s claimed reason
            qualifies as a valid “good cause.”
          </Trans>
        </li>
      </ul>
    </section>
  </ContentBoxItem>
);

export const LetterResponsesNonRenewal: React.FC<
  NextStepCollectionProps & {
    includeUniversal?: boolean;
  }
> = ({ includeUniversal, ...props }) => (
  <ContentBox
    subtitle={
      includeUniversal ? (
        <Trans>How might your landlord respond?</Trans>
      ) : (
        <Trans>What to do if your landlord won’t renew your lease</Trans>
      )
    }
    {...props}
  >
    {includeUniversal ? (
      <>
        {" "}
        <NewCompliantLease />
        <NewLeaseUnreasonableIncrease />
        <RefusesNewLease />
        <ReasonForNonRenewal />
        <ProofForNonRenewalReason />
        <ClaimsNotCoveredByGCE />
        <NoResponse />
        <SendsCourtPaper />{" "}
      </>
    ) : (
      <>
        <RefusesNewLease />
        <NewLeaseUnreasonableIncrease />
        <ReasonForNonRenewal />
        <ProofForNonRenewalReason />{" "}
      </>
    )}
  </ContentBox>
);

// Who can help

export const CommunityResources: React.FC<NextStepItemProps> = (props) => (
  <ContentBoxItem title={<Trans>Community resources</Trans>} {...props}>
    <section>
      <h5>
        <Trans>When to use</Trans>
      </h5>
      <p>
        <Trans>
          If you need help understanding your rights, contacting your landlord,
          or getting connected to local tenant groups or city services.
        </Trans>
      </p>
    </section>
    <section>
      <h5>
        <Trans>Helpful organizations</Trans>
      </h5>
      <ul>
        <li>
          <JFCLLinkExternal to="https://www.nyc.gov/site/mayorspeu/programs/contact-the-tenant-support-unit.page">
            <Trans>NYC's Tenant Support Unit (TSU)</Trans>
          </JFCLLinkExternal>
        </li>
        <li>
          <JFCLLinkExternal to="https://housingcourtanswers.org/answers/for-tenants/">
            <Trans>Housing Court Answers</Trans>
          </JFCLLinkExternal>
        </li>
      </ul>
    </section>
  </ContentBoxItem>
);

export const TenantAdvocacyGroups: React.FC<NextStepItemProps> = (props) => (
  <ContentBoxItem title={<Trans>Tenant advocacy groups</Trans>} {...props}>
    <section>
      <h5>
        <Trans>When to use</Trans>
      </h5>
      <p>
        <Trans>
          If you’re organizing with neighbors, challenging a landlord’s actions,
          or want to connect with tenant campaigns for stronger protections.
        </Trans>
      </p>
    </section>
    <section>
      <h5>
        <Trans>Helpful organizations</Trans>
      </h5>
      <ul>
        <li>
          <JFCLLinkExternal to="https://www.metcouncilonhousing.org/">
            <Trans>Met Council on Housing</Trans>
          </JFCLLinkExternal>
        </li>
        <li>
          <JFCLLinkExternal to="https://housingjusticeforall.org/">
            <Trans>Housing Justice for All</Trans>
          </JFCLLinkExternal>
        </li>
      </ul>
    </section>
  </ContentBoxItem>
);

export const LegalAdviceAssistance: React.FC<NextStepItemProps> = (props) => (
  <ContentBoxItem title={<Trans>Legal advice and assistance</Trans>} {...props}>
    <section>
      <h5>
        <Trans>When to use</Trans>
      </h5>
      <p>
        <Trans>
          If you’re organizing with neighbors, challenging a landlord’s actions,
          or want to connect with tenant campaigns for stronger protections.
        </Trans>
      </p>
    </section>
    <section>
      <h5>
        <Trans>Helpful organizations</Trans>
      </h5>
      <ul>
        <li>
          <JFCLLinkExternal to="https://housingcourtanswers.org/contact-us/">
            <Trans>Housing Court Answers (HCA)</Trans>
          </JFCLLinkExternal>
        </li>
        <li>
          <JFCLLinkExternal to="https://legalaidnyc.org/get-help/housing-problems/">
            <Trans>Legal Aid Society - Housing Unit</Trans>
          </JFCLLinkExternal>
        </li>
        <li>
          <JFCLLinkExternal to="https://www.legalservicesnyc.org/get-help-with-a-legal-issue/">
            <Trans>Legal Services NYC</Trans>
          </JFCLLinkExternal>
        </li>
        <li>
          <JFCLLinkExternal to="https://nylag.org/gethelp/">
            <Trans>New York Legal Assistance Group (NYLAG)</Trans>
          </JFCLLinkExternal>
        </li>
        <li>
          <JFCLLinkExternal to="https://mobilizationforjustice.org/get-help/how-to-get-help/">
            <Trans>Mobilization for Justice (MFJ)</Trans>
          </JFCLLinkExternal>
        </li>
      </ul>
    </section>
  </ContentBoxItem>
);

export const LetterWhoCanHelp: React.FC<NextStepCollectionProps> = (props) => (
  <ContentBox subtitle={<Trans>Who can help?</Trans>} {...props}>
    <CommunityResources />
    <TenantAdvocacyGroups />
    <LegalAdviceAssistance />
  </ContentBox>
);

export const LetterNextStepsStandalone: React.FC = () => {
  return (
    <>
      <Header
        title={<Trans>After you send your letter</Trans>}
        subtitle={
          <Trans>
            What to expect, what to do next, and how to respond to your
            landlord.
          </Trans>
        }
        showProgressBar={false}
      />
      <div className="content-section">
        <div className="content-section__content">
          <LetterNextSteps
            subtitle={<Trans>What to do after sending your letter</Trans>}
          />
          <LetterResponsesUniversal />
          <LetterResponsesNonRenewal />
          <LetterResponsesRentIncrease />
          <LetterWhoCanHelp subtitle={<Trans>Where to find support</Trans>} />
        </div>
      </div>
    </>
  );
};
