import { useEffect } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";

import { Address } from "../Home/Home";
import { ContentBox } from "../../ContentBox/ContentBox";
import { Accordion } from "../../Accordion/Accordion";
import { FormFields } from "../Form/Form";
import JFCLLinkExternal from "../../JFCLLinkExternal";
import { BackLink } from "../../JFCLLinkInternal";
import { useGetBuildingData } from "../../../api/hooks";
import { AcrisDocument, BuildingData } from "../../../types/APIDataTypes";
import {
  acrisDocTypeFull,
  prioritizeBldgs,
  urlAcrisBbl,
  urlAcrisDoc,
  urlCountyClerkBbl,
} from "../../../helpers";
import "./PortfolioSize.scss";
import { InfoBox } from "../../InfoBox/InfoBox";

// const LOOM_EMBED_URL =
//   "https://www.loom.com/embed/cef3632773a14617a0e8ec407c77e513?sid=93a986f7-ccdc-4048-903c-974fed826119";

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

  const { data: bldgData, isLoading, error } = useGetBuildingData(bbl);

  return (
    <div id="portfolio-size-guide">
      <div className="headline-section">
        <div className="headline-section__content">
          <BackLink to="/results">Back to Coverage Result</BackLink>
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
                  {/* <iframe
                    src={LOOM_EMBED_URL}
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      width: "100%",
                      height: "100%",
                    }}
                  /> */}
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
              <div className="content-box__section__search-building">
                <AcrisLinks
                  {...bldgData}
                  address={address.address}
                  info="You only need to find your building’s landlord’s signature on one of the documents below"
                />
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
              <div className="content-box__section__related-buildings">
                {isLoading && <>Loading document links...</>}
                {bldgData && <AcrisAccordions {...bldgData} />}
              </div>
            </div>
          </div>
        </ContentBox>
        <div className="eligibility__footer">
          <BackLink to="/results">Back to coverage result</BackLink>
        </div>
      </div>
    </div>
  );
};

type ACRISLinksProps = {
  bbl?: string;
  address?: string;
  unitsres?: number;
  acris_docs?: AcrisDocument[];
  info?: string;
  accordion?: boolean;
  open?: boolean;
};

export const AcrisLinks: React.FC<ACRISLinksProps> = ({
  bbl,
  address,
  unitsres,
  acris_docs,
  info,
  accordion = false,
  open = false,
}) => {
  const isStatenIsland = bbl ? bbl[0] === "5" : false;

  const header = (
    <div className="acris-links__header">
      <span className="acris-links__address">{address}</span>
      <span className="acris-links__pill pill">{`${unitsres} apartments`}</span>
    </div>
  );

  const content = (
    <div className="acris-links__content">
      {info && <InfoBox color="blue">{info}</InfoBox>}
      {!bbl && <>Loading document links...</>}
      {bbl && (
        <>
          {acris_docs && (
            <ul>
              {acris_docs.map((docInfo, i) => (
                <li key={i}>
                  <JFCLLinkExternal href={urlAcrisDoc(docInfo.doc_id)}>
                    {`${acrisDocTypeFull(
                      docInfo.doc_type
                    )} (${docInfo.doc_date.slice(0, 4)})`}
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
      )}
    </div>
  );
  return accordion ? (
    <Accordion summary={header} open={open} className="acris-links">
      {content}
    </Accordion>
  ) : (
    <div className="acris-links">
      {header}
      {content}
    </div>
  );
};

export const AcrisAccordions: React.FC<BuildingData> = (props) => {
  const MAX_PROPERTIES = 5;
  // TODO: decide how to handle these cases, for now exclude. might also want to exclude if no acris_docs, but for now leave in.
  const relatedProperties = props.related_properties
    ?.filter((bldg) => bldg.unitsres > 0)
    .sort(prioritizeBldgs)
    .slice(0, MAX_PROPERTIES);

  return (
    <ul>
      {relatedProperties?.map((bldg, i) => {
        return (
          <li key={i}>
            <AcrisLinks
              {...bldg}
              info="You only need to find your building’s landlord’s signature on one of the documents below"
              accordion
            />
          </li>
        );
      })}
    </ul>
  );
};
