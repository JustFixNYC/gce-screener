import { useState } from "react";
import { FieldPath, Resolver, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@justfixnyc/component-library";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";

import { handleFormNoDefault } from "../../form-utils";
import { Tenants2ApiFetcherVerifyAddress } from "../../api/helpers";
import { ProgressBar } from "./ProgressBar/ProgressBar";
import { FormFields, FormSchema } from "../../types/LetterFormTypes";
import { LandlordDetailsStep } from "./FormSteps/LandlordDetailsStep";
import { UserDetailsStep } from "./FormSteps/UserDetailsStep";
import { UserAddressStep } from "./FormSteps/UserAddressStep";
import { MailChoiceStep } from "./FormSteps/MailChoiceStep";
import { PreviewStep } from "./FormSteps/PreviewStep";
import { buildLetterHtml } from "./Letter/letter-utils";
import {
  GCELetterConfirmation,
  GCELetterPostData,
} from "../../types/APIDataTypes";
import { useSendGceLetterData } from "../../api/hooks";
import { ConfirmationStep } from "./FormSteps/ConfirmationStep";
import { EmailChoiceStep } from "./FormSteps/EmailChoiceStep";

interface Step {
  id: string;
  name: string;
  fields?: FieldPath<FormFields>[];
}

// TODO: refactor to include step component and/or submission function?
const steps: Step[] = [
  {
    id: "Step 1",
    name: "Contact information",
    fields: [
      "user_details.email",
      "user_details.phone_number",
      "user_details.first_name",
      "user_details.last_name",
    ],
  },
  {
    id: "Step 2",
    name: "Your address",
    fields: [
      "user_details.primary_line",
      "user_details.secondary_line",
      "user_details.city",
      "user_details.state",
      "user_details.zip_code",
      "user_details.bbl",
    ],
  },
  {
    id: "Step 3",
    name: "Landlord details",
    fields: ["landlord_details"],
  },
  { id: "Step 4", name: "Mail Choice" },
  {
    id: "Step 5",
    name: "Email Choice",
    fields: ["email_to_landlord", "landlord_details.email"],
  },
  { id: "Step 6", name: "Preview" },
  { id: "Step 7", name: "Confirmation" },
];

export const LetterBuilderForm: React.FC = () => {
  const { _ } = useLingui();
  const formHookReturn = useForm<FormFields>({
    // Issue with the inferred type being "unknown" when preprocess() is used to
    // handle values that should be changed to undefined
    resolver: zodResolver(FormSchema) as Resolver<FormFields>,
    mode: "onSubmit",
  });
  const { reset, trigger, handleSubmit, setError, getValues } = formHookReturn;

  const [currentStep, setCurrentStep] = useState(0);

  const processForm: SubmitHandler<FormFields> = (data: FormFields) => {
    console.log({ data });
    reset();
  };

  // TODO: refactor to include this within the step if possible
  const verifyAddressDeliverable = async (
    data: Omit<FormFields["landlord_details"], "name" | "email">
  ): Promise<boolean | undefined> => {
    try {
      const verification = await Tenants2ApiFetcherVerifyAddress(
        "/gceletter/verify_address",
        { arg: data }
      );
      const isUndeliverable =
        verification.deliverability !== "deliverable" &&
        !verification.valid_address;
      if (isUndeliverable) {
        setError("landlord_details", {
          type: "lob_verification",
          message: "Landlord address as entered is not deliverable by USPS",
        });
        return false;
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Unable to check address deliverability: ", error);
      return;
    }
    return true;
  };

  const { trigger: sendLetter } = useSendGceLetterData();

  const [letterResp, setLetterResp] = useState<GCELetterConfirmation>();
  const onLetterSubmit = async () => {
    const letterData = getValues();
    const letterHtml = await buildLetterHtml(letterData, "en", true);
    const letterPostData: GCELetterPostData = {
      ...letterData,
      html_content: letterHtml,
    };
    const resp = await sendLetter(letterPostData);
    setLetterResp(resp);
    return resp;
  };

  // console.log({ landlordDetails: watch("landlord_details") });

  const next = async () => {
    const fields = steps[currentStep].fields;

    // console.log(FormSchema.safeParse(getValues()));
    if (fields) {
      const output = await trigger(fields, { shouldFocus: true });
      console.log({ output });
      if (!output) return;
    }

    if (steps[currentStep].name === "Landlord details") {
      // TODO: need to change how steps work when the landlord details step can
      // have two sub-steps (lookup address then manual enter)
      const isDeliverable = await verifyAddressDeliverable(
        getValues("landlord_details")
      );
      if (!isDeliverable) {
        return;
      }
    }

    if (steps[currentStep].name === "Preview") {
      console.log("submit");
      const resp = await onLetterSubmit();
      if (!resp) {
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)();
      }
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <form onSubmit={handleFormNoDefault(next)} className="letter-form">
      <h3>
        <Trans>Good Cause Letter Builder</Trans>
      </h3>
      <p>
        <Trans>
          Send a letter to your landlord via certified mail asserting your Good
          Cause
        </Trans>
      </p>
      <ProgressBar steps={steps} currentStep={currentStep} />
      <div className="letter-form__content">
        {currentStep === 0 && <UserDetailsStep {...formHookReturn} />}
        {currentStep === 1 && <UserAddressStep {...formHookReturn} />}
        {currentStep === 2 && <LandlordDetailsStep {...formHookReturn} />}
        {currentStep === 3 && <MailChoiceStep {...formHookReturn} />}
        {currentStep === 4 && <EmailChoiceStep {...formHookReturn} />}
        {currentStep === 5 && <PreviewStep {...formHookReturn} />}
        {currentStep === 6 && (
          <ConfirmationStep confirmationResponse={letterResp} />
        )}
      </div>
      <div className="letter-form__buttons">
        {currentStep > 0 && (
          <Button variant="tertiary" labelText={_(msg`Back`)} onClick={prev} />
        )}
        <Button
          labelText={
            currentStep < steps.length - 1 ? _(msg`Next`) : _(msg`Submit`)
          }
          type="submit"
        />
      </div>
    </form>
  );
};
