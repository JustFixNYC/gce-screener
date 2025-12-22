import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";
import { Link } from "react-router-dom";

import { ContentBox, ContentBoxItem } from "../../ContentBox/ContentBox";
import { GoodCauseProtections } from "../../KYRContent/KYRContent";
import { Pill } from "../../Pill/Pill";
import { JFCLLinkExternal } from "../../JFCLLink";
import { BackNextButtons } from "../BackNextButtons/BackNextButtons";
import { Notice } from "../../Notice/Notice";
import { urlMyGov } from "../../../helpers";
import { Heading } from "../../Heading/Heading";
import "./AllowedIncreaseStep.scss";

export const AllowedIncreaseStep: React.FC = () => {
  const { i18n } = useLingui();
  return (
    <div className="allowed-increase-step">
      <Notice
        className="allowed-increase-notice"
        color="yellow"
        header={
          <Trans>
            You told us that the landlord’s proposed rent increase is within the{" "}
            <span className="good-cause-text-group">Good Cause</span> legal
            limit.
          </Trans>
        }
        headingLevel={4}
      >
        <p>
          <Trans>
            You still have rights, and you may be able to negotiate a smaller
            increase or request more information about how your rent is
            determined. Or, you can go back and{" "}
          </Trans>
          <Link
            to={`/${i18n.locale}/letter/rent_increase`}
            className="jfcl-link"
          >
            <Trans>modify your response.</Trans>
          </Link>
        </p>
      </Notice>
      <RentNegotiationTips />
      <GoodCauseProtections
        title={
          <Trans>
            Protections under{" "}
            <span className="good-cause-text-group">Good Cause</span>
          </Trans>
        }
        headingLevel={4}
      />
      <BackNextButtons hideButton2 backStepName="rent_increase" />
    </div>
  );
};

const PhaseInIncrease: React.FC = () => (
  <ContentBoxItem
    title={
      <>
        <Pill color="black" circle>
          1
        </Pill>
        <Trans>Ask if your landlord can phase-in the increase</Trans>
      </>
    }
    headingLevel={5}
  >
    <p>
      <Trans>
        Even if the full increase is allowed under{" "}
        <span className="good-cause-text-group">Good Cause</span>, you can ask
        to spread it out over several months.
      </Trans>
    </p>
    <p>
      <Trans>
        Example: If your rent is going up 8%, you could propose a 4% increase
        now and another 4% later in the year.
      </Trans>
    </p>
    <p>
      <Trans>
        This approach can make the increase more manageable while showing your
        landlord you’re willing to meet halfway.
      </Trans>
    </p>
  </ContentBoxItem>
);
const HighlightTrackRecord: React.FC = () => (
  <ContentBoxItem
    title={
      <>
        <Pill color="black" circle>
          2
        </Pill>
        <Trans>Highlight your track record as a reliable tenant</Trans>
      </>
    }
    headingLevel={5}
  >
    <p>
      <Trans>
        Remind your landlord that you’ve paid rent on time, taken care of the
        unit, and been a responsible tenant.
      </Trans>
    </p>
    <p>
      <Trans>
        Landlords often value stability, especially in a competitive market. A
        short, polite message pointing out your reliability can strengthen your
        case for a smaller increase.
      </Trans>
    </p>
  </ContentBoxItem>
);
const AskIncreaseReason: React.FC = () => (
  <ContentBoxItem
    title={
      <>
        <Pill color="black" circle>
          3
        </Pill>
        <Trans>Ask what’s driving the increase</Trans>
      </>
    }
    headingLevel={5}
  >
    <p>
      <Trans>
        Politely ask your landlord to explain the reason for the increase. For
        example, higher property taxes or maintenance costs.
      </Trans>
    </p>
    <p>
      <Trans>
        Understanding the cause can help you decide whether the increase seems
        fair and whether you have room to negotiate.
      </Trans>
    </p>
    <p>
      <Trans>
        If costs haven’t clearly gone up, that may strengthen your argument for
        a smaller raise.
      </Trans>
    </p>
  </ContentBoxItem>
);
const OfferLongerLease: React.FC = () => (
  <ContentBoxItem
    title={
      <>
        <Pill color="black" circle>
          4
        </Pill>
        <Trans>Offer a longer lease in exchange for a smaller increase</Trans>
      </>
    }
    headingLevel={5}
  >
    <p>
      <Trans>
        If you plan to stay long-term, you could offer to renew for two years
        instead of one in exchange for a smaller rent increase.
      </Trans>
    </p>
    <p>
      <Trans>
        Many landlords prefer stable, predictable tenants. This saves them time
        and reduces turnover. Framing it as a win-win can make this offer
        appealing.
      </Trans>
    </p>
  </ContentBoxItem>
);
const GetOrganizationSupport: React.FC = () => (
  <ContentBoxItem
    title={
      <>
        <Pill color="black" circle>
          5
        </Pill>
        <Trans>Get support from a tenant organization</Trans>
      </>
    }
    headingLevel={5}
  >
    <p>
      <Trans>
        Tenant support groups can help you draft messages, practice negotiation
        conversations, or understand your rights if your landlord refuses to
        negotiate.
      </Trans>
    </p>
    <section className="organizations-section">
      <Heading level={6}>
        <Trans>Organizations that can help</Trans>
      </Heading>
      <ul className="no-bullets">
        <li>
          <JFCLLinkExternal to="https://www.metcouncilonhousing.org/">
            <Trans>Met Council on Housing</Trans>
          </JFCLLinkExternal>
        </li>
        <li>
          <JFCLLinkExternal to="https://housingcourtanswers.org/answers/for-tenants/">
            <Trans>Housing Court Answers</Trans>
          </JFCLLinkExternal>
        </li>
        <li>
          <JFCLLinkExternal to="https://www.nyc.gov/site/mayorspeu/programs/tenant-support-unit.page">
            <Trans>NYC’s Tenant Support Unit (311)</Trans>
          </JFCLLinkExternal>
        </li>
        <li>
          <JFCLLinkExternal to={urlMyGov()}>
            <Trans>Your local City Council representative</Trans>
          </JFCLLinkExternal>
        </li>
      </ul>
    </section>
  </ContentBoxItem>
);

const RentNegotiationTips: React.FC = () => (
  <ContentBox
    title={<Trans>Tips for negotiating a smaller increase</Trans>}
    headingLevel={4}
  >
    <PhaseInIncrease />
    <HighlightTrackRecord />
    <AskIncreaseReason />
    <OfferLongerLease />
    <GetOrganizationSupport />
  </ContentBox>
);
