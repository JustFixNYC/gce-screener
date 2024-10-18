import { useEffect, useMemo, useState } from "react";
import { Dropdown } from "@justfixnyc/component-library";
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
};

export const GeoSearchInput: React.FC<GeoSearchInputProps> = ({
  initialAddress,
  onChange,
}) => {
  const [results, setResults] = useState<GeoSearchFeature[]>([]);

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
    <>
      <Dropdown
        className="geo-search"
        options={options}
        labelText="Enter your building address to get started"
        filterOption={null}
        onInputChange={(value: string) => {
          requester.changeSearchRequest(value);
          return value;
        }}
        escapeClearsValue={false}
        defaultValue={{
          value: initialAddress?.address,
          label: initialAddress?.address,
        }}
        defaultOptions={[
          { value: initialAddress?.address, label: initialAddress?.address },
        ]}
        // @ts-expect-error We need to update the JFCL onChange props to match react-select
        onChange={({ value }) => {
          console.log("onchange", { value });
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
              longLat: longLat,
            });
          }
        }}
      />
    </>
  );
};
