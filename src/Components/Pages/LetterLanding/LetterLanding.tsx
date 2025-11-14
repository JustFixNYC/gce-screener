import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { Header } from "../../Header/Header";
import { JFCLLink } from "../../JFCLLink";
import "./LetterLanding.scss";
import { PhoneNumberCallout } from "../../PhoneNumberCallout/PhoneNumberCallout";

export const LetterLanding: React.FC = () => {
  const { _, i18n } = useLingui();

  return (
    <div id="letter-sender-landing-page">
      <div className="headline-section">
        <div className="coming-soon-pill-container">
          <span className="coming-soon-pill">
            <Trans>Coming soon</Trans>
          </span>
        </div>
        <Header
          title={_(msg`Send a letter to your landlord`)}
          subtitle={
            <Trans>
              If you’re covered by Good Cause and your landlord is planning to
              raise your rent or not offer you a new lease, you can send a
              letter to your landlord asserting your Good Cause rights.
            </Trans>
          }
          showProgressBar={false}
        ></Header>
      </div>
      <div className="content-section">
        <div className="content-section__content">
          <PhoneNumberCallout
            headerText={_(msg`Get a text when the letter sender is live.`)}
            bodyText={_(
              msg`We will send you a text with a link to the letter sender when it is ready.`
            )}
            gtmId="rent-calculator-page"
          />
          <section className="about-section">
            <h3>
              <Trans>How it works</Trans>
            </h3>
            <p>
              <Trans>
                If you are covered by Good Cause, you have a legal right to
                limited rent increases and the right to stay in your home.
              </Trans>
            </p>
            <p>
              <Trans>
                If your landlord is either planning to raise your rent, or not
                offering you a new lease, we will draft a USPS Certified Mail®
                letter asserting your Good Cause rights. We will even send it
                for you, for free.
              </Trans>
            </p>
            <p>
              <strong>
                <Trans>Not sure if you’re covered?</Trans>
              </strong>{" "}
              <JFCLLink to={`/${i18n.locale}`}>
                <Trans>Take the survey</Trans>
              </JFCLLink>
            </p>
          </section>
          <section>
            <div className="callout-box">
              <h4>
                <Trans>Designed with tenants and experts</Trans>
              </h4>
              <p>
                <Trans>
                  The Good Cause Letter Sender was developed with housing
                  attorneys, tenant organizers, community leaders, and tenants
                  themselves.
                </Trans>
              </p>
            </div>
          </section>
        </div>
      </div>

      <div className="content-section">
        <div className="content-section__content">
          <section>
            <h3>
              <Trans>Why send a letter to your landlord?</Trans>
            </h3>
            <ol>
              <li>
                <strong>
                  <Trans>Formally asserts your rights</Trans>
                </strong>
                <p>
                  <Trans>
                    Sending a letter clearly communicates to your landlord that
                    you know your legal protections.
                  </Trans>
                </p>
              </li>
              <li>
                <strong>
                  <Trans>Creates a paper trail</Trans>
                </strong>
                <p>
                  <Trans>
                    Communicating your request to your landlord in writing
                    provides documented evidence of your complaint.
                  </Trans>
                </p>
              </li>
              <li>
                <strong>
                  <Trans>Opens negotiation</Trans>
                </strong>
                <p>
                  <Trans>
                    Establishes a professional channel to negotiate solutions to
                    your rent increase or non-renewal.
                  </Trans>
                </p>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};
