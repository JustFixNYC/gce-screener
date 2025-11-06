import React from "react";
import { Button } from "@justfixnyc/component-library";
import { Trans } from "@lingui/react/macro";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";

import Modal from "../Modal/Modal";
import { LOBVerificationResponse } from "../../types/APIDataTypes";
import "./AddressConfirmationModal.scss";

interface AddressConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onBack: () => void;
  inputAddress: {
    primary_line: string;
    secondary_line?: string;
    city: string;
    state: string;
    zip_code: string;
  };
  lobAddress: LOBVerificationResponse;
  type: "undeliverable" | "better_address";
}

export const AddressConfirmationModal: React.FC<
  AddressConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  onBack,
  inputAddress,
  lobAddress,
  type,
}) => {
  const { _ } = useLingui();

  const formatAddress = () => {
    return [
      inputAddress.primary_line,
      inputAddress.secondary_line,
      `${inputAddress.city}, ${inputAddress.state} ${inputAddress.zip_code}`,
    ].filter(Boolean);
  };

  const formatLOBAddress = () => {
    return [
      lobAddress.primary_line,
      lobAddress.secondary_line,
      `${lobAddress.components.city}, ${lobAddress.components.state} ${lobAddress.components.zip_code}`,
    ].filter(Boolean);
  };

  const getModalHeader = () => {
    switch (type) {
      case "undeliverable":
        return "Public records tell us that this is not a deliverable address";
      case "better_address":
        return "Public records tell us there is a better address available";
      default:
        return "Public records tell us that there may be inaccuracies in this address";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} header={getModalHeader()}>
      <p>
        <Trans>
          Your letter still may reach the intended destination, but if you see
          any errors, please review and adjust the address.
        </Trans>
      </p>

      <div className="address-confirmation-modal__address-box">
        <div className="address-confirmation-modal__address-label">
          <Trans>Your entered address:</Trans>
        </div>
        {formatAddress().map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      {type == "better_address" && (
        <div className="address-confirmation-modal__address-box">
          <div className="address-confirmation-modal__address-label">
            <Trans>USPS verified address:</Trans>
          </div>
          {formatLOBAddress().map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      )}

      <div className="address-confirmation-modal__instructions">
        {type == "better_address" && (
          <p>
            <Trans>Select "Continue" to proceed with this address.</Trans>
          </p>
        )}
        <p>
          <Trans>Select "Back" to edit the address.</Trans>
        </p>
      </div>

      <div className="modal__buttons">
        <Button
          type="button"
          variant="secondary"
          labelText={_(msg`Back`)}
          onClick={onBack}
        />
        {type == "better_address" && (
          <Button
            type="button"
            variant="primary"
            labelText={_(msg`Continue`)}
            onClick={onConfirm}
          />
        )}
      </div>
    </Modal>
  );
};
