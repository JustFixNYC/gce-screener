import { useEffect } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { Icon } from "@justfixnyc/component-library";

import { Address } from "../Home/Home";
import { LegalDisclaimer } from "../../LegalDisclaimer/LegalDisclaimer";
import { BackToResults } from "../../BreadCrumbs/BreadCrumbs";
import { ContentBox } from "../../ContentBox/ContentBox";
import { FormFields } from "../../../App";
import JFCLLinkExternal from "../../JFCLLinkExternal";
import { useGetBuildingEligibilityInfo } from "../../../api/hooks";
import { BuildingEligibilityInfo } from "../../../types/APIDataTypes";
import { acrisDocTypeFull, urlAcrisBbl, urlAcrisDoc } from "../../../helpers";
import "./PortfolioSize.scss";

export const AcrisLinks: React.FC<BuildingEligibilityInfo> = (props) => (
  <>
    <ul>
      {props.acris_docs.map((docInfo, i) => (
        <li key={i}>
          Document:{" "}
          <JFCLLinkExternal href={urlAcrisDoc(docInfo.doc_id)}>
            {`${acrisDocTypeFull(docInfo.doc_type)}`}
          </JFCLLinkExternal>
        </li>
      ))}
    </ul>
    <JFCLLinkExternal href={urlAcrisBbl(props.bbl)}>
      View all documents in ACRIS
    </JFCLLinkExternal>
  </>
);

export const AcrisAccordions: React.FC<BuildingEligibilityInfo> = (props) => {
  const MAX_PROPERTIES = 5;
  return (
    <ul>
      {props.wow_data?.slice(0, MAX_PROPERTIES).map((bldg, i) => (
        <li key={i}>
          <details>
            <summary>
              {bldg.addr}
              <Icon icon="chevronDown" className="chevron-icon" />
            </summary>
            <div className="content-box__section__acris-links">
              <AcrisLinks {...props} />
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
};

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

  const bbl = address.bbl;

  const {
    data: bldgData,
    isLoading,
    error,
  } = useGetBuildingEligibilityInfo(bbl);

  return (
    <div className="portfolios-size__wrapper">
      <div className="headline-section">
        <div className="headline-section__content">
          <BackToResults />
          {error && (
            <div className="eligibility__error">
              There was an error loading your results, please try again in a few
              minutes.
            </div>
          )}
          <div className="headline-section__page-type">Guide</div>
          <h2 className="headline-section__title">
            Finding out if your landlord owns other apartments
          </h2>
          <div className="headline-section__subtitle">
            Everything you need to know about researching your landlord’s other
            potential properties.
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
                total apartments across multiple buildings, this means that you
                meet the Landlord Portfolio Size criteria for Good Cause
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
              <div className="content-box__section__step">Before you begin</div>
              <div className="content-box__section__header">
                Learn how to find the information you will be looking for
              </div>
              <p>
                Use this video as a guide to help you understand how to search
                the databases for the information that will help you understand
                if your landlord owns other apartments.
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
                we need to confirm your building’s landlord. The best way to do
                this is by searching real estate documents for your building’s
                landlord’s name and signature.
              </p>
              <div className="content-box__section__acris-links">
                <p>Start here:</p>
                {isLoading && <>Loading document links...</>}
                {bldgData && <AcrisLinks {...bldgData} />}
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
                {isLoading && <>Loading document links...</>}
                {bldgData && <AcrisAccordions {...bldgData} />}
              </div>
            </div>
          </div>
        </ContentBox>
        <div className="eligibility__footer">
          <BackToResults />
        </div>
        <LegalDisclaimer />
      </div>
    </div>
  );
};
