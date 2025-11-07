import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";

import { FormFields, LobAddressFields } from "../../types/LetterFormTypes";
import { useAddressVerification } from "../../hooks/useAddressVerification";
import {
  AddressConfirmationModal,
  AddressModalType,
} from "../AddressConfirmationModal/AddressConfirmationModal";

interface AddressModalHelpersProps {
  formMethods: UseFormReturn<FormFields>;
  onAddressConfirmed: () => void;
}

export const useAddressModalHelpers = ({
  formMethods,
  onAddressConfirmed,
}: AddressModalHelpersProps) => {
  const { setError } = formMethods;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<AddressModalType | null>(null);
  const { _ } = useLingui();

  const {
    verifyAndConfirm,
    confirmAddress,
    resetVerification,
    verificationState,
  } = useAddressVerification(formMethods);

  const handleAddressVerification = async (
    data: LobAddressFields
  ): Promise<boolean> => {
    const result = await verifyAndConfirm(data);

    if (!(result.needsConfirmation && result.data)) {
      return result.isDeliverable || false;
    }

    // Set the modal type based on the verification result
    if (!result.isDeliverable) {
      setError("landlord_details", {
        type: "lob_verification",
        message: _(msg`Landlord address as entered is not deliverable by USPS`),
      });
      setModalType("undeliverable");
    } else {
      const inputAddress =
        data.primary_line +
        data.secondary_line +
        data.city +
        data.state +
        data.zip_code;
      const lobAddress =
        result.data.lobAddress.primary_line +
        result.data.lobAddress.components.city +
        result.data.lobAddress.components.state +
        result.data.lobAddress.components.zip_code;
      const hasBetterAddress = inputAddress !== lobAddress;

      if (hasBetterAddress) {
        setModalType("better_address");
      }
    }

    setIsModalOpen(true);
    return false; // Don't proceed to next step
  };

  // Address confirmation modal handlers
  const handleAddressConfirm = async () => {
    const useLobAddress = modalType === "better_address";
    const isValid = await confirmAddress(useLobAddress);

    setIsModalOpen(false);

    if (isValid) {
      // Call the callback to advance to next step
      onAddressConfirmed();
    }
  };

  const handleAddressBack = () => {
    setIsModalOpen(false);
    resetVerification();
  };

  const handleAddressModalClose = () => {
    setIsModalOpen(false);
    resetVerification();
  };

  const addressConfirmationModal =
    verificationState.data && modalType ? (
      <AddressConfirmationModal
        isOpen={isModalOpen}
        onClose={handleAddressModalClose}
        onConfirm={handleAddressConfirm}
        onBack={handleAddressBack}
        inputAddress={verificationState.data.inputAddress}
        lobAddress={verificationState.data.lobAddress}
        type={modalType}
      />
    ) : null;

  return {
    handleAddressVerification,
    addressConfirmationModal,
  };
};
