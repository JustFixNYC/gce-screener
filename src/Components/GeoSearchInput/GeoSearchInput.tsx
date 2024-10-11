import { useState } from "react";
import { Dropdown } from "@justfixnyc/component-library";
import {
  GeoSearchRequester,
  GeoSearchFeature,
} from "@justfixnyc/geosearch-requester";
import "./GeoSearchInput.scss";
import { Address } from "../Pages/Home/Home";

type GeoSearchInputProps = {
  onChange: (selectedAddress: Address) => void;
};

// Address labels from geosearch look like this: "105-47 FLATLANDS SECOND STREET, Brooklyn, NY, USA"
// We don't need the state and country, so we'll clean up the label by removing them
const cleanLabel = (addressLabel: string) => {
  return addressLabel.replace(", NY, USA", "");
};

export const GeoSearchInput: React.FC<GeoSearchInputProps> = ({ onChange }) => {
  const [results, setResults] = useState<GeoSearchFeature[]>([]);
  const requester = new GeoSearchRequester({
    onError: (e) => {
      console.log("ERROR", e);
    },
    onResults: (results) => {
      // setIsLoading(false);
      setResults(results.features);
    },
  });

  const options = results.map((result) => {
    return {
      value: result.properties.label,
      label: cleanLabel(result.properties.label),
    };
  });

  return (
    <>
      <Dropdown
        className="geo-search"
        options={options}
        labelText="Enter your address to get started"
        filterOption={null}
        onInputChange={(value: string) => {
          requester.changeSearchRequest(value);
          return value;
        }}
        // @ts-expect-error We need to update the JFCL onChange props to match react-select
        onChange={({ value }) => {
          const selectedAddress = results.find(
            (result) => result.properties.label === value
          );

          const longLat = (
            selectedAddress?.geometry as { coordinates: number[] }
          ).coordinates.join();

          if (selectedAddress) {
            onChange({
              bbl: selectedAddress?.properties.addendum.pad.bbl,
              address: cleanLabel(selectedAddress?.properties.label),
              longLat: longLat,
            });
          }
        }}
      />
    </>
  );
};
