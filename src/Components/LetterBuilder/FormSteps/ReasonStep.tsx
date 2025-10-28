import { useContext, useState } from "react";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { FormGroup, SelectButton } from "@justfixnyc/component-library";

import { InfoBox } from "../../InfoBox/InfoBox";
import Modal from "../../Modal/Modal";
import { JFCLLinkExternal } from "../../JFCLLink";
import { NextBackButtons } from "../NextBackButtons/NextBackButtons";
import { FormContext } from "../../../types/LetterFormTypes";

export const ReasonStep: React.FC = () => {
  const { formMethods } = useContext(FormContext);
  const {
    register,
    formState: { errors },
  } = formMethods;

  const { _ } = useLingui();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <FormGroup
        legendText={_(msg`Select the reason for your letter`)}
        invalid={!!errors?.reason}
        invalidText={errors?.reason?.message}
        invalidRole="status"
        helperElement={<ReasonHelperText onClick={() => setShowModal(true)} />}
      >
        <SelectButton
          {...register("reason")}
          labelText={_(msg`Your landlord is planning to raise your rent`)}
          value="PLANNED_INCREASE"
          id="reason__planned-increase"
        />
        <SelectButton
          {...register("reason")}
          labelText={_(msg`Your landlord is not offering you a new lease`)}
          value="NON_RENEWAL"
          id="reason__non-renewal"
        />
        <NextBackButtons hideButon1 />
      </FormGroup>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        hasCloseBtn={true}
        header={_(msg`How to choose the reason for your letter`)}
      >
        <div className="callout-box">
          <section>
            <Trans>
              You should select{" "}
              <strong>
                “Your landlord has recently proposed a rent increase”
              </strong>
              if any of the following apply:
            </Trans>
            <ul>
              <li>
                <Trans>
                  Your landlord has told you your rent will be increasing.
                </Trans>
              </li>
              <li>
                <Trans>
                  Your landlord has recently given you a new lease with a rent
                  increase.
                </Trans>
              </li>
              <li>
                <Trans>
                  You’ve received a{" "}
                  <JFCLLinkExternal to="https://www.nycourts.gov/legacypdfs/courts/10jd/suffolk/dist/pdf/LandlordRentIncreaseofAtLeast5PercentResidental.pdf">
                    226c notice detailing an upcoming rent increase
                  </JFCLLinkExternal>
                </Trans>
              </li>
            </ul>
          </section>
        </div>
        <div className="callout-box">
          <Trans>
            You should select{" "}
            <strong>
              “Your landlord has communicated that they do not intend to offer
              you a new lease”
            </strong>
            if any of the following apply:
          </Trans>
          <ul>
            <li>
              <Trans>
                Your landlord has told you that you will not be offered a lease
                renewal
              </Trans>
            </li>
            <li>
              <Trans>
                You’ve received a{" "}
                <JFCLLinkExternal to="https://www.nycourts.gov/legacypdfs/courts/10jd/suffolk/dist/pdf/LandlordsNoticeNotToRenewTenancyResidential.pdf">
                  226c notice stating that your lease will not be renewed
                </JFCLLinkExternal>
              </Trans>
            </li>
            <li>
              <Trans>
                You’ve received a{" "}
                <JFCLLinkExternal to="">notice of termination</JFCLLinkExternal>
              </Trans>
            </li>
          </ul>
        </div>
      </Modal>
    </>
  );
};

const ReasonHelperText: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <InfoBox>
      <>
        <Trans>Need help choosing which letter is best for you?</Trans>{" "}
        <button
          type="button"
          className="text-link-button jfcl-link"
          onClick={onClick}
        >
          <Trans>Learn more</Trans>
        </button>
      </>
    </InfoBox>
  );
};
