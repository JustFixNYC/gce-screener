import { useNavigate } from "react-router-dom";
import { Button } from "@justfixnyc/component-library";

import { LegalDisclaimer } from "../../LegalDisclaimer/LegalDisclaimer";
import { ContentBox } from "../../ContentBox/ContentBox";
import JFCLLinkExternal from "../../JFCLLinkExternal";
import { BackLink } from "../../JFCLLinkInternal";
import "./RentStabilization.scss";

export const RentStabilization: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="rent-stabilization__wrapper">
      <div className="headline-section">
        <div className="headline-section__content">
          <BackLink to="/results">Back to coverage result</BackLink>
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
                Check your lease
              </div>
              <p>
                You can find out if your apartment is rent stabilized by
                checking your lease. If your lease says you're apartment is rent
                stabilized, then it's safe to say it is! We still recommend
                requesting your rent history to be extra certain (see below),
                especially if your lease does not mention anything about rent
                stabilization.
              </p>
            </div>
          </div>

          <div className="content-box__section">
            <div className="content-box__section__content">
              <div className="content-box__section__header">
                Request your rent history
              </div>
              <p>
                Request your rent history to help find out if your apartment is
                rent stabilized and if you're being overcharged.
              </p>
              <br />
              <p>
                If your apartment has ever been rent stabilized, you’ll receive
                a document showing the rents that your landlord has registered
                since 1984.
              </p>
              <br />
              <p>
                If your apartment is not rent stabilized, you will get an email
                the day after you submit your request, saying your apartment
                doesn't have a registration on file. This means you're apartment
                has never been rent stabilized, and therefore you meet the rent
                regulation criteria for Good Cause Eviction.
              </p>
              <JFCLLinkExternal href="https://portal.hcr.ny.gov/app/ask">
                Fill out the form
              </JFCLLinkExternal>
            </div>
          </div>

          <div className="content-box__footer">
            <div className="content-box__section__content">
              <div className="content-box__section__header">
                When you find out your rent stabilization status:
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
          <BackLink to="/results">Back to coverage result</BackLink>
        </div>
        <LegalDisclaimer />
      </div>
    </div>
  );
};
