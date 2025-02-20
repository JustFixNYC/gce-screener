import { useState } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";

import { Address } from "../Home/Home";
import {
  ContentBox,
  ContentBoxFooter,
  ContentBoxItem,
} from "../../ContentBox/ContentBox";
import { Accordion } from "../../Accordion/Accordion";
import { FormFields } from "../Form/Survey";
import { useGetBuildingData } from "../../../api/hooks";
import {
  AcrisDocument,
  BuildingData,
  GCEUser,
} from "../../../types/APIDataTypes";
import {
  acrisDocTypeFull,
  getPrioritizeBldgs,
  toTitleCase,
  urlAcrisBbl,
  urlAcrisDoc,
  urlCountyClerkBbl,
} from "../../../helpers";
import { InfoBox } from "../../InfoBox/InfoBox";
import { Header } from "../../Header/Header";
import { ShareButtons } from "../../ShareButtons/ShareButtons";
import { useAccordionsOpenForPrint } from "../../../hooks/useAccordionsOpenForPrint";
import { useSearchParamsURL } from "../../../hooks/useSearchParamsURL";
import { JFCLLinkExternal } from "../../JFCLLink";
import "./PortfolioSize.scss";
import { gtmPush } from "../../../google-tag-manager";

// const LOOM_EMBED_URL =
//   "https://www.loom.com/embed/cef3632773a14617a0e8ec407c77e513?sid=93a986f7-ccdc-4048-903c-974fed826119";

const EMAIL_SUBJECT =
  "Good Cause NYC | Find out if your landlord owns other apartments";
const EMAIL_BODY = "...";

export const PortfolioSize: React.FC = () => {
  const { user, address, fields } = useLoaderData() as {
    user?: GCEUser;
    address: Address;
    fields: FormFields;
  };
  const [, setSearchParams] = useSearchParams();

  useAccordionsOpenForPrint();
  useSearchParamsURL(setSearchParams, address, fields, user);

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
        <div className="content-section__content">
          <ContentBox subtitle="Good Cause covers tenants whose landlords own more than 10 apartments">
            <ContentBoxItem accordion={false}>
              <p>
                If you are able to find that your landlord owns more than 10
                total apartments across multiple buildings, this means that you
                meet the Landlord Portfolio Size criteria for Good Cause
                Eviction Law.
              </p>
            </ContentBoxItem>
          </ContentBox>
          <div className="divider__print" />
          <ContentBox
            subtitle="How to find other apartments your landlord owns"
            headerExtra={
              <InfoBox color="blue">
                We recommend doing the following research on a desktop computer.
              </InfoBox>
            }
          >
            <ContentBoxItem
              title="Confirm your landlord’s name and signature"
              step={1}
            >
              <p>
                Before we can find out if your landlord owns other apartments,
                we need to confirm your building’s landlord. The best way to do
                this is by searching real estate documents for your building’s
                landlord’s name and signature.
              </p>
              <VideoEmbed url="https://www.youtube.com/embed/jFyi3k6rr8k?si=C98276JgvDojcfx7&amp;controls=0" />
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
              {bldgData && !!bldgData?.related_properties.length && (
                <>
                  <p>
                    Review documents below to find your landlord’s name or
                    signature to see if they own more than 10 units across
                    multiple buildings.
                  </p>
                  <br />
                </>
              )}
              {bldgData && (
                <p>
                  {`Your building has ${bldgData.unitsres} apartments. You only need to confirm that your ` +
                    `landlord owns ${10 - bldgData.unitsres} additional ${
                      10 - bldgData.unitsres == 1 ? "apartment" : "apartments"
                    } across other buildings.`}
                </p>
              )}
              <VideoEmbed url="https://www.youtube.com/embed/jFyi3k6rr8k?si=C98276JgvDojcfx7&amp;controls=0" />
              <div className="content-box__section__related-buildings">
                {!!bldgData?.related_properties &&
                bldgData?.related_properties.length > 0 ? (
                  <>
                    {isLoading && <>Loading document links...</>}
                    <AcrisAccordions {...bldgData} />
                  </>
                ) : (
                  <>
                    <InfoBox color="blue">
                      <span>
                        Our data is not showing additional buildings that may be
                        owned by your landlord.
                      </span>
                    </InfoBox>
                    <FindOtherBuildings />
                  </>
                )}
              </div>
            </ContentBoxItem>

            <ContentBoxFooter
              message="Update your coverage result"
              linkText="Adjust survey answers"
              linkTo="/survey"
              linkOnClick={() => gtmPush("gce_return_survey")}
            />
          </ContentBox>
          <div className="divider__print" />
        </div>
      </div>
    </div>
  );
};

const VideoEmbed: React.FC<{ url: string }> = ({ url }) => (
  <div className="content-box__section__video">
    <iframe
      width="560"
      height="315"
      src={url}
      title="YouTube video for how to find other apartments your landlord owns"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
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
      <span className="acris-links__address">{toTitleCase(address || "")}</span>
      <span className="acris-links__pill pill">{`${unitsres} ${
        unitsres === 1 ? "apartment" : "apartments"
      }`}</span>
    </div>
  );

  const content = (
    <>
      <div className="acris-links__content">
        {info && acris_docs && acris_docs?.length > 1 && (
          <InfoBox color="blue">{info}</InfoBox>
        )}
        {!bbl && <>Loading document links...</>}
        {acris_docs && (
          <ul>
            {acris_docs.map((docInfo, i) => (
              <li key={i}>
                <JFCLLinkExternal to={urlAcrisDoc(docInfo.doc_id)}>
                  {`${acrisDocTypeFull(
                    docInfo.doc_type
                  )} (${docInfo.doc_date.slice(0, 4)})`}
                </JFCLLinkExternal>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="acris-links__footer">
        {bbl && (
          <>
            {isStatenIsland ? (
              <JFCLLinkExternal to={urlCountyClerkBbl(bbl)}>
                View all documents from Richmond County Clerk
              </JFCLLinkExternal>
            ) : (
              <JFCLLinkExternal to={urlAcrisBbl(bbl)}>
                View all documents in ACRIS
              </JFCLLinkExternal>
            )}
          </>
        )}
      </div>
    </>
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

const FindOtherBuildings: React.FC = () => {
  return (
    <div className="callout-box">
      <strong>To find other buildings your landlord might own, you can:</strong>
      <ul>
        <li>
          Google your landlord’s name and find mentions of other buildings they
          may own in the press.
        </li>
        <li>
          Talk to your neighbors to see if they know of any other buildings your
          landlord may own.
        </li>
      </ul>
    </div>
  );
};

export const AcrisAccordions: React.FC<BuildingData> = (props) => {
  const INIT_DISPLAY = 5;
  const LOAD_MORE_AMOUNT = 5;

  // Generate a sort function that takes into account how many additional units
  // we need to find
  const prioritizeBldgs = getPrioritizeBldgs(10 - props.unitsres);

  // TODO: decide how to handle these cases, for now exclude. might also want to exclude if no acris_docs, but for now leave in.
  const relatedProperties = props.related_properties
    ?.filter((bldg) => bldg.unitsres > 0)
    .sort(prioritizeBldgs);
  const totalCount = relatedProperties?.length;
  const [visibleCount, setVisibleCount] = useState(
    Math.min(totalCount, INIT_DISPLAY)
  );
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(
    totalCount ? totalCount > INIT_DISPLAY : false
  );

  const loadMoreBuildings = () => {
    if (!!totalCount && visibleCount + LOAD_MORE_AMOUNT >= totalCount) {
      setVisibleCount(totalCount);
      setShowLoadMoreButton(false);
    } else {
      setVisibleCount(visibleCount + LOAD_MORE_AMOUNT);
    }
    gtmPush("gce_load_more");
  };

  return (
    <>
      <ul>
        {relatedProperties?.slice(0, visibleCount).map((bldg, i) => (
          <li key={i}>
            <AcrisLinks
              {...bldg}
              info="You only need to find your building’s landlord’s signature on one of the documents below"
              accordion
            />
          </li>
        ))}
      </ul>
      <div className="related-buildings__footer">
        {`Showing ${visibleCount} of ${totalCount} buildings`}
        {showLoadMoreButton ? (
          <button
            onClick={loadMoreBuildings}
            className="load-more-button jfcl-link"
          >
            Load more buildings
          </button>
        ) : (
          <div className="load-more-end">
            We’ve loaded all buildings that we could find related to your
            landlord.
            <FindOtherBuildings />
          </div>
        )}
      </div>
    </>
  );
};
