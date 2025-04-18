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
  buildingSubsidyLanguage,
  formatNumber,
  ProgressStep,
  urlFCSubsidized,
  urlWOWTimelineRS,
} from "../../../helpers";
import { cleanFormFields } from "../../../api/helpers";
import { BuildingData, GCEUser } from "../../../types/APIDataTypes";
import { Header } from "../../Header/Header";
import { BackLink, JFCLLinkExternal } from "../../JFCLLink";
import "./Survey.scss";
import Modal from "../../Modal/Modal";

export type FormFields = {
  bedrooms: "STUDIO" | "1" | "2" | "3" | "4+" | null;
  rent: string | null;
  rentStabilized: "YES" | "NO" | "UNSURE" | null;
  housingType: "NYCHA" | "SUBSIDIZED" | "NONE" | null;
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
  const [showSubsidyModal, setShowSubsidyModal] = useState(false);
  const toggleModalVisibility = () => setShowSubsidyModal((prev) => !prev);

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

  const { subsidyHelperText, subsidyHelperElement } = getSubsidyHelperInfo(
    bldgData,
    toggleModalVisibility
  );

  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

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
    } catch {
      rollbar.error("Cannot connect to tenant platform");
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
        subtitle="We'll use your answers and publicly available information about your building to help learn if you’re covered."
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
          <form id="survey-form" onSubmit={handleSubmit}>
            <FormStep
              fieldsetRef={formStepRefs[0]}
              invalid={showErrors && localFields.bedrooms === null}
            >
              <FormGroup
                legendText="1. How many bedrooms are in your apartment?"
                invalid={showErrors && localFields.bedrooms === null}
                invalidText="Please specify the number of bedrooms in your apartment."
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
                labelText="2. What is the total monthly rent for your entire apartment?"
                invalid={showErrors && localFields.rent === null}
                invalidText="Please enter your total rent amount."
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
                legendText="3. Is your apartment rent stabilized?"
                helperElement={
                  getRsHelperText(bldgData) && (
                    <InfoBox>{getRsHelperText(bldgData)}</InfoBox>
                  )
                }
                invalid={showErrors && localFields.rentStabilized === null}
                invalidText="Please specify if your apartment is rent stabilized."
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
                legendText="4. Is your building part of any of these subsidy programs?"
                helperElement={<InfoBox>{subsidyHelperElement}</InfoBox>}
                invalid={showErrors && localFields.housingType === null}
                invalidText="Please specify if your apartment is part of any subsidized housing programs."
                invalidRole="status"
              >
                <RadioGroup
                  fields={localFields}
                  radioGroup={{
                    name: "housingType",
                    options: [
                      { label: "Yes, NYCHA / PACT-RAD", value: "NYCHA" },
                      {
                        label: "Yes, Mitchell-Lama, HDFC, or other",
                        value: "SUBSIDIZED",
                      },
                      {
                        label: "No, my building is not subsidized",
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
                    legendText="5. Does your landlord live in the building?"
                    invalid={showErrors && localFields.landlord === null}
                    invalidText="Please specify whether your landlord lives in your apartment building."
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
                    legendText="6. Does your landlord own more than 10 apartments across multiple buildings?"
                    helperElement={
                      <InfoBox>
                        {`Publicly available data sources indicate that there ${
                          bldgData.unitsres == 1
                            ? "is 1 apartment"
                            : `are ${bldgData.unitsres} apartments`
                        } in your building. ` +
                          "Good Cause protections only apply to tenants whose landlord owns more than 10 " +
                          "apartments, even if those apartments are spread across multiple buildings."}
                      </InfoBox>
                    }
                    invalid={showErrors && localFields.portfolioSize === null}
                    invalidText="Please specify whether your landlord owns more than 10 apartments across multiple buildings."
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
              type="submit"
              form="survey-form"
              labelText="See your results"
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={showSubsidyModal}
        onClose={() => setShowSubsidyModal(false)}
        hasCloseBtn={true}
      >
        <h3>FAQs to help guide your answer</h3>
        <p>
          <strong>{subsidyHelperText}</strong> We check for NYCHA,
          Mitchell-Lama, HDFC, LIHTC, Project Section 8, and various HPD and HUD
          programs. If you know the public data is incorrect, use these tips to
          guide your answer:
        </p>
        <div className="callout-box">
          <p>
            If you applied for your apartment through “NYC Housing Connect,”
            your building is very likely subsidized, and you should select the
            option: <strong>“Yes, Mitchell-Lama, HDFC, or other”</strong>
          </p>
        </div>
        <div className="callout-box">
          <p>
            If you know that your building is part of Low-Income Housing Tax
            Credit (LIHTC) program, select the option:{" "}
            <strong>“Yes, Mitchell-Lama, HDFC, or other”</strong>
          </p>
        </div>
        <div className="callout-box">
          <p>
            If you know that your building is part of public housing (NYCHA or
            PACT-RAD), select: <strong>“Yes, NYCHA / PACT-RAD”</strong>
          </p>
        </div>
        <div className="callout-box">
          <p>
            If you know that your building receives 421a or J51 tax abatement,
            select the option:{" "}
            <strong>“No, my building is not subsidized”</strong>
          </p>
          <p>
            <i>
              Note: if your building is part of 42a or J51, your apartment
              should be rent stabilized
            </i>
          </p>
        </div>
        <div className="callout-box">
          <p>
            If you use a voucher that covers some or all of your rent, and you
            can use that voucher in another apartment if you move, select the
            option: <strong>“No, my building is not subsidized”</strong>
          </p>
        </div>
      </Modal>
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
    <JFCLLinkExternal to={urlWOWTimelineRS(bbl)} className="source-link">
      View source
    </JFCLLinkExternal>
  );

  if (active421a || activeJ51) {
    return (
      <>
        {`Publicly available data sources indicate that your building receives the ${
          active421a ? "421a" : "J51"
        } tax incentive. This means your
        apartment is rent stabilized.`}
        <br />
        <JFCLLinkExternal to={urlFCSubsidized(bbl)} className="source-link">
          View source
        </JFCLLinkExternal>
      </>
    );
  } else if (bldgUnits > 0 && rsUnits >= bldgUnits) {
    return (
      <>
        Publicly available data sources indicate that all apartments in your
        building are registered as rent stabilized. <br />
        {wowLink}
      </>
    );
  } else if (rsUnits > 0) {
    return (
      <>
        {`Publicly available data sources indicate that ${formatNumber(
          rsUnits
        )} of the ${formatNumber(
          bldgUnits
        )} apartments in your building are registered as rent stabilized.`}
        <br />
        {wowLink}
      </>
    );
  } else if (yearbuilt < 1974 && bldgUnits >= 6) {
    return (
      "No rent stabilized apartments were registered in your building in recent years, " +
      "but based on the size and age of your building some of the apartments may still be rent stabilized."
    );
  } else {
    return undefined;
  }
};

const getSubsidyHelperInfo = (
  bldgData?: BuildingData,
  learnMoreOnClick?: () => void
) => {
  let subsidyHelperText: ReactNode;
  let subsidyHelperElement: ReactNode;

  if (!bldgData) return { subsidyHelperText, subsidyHelperElement };

  const { bbl, is_nycha, is_subsidized, subsidy_name } = bldgData;

  const sourceLink = (
    <JFCLLinkExternal to={urlFCSubsidized(bbl)} className="source-link">
      View source
    </JFCLLinkExternal>
  );
  const learnMoreLink = (
    <button
      type="button"
      className="modal-link jfcl-link"
      onClick={learnMoreOnClick}
    >
      Learn more
    </button>
  );

  if (is_nycha) {
    subsidyHelperText =
      "Publicly available data sources indicate that your building is part of NYCHA.";
    subsidyHelperElement = (
      <>
        {subsidyHelperText}
        <br />
        {sourceLink}
      </>
    );
  } else if (is_subsidized) {
    subsidyHelperText = `Publicly available data sources indicate that your building ${buildingSubsidyLanguage(
      subsidy_name
    )}, which is considered subsidized housing.`;
    subsidyHelperElement = (
      <>
        {subsidyHelperText}
        <br />
        {sourceLink}
      </>
    );
  } else {
    subsidyHelperText =
      "Publicly available data sources do not indicate that your building is part of a subsidized housing program.";
    subsidyHelperElement = (
      <>
        {subsidyHelperText} {learnMoreLink}
      </>
    );
  }
  return { subsidyHelperText, subsidyHelperElement };
};
