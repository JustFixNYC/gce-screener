import { ReactNode, useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { useRollbar } from "@rollbar/react";
import { Button, FormGroup, TextInput } from "@justfixnyc/component-library";
import { Trans } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";

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
import Modal, { RentStabLeaseModal } from "../../Modal/Modal";

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
  const { _ } = useLingui();
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
  const [showLeaseModal, setShowLeaseModal] = useState(false);
  const openLeaseModal = () => setShowLeaseModal(true);
  const openSubsidyModal = () => setShowSubsidyModal(true);

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
    openSubsidyModal
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
        title={_(msg`A few questions about your apartment`)}
        subtitle={_(
          msg`We’ll use your answers and publicly available information about your building to help learn if you’re covered.`
        )}
        address={address}
        lastStepReached={lastStepReached}
      />
      <div className="content-section">
        <div className="content-section__content">
          {showErrors && (
            <InfoBox color="orange" role="alert">
              <Trans>
                Please complete the unanswered questions before continuing.
              </Trans>
            </InfoBox>
          )}
          <form id="survey-form" onSubmit={handleSubmit}>
            <FormStep
              fieldsetRef={formStepRefs[0]}
              invalid={showErrors && localFields.bedrooms === null}
            >
              <FormGroup
                legendText={_(msg`1. How many bedrooms are in your apartment?`)}
                invalid={showErrors && localFields.bedrooms === null}
                invalidText={_(
                  msg`Please specify the number of bedrooms in your apartment.`
                )}
                invalidRole="status"
              >
                <RadioGroup
                  fields={localFields}
                  radioGroup={{
                    name: "bedrooms",
                    options: [
                      { label: _(msg`Studio`), value: "STUDIO" },
                      { label: _(msg`1`), value: "1" },
                      { label: _(msg`2`), value: "2" },
                      { label: _(msg`3`), value: "3" },
                      { label: _(msg`4+`), value: "4+" },
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
                labelText={_(
                  msg`2. What is the total monthly rent for your entire apartment?`
                )}
                invalid={showErrors && localFields.rent === null}
                invalidText={_(msg`Please enter your total rent amount.`)}
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
                  setTimeout(() => e?.currentTarget?.focus(), 0);
                }}
              />
            </FormStep>

            <FormStep
              fieldsetRef={formStepRefs[2]}
              invalid={showErrors && localFields.rentStabilized === null}
            >
              <FormGroup
                legendText={_(msg`3. Is your apartment rent stabilized?`)}
                helperElement={
                  getRsHelperText(bldgData, openLeaseModal) && (
                    <InfoBox>
                      {getRsHelperText(bldgData, openLeaseModal)}
                    </InfoBox>
                  )
                }
                invalid={showErrors && localFields.rentStabilized === null}
                invalidText={_(
                  msg`Please specify if your apartment is rent stabilized.`
                )}
                invalidRole="status"
              >
                <RadioGroup
                  fields={localFields}
                  radioGroup={{
                    name: "rentStabilized",
                    options: [
                      { label: _(msg`Yes`), value: "YES" },
                      { label: _(msg`No`), value: "NO" },
                      { label: _(msg`I'm not sure`), value: "UNSURE" },
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
                legendText={_(
                  msg`4. Is your building part of any of these subsidy programs?`
                )}
                helperElement={<InfoBox>{subsidyHelperElement}</InfoBox>}
                invalid={showErrors && localFields.housingType === null}
                invalidText={_(
                  msg`Please specify if your apartment is part of any subsidized housing programs.`
                )}
                invalidRole="status"
              >
                <RadioGroup
                  fields={localFields}
                  radioGroup={{
                    name: "housingType",
                    options: [
                      { label: _(msg`Yes, NYCHA / PACT-RAD`), value: "NYCHA" },
                      {
                        label: _(msg`Yes, Mitchell-Lama, HDFC, or other`),
                        value: "SUBSIDIZED",
                      },
                      {
                        label: _(msg`No, my building is not subsidized`),
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
                    legendText={_(
                      msg`5. Does your landlord live in the building?`
                    )}
                    invalid={showErrors && localFields.landlord === null}
                    invalidText={_(
                      msg`Please specify whether your landlord lives in your apartment building.`
                    )}
                    invalidRole="status"
                  >
                    <RadioGroup
                      fields={localFields}
                      radioGroup={{
                        name: "landlord",
                        options: [
                          { label: _(msg`Yes`), value: "YES" },
                          { label: _(msg`No`), value: "NO" },
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
                    legendText={_(
                      msg`6. Does your landlord own more than 10 apartments across multiple buildings?`
                    )}
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
                    invalidText={_(
                      msg`Please specify whether your landlord owns more than 10 apartments across multiple buildings.`
                    )}
                    invalidRole="status"
                  >
                    <RadioGroup
                      fields={localFields}
                      radioGroup={{
                        name: "portfolioSize",
                        options: [
                          { label: _(msg`Yes`), value: "YES" },
                          { label: _(msg`No`), value: "NO" },
                          { label: _(msg`I'm not sure`), value: "UNSURE" },
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
              <Trans>Back</Trans>
            </BackLink>
            <Button
              type="submit"
              form="survey-form"
              labelText={_(msg`See your results`)}
            />
          </div>
        </div>
      </div>

      <RentStabLeaseModal
        isOpen={showLeaseModal}
        onClose={() => setShowLeaseModal(false)}
        hasCloseBtn={true}
        header={_(msg`To help guide your answer`)}
      />
      <Modal
        isOpen={showSubsidyModal}
        onClose={() => setShowSubsidyModal(false)}
        hasCloseBtn={true}
        header={_(msg`FAQs to help guide your answer`)}
      >
        <p>
          <strong>{subsidyHelperText}</strong>{" "}
          <Trans>
            We check for NYCHA, Mitchell-Lama, HDFC, LIHTC, Project Section 8,
            and various HPD and HUD programs. If you know the public data is
            incorrect, use these tips to guide your answer:
          </Trans>
        </p>
        <div className="callout-box">
          <p>
            <Trans>
              If you applied for your apartment through "NYC Housing Connect,"
              your building is very likely subsidized, and you should select the
              option: <strong>“Yes, Mitchell-Lama, HDFC, or other”</strong>
            </Trans>
          </p>
        </div>
        <div className="callout-box">
          <p>
            <Trans>
              If you know that your building is part of Low-Income Housing Tax
              Credit (LIHTC) program, select the option:{" "}
              <strong>“Yes, Mitchell-Lama, HDFC, or other”</strong>{" "}
            </Trans>
          </p>
        </div>
        <div className="callout-box">
          <p>
            <Trans>
              If you know that your building is part of public housing (NYCHA or
              PACT-RAD), select: <strong>"NYCHA or PACT/RAD"</strong>
            </Trans>
          </p>
        </div>
        <div className="callout-box">
          <p>
            <Trans>
              If you know that your building receives 421a or J51 tax abatement,
              select the option:
              <strong>“No, my building is not subsidized”</strong>
            </Trans>
          </p>
          <p>
            <i>
              <Trans>
                Note: if your building is part of 421a or J51, your apartment
                should be rent stabilized
              </Trans>
            </i>
          </p>
        </div>
        <div className="callout-box">
          <p>
            <Trans>
              If you use a voucher that covers some or all of your rent, and you
              can use that voucher in another apartment if you move, select the
              option: <strong>“No, my building is not subsidized”</strong>
            </Trans>
          </p>
        </div>
      </Modal>
    </div>
  );
};

const getRsHelperText = (
  bldgData?: BuildingData,
  learnMoreOnClick?: () => void
): ReactNode | undefined => {
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
      <Trans>View source</Trans>
    </JFCLLinkExternal>
  );
  const leaseText = (
    <>
      <Trans>
        If your most recent lease renewal{" "}
        <button
          type="button"
          className="text-link-button jfcl-link"
          onClick={learnMoreOnClick}
        >
          looks like this
        </button>
        , then your apartment is likely rent stabilized.
      </Trans>
    </>
  );

  if (active421a || activeJ51) {
    return (
      <>
        <Trans>
          Publicly available data sources indicate that your building receives
          the {active421a ? "421a" : "J51"} tax incentive. This means your
          apartment is rent stabilized.
        </Trans>{" "}
        <JFCLLinkExternal to={urlFCSubsidized(bbl)} className="source-link">
          <Trans>View source</Trans>
        </JFCLLinkExternal>
      </>
    );
  } else if (bldgUnits > 0 && rsUnits >= bldgUnits) {
    return (
      <>
        <Trans>
          Publicly available data sources indicate that all apartments in your
          building are registered as rent stabilized.
        </Trans>{" "}
        {wowLink}
      </>
    );
  } else if (rsUnits > 0) {
    return (
      <>
        <Trans>
          Publicly available data sources indicate that {formatNumber(rsUnits)}{" "}
          of the {formatNumber(bldgUnits)} apartments in your building are
          registered as rent stabilized.
        </Trans>{" "}
        {wowLink} {leaseText}
      </>
    );
  } else if (yearbuilt < 1974 && bldgUnits >= 6) {
    return (
      <>
        <Trans>
          No rent stabilized apartments were registered in your building in
          recent years, but based on the size and age of your building some of
          the apartments may still be rent stabilized.
        </Trans>{" "}
        {leaseText}
      </>
    );
  } else if (yearbuilt >= 1974 && bldgUnits < 6) {
    // Start of NOT Rent Stabilized helper text cases
    return (
      <>
        <Trans>
          Because your building has fewer than 6 units and was built after 1974,
          it is very unlikely that your apartment is rent stabilized.
          Additionally, based on publicly available data, no rent stabilized
          apartments were registered in your building in recent years.
        </Trans>
      </>
    );
  } else if (yearbuilt >= 1974 && !(active421a || activeJ51)) {
    return (
      <>
        <Trans>
          Because your building was built after 1974 and is not part of 421a or
          J51 tax incentive programs, it is very unlikely that your apartment is
          rent stabilized. Additionally, based on publicly available, no rent
          stabilized apartments were registered in your building in recent
          years.
        </Trans>
      </>
    );
  } else if (bldgUnits < 6) {
    return (
      <>
        <Trans>
          Because your building has fewer than 6 units it is very unlikely that
          your apartment is rent stabilized. Additionally, based on publicly
          available, no rent stabilized apartments were registered in your
          building in recent years.
        </Trans>
      </>
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
      <Trans>View source</Trans>
    </JFCLLinkExternal>
  );
  const learnMoreLink = (
    <button
      type="button"
      className="text-link-button jfcl-link"
      onClick={learnMoreOnClick}
    >
      <Trans>Learn more</Trans>
    </button>
  );

  if (is_nycha) {
    subsidyHelperText = (
      <Trans>
        Publicly available data sources indicate that your building is part of
        NYCHA.
      </Trans>
    );
    subsidyHelperElement = (
      <>
        {subsidyHelperText} {sourceLink}
      </>
    );
  } else if (is_subsidized) {
    subsidyHelperText = (
      <Trans>
        Publicly available data sources indicate that your building{" "}
        {buildingSubsidyLanguage(subsidy_name)}, which is considered subsidized
        housing.
      </Trans>
    );
    subsidyHelperElement = (
      <>
        {subsidyHelperText} {sourceLink}
      </>
    );
  } else {
    subsidyHelperText = (
      <Trans>
        Publicly available data sources do not indicate that your building is
        part of a subsidized housing program.
      </Trans>
    );
    subsidyHelperElement = (
      <>
        {subsidyHelperText} {learnMoreLink}
      </>
    );
  }
  return { subsidyHelperText, subsidyHelperElement };
};
