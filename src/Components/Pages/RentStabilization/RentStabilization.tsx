import { useNavigate } from "react-router-dom";
import { Button } from "@justfixnyc/component-library";

import { LegalDisclaimer } from "../../LegalDisclaimer/LegalDisclaimer";
import { ContentBox } from "../../ContentBox/ContentBox";
import JFCLLinkExternal from "../../JFCLLinkExternal";
import "./RentStabilization.scss";
import { BackToResults } from "../../BreadCrumbs/BreadCrumbs";

export const RentStabilization: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="rent-stabilization__wrapper">
        <div className="headline-section">
          <div className="headline-section__content">
            <BackToResults />
            <div className="headline-section__page-type">Guide</div>
            <h2 className="headline-section__title">
              Find out if your apartment is rent stabilized
            </h2>
            <div className="headline-section__subtitle">
              Everything you need to know if you are unsure if your apartment is
              rent stabilized.
            </div>
          </div>
        </div>

        <div className="content-section">
          <div className="content-section__content"></div>
          <ContentBox
            headerTitle="Why you need to know"
            headerSubtitle="Good Cause Eviction Law does not cover rent stabilized apartments"
          >
            <div className="content-box__section">
              <div className="content-box__section__content">
                <p>
                  If your apartment is rent stabilized, you are not covered by
                  Good Cause Eviction law because you already have stronger
                  existing protections through rent stabilization law.
                </p>
              </div>
            </div>
          </ContentBox>

          <ContentBox
            headerTitle="WHAT YOU CAN DO"
            headerSubtitle="How to find out if your apartment is rent stabilized"
          >
            <div className="content-box__section">
              <div className="content-box__section__content">
                <div className="content-box__section__header">
                  Print your coverage results
                </div>
                <p>
                  If your apartment is rent stabilized, you are not covered by
                  Good Cause Eviction law because you already have stronger
                  existing protections through rent stabilization law.
                </p>
                <JFCLLinkExternal href="https://portal.hcr.ny.gov/app/ask">
                  Fill out the form
                </JFCLLinkExternal>
              </div>
            </div>

            <div className="content-box__section">
              <div className="content-box__section__content">
                <div className="content-box__section__header">
                  Request your apartment’s rent history
                </div>
                <p>
                  Use JustFix’s rent history request tool to help find out if
                  your apartment is rent stabilized and if you're being
                  overcharged. If your apartment has ever been rent stabilized,
                  you’ll receive a document showing the rents that your landlord
                  has registered since 1984.
                </p>
                <JFCLLinkExternal href="https://app.justfix.org/rh">
                  Start my request
                </JFCLLinkExternal>
              </div>
            </div>

            <div className="content-box__footer">
              <div className="content-box__section__content">
                <div className="content-box__section__header">
                  Learn more about your rights
                </div>
                <Button
                  labelText="Re-take the screener survey"
                  labelIcon="arrowsRotateReverse"
                  onClick={() => {
                    navigate("/form");
                  }}
                />
              </div>
            </div>
          </ContentBox>
          <div className="eligibility__footer">
            <h3 className="eligibility__footer__header">
              Help others understand their coverage
            </h3>
            <Button
              labelText="Share this screener"
              labelIcon="squareArrowUpRight"
            />
          </div>
        </div>
        <LegalDisclaimer />
      </div>
    </>
  );
};
