import { Button } from "@justfixnyc/component-library";
import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";
import "./Home.scss";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

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
  const [searchParams] = useSearchParams();
  const address = searchParams.get("address");
  // const bbl = searchParams.get("bbl");
  // const longLat = searchParams.get("longLat");
  return (
    <div className="wrapper">
      <div className="main-content">
        <h2>What is Good Cause Eviction?</h2>
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
          <div>Selected Address: {address}</div>
          <GeoSearchInput
            onChange={(address) => {
              setAddress(address);
            }}
          />
          <Button
            labelText="See if you are eligible"
            size="small"
            disabled={!geoAddress}
            onClick={() => {
              if (geoAddress) {
                onSelectAddress(geoAddress);
                console.log(searchParams.toString());
                searchParams.set("address", geoAddress.address);
                searchParams.set("bbl", geoAddress.bbl);
                searchParams.set("longLat", geoAddress.longLat);
                navigate(`confirm_address?${searchParams.toString()}`);
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
