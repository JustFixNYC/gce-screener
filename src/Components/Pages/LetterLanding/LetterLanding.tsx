import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { Button } from "@justfixnyc/component-library";
import { useNavigate } from "react-router-dom";

import { Header } from "../../Header/Header";
import { JFCLLink, JFCLLinkExternal } from "../../JFCLLink";
import "./LetterLanding.scss";

export const LetterLanding: React.FC = () => {
  const { _, i18n } = useLingui();
  const navigate = useNavigate();

  return (
    <div id="letter-sender-landing-page">
      <Header
        title={
          <Trans>
            Send a letter to your <br />
            landlord defending <br />
            your Good Cause rights
          </Trans>
        }
        subtitle={
          <Trans>
            If you’re covered by Good Cause and your landlord is planning to
            raise your rent or not offer you a new lease, you can send a letter
            defending your Good Cause rights.
          </Trans>
        }
        showProgressBar={false}
      >
        <div className="hero-cta">
          <Trans>
            <strong>Start here:</strong> are you covered by Good Cause?
          </Trans>
          <div className="hero-cta__buttons">
            <Button
              labelIcon="mailboxOpenLetter"
              labelText={_(msg`I’m covered, start my free letter`)}
              onClick={() => navigate("reason")}
            />
            <Button
              labelText={_(msg`Find out if I’m covered`)}
              onClick={() => navigate(`/${i18n.locale}`)}
              variant="secondary"
            />
          </div>
        </div>
      </Header>

      <div className="content-section">
        <div className="content-section__content">
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
                offer you a new lease, we will draft a USPS Certified Mail
                letter defending your Good Cause rights. We will even send it
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
          <section className="callout-box">
            <h4>
              <Trans>This free service has been legally vetted</Trans>
            </h4>
            <p>
              <Trans>
                The Good Cause Letter Sender was developed with housing
                attorneys, tenant organizers, community leaders, and tenants.
              </Trans>
            </p>
          </section>
          <section className="callout-box outside-nyc">
            <h4>
              <Trans>If you live outside of NYC</Trans>
            </h4>
            <p>
              <Trans>
                Tenants and tenant advocates are working to extend Good Cause
                protections throughout New York State. This product is not yet
                available for residents outside of New York City.
              </Trans>
            </p>
            <JFCLLinkExternal to="https://housingjusticeforall.org/kyr-good-cause/">
              Learn where Good Cause Protections have already been won
            </JFCLLinkExternal>
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
                  <Trans>Formally assert your rights</Trans>
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
                  <Trans>Open negotiation</Trans>
                </strong>
                <p>
                  <Trans>
                    Establishes a professional channel to negotiate solutions to
                    your rent increase or non-renewal.
                  </Trans>
                </p>
              </li>
              <li>
                <strong>
                  <Trans>Create a paper trail</Trans>
                </strong>
                <p>
                  <Trans>
                    Communicating your request to your landlord in writing
                    provides documented evidence of your complaint.
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
