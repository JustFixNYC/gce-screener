import { Button } from "@justfixnyc/component-library";
import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";
import "./Home.scss";
import { useNavigate } from "react-router";
import { useState } from "react";

export type Address = {
  bbl: string;
  address: string;
  longLat: string;
};

type HomeProps = {
  address?: Address;
  onSelectAddress: (address: Address) => void;
};

export const Home: React.FC<HomeProps> = ({ onSelectAddress }) => {
  const navigate = useNavigate();
  const [geoAddress, setAddress] = useState<Address>();

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
          <GeoSearchInput onChange={setAddress} />
          <Button
            labelText="See if you are eligible"
            size="small"
            disabled={!geoAddress}
            onClick={() => {
              if (geoAddress) {
                onSelectAddress(geoAddress);
                navigate("confirm_address");
              }
            }}
          />
        </div>
      </div>
      <div id="legal-footer">
        <p className="legal-header">Legal Disclaimer</p>
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
      </div>
    </div>
  );
};
