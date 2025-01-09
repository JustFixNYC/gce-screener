import { useEffect } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";

import { Address } from "../Home/Home";
import {
  ContentBox,
  ContentBoxFooter,
  ContentBoxItem,
} from "../../ContentBox/ContentBox";
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
import { Header } from "../../Header/Header";
import { ShareButtons } from "../../ShareButtons/ShareButtons";

// const LOOM_EMBED_URL =
//   "https://www.loom.com/embed/cef3632773a14617a0e8ec407c77e513?sid=93a986f7-ccdc-4048-903c-974fed826119";

const EMAIL_SUBJECT =
  "Good Cause NYC | Find out if your landlord owns other apartments";
const EMAIL_BODY = "...";

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
    <div id="portfolio-size-page">
      <Header
        title="Find out if your landlord owns other apartments"
        address={address}
        showProgressBar={false}
        isGuide
      >
        {error && (
          <div className="data__error">
            There was an error loading your results, please try again in a few
            minutes.
          </div>
        )}
        <ShareButtons
          buttonsInfo={[
            ["bookmark", "Bookmark this page"],
            ["email", "Email this page"],
          ]}
          emailSubject={EMAIL_SUBJECT}
          emailBody={EMAIL_BODY}
        />
      </Header>

      <div className="content-section">
        <div className="content-section__content"></div>
        <ContentBox
          title="Why you need to know"
          subtitle="Good Cause Eviction covers tenants whose landlords own more than 10 apartments"
        >
          <ContentBoxItem accordion={false}>
            <p>
              If you are able to find that your landlord owns more than 10 total
              apartments across multiple buildings, this means that you meet the
              Landlord Portfolio Size criteria for Good Cause Eviction Law.
            </p>
          </ContentBoxItem>
        </ContentBox>

        <ContentBox
          title="WHAT YOU CAN DO"
          subtitle="How to find other apartments your landlord owns"
        >
          <ContentBoxItem
            title="Confirm your landlord’s name and signature"
            step={1}
          >
            <p>
              Before we can find out if your landlord owns other apartments, we
              need to confirm your building’s landlord. The best way to do this
              is by searching real estate documents for your building’s
              landlord’s name and signature.
            </p>
            <VideoEmbed url="" />
            <div className="content-box__section__search-building">
              <AcrisLinks
                {...bldgData}
                address={address.address}
                info="You only need to find your building’s landlord’s signature on one of the documents below"
              />
            </div>
          </ContentBoxItem>

          <ContentBoxItem
            title="Find other buildings your landlord might own"
            step={2}
          >
            <p>
              Review documents below to find your landlord’s name or signature
              to see if they own more than 10 units across multiple buildings.
            </p>
            <br />
            <p>
              {`Your building has ${bldgData?.unitsres} apartments. You only need to confirm that your ` +
                `landlord owns ${10 - bldgData!.unitsres} additional ${
                  10 - bldgData!.unitsres == 1 ? "apartment" : "apartments"
                } across other buildings.`}
            </p>
            <VideoEmbed url="" />
            <div className="content-box__section__related-buildings">
              {isLoading && <>Loading document links...</>}
              {bldgData && <AcrisAccordions {...bldgData} />}
            </div>
          </ContentBoxItem>

          <ContentBoxFooter
            title="Have you found more buildings owned by your landlord?"
            subtitle="Adjust your survey answers and receive an updated coverage result"
            link={<BackLink to="/form">Back to survey</BackLink>}
          />
        </ContentBox>
      </div>
    </div>
  );
};

const VideoEmbed: React.FC<{ url: string }> = ({ url }) => (
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
        src={url}
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
);

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
