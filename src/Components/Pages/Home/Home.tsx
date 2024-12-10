import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@justfixnyc/component-library";
import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import "./Home.scss";
import { FormFields } from "../Form/Form";
import { useSendGceData } from "../../../api/hooks";
import { GCEPostData, GCEUser } from "../../../types/APIDataTypes";

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
  const [geoAddress, setGeoAddress] = useState<Address>();
  const { trigger } = useSendGceData();

  const handleAddressSearch = async () => {
    if (geoAddress) {
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
    }
    removeFormFields();
    navigate("confirm_address");
  };

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
          <GeoSearchInput initialAddress={address} onChange={setGeoAddress} />
          <Button
            labelText="See if you are covered"
            size="small"
            disabled={!geoAddress && !address}
            onClick={handleAddressSearch}
          />
        </div>
      </div>
    </div>
  );
};
