import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { FormGroup, SelectButton } from "@justfixnyc/component-library";
import { Controller } from "react-hook-form";

import {
  FormHookProps,
  isPlannedIncreaseErrors,
} from "../../../types/LetterFormTypes";
import { InfoBox } from "../../InfoBox/InfoBox";
import {
  CPI,
  CPI_EFFECTIVE_DATE,
} from "../../Pages/RentCalculator/RentIncreaseValues";
import { JFCLLinkExternal } from "../../JFCLLink";

export const PlannedIncreaseStep: React.FC<FormHookProps> = (props) => {
  const {
    control,
    watch,
    formState: { errors },
  } = props;

  const { _ } = useLingui();

  if (!isPlannedIncreaseErrors(errors, watch("reason"))) return null;

  return (
    <FormGroup
      legendText={_(
        msg`Is your landlord increasing your monthly rent beyond ${CPI + 5}%?`
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
  );
};

const IncreaseHelperText: React.FC = () => {
  const { _, i18n } = useLingui();
  return (
    <InfoBox>
      <Trans>
        For leases offered on or after {_(CPI_EFFECTIVE_DATE)}, landlords cannot
        increase rent more than {CPI + 5}% without legitimate justification. You
        can use our{" "}
        <JFCLLinkExternal to={`/${i18n.locale}/rent_calculator`}>
          rent increase calculator
        </JFCLLinkExternal>{" "}
        to learn more and determine if your landlord’s proposed rent exceeds the
        allowable rent increase amount.
      </Trans>
    </InfoBox>
  );
};
