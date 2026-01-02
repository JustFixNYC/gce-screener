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
            Send a letter to your <br aria-hidden />
            landlord defending <br aria-hidden />
            your Good Cause rights
          </Trans>
        }
        subtitle={
          <Trans>
            If you’re covered by{" "}
            <span className="good-cause-text-group">Good Cause</span> and your
            landlord is planning to raise your rent or not offer you a new
            lease, you can send a letter defending your{" "}
            <span className="good-cause-text-group">Good Cause</span> rights. We
            will even send it for you, for free.
          </Trans>
        }
        showProgressBar={false}
      >
        <div className="hero-cta">
          <Trans>
            <strong>Start here:</strong> are you covered by{" "}
            <span className="good-cause-text-group">Good Cause</span>?
          </Trans>
          <div className="hero-cta__buttons">
            <Button
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
                If you are covered by{" "}
                <span className="good-cause-text-group">Good Cause</span>, you
                have a legal right to limited rent increases and the right to
                stay in your home.
              </Trans>
            </p>
            <p>
              <Trans>
                If your landlord is either planning to raise your rent, or not
                offer you a new lease, we will draft a USPS Certified Mail
                letter defending your{" "}
                <span className="good-cause-text-group">Good Cause</span>{" "}
                rights. We will even send it for you, for free.
              </Trans>
            </p>
            <p>
              <Trans>Not sure if you’re covered?</Trans>{" "}
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
                The <span className="good-cause-text-group">Good Cause</span>{" "}
                Letter Sender was developed with housing attorneys, tenant
                organizers, community leaders, and tenants.
              </Trans>
            </p>
          </section>
          <section className="callout-box outside-nyc">
            <h4>
              <Trans>If you live outside of NYC</Trans>
            </h4>
            <p>
              <Trans>
                Tenants and tenant advocates are working to extend{" "}
                <span className="good-cause-text-group">Good Cause</span>{" "}
                protections throughout New York State. This product is not yet
                available for residents outside of New York City.
              </Trans>
            </p>
            <JFCLLinkExternal to="https://housingjusticeforall.org/kyr-good-cause/#:~:text=Outside%20of%20NYC%20eligibility%20differs%20by%20locality%20because%20municipalities%20that%20opt%20in%20can%20change%20the%20real%20estate%20portfolio%20exemption%20and%20the%20luxury%20rent%20exemption%20thresholds%3A">
              <Trans>
                Learn where{" "}
                <span className="good-cause-text-group">Good Cause</span>{" "}
                Protections have already been won
              </Trans>
            </JFCLLinkExternal>
          </section>
        </div>
      </div>

      <div className="content-section">
        <div className="content-section__content">
          <section className="reasons-section">
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
