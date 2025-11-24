import { useContext } from "react";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { FormGroup, SelectButton } from "@justfixnyc/component-library";
import { Controller } from "react-hook-form";

import {
  FormContext,
  isPlannedIncreaseErrors,
} from "../../../types/LetterFormTypes";
import { InfoBox } from "../../InfoBox/InfoBox";
import {
  CPI,
  CPI_EFFECTIVE_DATE,
} from "../../Pages/RentCalculator/RentIncreaseValues";
import { JFCLLinkExternal } from "../../JFCLLink";
import { BackNextButtons } from "../BackNextButtons/BackNextButtons";
import { StepRouteName } from "../LetterSteps";
import { LetterStepForm } from "../LetterBuilderForm";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import "./FormSteps.scss";

export const PlannedIncreaseStep: React.FC = () => {
  const {
    currentStep,
    formMethods: {
      control,
      watch,
      formState: { errors },
    },
  } = useContext(FormContext);

  const { _ } = useLingui();

  // fixes issue with type inference with this typeguard
  if (!isPlannedIncreaseErrors(errors, watch("reason"))) return null;

  const nextStep: StepRouteName | undefined =
    watch("unreasonable_increase") === true
      ? "contact_info"
      : watch("unreasonable_increase") === false
      ? "allowed_increase"
      : undefined;

  return (
    <>
      <ProgressBar {...currentStep} />
      <div className="reason-details-step">
        <LetterStepForm nextStep={nextStep}>
          <FormGroup
            legendText={_(
              msg`Is your landlord increasing your monthly rent more than ${
                CPI + 5
              }%?`
            )}
            invalid={!!errors?.unreasonable_increase}
            invalidText={errors?.unreasonable_increase?.message}
            invalidRole="status"
            helperElement={<IncreaseHelperText />}
          >
            <Controller
              name="unreasonable_increase"
              control={control}
              render={({ field }) => (
                <SelectButton
                  {...field}
                  value="true"
                  checked={field.value === true}
                  onChange={() => field.onChange(true)}
                  labelText={_(msg`Yes`)}
                  id="reason-verified__yes"
                />
              )}
            />
            <Controller
              name="unreasonable_increase"
              control={control}
              render={({ field }) => (
                <SelectButton
                  {...field}
                  value="false"
                  checked={field.value === false}
                  onChange={() => field.onChange(false)}
                  labelText={_(msg`No`)}
                  id="reason-verified__no"
                />
              )}
            />
          </FormGroup>
          <BackNextButtons backStepName="reason" />
        </LetterStepForm>
      </div>
    </>
  );
};

const IncreaseHelperText: React.FC = () => {
  const { _, i18n } = useLingui();
  return (
    <InfoBox>
      <Trans>
        For leases offered after {_(CPI_EFFECTIVE_DATE)}, landlords cannot
        increase rent more than {CPI + 5}% without legitimate justification. You
        can use our{" "}
        <JFCLLinkExternal to={`/${i18n.locale}/rent_calculator`}>
          rent increase calculator
        </JFCLLinkExternal>{" "}
        to determine if your landlord’s proposed rent exceeds {CPI + 5}% .
      </Trans>
    </InfoBox>
  );
};
