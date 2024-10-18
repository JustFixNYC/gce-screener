import { Button } from "@justfixnyc/component-library";
import { Address } from "../Home/Home";
import "./ConfirmAddress.scss";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "../../../hooks/useSessionStorage";

export const ConfirmAddress: React.FC = () => {
  const navigate = useNavigate();
  const [address] = useSessionStorage<Address>('address');

  const styleToken = import.meta.env.VITE_MAPBOX_STYLE_TOKEN;
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const longLat = address?.longLat;
  const zoom = "15.25";
  const bearing = "0";
  const pitch = "0";
  const size = "381x212";
  const marker = `pin-s+000(${longLat})`;

  const mapImageURL = `https://api.mapbox.com/styles/v1/${styleToken}/static/${marker}/${longLat},${zoom},${bearing},${pitch}/${size}?access_token=${accessToken}`;


  return (
    <div className="confirmation__wrapper">
      <h2>Confirm your address</h2>
      <p className="confirmation__subheader">
        Let's make sure we have the right address
      </p>
      <div className="img-wrapper">
        <img className="img-wrapper__img" src={mapImageURL} />
        <p>YOUR ADDRESS</p>
        <p className="confirmation__address">{address?.address}</p>
      </div>
      <div className="confirmation__buttons">
        <Button
          className="confirmation__button"
          labelText="Search new address"
          labelIcon="chevronLeft"
          variant="secondary"
          onClick={() => {
            navigate("/home");
          }}
        />
        <Button className="confirmation__button" labelText="Looks good!"
          onClick={() => {
            navigate("/form");
          }}/>
      </div>
    </div>
  );
};
