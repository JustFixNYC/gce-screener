import { Button } from "@justfixnyc/component-library";
import { Address } from "../Home/Home";
import "./ConfirmAddress.scss";
import { useLoaderData, useNavigate } from "react-router-dom";
import { ContentBox } from "../../ContentBox/ContentBox";
import { BackLink } from "../../JFCLLinkInternal";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { useGetBuildingData, useSendGceData } from "../../../api/hooks";
import { GCEUser } from "../../../types/APIDataTypes";

export const ConfirmAddress: React.FC = () => {
  const navigate = useNavigate();
  const { address, user } = useLoaderData() as {
    address: Address;
    user: GCEUser;
  };
  const { data: bldgData } = useGetBuildingData(address.bbl);
  const { trigger } = useSendGceData();

  const styleToken = import.meta.env.VITE_MAPBOX_STYLE_TOKEN;
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const longLat = address.longLat;
  const zoom = "15.25";
  const bearing = "0";
  const pitch = "0";
  const width = "814";
  const height = "356";
  const marker = `pin-s+000(${longLat})`;

  const mapImageURL = `https://api.mapbox.com/styles/v1/${styleToken}/static/${marker}/${longLat},${zoom},${bearing},${pitch}/${width}x${height}?access_token=${accessToken}`;

  const handleSubmit = async () => {
    try {
      trigger({
        id: user.id,
        address_confirmed: true,
        nycdb_results: bldgData,
      });
    } catch (error) {
      console.log({ "tenants2-error": error });
    }
    navigate("/form");
  };

  return (
    <div className="confirmation__wrapper">
      <div className="headline-section">
        <div className="headline-section__content">
          <BreadCrumbs
            crumbs={[
              { path: "/home", name: "Home" },
              {
                path: "/confirm_address",
                name: address?.address || "Your address",
              },
              { path: "/form", name: "Screener survey" },
              { path: "/results", name: "Coverage result" },
            ]}
          />

          <h2 className="headline-section__title">Confirm your address</h2>
          <div className="headline-section__subtitle">
            We'll use info about your building from public data sources to help
            learn if you're covered
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="content-section__content">
          <ContentBox>
            <div className="img-wrapper">
              <img
                className="img-wrapper__img"
                src={mapImageURL}
                alt="Map showing location of the entered address."
                width={width}
                height={height}
              />
            </div>
            <h3 className="confirmation__address">{address.address}</h3>
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
