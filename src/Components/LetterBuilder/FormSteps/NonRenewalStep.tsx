import { useContext, useState } from "react";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Button, FormGroup, SelectButton } from "@justfixnyc/component-library";
import { Controller } from "react-hook-form";

import {
  FormContext,
  isNonRenewalErrors,
} from "../../../types/LetterFormTypes";
import Modal from "../../Modal/Modal";
import { BackNextButtons } from "../BackNextButtons/BackNextButtons";
import { LetterStepForm } from "../LetterBuilderForm";
import "./FormSteps.scss";
import "./NonRenewalStep.scss";

export const NonRenewalStep: React.FC = () => {
  const {
    formMethods: {
      control,
      watch,
      formState: { errors },
    },
    next,
  } = useContext(FormContext);

  const { _ } = useLingui();
  const [showModal, setShowModal] = useState(false);

  // fixes issue with type inference with this typeguard
  if (!isNonRenewalErrors(errors, watch("reason"))) return null;

  const onSubmit =
    watch("good_cause_given") && !showModal
      ? () => setShowModal(true)
      : () => next("contact_info");

  return (
    <LetterStepForm onSubmit={onSubmit} className="non-renewal-step">
      <FormGroup
        legendText={_(
          msg`Has your landlord provided any of the following reasons for not offering you a new lease?`
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
            <Trans>Removal of apartment from market</Trans>
          </li>
          <li>
            <Trans>Demolition</Trans>
          </li>
          <li>
            <Trans>
              Failure to sign new lease or provide access to apartment
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
      <BackNextButtons backStepName="reason" />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        hasCloseBtn={true}
        header={_(msg`Something to know`)}
      >
        <section>
          <p>
            <Trans>
              You’ve shared that your landlord has provided a reason for ending
              your tenancy. If the reason that your landlord provided is
              legitimate,{" "}
              <strong>you may not be guaranteed a new lease by law.</strong>
            </Trans>
          </p>
          <p>
            <Trans>
              But we still recommend continuing to send this letter because your
              landlord may still listen to your demand for a new lease.
            </Trans>
          </p>
          <div className="buttons">
            <Button
              variant="secondary"
              labelText={_(msg`Back`)}
              onClick={() => setShowModal(false)}
            />
            <Button labelText={_(msg`Continue`)} type="submit" />
          </div>
        </section>
      </Modal>
    </LetterStepForm>
  );
};
