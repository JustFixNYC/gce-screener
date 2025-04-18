import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useRollbar } from "@rollbar/react";
import { Button } from "@justfixnyc/component-library";

import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import { FormFields } from "../Form/Survey";
import { useSendGceData } from "../../../api/hooks";
import { GCEPostData, GCEUser } from "../../../types/APIDataTypes";
import { Header } from "../../Header/Header";
import { ProgressStep, toMacroCase } from "../../../helpers";
import { JFCLLinkExternal, JFCLLinkInternal } from "../../JFCLLink";
import "./Home.scss";
import { gtmPush } from "../../../google-tag-manager";

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

  const handleAddressSearch = async () => {
    if (!geoAddress) {
      setInputInvalid(true);
      return;
    }
    setAddress(geoAddress);
    const postData: GCEPostData = {
      id: sessionUser?.id,
      bbl: geoAddress.bbl,
      house_number: geoAddress.houseNumber,
      street_name: geoAddress.streetName,
      borough: toMacroCase(geoAddress.borough),
      zipcode: geoAddress.zipcode,
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
          <>
            Learn if you’re covered <br />
            by Good Cause <br />
            Eviction law in NYC
          </>
        }
        lastStepReached={lastStepReached}
      >
        <div className="geo-search-form">
          <GeoSearchInput
            initialAddress={address}
            onChange={setGeoAddress}
            invalid={inputInvalid}
            setInvalid={setInputInvalid}
          />
          <Button labelText="Get started" onClick={handleAddressSearch} />
        </div>
      </Header>

      <div className="content-section home__about-law">
        <div className="content-section__content">
          <h3>About the law</h3>
          <p>
            Good Cause Eviction protections went into effect on April 20th,
            2024. If you are covered by the law, you have strong legal
            protections against eviction as long as you follow your lease. There
            are also limits to how much your landlord can raise your rent.{" "}
            <JFCLLinkInternal
              to="/rent_calculator"
              onClick={() =>
                gtmPush("gce_rent_calculator", { from: "home-page" })
              }
            >
              Calculate your max rent increase.
            </JFCLLinkInternal>
          </p>
          <br />
          <p>
            To be covered by the law, your apartment must meet several
            requirements.{" "}
            <a
              href="https://www.nyc.gov/site/hpd/services-and-information/good-cause-eviction.page"
              target="_blank"
              rel="noopener noreferrer"
              className="jfcl-link"
            >
              Learn more about the law.
            </a>{" "}
            If you live in New York City, you can use this site to learn which
            requirements you meet and how to assert your rights.
          </p>
          <div className="callout-box">
            <span className="callout-box__header">
              If you’re not covered by Good Cause Eviction
            </span>
            <p>
              If you live in NYC and are not covered by Good Cause Eviction, you
              still have important tenant protections. Depending on the type of
              housing you live in, your protections may be even stronger than
              those provided by Good Cause.
            </p>
            <JFCLLinkInternal to="/tenant_rights">
              Learn more about tenant protections in NYC
            </JFCLLinkInternal>
          </div>
          <div className="callout-box">
            <span className="callout-box__header">
              If you live outside of NYC
            </span>
            <p>
              Tenants and tenant advocates are working to extend Good Cause
              protections throughout New York State.
            </p>
            <JFCLLinkExternal to="https://housingjusticeforall.org/kyr-good-cause/">
              Learn where Good Cause Protections have already been won
            </JFCLLinkExternal>
          </div>
        </div>
      </div>
      <div className="content-section home__about-project">
        <div className="content-section__content">
          <h3>About the site</h3>
          <p>
            Good Cause law can be complex to understand and to use to protect
            yourself. This site exists to make it easier for you and your
            neighbors to understand your tenant protections and to assert your
            rights.
          </p>
          <p>
            This site is a collaboration between Housing Justice for All
            Coalition and JustFix. We thank all individuals who contributed to
            this site and to all the tenants and advocates who fought for Good
            Cause protections.
          </p>
          <div className="about-project__orgs-container">
            <div className="callout-box">
              <span className="callout-box__header">
                Housing Justice for All
              </span>
              <p>
                A statewide coalition of tenants and homeless New Yorkers united
                in our fight for housing as a human right.
              </p>
              <JFCLLinkExternal to="https://housingjusticeforall.org/">
                Visit Housing Justice for All
              </JFCLLinkExternal>
            </div>
            <div className="callout-box">
              <span className="callout-box__header">JustFix</span>
              <p>
                A nonprofit organization that builds online tools to help New
                Yorkers achieve affordable, healthy, eviction-free housing.
              </p>
              <JFCLLinkExternal to="https://www.justfix.org/">
                Visit JustFix
              </JFCLLinkExternal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
