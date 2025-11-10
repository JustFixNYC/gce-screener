import React, { useContext } from "react";
import { Button } from "@justfixnyc/component-library";
import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";

import Modal from "../Modal/Modal";
import { InfoBox } from "../InfoBox/InfoBox";
import { Deliverability } from "../../hooks/useAddressVerification";
import { LOBVerificationResponse } from "../../types/APIDataTypes";
import { FormContext } from "../../types/LetterFormTypes";
import "./AddressConfirmationModal.scss";

interface AddressConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onBack: () => void;
  lobAddress: LOBVerificationResponse;
  type: Deliverability;
}

export const AddressConfirmationModal: React.FC<
  AddressConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, onBack, lobAddress, type }) => {
  const {
    formMethods: { watch },
  } = useContext(FormContext);

  const { _ } = useLingui();

  const formatLOBAddress = () => {
    return [
      lobAddress.urbanization,
      lobAddress.primary_line,
      lobAddress.secondary_line,
      `${lobAddress.components.city}, ${lobAddress.components.state} ${lobAddress.components.zip_code}`,
    ].filter(Boolean);
  };

  const getInfoBoxText = () => {
    switch (type) {
      case "undeliverable":
        return (
          <Trans>
            USPS has flagged this address as undeliverable. Your letter may not
            be delivered if you proceed with this address. If you know of an
            alternate address for your landlord, we encourage you to use it.{" "}
          </Trans>
        );
      case "missing_unit":
        return (
          <Trans>
            USPS has flagged that this address may be missing a unit number.
            Your letter may still be delivered if you proceed with this address,
            but if you see any errors, please review and edit.
          </Trans>
        );
      case "incorrect_unit":
        return (
          <Trans>
            USPS has flagged that the unit in this address may not exist in the
            building. Your letter may still be delivered if you proceed with
            this address, but if you see any errors, please review and edit the
            address.
          </Trans>
        );
      case "unnecessary_unit":
        return (
          <Trans>
            USPS has flagged that this address does not require a unit number.
            Your letter may still be delivered if you proceed with this address,
            but if you see any errors, please review and edit the address.
          </Trans>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      header={_(
        msg`Public records tell us that there may be inaccuracies in this address`
      )}
      className="address-confirmation-modal"
    >
      <InfoBox color={type === "undeliverable" ? "orange" : "blue"}>
        {getInfoBoxText()}
      </InfoBox>

      <address>
        <div key={-1}>
          <strong>{watch("landlord_details.name")}</strong>
        </div>
        {formatLOBAddress().map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </address>

      <div className="modal__buttons">
        <Button
          type="button"
          labelText={_(msg`Edit address`)}
          onClick={onBack}
        />
        <Button
          type="button"
          variant="secondary"
          labelText={_(msg`Use this address`)}
          onClick={onConfirm}
        />
      </div>
    </Modal>
  );
};
