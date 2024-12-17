import { useEffect, useMemo, useState } from "react";
import { Dropdown, Icon } from "@justfixnyc/component-library";
import {
  GeoSearchRequester,
  GeoSearchFeature,
} from "@justfixnyc/geosearch-requester";
import "./GeoSearchInput.scss";
import { Address } from "../Pages/Home/Home";
import { formatGeosearchAddress } from "../../helpers";

type GeoSearchInputProps = {
  initialAddress?: Address;
  onChange: (selectedAddress: Address) => void;
  invalid: boolean;
  setInvalid: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GeoSearchInput: React.FC<GeoSearchInputProps> = ({
  initialAddress,
  onChange,
  invalid,
  setInvalid,
}) => {
  const [results, setResults] = useState<GeoSearchFeature[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const placeholder = (
    <>
      <Icon icon="locationDot" />
      Enter your address
    </>
  );

  const requester = useMemo(
    () =>
      new GeoSearchRequester({
        onError: (e) => {
          console.log("ERROR", e);
        },
        onResults: (results) => {
          // setIsLoading(false);
          setResults(results.features);
        },
      }),
    []
  );

  useEffect(() => {
    if (initialAddress) {
      requester.changeSearchRequest(initialAddress?.address);
    }
  }, [initialAddress, requester]);

  const options = results.map((result) => {
    return {
      value: formatGeosearchAddress(result.properties),
      label: formatGeosearchAddress(result.properties),
    };
  });

  return (
    <div className="geo-search">
      <Dropdown
        className="geo-search"
        options={options}
        placeholder={!isFocused && placeholder}
        invalid={!isFocused && invalid}
        invalidText="You must enter an address"
        onFocus={() => {
          setInvalid(false);
          setIsFocused(true);
        }}
        onBlur={() => setIsFocused(false)}
        filterOption={null}
        onInputChange={(value: string) => {
          requester.changeSearchRequest(value);
          return value;
        }}
        escapeClearsValue={false}
        defaultOptions={[
          { value: initialAddress?.address, label: initialAddress?.address },
        ]}
        // @ts-expect-error We need to update the JFCL onChange props to match react-select
        onChange={({ value }) => {
          const selectedAddress = results.find(
            (result) => formatGeosearchAddress(result.properties) === value
          );

          const longLat = (
            selectedAddress?.geometry as { coordinates: number[] }
          ).coordinates.join();

          if (selectedAddress) {
            onChange({
              bbl: selectedAddress?.properties.addendum.pad.bbl,
              address: formatGeosearchAddress(selectedAddress?.properties),
              houseNumber: selectedAddress?.properties.housenumber,
              streetName: selectedAddress?.properties.street,
              borough: selectedAddress?.properties.borough.toUpperCase(),
              zipcode: selectedAddress?.properties.postalcode,
              longLat: longLat,
            });
          }
        }}
      />
    </div>
  );
};
