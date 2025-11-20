import React, { useContext } from "react";
import { Button } from "@justfixnyc/component-library";
import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";

import Modal from "../Modal/Modal";
import { InfoBox } from "../InfoBox/InfoBox";
import { FormContext } from "../../types/LetterFormTypes";
import { FormattedLandlordAddress } from "../LetterBuilder/FormSteps/LandlordDetailsStep";
import { Deliverability } from "../LetterBuilder/landlordAddressHelpers";
import "./AddressConfirmationModal.scss";

interface AddressConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: Deliverability;
}

export const AddressConfirmationModal: React.FC<
  AddressConfirmationModalProps
> = ({ isOpen, onClose, type }) => {
  const {
    formMethods: { watch },
  } = useContext(FormContext);

  const { _ } = useLingui();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={_(msg`There may be inaccuracies in this address`)}
      className="address-confirmation-modal"
    >
      <InfoBox color={type === "undeliverable" ? "orange" : "blue"}>
        {getInfoBoxText(type)}
      </InfoBox>

      <FormattedLandlordAddress landlordDetails={watch("landlord_details")} />

      <div className="modal__buttons">
        <Button
          type="button"
          labelText={_(msg`Edit address`)}
          onClick={onClose}
        />
        <Button
          type="submit"
          variant="secondary"
          labelText={_(msg`Use this address`)}
        />
      </div>
    </Modal>
  );
};

const getInfoBoxText = (modalType?: Deliverability) => {
  switch (modalType) {
    case "undeliverable":
      return (
        <Trans>
          USPS has flagged this address as undeliverable. Your letter may not be
          delivered if you proceed with this address. If you know of an
          alternate address for your landlord, we encourage you to use it.{" "}
        </Trans>
      );
    case "missing_unit":
      return (
        <Trans>
          USPS has flagged that this address may be missing a unit number. Your
          letter may still be delivered if you proceed with this address, but
          please review and edit if you see any errors.
        </Trans>
      );
    case "incorrect_unit":
      return (
        <Trans>
          USPS has flagged that the unit in this address may not exist in the
          building. Your letter may still be delivered if you proceed with this
          address, but please review and edit if you see any errors.
        </Trans>
      );
    case "unnecessary_unit":
      return (
        <Trans>
          USPS has flagged that this address does not require a unit number.
          Your letter may still be delivered if you proceed with this address,
          but please review and edit if you see any errors.
        </Trans>
      );
    default:
      return <></>;
  }
};
