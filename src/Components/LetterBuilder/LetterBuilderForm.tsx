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
      "userDetails.email",
      "userDetails.phone",
      "userDetails.firstName",
      "userDetails.lastName",
    ],
  },
  {
    id: "Step 2",
    name: "Your address",
    fields: ["userDetails.address"],
  },
  {
    id: "Step 3",
    name: "Landlord details",
    fields: ["landlordDetails"],
  },
  { id: "Step 4", name: "Complete" },
];

export const LetterBuilderForm: React.FC = () => {
  const { _ } = useLingui();
  const formHookReturn = useForm<FormFields>({
    // Issue with the inferred type being "unknown" when preprocess() is used to
    // handle values that should be changed to undefined
    resolver: zodResolver(FormSchema) as Resolver<FormFields>,
    mode: "onSubmit",
  });
  const { reset, watch, trigger, handleSubmit, setError, getValues } =
    formHookReturn;

  const [currentStep, setCurrentStep] = useState(0);

  const processForm: SubmitHandler<FormFields> = (data: FormFields) => {
    console.log({ data });
    reset();
  };

  // TODO: refactor to include this within the step if possible
  const verifyAddressDeliverable = async (
    data: FormFields["landlordDetails"]["address"]
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
        setError("landlordDetails", {
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

  console.log({ landlordDetails: watch("landlordDetails") });

  const next = async () => {
    const fields = steps[currentStep].fields;

    // TODO: clean up logic to handle final confirmation step with no fields
    if (!fields) {
      setCurrentStep((step) => step + 1);
      return;
    }

    // console.log(FormSchema.safeParse(getValues()));

    const output = await trigger(fields, { shouldFocus: true });

    if (!output) return;

    if (fields.includes("landlordDetails")) {
      // TODO: need to change how steps work when the landlord details step can
      // have two sub-steps (lookup address then manual enter)
      const isDeliverable = await verifyAddressDeliverable(
        getValues("landlordDetails.address")
      );
      if (!isDeliverable) {
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
