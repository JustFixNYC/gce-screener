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
import {
  AcrisDocument,
  BuildingEligibilityInfo,
} from "../../../types/APIDataTypes";
import {
  acrisDocTypeFull,
  urlAcrisBbl,
  urlAcrisDoc,
  urlCountyClerkBbl,
} from "../../../helpers";
import "./PortfolioSize.scss";

const LOOM_EMBED_URL =
  "https://www.loom.com/embed/cef3632773a14617a0e8ec407c77e513?sid=93a986f7-ccdc-4048-903c-974fed826119";

type ACRISLinksProps = {
  bbl: string;
  unitsres: number;
  acris_docs: AcrisDocument[] | null;
};

export const AcrisLinks: React.FC<ACRISLinksProps> = ({ bbl, acris_docs }) => {
  const isStatenIsland = bbl[0] === "5";
  return (
    <>
      {acris_docs && (
        <ul>
          {acris_docs.map((docInfo, i) => (
            <li key={i}>
              Document:{" "}
              <JFCLLinkExternal href={urlAcrisDoc(docInfo.doc_id)}>
                {acrisDocTypeFull(docInfo.doc_type)}
              </JFCLLinkExternal>
            </li>
          ))}
        </ul>
      )}
      {isStatenIsland ? (
        <JFCLLinkExternal href={urlCountyClerkBbl(bbl)}>
          View all documents from Richmond County Clerk
        </JFCLLinkExternal>
      ) : (
        <JFCLLinkExternal href={urlAcrisBbl(bbl)}>
          View all documents in ACRIS
        </JFCLLinkExternal>
      )}
    </>
  );
};

export const AcrisAccordions: React.FC<BuildingEligibilityInfo> = (props) => {
  const MAX_PROPERTIES = 5;
  // TODO: decide how to handle these cases, for now exclude. might also want to exclude if no acris_docs, but for now leave in.
  const wowProperties = props.wow_data
    ?.filter((bldg) => bldg.unitsres > 0)
    .slice(0, MAX_PROPERTIES);
  return (
    <ul>
      {wowProperties?.map((bldg, i) => {
        return (
          <li key={i}>
            <details>
              <summary>
                {bldg.addr}
                <span className="apartments-pill">{`${bldg.unitsres} apartments`}</span>
                <Icon icon="chevronDown" className="chevron-icon" />
              </summary>
              <div className="content-box__section__acris-links">
                <AcrisLinks {...bldg} />
              </div>
            </details>
          </li>
        );
      })}
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
          headerSubtitle="How to find other apartments your landlord owns"
        >
          <div className="content-box__section">
            <div className="content-box__section__content">
              <div className="content-box__section__step">Before you begin</div>
              <div className="content-box__section__header">
                Learn how to find your landlord's name and signature
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
                    src={LOOM_EMBED_URL}
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
                Review potentially related buildings
              </div>
              <p>
                Start reviewing potentially related buildings to see if the
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
