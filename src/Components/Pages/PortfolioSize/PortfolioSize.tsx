import { useState } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Plural, Trans } from "@lingui/react/macro";

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
import { useAccordionsOpenForPrint } from "../../../hooks/useAccordionsOpenForPrint";
import { useSearchParamsURL } from "../../../hooks/useSearchParamsURL";
import { JFCLLinkExternal } from "../../JFCLLink";
import { gtmPush } from "../../../google-tag-manager";
import "./PortfolioSize.scss";

const VIDEO_EMBED_URL =
  "https://www.youtube.com/embed/dSnDgmGH_6E?si=G9wM6P8LHgAynN5O";

export const PortfolioSize: React.FC = () => {
  const { user, address, fields } = useLoaderData() as {
    user?: GCEUser;
    address: Address;
    fields: FormFields;
  };
  const [, setSearchParams] = useSearchParams();
  const { _, i18n } = useLingui();

  useAccordionsOpenForPrint();
  useSearchParamsURL(setSearchParams, address, fields, user);

  const bbl = address.bbl;

  const { data: bldgData, isLoading, error } = useGetBuildingData(bbl);

  const wowLink = (
    <a
      href="https://whoownswhat.justfix.org/"
      target="_blank"
      rel="noopener noreferrer"
      className="jfcl-link"
    >
      Who Owns What
    </a>
  );

  return (
    <div id="portfolio-size-page">
      <Header
        title={_(msg`Find out if your landlord owns other buildings`)}
        address={address}
        showProgressBar={false}
        isGuide
      >
        {error && (
          <div className="data__error">
            <Trans>
              There was an error loading your results, please try again in a few
              minutes.
            </Trans>
          </div>
        )}
      </Header>

      <div className="content-section">
        <div className="content-section__content">
          <ContentBox
            subtitle={_(
              msg`To meet Good Cause Eviction’s “Landlord Portfolio Size” requirement, you need to find out if your landlord owns more than 10 apartments`
            )}
            className="portfolio-video-box"
          >
            <ContentBoxItem accordion={false}>
              <p>
                <Trans>
                  If your building has fewer than 11 apartments, you need to
                  learn if your landlord owns other residential buildings.
                </Trans>
              </p>
              <p>
                <Trans>
                  Unfortunately, it can be difficult to find out who your
                  landlord really is and if your landlord owns other buildings.
                  This is especially true if your building is owned by a
                  corporation.
                </Trans>
              </p>
              <p>
                <Trans>
                  This guide will walk you through two steps that will help you
                  prove who you landlord is and if they own other buildings.
                  Please watch the instruction video, below, to get started.
                </Trans>
              </p>
              <VideoEmbed url={VIDEO_EMBED_URL} />
            </ContentBoxItem>
          </ContentBox>
          <div className="divider__print" />
          <ContentBox
            subtitle={_(msg`How to find other apartments your landlord owns`)}
          >
            <ContentBoxItem className="mobile-video-prompt" accordion={false}>
              <InfoBox color="blue">
                <Trans>
                  <strong>Tip:</strong> We recommend doing the following
                  research on a desktop computer. If you have not already,
                  please watch the video, above, for step-by-step instructions
                  on how to complete Steps 1 and 2.
                </Trans>
              </InfoBox>
            </ContentBoxItem>
            <ContentBoxItem
              title={
                <Trans>
                  <strong>Step 1:</strong> Find out who owns your building
                </Trans>
              }
            >
              <p>
                <strong>
                  <Trans>
                    The owner of the building may be different than the person
                    listed on your lease.
                  </Trans>
                </strong>{" "}
                <Trans>
                  The best way to confirm the owner of your building is to
                  review your building’s official real estate transaction
                  documents and look for the owner’s signature. We have provided
                  links to these documents, below.
                </Trans>
              </p>
              <InfoBox color="blue">
                <span>
                  <Trans>
                    Tip: The signature page is often located toward the end of
                    the document
                  </Trans>
                </span>
              </InfoBox>
              <div className="content-box__section__search-building">
                <AcrisLinks {...bldgData} address={address.address}>
                  <p>
                    <Trans>
                      You only need to find the name or signature of your
                      building’s owner on one of these documents before moving
                      to Step 2.
                    </Trans>{" "}
                    <strong>
                      <Trans>
                        Once you find the name of your building’s owner,
                        remember it because you’ll need it in Step 2.
                      </Trans>
                    </strong>
                  </p>
                </AcrisLinks>
              </div>
            </ContentBoxItem>

            <ContentBoxItem
              title={
                <Trans>
                  <strong>Step 2:</strong> Find other properties associated with
                  the owner of your building
                </Trans>
              }
            >
              {bldgData && (
                <>
                  {!!bldgData?.related_properties &&
                  bldgData?.related_properties.length > 0 ? (
                    <p>
                      <Trans>
                        Based on data from the website {wowLink}, we have
                        gathered a list of properties that the owner of your
                        building may be associated with. For each property, we
                        have included links to important real estate transaction
                        documents.
                      </Trans>
                    </p>
                  ) : (
                    <p>
                      <Trans>
                        Based on data from the website {wowLink}, we gather a
                        list of properties that the owner of your building may
                        be associated with. For each property, we include links
                        to important real estate transaction documents.
                      </Trans>
                    </p>
                  )}
                  <p>
                    <Trans>
                      Please review these documents to learn if the owner of
                      your building also owns any of the properties below. If
                      you find the name or signature of your building’s owner on
                      any of the documents below, that's a good sign they own
                      the property.
                    </Trans>
                  </p>
                  <p>
                    <strong>
                      <Trans>
                        For any of the addresses listed below, you only need to
                        find your building’s owner’s name or signature on one of
                        the documents to know if they own that property.
                      </Trans>
                    </strong>
                  </p>
                  <InfoBox color="blue">
                    <Trans>
                      Remember, your building has{" "}
                      <Plural
                        value={bldgData.unitsres || 0}
                        one="# apartment"
                        other="# apartments"
                      />
                      , so
                      <strong>
                        {" "}
                        you only need to confirm that your landlord owns{" "}
                        <Plural
                          value={11 - bldgData.unitsres}
                          one="# apartment"
                          other="# apartments"
                        />{" "}
                        across other buildings.
                      </strong>
                    </Trans>
                  </InfoBox>
                </>
              )}
              <div className="content-box__section__related-buildings">
                {!!bldgData?.related_properties &&
                bldgData?.related_properties.length > 0 ? (
                  <>
                    {isLoading && <Trans>Loading document links...</Trans>}
                    <AcrisAccordions {...bldgData} />
                  </>
                ) : (
                  <>
                    <InfoBox color="blue">
                      <span>
                        <Trans>
                          Our data is not showing additional buildings that may
                          be owned by your landlord.
                        </Trans>
                      </span>
                    </InfoBox>
                    <FindOtherBuildings />
                  </>
                )}
              </div>
            </ContentBoxItem>

            <ContentBoxFooter
              message={_(msg`Have you learned something new?`)}
              linkText={_(msg`Adjust survey answers`)}
              linkTo={`/${i18n.locale}/survey`}
              linkOnClick={() =>
                gtmPush("gce_return_survey", { from: "portfolio-guide-page" })
              }
            />
          </ContentBox>
          <div className="divider__print" />
        </div>
      </div>
    </div>
  );
};

const VideoEmbed: React.FC<{ url: string }> = ({ url }) => {
  const { _ } = useLingui();
  return (
    <div className="content-box__section__video">
      <iframe
        width="560"
        height="315"
        src={url}
        title={_(
          msg`YouTube video for how to find other apartments your landlord owns`
        )}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
};

type ACRISLinksProps = {
  bbl?: string;
  address?: string;
  unitsres?: number;
  acris_docs?: AcrisDocument[];
  accordion?: boolean;
  open?: boolean;
  children?: React.ReactNode;
};

export const AcrisLinks: React.FC<ACRISLinksProps> = ({
  bbl,
  address,
  unitsres,
  acris_docs,
  accordion = false,
  open = false,
  children,
}) => {
  const { _ } = useLingui();
  const isStatenIsland = bbl ? bbl[0] === "5" : false;

  const header = (
    <div className="acris-links__header">
      <span className="acris-links__address">{toTitleCase(address || "")}</span>
      {unitsres && (
        <span className="acris-links__pill pill">
          <Plural value={unitsres} one="# apartment" other="# apartments" />
        </span>
      )}
    </div>
  );

  const content = (
    <>
      <div className="acris-links__content">
        {children}
        {!bbl && <Trans>Loading document links...</Trans>}
        {acris_docs && (
          <ul>
            {acris_docs.map((docInfo, i) => (
              <li key={i}>
                <JFCLLinkExternal to={urlAcrisDoc(docInfo.doc_id)}>
                  {_(acrisDocTypeFull(docInfo.doc_type)) +
                    ` (${docInfo.doc_date.slice(0, 4)})`}
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
                <Trans>View all documents from Richmond County Clerk</Trans>
              </JFCLLinkExternal>
            ) : (
              <JFCLLinkExternal to={urlAcrisBbl(bbl)}>
                <Trans>View all documents in ACRIS</Trans>
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
      <strong>
        <Trans>To find other buildings your landlord might own, you can:</Trans>
      </strong>
      <ul>
        <li>
          <Trans>
            Google your landlord’s name and find mentions of other buildings
            they may own in the press.
          </Trans>
        </li>
        <li>
          <Trans>
            Talk to your neighbors to see if they know of any other buildings
            your landlord may own.
          </Trans>
        </li>
      </ul>
    </div>
  );
};

export const AcrisAccordions: React.FC<BuildingData> = (props) => {
  const INIT_DISPLAY = 5;
  const LOAD_MORE_AMOUNT = 5;

  const { _ } = useLingui();

  // Generate a sort function that takes into account how many additional units
  // we need to find
  const prioritizeBldgs = getPrioritizeBldgs(10 - props.unitsres);

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
        {relatedProperties?.slice(0, visibleCount).map((bldg, i) => {
          const isStatenIsland = bldg.bbl ? bldg.bbl[0] === "5" : false;
          return (
            <li key={i}>
              <AcrisLinks {...bldg} accordion>
                <InfoBox color="blue">
                  {bldg.acris_docs.length ? (
                    <Trans>
                      <strong>Tip:</strong> If, in any one of the documents
                      below, you find an owner’s name that does not match your
                      building’s owner’s name, then move on to the next building
                      address.
                    </Trans>
                  ) : isStatenIsland ? (
                    <Trans>
                      We are unable to directly link to specific documents for
                      properties in Staten Island. Please view all documents for
                      this property, and refer to the video above to learn how
                      to identify the documents most likely to contain the
                      owner's name and signature.
                    </Trans>
                  ) : (
                    <Trans>
                      We were unable to find relevant documents containing owner
                      names and/or signatures for this building.
                    </Trans>
                  )}
                </InfoBox>
              </AcrisLinks>
            </li>
          );
        })}
      </ul>
      <div className="related-buildings__footer">
        {_(
          msg`Showing ${visibleCount} of ${totalCount} buildings that your landlord may own`
        )}
        {showLoadMoreButton ? (
          <button
            onClick={loadMoreBuildings}
            className="load-more-button jfcl-link"
          >
            <Trans>Load more buildings</Trans>
          </button>
        ) : (
          <div className="load-more-end">
            <Trans>
              We’ve loaded all buildings that we could find related to your
              landlord.
            </Trans>
            <FindOtherBuildings />
          </div>
        )}
      </div>
    </>
  );
};
