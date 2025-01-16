import { useEffect } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { useRollbar } from "@rollbar/react";
import { Button } from "@justfixnyc/component-library";

import { Address } from "../Home/Home";
import { ContentBox } from "../../ContentBox/ContentBox";
import { BackLink } from "../../JFCLLinkInternal";
import { useGetBuildingData, useSendGceData } from "../../../api/hooks";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import { GCEUser } from "../../../types/APIDataTypes";
import { Header } from "../../Header/Header";
import { ProgressStep, toTitleCase } from "../../../helpers";
import { InfoBox } from "../../InfoBox/InfoBox";
import "./ConfirmAddress.scss";

export const ConfirmAddress: React.FC = () => {
  const navigate = useNavigate();
  const { address, user } = useLoaderData() as {
    address: Address;
    user?: GCEUser;
  };
  const [lastStepReached, setLastStepReached] =
    useSessionStorage<ProgressStep>("lastStepReached");
  useEffect(() => {
    if (!lastStepReached || lastStepReached < 0) {
      setLastStepReached(ProgressStep.Address);
    }
  }, [lastStepReached, setLastStepReached]);
  const { data: bldgData } = useGetBuildingData(address.bbl);
  const { trigger } = useSendGceData();
  const rollbar = useRollbar();

  const styleToken = import.meta.env.VITE_MAPBOX_STYLE_TOKEN;
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const longLat = address.longLat;
  const zoom = "15.25";
  const bearing = "0";
  const pitch = "0";
  const width = "425";
  const height = "223";
  const marker = `pin-s+000(${longLat})`;

  const mapImageURL = `https://api.mapbox.com/styles/v1/${styleToken}/static/${marker}/${longLat},${zoom},${bearing},${pitch}/${width}x${height}?access_token=${accessToken}`;

  const handleSubmit = async () => {
    if (import.meta.env.MODE === "production") {
      try {
        trigger({
          id: user?.id,
          address_confirmed: true,
          nycdb_results: bldgData,
        });
      } catch {
        rollbar.error("cannot connect to tenant platform");
      }
    }
    navigate("/survey");
  };

  return (
    <div id="confirm-address-page">
      <Header
        title="Confirm your address"
        subtitle="We'll use info about your building from public data sources to help learn if you're covered"
        address={address}
        lastStepReached={lastStepReached}
      />

      <div className="content-section">
        <div className="content-section__content">
          <ContentBox>
            {bldgData?.unitsres === 0 && (
              <InfoBox color="blue">
                <span>
                  City data shows that there aren’t any residential units at
                  this address.
                </span>
                <Link to="/">Search new address</Link>
              </InfoBox>
            )}
            <div className="map-address-container">
              <div className="img-wrapper">
                <img
                  className="img-wrapper__img"
                  src={mapImageURL}
                  alt="Map showing location of the entered address."
                  width={width}
                  height={height}
                />
              </div>
              <div className="address-container">
                <div className="your-address">Your Address</div>
                <h3 className="address-part-1">{`${
                  address.houseNumber || ""
                } ${toTitleCase(address.streetName)}`}</h3>
                <div className="address-part-2">{`${toTitleCase(
                  address.borough
                )}, New York ${address.zipcode}`}</div>
              </div>
            </div>
          </ContentBox>

          <div className="confirmation__buttons">
            <BackLink to="/home" className="confirmation__back">
              Back
            </BackLink>
            <Button
              className="confirmation__button"
              labelText="Next"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
