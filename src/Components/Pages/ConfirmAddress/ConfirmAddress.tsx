import { Button } from "@justfixnyc/component-library";
import { Address } from "../Home/Home";
import "./ConfirmAddress.scss";
import { useLoaderData, useNavigate } from "react-router-dom";

export const ConfirmAddress: React.FC = () => {
  const navigate = useNavigate();
  const { address } = useLoaderData() as { address: Address };

  const styleToken = import.meta.env.VITE_MAPBOX_STYLE_TOKEN;
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const longLat = address.longLat;
  const zoom = "15.25";
  const bearing = "0";
  const pitch = "0";
  const size = "634x352";
  const marker = `pin-s+000(${longLat})`;

  const mapImageURL = `https://api.mapbox.com/styles/v1/${styleToken}/static/${marker}/${longLat},${zoom},${bearing},${pitch}/${size}?access_token=${accessToken}`;

  return (
    <div className="confirmation__wrapper">
      <h2>Confirm your address</h2>
      <p className="confirmation__subheader">
        We'll use info about your building from public data sources to help
        learn if you're covered
      </p>
      <div className="img-wrapper">
        <img
          className="img-wrapper__img"
          src={mapImageURL}
          alt="Map showing location of the entered address."
        />
        <p className="confirmation__address">{address.address}</p>
      </div>
      <div className="confirmation__buttons">
        <Button
          className="confirmation__button"
          labelText="Back"
          labelIcon="chevronLeft"
          variant="secondary"
          onClick={() => {
            navigate("/home");
          }}
        />
        <Button
          className="confirmation__button"
          labelText="Next"
          onClick={() => {
            navigate("/form");
          }}
        />
      </div>
    </div>
  );
};
