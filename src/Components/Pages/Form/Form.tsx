import { useState } from "react";
import { Button, FormGroup, TextInput } from "@justfixnyc/component-library";
import { useLoaderData, useNavigate } from "react-router";

import { FormStep } from "../../FormStep/FormStep";
import { Address } from "../Home/Home";
import { useGetBuildingData } from "../../../api/hooks";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import { RadioGroup } from "../../RadioGroup/RadioGroup";
import { FormFields } from "../../../App";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import "./Form.scss";
import { BuildingData } from "../../../types/APIDataTypes";

const initialFields: FormFields = {
  bedrooms: null,
  rent: "",
  landlord: null,
  rentStabilized: null,
  housingType: null,
  portfolioSize: undefined,
};

export const Form: React.FC = () => {
  const { address } = useLoaderData() as { address: Address };
  const [fields, setFields] = useSessionStorage<FormFields>("fields");
  const [localFields, setLocalFields] = useState<FormFields>(
    fields || initialFields
  );

  const bbl = address.bbl;

  const { data: bldgData } = useGetBuildingData(bbl);

  const navigate = useNavigate();

  const handleSubmit = () => {
    setFields(localFields);
    navigate(`/results`);
  };

  const handleRadioChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const fieldName = e.target.name;
    const value = e.target.dataset.value || null;
    const updatedFields = {
      ...localFields,
      [fieldName]: value,
    };
    setLocalFields(updatedFields as FormFields);
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const fieldName = e.target.name;
    const value = e.target.value;
    const updatedFields = {
      ...localFields,
      [fieldName]: value,
    };
    setLocalFields(updatedFields as FormFields);
  };

  return (
    <div className="form__wrapper content-section">
      <div className="content-section__content">
        <BreadCrumbs
          crumbs={[
            { path: "/home", name: "Home" },
            {
              path: "/confirm_address",
              name: address?.address || "Your address",
            },
            { path: "/form", name: "Screener survey", active: true },
            { path: "/results", name: "Coverage result" },
          ]}
        />

        <h2>Screener Survey</h2>

        <p className="form__subheader">
          We'll use the information from this 5-question survey to run through
          the laws and find out if you're covered.{" "}
        </p>
        <form>
          <FormStep step={1} total={6}>
            <FormGroup legendText="How many bedrooms are in your apartment?">
              <RadioGroup
                fields={localFields}
                radioGroup={{
                  name: "bedrooms",
                  options: [
                    { label: "Studio", value: "studio" },
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3", value: "3" },
                    { label: "4+", value: "4+" },
                  ],
                }}
                onChange={handleRadioChange}
              />
            </FormGroup>
          </FormStep>

          <FormStep step={2} total={6}>
            <TextInput
              labelText="What is the total monthly rent for your entire apartment?"
              helperText="Please provide the total rent of your apartment, not just the portion of rent that you pay."
              id="rent-input"
              type="money"
              name="rent"
              value={localFields["rent"] || ""}
              onChange={handleInputChange}
            />
          </FormStep>

          <FormStep step={3} total={6}>
            <FormGroup legendText="Does your landlord live in the building?">
              <RadioGroup
                fields={localFields}
                radioGroup={{
                  name: "landlord",
                  options: [
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                    { label: "I'm not sure", value: "not-sure" },
                  ],
                }}
                onChange={handleRadioChange}
              />
            </FormGroup>
          </FormStep>

          <FormStep step={4} total={6}>
            <FormGroup
              legendText="Is your apartment rent-stabilized?"
              helperText={getRsHelperText(bldgData)}
            >
              <RadioGroup
                fields={localFields}
                radioGroup={{
                  name: "rentStabilized",
                  options: [
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                    { label: "I'm not sure", value: "not-sure" },
                  ],
                }}
                onChange={handleRadioChange}
              />
            </FormGroup>
          </FormStep>

          <FormStep step={5} total={6}>
            <FormGroup
              legendText="Is your apartment associated with any of the following?"
              helperText={getSubsidyHelperText(bldgData)}
            >
              <RadioGroup
                fields={localFields}
                radioGroup={{
                  name: "housingType",
                  options: [
                    { label: "NYCHA or PACT/RAD", value: "public" },
                    { label: "Subsidized housing", value: "subsidized" },
                    { label: "None of these", value: "none" },
                    { label: "I'm not sure", value: "not-sure" },
                  ],
                }}
                onChange={handleRadioChange}
              />
            </FormGroup>
          </FormStep>

          <FormStep step={6} total={6}>
            <FormGroup
              legendText="Does your landlord own more than 10 apartments across multiple buildings?"
              helperText={getPortfolioSizeHelperText(bldgData)}
            >
              <RadioGroup
                fields={localFields}
                radioGroup={{
                  name: "portfolioSize",
                  options: [
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" },
                    { label: "I'm not sure", value: "not-sure" },
                  ],
                }}
                onChange={handleRadioChange}
              />
            </FormGroup>
          </FormStep>
        </form>
        <div className="form__buttons">
          <Button
            labelText="Back"
            labelIcon="chevronLeft"
            variant="secondary"
            onClick={() => navigate("/confirm_address")}
          />
          <Button
            labelText="Next"
            onClick={handleSubmit}
            disabled={
              !localFields || !Object.values(localFields).every(Boolean)
            }
          />
        </div>
      </div>
    </div>
  );
};

const getRsHelperText = (bldgData?: BuildingData): string | undefined => {
  return !bldgData
    ? undefined
    : bldgData.unitsres > 0 && bldgData.post_hstpa_rs_units >= bldgData.unitsres
    ? "Our data shows that all apartments in your building are registered as rent stabilized."
    : new Date(bldgData.end_421a) > new Date()
    ? "Your building appears to receive the 421a tax exemption. This means your apartment is rent stabilized."
    : new Date(bldgData.end_j51) > new Date()
    ? "Your building appears to receive the J51 tax exemption. This means your apartment is rent stabilized."
    : bldgData.post_hstpa_rs_units > 0
    ? "Our data shows that some apartments in your building are registered as rent stabilized."
    : bldgData.yearbuilt < 1974 && bldgData.unitsres >= 6
    ? "Based on the size and age of your building, your apartment might be rent stabilized."
    : undefined;
};

const getSubsidyHelperText = (bldgData?: BuildingData): string | undefined => {
  return !bldgData
    ? undefined
    : bldgData.is_nycha
    ? "Based on our data, it looks like your building is part of NYCHA"
    : bldgData.is_subsidized
    ? `Based on our data, it looks like your building receives ${bldgData.subsidy_name} subsidy`
    : "If your apartment is kept affordable for people based on their income level, then you live in what’s called “subsidized housing.”" +
      " Your apartment is not considered subsidized if you receive a housing voucher that can be used anywhere.";
};

const getPortfolioSizeHelperText = (
  bldgData?: BuildingData
): string | undefined => {
  return !bldgData
    ? undefined
    : bldgData.unitsres <= 10
    ? `It looks like looks like there are ${bldgData.unitsres} apartments in your building. ` +
      "Good Cause Eviction protections only apply to tenants whose landlords own more than 10 apartments, " +
      "even if those apartments are spread across multiple buildings."
    : undefined;
};
