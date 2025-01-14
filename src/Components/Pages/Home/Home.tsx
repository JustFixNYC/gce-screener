import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@justfixnyc/component-library";

import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import { FormFields } from "../Form/Form";
import { useSendGceData } from "../../../api/hooks";
import { GCEPostData, GCEUser } from "../../../types/APIDataTypes";
import { Header } from "../../Header/Header";
import JFCLLinkInternal from "../../JFCLLinkInternal";
import "./Home.scss";
import { ProgressStep } from "../../../helpers";

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
  const [, setUser] = useSessionStorage<GCEUser>("user");
  const [address, setAddress] = useSessionStorage<Address>("address");
  const [, , removeFormFields] = useSessionStorage<FormFields>("fields");
  const [lastStepReached, setLastStepReached] =
    useSessionStorage<ProgressStep>("lastStepReached");
  const [geoAddress, setGeoAddress] = useState<Address>();
  const [inputInvalid, setInputInvalid] = useState(false);
  const { trigger } = useSendGceData();

  const handleAddressSearch = async () => {
    if (!geoAddress) {
      setInputInvalid(true);
      return;
    }
    setAddress(geoAddress);
    const postData: GCEPostData = {
      bbl: geoAddress.bbl,
      house_number: geoAddress.houseNumber,
      street_name: geoAddress.streetName,
      borough: geoAddress.borough,
      zipcode: geoAddress.zipcode,
    };
    try {
      const userResp = (await trigger(postData)) as GCEUser;
      setUser(userResp);
    } catch (error) {
      console.log({ "tenants2-error": error });
    }

    removeFormFields();
    setLastStepReached(ProgressStep.Address);
    navigate("confirm_address");
  };

  return (
    <div id="home-page">
      <Header
        title="Learn if you're covered by Good Cause Eviction law in NYC"
        address={address}
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
            Good Cause Eviction went into effect on April 20th, 2024. If you are
            covered by the law, you now have a right to remain in your home as
            long as you pay rent and follow the terms of your lease. There are
            also limits to how much your rent can be increased.
          </p>
          <div className="callout-box">
            <span className="callout-box__header">
              You’re protected, even if you aren’t covered
            </span>
            <p>
              All NYC tenants are protected by certain rights, even if they are
              not covered by the new Good Cause Eviction legislation.
            </p>
            <JFCLLinkInternal to="/tenant_rights">
              Learn more about tenants’ rights in NYC
            </JFCLLinkInternal>
          </div>
        </div>
      </div>
      <div className="content-section home__about-project">
        <div className="content-section__content">
          <h3>About the project</h3>
          <p>
            To be covered by Good Cause Eviction, your apartment must meet
            certain requirements. If you live in New York City, you can use this
            tool to see which of the law's requirements you meet and what you
            can do to assert your rights.
          </p>
          <br />
          <p>
            This project is a collaboration between JustFix and Housing Justice
            for All
          </p>
          <div className="about-project__orgs-container">
            <div className="callout-box">
              <span className="callout-box__header">JustFix</span>
              <p>
                A non-profit that builds free tools for tenants to exercise
                their rights to a livable home.
              </p>
              <JFCLLinkInternal to="">Learn more</JFCLLinkInternal>
            </div>
            <div className="callout-box">
              <span className="callout-box__header">
                Housing Justice for All
              </span>
              <p>
                A statewide coalition of over 80 groups representing tenants and
                homeless New Yorkers, united in the fight for housing as a human
                right.
              </p>
              <JFCLLinkInternal to="">Learn more</JFCLLinkInternal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
