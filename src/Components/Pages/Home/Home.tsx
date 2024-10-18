import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@justfixnyc/component-library";
import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";
import { LegalDisclaimer } from "../../LegalDisclaimer/LegalDisclaimer";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import "./Home.scss";

export type Address = {
  bbl: string;
  address: string;
  longLat: string;
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useSessionStorage<Address>("address");
  const [geoAddress, setGeoAddress] = useState<Address>();

  return (
    <div className="wrapper">
      <div className="main-content">
        <h2>Learn if you're covered by Good Cause Eviction in NYC</h2>
        <p className="content-p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tellus
          lacus, pharetra dictum bibendum eu, ornare non mauris. Fusce pretium
          laoreet magna, ac dictum enim dictum sit amet. Vivamus sit amet augue
          ut metus auctor eleifend. Mauris tincidunt auctor lorem a ultricies.
          Aenean enim magna, semper ac arcu volutpat, mattis convallis nibh.
          Mauris efficitur augue quam, ut pharetra felis vehicula sed. In hac
          habitasse platea dictumst. Pellentesque eget cursus neque, in
          pellentesque mi.
        </p>

        <div className="geo-search-form">
          <GeoSearchInput initialAddress={address} onChange={setGeoAddress} />
          <Button
            labelText="See if you are eligible"
            size="small"
            disabled={!geoAddress && !address}
            onClick={() => {
              if (geoAddress) {
                setAddress(geoAddress);
              }
              navigate("confirm_address");
            }}
          />
        </div>
      </div>
      <LegalDisclaimer />
    </div>
  );
};
