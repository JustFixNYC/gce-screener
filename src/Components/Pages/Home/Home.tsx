import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useRollbar } from "@rollbar/react";
import { Button } from "@justfixnyc/component-library";
import { Trans } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";


import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import { FormFields } from "../Form/Survey";
import { useSendGceData } from "../../../api/hooks";
import { GCEPostData, GCEUser } from "../../../types/APIDataTypes";
import { Header } from "../../Header/Header";
import { ProgressStep } from "../../../helpers";
import { JFCLLinkExternal, JFCLLinkInternal } from "../../JFCLLink";
import { cleanAddressFields } from "../../../api/helpers";
import { gtmPush } from "../../../google-tag-manager";
import "./Home.scss";

export type Address = {
  bbl: string;
  address: string;
  houseNumber: string;
  streetName: string;
  borough: string;
  zipcode?: string;
  longLat: string;
};

export const Home: React.FC = () => {
  const { _ } = useLingui();
  const navigate = useNavigate();
  const [sessionUser, setUser] = useSessionStorage<GCEUser>("user");
  const [address, setAddress, removeAddress] =
    useSessionStorage<Address>("address");
  const [, , removeFormFields] = useSessionStorage<FormFields>("fields");
  const [lastStepReached, setLastStepReached] =
    useSessionStorage<ProgressStep>("lastStepReached");
  const [geoAddress, setGeoAddress] = useState<Address>();
  const [inputInvalid, setInputInvalid] = useState(false);
  const { trigger } = useSendGceData();
  const rollbar = useRollbar();

  useEffect(() => {
    removeAddress();
    removeFormFields();
    setLastStepReached(ProgressStep.Home);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddressSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!geoAddress) {
      setInputInvalid(true);
      return;
    }
    setAddress(geoAddress);
    const postData: GCEPostData = {
      id: sessionUser?.id,
      ...cleanAddressFields(geoAddress),
    };

    try {
      const userResp = (await trigger(postData)) as GCEUser;
      if (!sessionUser?.id) setUser(userResp);
    } catch {
      rollbar.critical("Cannot connect to tenant platform");
    }

    removeFormFields();
    setLastStepReached(ProgressStep.Address);
    navigate("confirm_address");
  };

  return (
    <div id="home-page">
      <Header
        title={
          <Trans>
            Learn if you're covered <br />
            by Good Cause <br />
            Eviction law in NYC
          </Trans>
        }
        lastStepReached={lastStepReached}
      >
        <form className="geo-search-form" onSubmit={handleAddressSearch}>
          <GeoSearchInput
            initialAddress={address}
            onChange={setGeoAddress}
            invalid={inputInvalid}
            setInvalid={setInputInvalid}
          />
          <Button type="submit" labelText={_(msg`Get started`)} />
        </form>
      </Header>

      <div className="content-section home__about-law">
        <div className="content-section__content">
          <h3><Trans>About the law</Trans></h3>
          <p>
            <Trans>
              Good Cause Eviction protections went into effect on April 20th,
              2024. If you are covered by the law, you have strong legal
              protections against eviction as long as you follow your lease. There
              are also limits to how much your landlord can raise your rent.{" "}
            </Trans>
            <JFCLLinkInternal
              to="/rent_calculator"
              onClick={() =>
                gtmPush("gce_rent_calculator", { from: "home-page" })
              }
            >
              <Trans>Calculate your max rent increase.</Trans>
            </JFCLLinkInternal>
          </p>
          <p>
            <Trans>
              To be covered by the law, your apartment must meet several
              requirements.{" "}
            </Trans>
            <a
              href="https://www.nyc.gov/site/hpd/services-and-information/good-cause-eviction.page"
              target="_blank"
              rel="noopener noreferrer"
              className="jfcl-link"
            >
              <Trans>Learn more about the law.</Trans>
            </a>{" "}
            <Trans>
              If you live in New York City, you can use this site to learn which
              requirements you meet and how to assert your rights.
            </Trans>
          </p>
          <div className="callout-box">
            <span className="callout-box__header">
              <Trans>If you're not covered by Good Cause Eviction</Trans>
            </span>
            <p>
              <Trans>
                If you live in NYC and are not covered by Good Cause Eviction, you
                still have important tenant protections. Depending on the type of
                housing you live in, your protections may be even stronger than
                those provided by Good Cause.
              </Trans>
            </p>
            <JFCLLinkInternal to="/tenant_rights">
              <Trans>Learn more about tenant protections in NYC</Trans>
            </JFCLLinkInternal>
          </div>
          <div className="callout-box">
            <span className="callout-box__header">
              <Trans>If you live outside of NYC</Trans>
            </span>
            <p>
              <Trans>
                Tenants and tenant advocates are working to extend Good Cause
                protections throughout New York State.
              </Trans>
            </p>
            <JFCLLinkExternal to="https://housingjusticeforall.org/kyr-good-cause/">
              <Trans>Learn where Good Cause protections have been won</Trans>
            </JFCLLinkExternal>
          </div>
        </div>
      </div>
      <div className="content-section home__about-project">
        <div className="content-section__content">
          <h3><Trans>About this site</Trans></h3>
          <p>
            <Trans>
              Good Cause law can be complex to understand and to use to protect
              yourself. This site exists to make it easier for you and your
              neighbors to understand your tenant protections and to assert your
              rights.
            </Trans>
          </p>
          <p>
            <Trans>
              This site is a collaboration between the Housing Justice for All
              Coalition and JustFix. We thank all individuals who contributed to
              this site and to all the tenants and advocates who fight for Good
              Cause protections.
            </Trans>
          </p>
          <div className="about-project__orgs-container">
            <div className="callout-box">
              <span className="callout-box__header">
                <Trans>Housing Justice for All</Trans>
              </span>
              <p>
                <Trans>
                  A statewide coalition of tenants and homeless New Yorkers united
                  in our fight for housing as a human right.
                </Trans>
              </p>
              <JFCLLinkExternal to="https://housingjusticeforall.org/">
                <Trans>Visit Housing Justice for All</Trans>
              </JFCLLinkExternal>
            </div>
            <div className="callout-box">
              <span className="callout-box__header">
                <Trans>JustFix</Trans>
              </span>
              <p>
                <Trans>
                  A nonprofit organization that builds online tools to help New
                  Yorkers achieve affordable, healthy, eviction-free housing.
                </Trans>
              </p>
              <JFCLLinkExternal to="https://www.justfix.org/">
                <Trans>Visit JustFix</Trans>
              </JFCLLinkExternal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
