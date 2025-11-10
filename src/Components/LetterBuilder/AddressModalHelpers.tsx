import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { FormFields, LobAddressFields } from "../../types/LetterFormTypes";
import {
  Deliverability,
  useAddressVerification,
} from "../../hooks/useAddressVerification";
import { AddressConfirmationModal } from "../AddressConfirmationModal/AddressConfirmationModal";

interface AddressModalHelpersProps {
  formMethods: UseFormReturn<FormFields>;
  onAddressConfirmed: () => void;
}

export const useAddressModalHelpers = ({
  formMethods,
  onAddressConfirmed,
}: AddressModalHelpersProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<Deliverability | null>(null);

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
    console.log(result);

    if (!(result.needsConfirmation && result.data)) {
      return result.deliverability !== "undeliverable" || false;
    }

    if (!result.deliverability) return false;
    if (result.deliverability === "deliverable") return true;

    // Set the modal type based on the verification result
    setModalType(result.deliverability);
    setIsModalOpen(true);
    return false; // Don't proceed to next step
  };

  // Address confirmation modal handlers
  const handleAddressConfirm = async () => {
    const isValid = await confirmAddress();

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
        lobAddress={verificationState.data.lobAddress}
        type={modalType}
      />
    ) : null;

  return {
    handleAddressVerification,
    addressConfirmationModal,
  };
};
