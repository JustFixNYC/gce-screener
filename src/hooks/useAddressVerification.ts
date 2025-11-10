import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { Tenants2ApiFetcherVerifyAddress } from "../api/helpers";
import { FormFields, LobAddressFields } from "../types/LetterFormTypes";
import { LOBVerificationResponse } from "../types/APIDataTypes";

interface AddressVerificationState {
  status:
    | "idle"
    | "verifying"
    | "needs_confirmation"
    | "confirmed"
    | "rejected";
  data?: {
    inputAddress: LobAddressFields;
    lobAddress: LOBVerificationResponse;
  };
}

export type Deliverability =
  | "deliverable"
  | "undeliverable"
  | "missing_unit"
  | "incorrect_unit"
  | "unnecessary_unit";

interface VerificationResult {
  needsConfirmation: boolean;
  data?: {
    inputAddress: LobAddressFields;
    lobAddress: LOBVerificationResponse;
  };
  deliverability?: Deliverability;
}

export const useAddressVerification = (
  formMethods: UseFormReturn<FormFields>
) => {
  const [verificationState, setVerificationState] =
    useState<AddressVerificationState>({
      status: "idle",
    });

  const {
    setValue,
    trigger,
    formState: { errors },
  } = formMethods;

  const verifyAndConfirm = async (
    addressData: LobAddressFields
  ): Promise<VerificationResult> => {
    setVerificationState({ status: "verifying" });

    try {
      const verification = await Tenants2ApiFetcherVerifyAddress(
        "/gceletter/verify_address",
        { arg: addressData }
      );

      console.log(verification);

      const deliverability: Deliverability =
        verification.deliverability === "undeliverable" &&
        verification.valid_address === false
          ? "undeliverable"
          : verification.deliverability === "deliverable_missing_unit"
          ? "missing_unit"
          : verification.deliverability === "deliverable_incorrect_unit"
          ? "incorrect_unit"
          : verification.deliverability === "deliverable_unnecessary_unit"
          ? "unnecessary_unit"
          : "deliverable";

      if (deliverability !== "deliverable") {
        setVerificationState({
          status: "needs_confirmation",
          data: { inputAddress: addressData, lobAddress: verification },
        });
        return {
          needsConfirmation: true,
          data: { inputAddress: addressData, lobAddress: verification },
          deliverability: deliverability,
        };
      }

      setVerificationState({ status: "confirmed" });
      return { needsConfirmation: false, deliverability };
    } catch (error) {
      console.error("Unable to check address deliverability: ", error);
      setVerificationState({ status: "rejected" });
      return { needsConfirmation: false, deliverability: "undeliverable" };
    }
  };

  const confirmAddress = async (): Promise<boolean> => {
    if (!verificationState.data) return false;

    const { lobAddress } = verificationState.data;

    const finalAddress = {
      primary_line: lobAddress.primary_line,
      secondary_line: lobAddress.secondary_line,
      city: lobAddress.components.city,
      state: lobAddress.components.state,
      urbanization: lobAddress.urbanization,
      zip_code: lobAddress.components.zip_code,
    };

    setValue("landlord_details.primary_line", finalAddress.primary_line, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(
      "landlord_details.secondary_line",
      finalAddress.secondary_line || "",
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
    setValue("landlord_details.no_unit", !finalAddress.secondary_line, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("landlord_details.city", finalAddress.city, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("landlord_details.state", finalAddress.state, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("landlord_details.zip_code", finalAddress.zip_code, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("landlord_details.urbanization", finalAddress.urbanization, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const isValid = await trigger(["landlord_details"]);
    if (!isValid) console.warn(errors.landlord_details);

    setVerificationState({ status: "confirmed" });
    return isValid;
  };

  const resetVerification = () => {
    setVerificationState({ status: "idle" });
  };

  return {
    verifyAndConfirm,
    confirmAddress,
    resetVerification,
    verificationState,
  };
};
