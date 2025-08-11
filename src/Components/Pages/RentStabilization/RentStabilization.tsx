import { useState } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";

import {
  ContentBox,
  ContentBoxFooter,
  ContentBoxItem,
} from "../../ContentBox/ContentBox";
import { Address } from "../Home/Home";
import { Header } from "../../Header/Header";
import { useAccordionsOpenForPrint } from "../../../hooks/useAccordionsOpenForPrint";
import { GCEUser } from "../../../types/APIDataTypes";
import { FormFields } from "../Form/Survey";
import { useSearchParamsURL } from "../../../hooks/useSearchParamsURL";
import { JFCLLinkExternal } from "../../JFCLLink";
import { gtmPush } from "../../../google-tag-manager";
import "./RentStabilization.scss";
import { RentStabilizedProtections } from "../../KYRContent/KYRContent";
import { RentStabLeaseModal } from "../../Modal/Modal";

export const RentStabilization: React.FC = () => {
  const { _ } = useLingui();
  const { user, address, fields } = useLoaderData() as {
    user: GCEUser;
    address: Address;
    fields: FormFields;
  };
  const [, setSearchParams] = useSearchParams();

  useAccordionsOpenForPrint();
  useSearchParamsURL(setSearchParams, address, fields, user);

  const [showLeaseModal, setShowLeaseModal] = useState(false);
  const openLeaseModal = () => setShowLeaseModal(true);

  return (
    <div id="rent-stabilization-page">
      <Header
        title={_(msg`Find out if your apartment is rent stabilized`)}
        address={address}
        showProgressBar={false}
        isGuide
      />

      <div className="content-section">
        <div className="content-section__content">
          <ContentBox subtitle="Good Cause Eviction only applies to tenants who are not rent stabilized.">
            <ContentBoxItem accordion={false}>
              <p>
                If your apartment is rent stabilized, you are not covered by
                Good Cause because you already have stronger existing
                protections through rent stabilization law.
              </p>
            </ContentBoxItem>
          </ContentBox>
          <div className="divider__print" />
          <ContentBox subtitle="How to find out if your apartment is rent stabilized">
            <ContentBoxItem title="Request your rent history">
              <p>
                Request your rent history to help find out if your apartment is
                rent stabilized and if you're being overcharged.
              </p>
              <br />
              <p>
                If your apartment has ever been rent stabilized, you’ll receive
                a document showing the rents that your landlord has registered
                since 1984. This document will help you learn if your apartment
                is still rent stabilized.
              </p>
              <br />
              <p>
                If your apartment has never been rent stabilized, you should
                receive get an email the day after you submit your request
                letting you know that New York State does not have a
                registration on file. This means your apartment is not rent
                stabilized, and therefore you may be eligible for Good Cause
                Eviction protections.
              </p>
              <JFCLLinkExternal to="https://portal.hcr.ny.gov/app/ask">
                Fill out the request form
              </JFCLLinkExternal>
            </ContentBoxItem>

            <ContentBoxItem title="Check your most recent lease renewal">
              <p>
                If your most recent lease renewal{" "}
                <button
                  type="button"
                  className="text-link-button jfcl-link"
                  onClick={openLeaseModal}
                >
                  looks like this
                </button>
                , then your apartment is likely rent stabilized.
              </p>
              <RentStabLeaseModal
                isOpen={showLeaseModal}
                onClose={() => setShowLeaseModal(false)}
                hasCloseBtn={true}
                header="Check your lease renewal"
              />
            </ContentBoxItem>
            <ContentBoxItem title="Attend a walk-in Clinic hosted by the Met Council on Housing">
              <p>
                Met Council on Housing’s free clinic offers tenants assistance
                with understanding their rent stabilization status and
                landlord-tenant disputes.
              </p>
              <JFCLLinkExternal to="https://www.metcouncilonhousing.org/program/tenants-rights-hotline/">
                Call Met Council on Housing Hotline
              </JFCLLinkExternal>
            </ContentBoxItem>
            <ContentBoxFooter
              message="Update your coverage result"
              linkText="Adjust survey answers"
              linkTo="/survey"
              linkOnClick={() =>
                gtmPush("gce_return_survey", {
                  from: "rent-stab-guide-page",
                })
              }
            />
          </ContentBox>
          <div className="divider__print" />
          <RentStabilizedProtections subtitle="Tenant rights under rent stabilization" />
        </div>
      </div>
    </div>
  );
};
