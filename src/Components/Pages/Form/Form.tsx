import { useState } from "react";
import { Button, FormGroup, TextInput } from "@justfixnyc/component-library";
import { useLoaderData, useNavigate } from "react-router";

import { FormStep } from "../../FormStep/FormStep";
import { Address } from "../Home/Home";
import { useGetBuildingData, useSendGceData } from "../../../api/hooks";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import { RadioGroup } from "../../RadioGroup/RadioGroup";
import { BreadCrumbs } from "../../BreadCrumbs/BreadCrumbs";
import { InfoBox } from "../../InfoBox/InfoBox";
import { breadCrumbAddress, formatNumber } from "../../../helpers";
import { cleanFormFields } from "../../../api/helpers";
import { BuildingData, GCEUser } from "../../../types/APIDataTypes";
import "./Form.scss";

export type FormFields = {
  bedrooms: "STUDIO" | "1" | "2" | "3" | "4+" | null;
  rent: string | null;
  landlord: "YES" | "NO" | "UNSURE" | null;
  rentStabilized: "YES" | "NO" | "UNSURE" | null;
  housingType: "NYCHA" | "SUBSIDIZED" | "NONE" | "UNSURE" | null;
  portfolioSize?: "YES" | "NO" | "UNSURE";
};

const initialFields: FormFields = {
  bedrooms: null,
  rent: "",
  landlord: null,
  rentStabilized: null,
  housingType: null,
  portfolioSize: undefined,
};

export const Form: React.FC = () => {
  const { address, user } = useLoaderData() as {
    address: Address;
    user?: GCEUser;
  };
  const [fields, setFields] = useSessionStorage<FormFields>("fields");
  const [localFields, setLocalFields] = useState<FormFields>(
    fields || initialFields
  );

  const bbl = address.bbl;

  const { data: bldgData } = useGetBuildingData(bbl);
  const { trigger } = useSendGceData();

  const NUM_STEPS = !bldgData ? 5 : bldgData?.unitsres > 10 ? 5 : 6;

  const navigate = useNavigate();

  const handleSubmit = () => {
    setFields(localFields);
    try {
      trigger({ id: user?.id, form_answers: cleanFormFields(localFields) });
    } catch (error) {
      console.log({ "tenants2-error": error });
    }
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
              name: breadCrumbAddress(address),
            },
            { path: "/form", name: "Screener survey", active: true },
            { path: "/results", name: "Coverage result" },
          ]}
        />

        <h2>Screener Survey</h2>

        <p className="form__subheader">
          We'll use your answers to help determine your coverage.
        </p>
        <form>
          <FormStep step={1} total={NUM_STEPS}>
            <FormGroup legendText="How many bedrooms are in your apartment?">
              <RadioGroup
                fields={localFields}
                radioGroup={{
                  name: "bedrooms",
                  options: [
                    { label: "Studio", value: "STUDIO" },
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

          <FormStep step={2} total={NUM_STEPS}>
            <TextInput
              labelText="What is the total monthly rent for your entire apartment?"
              helperElement={
                <InfoBox>
                  Please provide the{" "}
                  <span className="bold">total rent of your apartment</span>,
                  not just the portion of rent that you pay.
                </InfoBox>
              }
              id="rent-input"
              type="money"
              name="rent"
              value={localFields["rent"] || ""}
              onChange={handleInputChange}
            />
          </FormStep>

          <FormStep step={3} total={NUM_STEPS}>
            <FormGroup legendText="Does your landlord live in the building?">
              <RadioGroup
                fields={localFields}
                radioGroup={{
                  name: "landlord",
                  options: [
                    { label: "Yes", value: "YES" },
                    { label: "No", value: "NO" },
                    { label: "I'm not sure", value: "UNSURE" },
                  ],
                }}
                onChange={handleRadioChange}
              />
            </FormGroup>
          </FormStep>

          <FormStep step={4} total={NUM_STEPS}>
            <FormGroup
              legendText="Is your apartment rent-stabilized?"
              helperElement={
                getRsHelperText(bldgData) && (
                  <InfoBox>{getRsHelperText(bldgData)}</InfoBox>
                )
              }
            >
              <RadioGroup
                fields={localFields}
                radioGroup={{
                  name: "rentStabilized",
                  options: [
                    { label: "Yes", value: "YES" },
                    { label: "No", value: "NO" },
                    { label: "I'm not sure", value: "UNSURE" },
                  ],
                }}
                onChange={handleRadioChange}
              />
            </FormGroup>
          </FormStep>

          <FormStep step={5} total={NUM_STEPS}>
            <FormGroup
              legendText="Is your apartment associated with any of the following?"
              helperElement={
                getSubsidyHelperText(bldgData) && (
                  <InfoBox>{getSubsidyHelperText(bldgData)}</InfoBox>
                )
              }
            >
              <RadioGroup
                fields={localFields}
                radioGroup={{
                  name: "housingType",
                  options: [
                    { label: "NYCHA or PACT/RAD", value: "NYCHA" },
                    { label: "Subsidized housing", value: "SUBSIDIZED" },
                    { label: "None of these", value: "NONE" },
                    { label: "I'm not sure", value: "UNSURE" },
                  ],
                }}
                onChange={handleRadioChange}
              />
            </FormGroup>
          </FormStep>

          {bldgData && bldgData?.unitsres <= 10 && (
            <FormStep step={6} total={NUM_STEPS}>
              <FormGroup
                legendText="Does your landlord own more than 10 apartments across multiple buildings?"
                helperElement={
                  <InfoBox>
                    {`It looks like there are ${bldgData.unitsres} apartments in your building. ` +
                      "Good Cause Eviction protections only apply to tenants whose landlords own more than 10 apartments, " +
                      "even if those apartments are spread across multiple buildings."}
                  </InfoBox>
                }
              >
                <RadioGroup
                  fields={localFields}
                  radioGroup={{
                    name: "portfolioSize",
                    options: [
                      { label: "Yes", value: "YES" },
                      { label: "No", value: "NO" },
                      { label: "I'm not sure", value: "UNSURE" },
                    ],
                  }}
                  onChange={handleRadioChange}
                />
              </FormGroup>
            </FormStep>
          )}
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
              !localFields ||
              Object.values(localFields).filter(Boolean).length < NUM_STEPS
            }
          />
        </div>
      </div>
    </div>
  );
};

const getRsHelperText = (bldgData?: BuildingData): string | undefined => {
  if (!bldgData) return undefined;

  const {
    post_hstpa_rs_units: rsUnits,
    unitsres: bldgUnits,
    end_421a,
    end_j51,
    yearbuilt,
  } = bldgData;

  return bldgUnits > 0 && rsUnits >= bldgUnits
    ? "Our data shows that all apartments in your building are registered as rent stabilized."
    : new Date(end_421a) > new Date()
    ? "Your building appears to receive the 421a tax exemption. This means your apartment is rent stabilized."
    : new Date(end_j51) > new Date()
    ? "Your building appears to receive the J51 tax exemption. This means your apartment is rent stabilized."
    : rsUnits > 0
    ? `Our data shows that ${formatNumber(rsUnits)} of the ${formatNumber(
        bldgUnits
      )} apartments in your building are registered as rent stabilized.`
    : yearbuilt < 1974 && bldgUnits >= 6
    ? "Based on the size and age of your building, your apartment might be rent stabilized."
    : undefined;
};

const getSubsidyHelperText = (bldgData?: BuildingData): string | undefined => {
  if (!bldgData) return undefined;
  return bldgData.is_nycha
    ? "Based on our data, it looks like your building is part of NYCHA"
    : bldgData.is_subsidized
    ? `Based on our data, it looks like your building is part of the ${bldgData.subsidy_name} subsidy program`
    : "By subsidized we mean that your apartment is affordable housing available to people with a specific income level. " +
      "This does not include vouchers that can be used anywhere to cover some or all of the your rent.";
};
