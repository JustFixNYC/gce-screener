import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { FormGroup, SelectButton } from "@justfixnyc/component-library";
import { Controller } from "react-hook-form";

import {
  FormHookProps,
  isNonRenewalErrors,
} from "../../../types/LetterFormTypes";
import "./FormSteps.scss";

export const NonRenewalStep: React.FC<FormHookProps> = (props) => {
  const {
    control,
    watch,
    formState: { errors },
  } = props;

  const { _ } = useLingui();

  if (!isNonRenewalErrors(errors, watch("reason"))) return null;

  return (
    <FormGroup
      legendText={_(
        msg`Has your landlord provided any of the following reasons for ending your tenancy?`
      )}
      invalid={!!errors?.good_cause_given}
      invalidText={errors?.good_cause_given?.message}
      invalidRole="status"
    >
      <ul>
        <li>
          <Trans>Non payment of rent</Trans>
        </li>
        <li>
          <Trans>Lease violations</Trans>
        </li>
        <li>
          <Trans>Nuisance activity</Trans>
        </li>
        <li>
          <Trans>Illegal Activity</Trans>
        </li>
        <li>
          <Trans>Landlord personal use/removal from market</Trans>
        </li>
        <li>
          <Trans>Demolition</Trans>
        </li>
        <li>
          <Trans>
            Failure to sign lease renewal or provide access to apartment
          </Trans>
        </li>
      </ul>
      <Controller
        name="good_cause_given"
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
        name="good_cause_given"
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
