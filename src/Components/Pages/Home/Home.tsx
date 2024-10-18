import { Button } from "@justfixnyc/component-library";
import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";
import "./Home.scss";
import { useNavigate } from "react-router";
import { useState } from "react";
import { LegalDisclaimer } from "../../LegalDisclaimer/LegalDisclaimer";

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
        <p className="content-p body-desktop-large">
          If you’re covered by the law, you have a right to stay in your home
          when your lease ends, and there are limits to how much your landlord
          can increase your rent. This tool will show you which of the law's
          requirements you meet and what you can do to assert your rights.
        </p>

        <div className="geo-search-form">
          <GeoSearchInput onChange={setAddress} />
          <Button
            labelText="See if you are covered"
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
      <LegalDisclaimer />
    </div>
  );
};
