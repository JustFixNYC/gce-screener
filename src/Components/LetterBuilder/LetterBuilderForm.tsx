import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FieldPath, Resolver, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLingui } from "@lingui/react";

import { handleFormNoDefault } from "../../form-utils";
import { Tenants2ApiFetcherVerifyAddress } from "../../api/helpers";
import { ProgressBar } from "./ProgressBar/ProgressBar";
import {
  formSchema,
  FormFields,
  FormContext,
} from "../../types/LetterFormTypes";
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
import { ReasonStep } from "./FormSteps/ReasonStep";
import { PlannedIncreaseStep } from "./FormSteps/PlannedIncreaseStep";
import { AllowedIncreaseStep } from "./FormSteps/AllowedIncreaseStep";
import { NonRenewalStep } from "./FormSteps/NonRenewalStep";

interface Step {
  id: string;
  name: string;
  routeName: string;
  fields?: FieldPath<FormFields>[];
}

const steps: Step[] = [
  {
    id: "Step 1",
    name: "Reason for letter",
    routeName: "reason",
    fields: ["reason"],
  },
  {
    id: "Step 2",
    name: "Reason for letter",
    routeName: "reason-details",
    fields: ["unreasonable_increase", "good_cause_given"],
  },
  {
    id: "Step 3",
    name: "Contact information",
    routeName: "contact-info",
    fields: [
      "user_details.email",
      "user_details.phone_number",
      "user_details.first_name",
      "user_details.last_name",
    ],
  },
  {
    id: "Step 4",
    name: "Your address",
    routeName: "address",
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
    // TODO: Move to after landlord details, it's here only for ease of PR review
    id: "Step 5",
    name: "Mail Choice",
    routeName: "mail-choice",
    fields: [
      "mail_choice",
      "user_details.email",
      "landlord_details.email",
      "extra_emails",
    ],
  },
  {
    id: "Step 6",
    name: "Landlord details",
    routeName: "landlord-details",
    fields: ["landlord_details"],
  },
  { id: "Step 7", name: "Preview", routeName: "preview" },
  { id: "Step 8", name: "Confirmation", routeName: "confirmation" },
];

export const LetterBuilderForm: React.FC = () => {
  const { i18n } = useLingui();
  const navigate = useNavigate();
  const location = useLocation();
  const formMethods = useForm<FormFields>({
    // Issue with the inferred type being "unknown" when preprocess() is used to
    // handle values that should be changed to undefined
    resolver: zodResolver(formSchema(i18n)) as Resolver<FormFields>,
    mode: "onSubmit",
  });
  const {
    reset,
    trigger,
    handleSubmit,
    setError,
    getValues,
    clearErrors,
    watch,
  } = formMethods;

  const [currentStep, setCurrentStep] = useState(0);

  const getStepIndexFromPathname = (pathname: string): number => {
    const parts = pathname.split("/").filter(Boolean);
    const letterIndex = parts.indexOf("letter");
    const routeSegment = letterIndex >= 0 ? parts[letterIndex + 1] : undefined;
    const stepIndex = steps.findIndex((s) => s.routeName === routeSegment);
    return stepIndex >= 0 ? stepIndex : 0;
  };

  // keeps LetterBuilderForm state in sync with URL
  useEffect(() => {
    setCurrentStep(getStepIndexFromPathname(location.pathname));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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
    const letterHtml = await buildLetterHtml(letterData, "en");
    const letterPostData: GCELetterPostData = {
      ...letterData,
      extra_emails: letterData.extra_emails
        ?.map(({ email }) => email)
        .filter((email): email is string => !!email),
      html_content: letterHtml,
    };
    const resp = await sendLetter(letterPostData);
    setLetterResp(resp);
    return resp;
  };

  console.log({ stepInfo: steps[currentStep] });
  console.log({ mail_choice: watch("mail_choice") });

  // for flows with early completione (e.g. rent increase less than maximum %, Good Cause given for non-renewal)
  const shouldShowFullProgress =
    currentStep === 2 &&
    ((getValues("reason") === "PLANNED_INCREASE" &&
      getValues("unreasonable_increase") === false) ||
      (getValues("reason") === "NON_RENEWAL" &&
        getValues("good_cause_given") === true));

  const next = async () => {
    const fields = steps[currentStep].fields;

    console.log({ fields_to_validate: fields });
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
      if (!isDeliverable) return;
    }

    if (steps[currentStep].name === "Preview") {
      const resp = await onLetterSubmit();
      if (!resp) return;
    }

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)();
      }
      const nextStep = steps[currentStep + 1];
      const nextPath = `/${i18n.locale}/letter/${nextStep.routeName}`;
      navigate(nextPath, { preventScrollReset: true });
    }
    setCurrentStep((step) => step + 1);
  };

  const back = () => {
    if (currentStep <= 0) return;

    const fields = steps[currentStep].fields;
    fields?.forEach((field) => {
      clearErrors(field);
    });

    setCurrentStep((step) => step - 1);
    const prevStep = steps[currentStep - 1];
    const prevPath = `/${i18n.locale}/letter/${prevStep.routeName}`;
    navigate(prevPath, { preventScrollReset: true });
  };

  return (
    <form onSubmit={handleFormNoDefault(next)} className="letter-form">
      <ProgressBar
        steps={steps}
        currentStep={currentStep}
        progressOverride={shouldShowFullProgress ? 100 : undefined}
      />
      <div className="letter-form__content">
        <FormContext.Provider value={{ formMethods, back, next }}>
          {currentStep === 0 && <ReasonStep />}
          {currentStep === 1 && (
            <>
              {getValues("reason") === "PLANNED_INCREASE" && (
                <PlannedIncreaseStep />
              )}
              {getValues("reason") === "NON_RENEWAL" && <NonRenewalStep />}
            </>
          )}
          {currentStep === 2 && (
            <>
              {getValues("unreasonable_increase") ? (
                <AllowedIncreaseStep />
              ) : (
                <UserDetailsStep {...formMethods} />
              )}
            </>
          )}
          {currentStep === 3 && <UserAddressStep {...formMethods} />}
          {currentStep === 4 && <MailChoiceStep />}
          {currentStep === 5 && <LandlordDetailsStep {...formMethods} />}
          {currentStep === 6 && <PreviewStep />}
          {currentStep === 7 && (
            <ConfirmationStep confirmationResponse={letterResp} />
          )}
        </FormContext.Provider>
      </div>
    </form>
  );
};
