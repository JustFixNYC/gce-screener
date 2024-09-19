import { Button } from "@justfixnyc/component-library";
import { GeoSearchInput } from "../../GeoSearchInput/GeoSearchInput";
import "./Home.scss";
import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router";

type HomeProps = {
  setAddress: Dispatch<
    SetStateAction<{ value: string; label: string } | undefined>
  >;
};

export const Home: React.FC<HomeProps> = ({ setAddress }) => {
  const navigate = useNavigate();
  const [localAddress, setLocalAddress] = useState<{
    value: string;
    label: string;
  }>();
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
          <GeoSearchInput onChange={(value) => setLocalAddress(value)} />

          <Button
            labelText="See if you are eligible"
            size="small"
            onClick={() => {
              console.log("submit");
              setAddress(localAddress);
              navigate("/form");
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
