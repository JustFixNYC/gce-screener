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

interface VerificationResult {
  needsConfirmation: boolean;
  data?: {
    inputAddress: LobAddressFields;
    lobAddress: LOBVerificationResponse;
  };
  isDeliverable?: boolean;
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

      // Does not include cases of missing unit, incorrect unit, or unnecessary unit
      const isUndeliverable =
        verification.deliverability == "undeliverable" &&
        !verification.valid_address;

      const inputAddress =
        addressData.urbanization +
        addressData.primary_line +
        addressData.secondary_line +
        addressData.city +
        addressData.state +
        addressData.zip_code;
      const lobAddress =
        verification.urbanization +
        verification.primary_line +
        verification.components.city +
        verification.components.state +
        verification.components.zip_code;
      const hasBetterAddress = inputAddress !== lobAddress;

      if (isUndeliverable || hasBetterAddress) {
        setVerificationState({
          status: "needs_confirmation",
          data: { inputAddress: addressData, lobAddress: verification },
        });
        return {
          needsConfirmation: true,
          data: { inputAddress: addressData, lobAddress: verification },
          isDeliverable: !isUndeliverable,
        };
      }

      setVerificationState({ status: "confirmed" });
      return { needsConfirmation: false, isDeliverable: true };
    } catch (error) {
      console.error("Unable to check address deliverability: ", error);
      setVerificationState({ status: "rejected" });
      return { needsConfirmation: false, isDeliverable: false };
    }
  };

  const confirmAddress = async (useLobAddress: boolean): Promise<boolean> => {
    if (!verificationState.data) return false;

    const { inputAddress, lobAddress } = verificationState.data;
    let finalAddress;
    if (useLobAddress) {
      finalAddress = {
        primary_line: lobAddress.primary_line,
        secondary_line: lobAddress.secondary_line,
        city: lobAddress.components.city,
        state: lobAddress.components.state,
        urbanization: lobAddress.urbanization,
        zip_code: lobAddress.components.zip_code,
      };
    } else {
      finalAddress = {
        primary_line: inputAddress.primary_line,
        secondary_line: inputAddress.secondary_line,
        city: inputAddress.city,
        state: inputAddress.state,
        urbanization: inputAddress.urbanization,
        zip_code: inputAddress.zip_code,
      };
    }

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
    if (!finalAddress.secondary_line) {
      setValue("landlord_details.no_unit", true, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
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

    if (finalAddress.urbanization) {
      setValue("landlord_details.urbanization", finalAddress.urbanization, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

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
