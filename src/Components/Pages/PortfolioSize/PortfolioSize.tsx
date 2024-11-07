import { useEffect } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Icon } from "@justfixnyc/component-library";

import { Address } from "../Home/Home";
import { LegalDisclaimer } from "../../LegalDisclaimer/LegalDisclaimer";
import { useGetBuildingEligibilityInfo } from "../../../api/hooks";
import { BackToResults } from "../../BreadCrumbs/BreadCrumbs";
import { ContentBox } from "../../ContentBox/ContentBox";
import { FormFields } from "../../../App";
import JFCLLinkExternal from "../../JFCLLinkExternal";
import "./PortfolioSize.scss";
import JFCLLinkInternal from "../../JFCLLinkInternal";

export const PortfolioSize: React.FC = () => {
  const { address, fields } = useLoaderData() as {
    address: Address;
    fields: FormFields;
  };
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    // save session state in params
    if (address && fields) {
      setSearchParams(
        { address: JSON.stringify(address), fields: JSON.stringify(fields) },
        { replace: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();

  const bbl = address.bbl;

  const {
    data: bldgData,
    isLoading,
    error,
  } = useGetBuildingEligibilityInfo(bbl);

  return (
    <>
      <div className="rent-stabilization__wrapper">
        <div className="headline-section">
          <div className="headline-section__content">
            <BackToResults />
            <div className="headline-section__page-type">Guide</div>
            <h2 className="headline-section__title">
              Finding out if your landlord owns other apartments
            </h2>
            <div className="headline-section__subtitle">
              Everything you need to know about researching your landlord’s
              other potential properties.
            </div>
          </div>
        </div>

        <div className="content-section">
          <div className="content-section__content"></div>
          <ContentBox
            headerTitle="Why you need to know"
            headerSubtitle="Good Cause Eviction covers tenants whose landlords own more than 10 apartments"
          >
            <div className="content-box__section">
              <div className="content-box__section__content">
                <p>
                  If you are able to find that your landlord owns more than 10
                  total apartments across multiple buildings, this means that
                  you meet the Landlord Portfolio Size criteria for Good Cause
                  Eviction Law.
                </p>
              </div>
            </div>
          </ContentBox>

          <ContentBox
            headerTitle="WHAT YOU CAN DO"
            headerSubtitle="How to find other apartments your landlord might own"
          >
            <div className="content-box__section">
              <div className="content-box__section__content">
                <div className="content-box__section__step">
                  Before you begin
                </div>
                <div className="content-box__section__header">
                  Learn how to find the information you will be looking for
                </div>
                <p>
                  Use this video as a guide to help you understand how to search
                  the databases for the information that will help you
                  understand if your landlord owns other apartments.
                </p>
                <div className="content-box__section__video">
                  {/* Loom embed code: */}
                  <div
                    style={{
                      position: "relative",
                      paddingBottom: "56.25%",
                      height: "0",
                    }}
                  >
                    <iframe
                      src="https://www.loom.com/embed/1eadf80cb4484fc1be1bb45fdc1eb73a?sid=8df0a71d-c2e9-4a76-9059-1b54cd96a601"
                      style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="content-box__section">
              <div className="content-box__section__content">
                <div className="content-box__section__step">Step 1</div>
                <div className="content-box__section__header">
                  Confirm your landlord’s name and signature
                </div>
                <p>
                  Before we can find out if your landlord owns other apartments,
                  we need to confirm your building’s landlord. The best way to
                  do this is by searching real estate documents for your
                  building’s landlord’s name and signature.
                </p>
                <div className="content-box__section__acris-links">
                  <p>Start here:</p>
                  <ul>
                    <li>
                      <JFCLLinkExternal href="">
                        ACRIS document 1
                      </JFCLLinkExternal>
                    </li>
                    <li>
                      <JFCLLinkExternal href="">
                        ACRIS document 2
                      </JFCLLinkExternal>
                    </li>
                  </ul>
                  <JFCLLinkExternal href="">
                    View all documents in ACRIS
                  </JFCLLinkExternal>
                </div>
              </div>
            </div>

            <div className="content-box__section">
              <div className="content-box__section__content">
                <div className="content-box__section__step">Step 2</div>
                <div className="content-box__section__header">
                  Scan potentially related buildings
                </div>
                <p>
                  Start scanning potentially related buildings to see if the
                  landlord name and/or signature matches the one on your
                  building’s mortgage agreement.
                </p>
                <div className="content-box__section__acris-buildings">
                  <ul>
                    <li>
                      <details>
                        <summary>
                          Address
                          <Icon icon="chevronDown" className="chevronIcon" />
                        </summary>
                        <div className="content-box__section__acris-links">
                          <ul>
                            <li>
                              Document:{" "}
                              <JFCLLinkExternal href="">
                                ACRIS document 1
                              </JFCLLinkExternal>
                            </li>
                            <li>
                              <JFCLLinkExternal href="">
                                ACRIS document 2
                              </JFCLLinkExternal>
                            </li>
                          </ul>
                          <JFCLLinkExternal href="">
                            View all documents in ACRIS
                          </JFCLLinkExternal>
                        </div>
                      </details>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </ContentBox>
          <div className="eligibility__footer">
            <BackToResults />
          </div>
        </div>
        <LegalDisclaimer />
      </div>
    </>
  );
};
