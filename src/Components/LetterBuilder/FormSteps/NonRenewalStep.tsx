import { useContext, useState } from "react";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
  Button,
  ButtonProps,
  FormGroup,
  SelectButton,
} from "@justfixnyc/component-library";
import { Controller } from "react-hook-form";

import {
  FormContext,
  isNonRenewalErrors,
} from "../../../types/LetterFormTypes";
import Modal from "../../Modal/Modal";
import { BackNextButtons } from "../BackNextButtons/BackNextButtons";

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

  // fix issue with type inference with this typeguard
  if (!isNonRenewalErrors(errors, watch("reason"))) return null;

  const button2Props: Partial<ButtonProps> = watch("good_cause_given")
    ? {
        type: "button",
        onClick: () => setShowModal(true),
      }
    : {};

  return (
    <>
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
        <BackNextButtons button2Props={button2Props} />
      </FormGroup>

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
              <strong>you may not be guaranteed a lease renewal.</strong>
            </Trans>
          </p>
          <p>
            <Trans>
              We still recommend continuing to send a letter asserting your Good
              Cause right to a lease renewal.
            </Trans>
          </p>
          <div>
            <Button
              variant="secondary"
              labelText={_(msg`Back`)}
              onClick={() => setShowModal(false)}
            />
            <Button labelText={_(msg`Continue`)} onClick={next} />
          </div>
        </section>
      </Modal>
    </>
  );
};
