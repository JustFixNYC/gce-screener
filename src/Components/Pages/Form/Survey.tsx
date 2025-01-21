import { useEffect, useRef, useState } from "react";
import { Button, FormGroup, TextInput } from "@justfixnyc/component-library";
import { useLoaderData, useNavigate } from "react-router";

import { FormStep } from "../../FormStep/FormStep";
import { Address } from "../Home/Home";
import { useGetBuildingData, useSendGceData } from "../../../api/hooks";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import { RadioGroup } from "../../RadioGroup/RadioGroup";
import { InfoBox } from "../../InfoBox/InfoBox";
import { formatNumber, ProgressStep } from "../../../helpers";
import { cleanFormFields } from "../../../api/helpers";
import { BuildingData, GCEUser } from "../../../types/APIDataTypes";
import { Header } from "../../Header/Header";
import "./Survey.scss";

export type FormFields = {
  bedrooms: "STUDIO" | "1" | "2" | "3" | "4+" | null;
  rent: string | null;
  landlord: "YES" | "NO" | "UNSURE" | null;
  rentStabilized: "YES" | "NO" | "UNSURE" | null;
  housingType: "NYCHA" | "SUBSIDIZED" | "NONE" | "UNSURE" | null;
  portfolioSize?: "YES" | "NO" | "UNSURE" | null;
};

const initialFields: FormFields = {
  bedrooms: null,
  rent: null,
  landlord: null,
  rentStabilized: null,
  housingType: null,
  portfolioSize: null,
};

export const Survey: React.FC = () => {
  const { address, user } = useLoaderData() as {
    address: Address;
    user?: GCEUser;
  };
  const [lastStepReached, setLastStepReached] =
    useSessionStorage<ProgressStep>("lastStepReached");
  useEffect(() => {
    if (!lastStepReached || lastStepReached < 1) {
      setLastStepReached(ProgressStep.Survey);
    }
  }, [lastStepReached, setLastStepReached]);

  const [fields, setFields] = useSessionStorage<FormFields>("fields");
  const [localFields, setLocalFields] = useState<FormFields>(
    fields || initialFields
  );
  const [showErrors, setShowErrors] = useState(false);

  const bbl = address.bbl;

  const { data: bldgData } = useGetBuildingData(bbl);
  const { trigger } = useSendGceData();

  const NUM_STEPS = !bldgData ? 5 : bldgData?.unitsres > 10 ? 5 : 6;

  const formStepRefs = [
    useRef<HTMLFieldSetElement | null>(null),
    useRef<HTMLFieldSetElement | null>(null),
    useRef<HTMLFieldSetElement | null>(null),
    useRef<HTMLFieldSetElement | null>(null),
    useRef<HTMLFieldSetElement | null>(null),
    useRef<HTMLFieldSetElement | null>(null),
  ];

  const navigate = useNavigate();

  const handleSubmit = () => {
    const firstUnansweredIndex = Object.values(localFields).findIndex(
      (x) => x === null
    );
    if (firstUnansweredIndex >= 0 && firstUnansweredIndex <= NUM_STEPS - 1) {
      setShowErrors(true);
      formStepRefs[firstUnansweredIndex].current?.scrollIntoView({
        behavior: "smooth",
      });
      return;
    }
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
    <div id="survey-page">
      <Header
        title="A few questions about your apartment"
        subtitle="We'll use your answers combined with public data to help determine your coverage."
        address={address}
        lastStepReached={lastStepReached}
      />
      <div className="content-section">
        <div className="content-section__content">
          {showErrors && (
            <InfoBox color="orange">
              Please complete the unanswered questions before continuing.
            </InfoBox>
          )}
          <form>
            <FormStep
              step={1}
              total={NUM_STEPS}
              fieldsetRef={formStepRefs[0]}
              invalid={showErrors && localFields.bedrooms === null}
            >
              <FormGroup
                legendText="How many bedrooms are in your apartment?"
                invalid={showErrors && localFields.bedrooms === null}
                invalidText="Please select one"
              >
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

            <FormStep
              step={2}
              total={NUM_STEPS}
              fieldsetRef={formStepRefs[1]}
              invalid={showErrors && localFields.rent === null}
            >
              <TextInput
                labelText="What is the total monthly rent for your entire apartment?"
                helperElement={
                  <InfoBox>
                    Please provide the total rent of your apartment, not just
                    the portion of rent that you pay.
                  </InfoBox>
                }
                invalid={showErrors && localFields.rent === null}
                invalidText="Enter your total rent amount"
                id="rent-input"
                type="money"
                name="rent"
                value={localFields["rent"] || ""}
                onChange={handleInputChange}
                onWheel={(e) => {
                  // prevents scroll incrementing value
                  e.currentTarget.blur();
                  e.stopPropagation();
                  setTimeout(() => e.currentTarget.focus(), 0);
                }}
              />
            </FormStep>

            <FormStep
              step={3}
              total={NUM_STEPS}
              fieldsetRef={formStepRefs[2]}
              invalid={showErrors && localFields.landlord === null}
            >
              <FormGroup
                legendText="Does your landlord live in the building?"
                invalid={showErrors && localFields.landlord === null}
                invalidText="Please select one"
              >
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

            <FormStep
              step={4}
              total={NUM_STEPS}
              fieldsetRef={formStepRefs[3]}
              invalid={showErrors && localFields.rentStabilized === null}
            >
              <FormGroup
                legendText="Is your apartment rent-stabilized?"
                helperElement={
                  getRsHelperText(bldgData) && (
                    <InfoBox>{getRsHelperText(bldgData)}</InfoBox>
                  )
                }
                invalid={showErrors && localFields.rentStabilized === null}
                invalidText="Please select one"
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

            <FormStep
              step={5}
              total={NUM_STEPS}
              fieldsetRef={formStepRefs[4]}
              invalid={showErrors && localFields.housingType === null}
            >
              <FormGroup
                legendText="Is your apartment associated with any of the following?"
                helperElement={
                  getSubsidyHelperText(bldgData) && (
                    <InfoBox>{getSubsidyHelperText(bldgData)}</InfoBox>
                  )
                }
                invalid={showErrors && localFields.housingType === null}
                invalidText="Please select one"
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
              <FormStep
                step={6}
                total={NUM_STEPS}
                fieldsetRef={formStepRefs[5]}
                invalid={showErrors && localFields.portfolioSize === null}
              >
                <FormGroup
                  legendText="Does your landlord own more than 10 apartments across multiple buildings?"
                  helperElement={
                    <InfoBox>
                      {`It looks like there are ${bldgData.unitsres} apartments in your building. ` +
                        "Good Cause Eviction protections only apply to tenants whose landlords own more than 10 apartments, " +
                        "even if those apartments are spread across multiple buildings."}
                    </InfoBox>
                  }
                  invalid={showErrors && localFields.portfolioSize === null}
                  invalidText="Please select one"
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
            <Button labelText="See your results" onClick={handleSubmit} />
          </div>
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
    ? "City data shows that all apartments in your building are registered as rent stabilized."
    : new Date(end_421a) > new Date()
    ? "Your building appears to receive the 421a tax exemption. This means your apartment is rent stabilized."
    : new Date(end_j51) > new Date()
    ? "Your building appears to receive the J51 tax exemption. This means your apartment is rent stabilized."
    : rsUnits > 0
    ? `City data shows that ${formatNumber(rsUnits)} of the ${formatNumber(
        bldgUnits
      )} apartments in your building are registered as rent stabilized.`
    : yearbuilt < 1974 && bldgUnits >= 6
    ? "Based on the size and age of your building, your apartment might be rent stabilized."
    : undefined;
};

const getSubsidyHelperText = (bldgData?: BuildingData): string | undefined => {
  if (!bldgData) return undefined;
  return bldgData.is_nycha
    ? "City data shows that your building is part of NYCHA."
    : bldgData.is_subsidized
    ? `City data shows that your building is part of ${bldgData.subsidy_name}, which is considered subsidized housing.`
    : "By subsidized we mean that your apartment is affordable housing available to people with a specific income level. " +
      "This does not include vouchers that can be used anywhere to cover some or all of the your rent.";
};
