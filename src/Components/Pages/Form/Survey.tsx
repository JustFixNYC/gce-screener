import { ReactNode, useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { useRollbar } from "@rollbar/react";
import { Button, FormGroup, TextInput } from "@justfixnyc/component-library";

import { FormStep } from "../../FormStep/FormStep";
import { Address } from "../Home/Home";
import { useGetBuildingData, useSendGceData } from "../../../api/hooks";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import { RadioGroup } from "../../RadioGroup/RadioGroup";
import { InfoBox } from "../../InfoBox/InfoBox";
import {
  formatNumber,
  ProgressStep,
  urlFCSubsidized,
  urlWOWTimelineRS,
} from "../../../helpers";
import { cleanFormFields } from "../../../api/helpers";
import { BuildingData, GCEUser } from "../../../types/APIDataTypes";
import { Header } from "../../Header/Header";
import { BackLink } from "../../JFCLLinkInternal";
import JFCLLinkExternal from "../../JFCLLinkExternal";
import "./Survey.scss";

export type FormFields = {
  bedrooms: "STUDIO" | "1" | "2" | "3" | "4+" | null;
  rent: string | null;
  rentStabilized: "YES" | "NO" | "UNSURE" | null;
  housingType:
    | "NYCHA"
    | "SUBSIDIZED_ML"
    | "SUBSIDIZED_LIHTC"
    | "SUBSIDIZED_OTHER"
    | "SUBSIDIZED_HDFC"
    | "NONE"
    | null;
  landlord?: "YES" | "NO" | null;
  portfolioSize?: "YES" | "NO" | "UNSURE" | null;
};

// This must be in the order that the questions appear
const initialFields: FormFields = {
  bedrooms: null,
  rent: null,
  rentStabilized: null,
  housingType: null,
  landlord: null,
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
  const rollbar = useRollbar();

  // Skip live-in landlord and portfolio size questions is > 10 units
  const NUM_STEPS = !bldgData ? 4 : bldgData?.unitsres > 10 ? 4 : 6;

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
    if (import.meta.env.MODE === "production") {
      try {
        trigger({ id: user?.id, form_answers: cleanFormFields(localFields) });
      } catch {
        rollbar.error("Cannot connect to tenant platform");
      }
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
    const value = e.target.value === "" ? null : e.target.value;
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
            <InfoBox color="orange" role="alert">
              Please complete the unanswered questions before continuing.
            </InfoBox>
          )}
          <form>
            <FormStep
              fieldsetRef={formStepRefs[0]}
              invalid={showErrors && localFields.bedrooms === null}
            >
              <FormGroup
                legendText="How many bedrooms are in your apartment?"
                invalid={showErrors && localFields.bedrooms === null}
                invalidText="Please select one"
                invalidRole="status"
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
                invalidRole="status"
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
              fieldsetRef={formStepRefs[2]}
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
                invalidRole="status"
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
              fieldsetRef={formStepRefs[3]}
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
                invalidRole="status"
              >
                <RadioGroup
                  fields={localFields}
                  radioGroup={{
                    name: "housingType",
                    options: [
                      { label: "NYCHA or PACT/RAD", value: "NYCHA" },
                      { label: "Mitchell-Lama", value: "SUBSIDIZED_ML" },
                      { label: "LIHTC", value: "SUBSIDIZED_LIHTC" },
                      { label: "HDFC", value: "SUBSIDIZED_HDFC" },
                      { label: "Other", value: "SUBSIDIZED_OTHER" },
                      {
                        label: "No, my apartment is not subsidized",
                        value: "NONE",
                      },
                    ],
                  }}
                  onChange={handleRadioChange}
                />
              </FormGroup>
            </FormStep>

            {bldgData && bldgData?.unitsres <= 10 && (
              <>
                <FormStep
                  fieldsetRef={formStepRefs[4]}
                  invalid={showErrors && localFields.landlord === null}
                >
                  <FormGroup
                    legendText="Does your landlord live in the building?"
                    invalid={showErrors && localFields.landlord === null}
                    invalidText="Please select one"
                    invalidRole="status"
                  >
                    <RadioGroup
                      fields={localFields}
                      radioGroup={{
                        name: "landlord",
                        options: [
                          { label: "Yes", value: "YES" },
                          { label: "No", value: "NO" },
                        ],
                      }}
                      onChange={handleRadioChange}
                    />
                  </FormGroup>
                </FormStep>

                <FormStep
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
                    invalidRole="status"
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
              </>
            )}
          </form>
          <div className="form__buttons">
            <BackLink to="/confirm_address" className="survey__back">
              Back
            </BackLink>
            <Button
              labelText="See your results"
              size="small"
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const getRsHelperText = (bldgData?: BuildingData): ReactNode | undefined => {
  if (!bldgData) return undefined;

  const {
    post_hstpa_rs_units: rsUnits,
    unitsres: bldgUnits,
    end_421a,
    end_j51,
    yearbuilt,
    bbl,
  } = bldgData;

  const active421a = new Date(end_421a) > new Date();
  const activeJ51 = new Date(end_j51) > new Date();

  const wowLink = (
    <JFCLLinkExternal href={urlWOWTimelineRS(bbl)} className="source-link">
      View source
    </JFCLLinkExternal>
  );

  if (bldgUnits > 0 && rsUnits >= bldgUnits) {
    return (
      <>
        City data shows that all apartments in your building are registered as
        rent stabilized. <br />
        {wowLink}
      </>
    );
  } else if (active421a || activeJ51) {
    return (
      <>
        {`Your building appears to receive the ${
          activeJ51 ? "421a" : "J51"
        } tax exemption. This means your
        apartment is rent stabilized.`}
        <br />
        <JFCLLinkExternal href={urlFCSubsidized(bbl)} className="source-link">
          View source
        </JFCLLinkExternal>
      </>
    );
  } else if (rsUnits > 0) {
    return (
      <>
        {`City data shows that ${formatNumber(rsUnits)} of the ${formatNumber(
          bldgUnits
        )} apartments in your building are registered as rent stabilized.`}
        <br />
        {wowLink}
      </>
    );
  } else if (yearbuilt < 1974 && bldgUnits >= 6) {
    return "Based on the size and age of your building, your apartment might be rent stabilized.";
  } else {
    return undefined;
  }
};

const getSubsidyHelperText = (
  bldgData?: BuildingData
): ReactNode | undefined => {
  if (!bldgData) return undefined;

  const { bbl, is_nycha, is_subsidized, subsidy_name } = bldgData;

  const subsidyLink = (
    <JFCLLinkExternal href={urlFCSubsidized(bbl)} className="source-link">
      View source
    </JFCLLinkExternal>
  );

  if (is_nycha) {
    return (
      <>
        City data shows that your building is part of NYCHA.
        <br />
        {subsidyLink}
      </>
    );
  } else if (is_subsidized) {
    const subsidyLanguage =
      subsidy_name === "HUD Project-Based"
        ? "receives a HUD Project-Based subsidy"
        : subsidy_name === "Low-Income Housing Tax Credit (LIHTC)"
        ? "receives receives the Low-Income Housing Tax Credit (LIHTC)"
        : subsidy_name === "Article XI"
        ? "is an Article XI"
        : subsidy_name === "HPD Program"
        ? "is part of an HPD subsidy Program"
        : subsidy_name === "Mitchell-Lama"
        ? "is a Mitchell-Lama"
        : "";

    return (
      <>
        {`City data shows that your building ${subsidyLanguage}, which is considered subsidized housing.`}
        <br />
        {subsidyLink}
      </>
    );
  } else {
    return (
      <>
        If you applied for your apartment through Housing Connect and are unsure
        of your specific subsidy, you can select “Other.”
        <br />
        If you used a voucher that can be used anywhere to cover some or all of
        the your rent, select “No, my apartment is not subsidized.”
      </>
    );
  }
};
