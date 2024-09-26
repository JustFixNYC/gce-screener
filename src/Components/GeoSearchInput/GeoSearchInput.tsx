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

export const GeoSearchInput: React.FC<GeoSearchInputProps> = ({ onChange }) => {
  // const [isLoading, setIsLoading] = useState(false);
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
      label: result.properties.label,
    };
  });

  return (
    <>
      <Dropdown
        className="geo-search"
        options={options}
        labelText="Enter your address to get started"
        onInputChange={(value: string) => {
          requester.changeSearchRequest(value);
          return value;
        }}
        // @ts-expect-error We need to update the JFCL onChange props to match react-select
        onChange={({ value }) => {
          const selectedAddress = results.find(
            (result) => result.properties.label === value
          )?.properties;

          console.log("selectedAddress", selectedAddress);

          if (selectedAddress) {
            onChange({
              bbl: selectedAddress?.addendum.pad.bbl,
              address: selectedAddress?.label,
            });
          }
        }}
      />
    </>
  );
};
