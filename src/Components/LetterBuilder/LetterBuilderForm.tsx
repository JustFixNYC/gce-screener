import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FieldPath, Resolver, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLingui } from "@lingui/react";

import { flattenExtraEmails, handleFormNoDefault } from "../../form-utils";
import { ProgressBar } from "./ProgressBar/ProgressBar";
import {
  formSchema,
  FormFields,
  FormContext,
  sampleFormValues,
} from "../../types/LetterFormTypes";
import { LandlordDetailsStep } from "./FormSteps/LandlordDetailsStep";
import { UserDetailsStep } from "./FormSteps/UserDetailsStep";
import { MailChoiceStep } from "./FormSteps/MailChoiceStep";
import { PreviewStep } from "./FormSteps/PreviewStep";
import { buildLetterHtml } from "./Letter/letter-utils";
import {
  GCELetterConfirmation,
  GCELetterPostData,
} from "../../types/APIDataTypes";
import { useSendGceLetterData } from "../../api/hooks";
import { ConfirmationStep } from "./FormSteps/ConfirmationStep";
import { useAddressModalHelpers } from "./AddressModalHelpers";
import { ReasonStep } from "./FormSteps/ReasonStep";
import { PlannedIncreaseStep } from "./FormSteps/PlannedIncreaseStep";
import { AllowedIncreaseStep } from "./FormSteps/AllowedIncreaseStep";
import { NonRenewalStep } from "./FormSteps/NonRenewalStep";
import "./LetterBuilderForm.scss";

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
    fields: ["user_details"],
  },
  {
    id: "Step 4",
    name: "Landlord details",
    routeName: "landlord-details",
    fields: ["landlord_details"],
  },
  { id: "Step 5", name: "Preview", routeName: "preview" },
  {
    id: "Step 6",
    name: "Mail Choice",
    routeName: "mail-choice",
    fields: [
      "mail_choice",
      "user_details.email",
      "landlord_details.email",
      "cc_user",
      "extra_emails",
    ],
  },
  { id: "Step 7", name: "Confirmation", routeName: "confirmation" },
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
    defaultValues: {
      cc_user: false,
      user_details: sampleFormValues.user_details,
      // user_details: { no_unit: false },
      landlord_details: { no_unit: false },
    },
  });

  const {
    reset,
    trigger,
    handleSubmit,
    getValues,
    clearErrors,
    formState: { errors },
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

  // Same as next() without validation. Useful when validation was already done or needs to be overridden (e.g. modals)
  const advanceToNextStep = () => {
    if (currentStep >= steps.length) return;
    const nextStep = steps[currentStep + 1];
    const nextPath = `/${i18n.locale}/letter/${nextStep.routeName}`;
    navigate(nextPath);
  };

  const { handleAddressVerification, addressConfirmationModal } =
    useAddressModalHelpers({
      formMethods: formMethods,
      onAddressConfirmed: advanceToNextStep,
    });

  const { trigger: sendLetter } = useSendGceLetterData();

  const [letterResp, setLetterResp] = useState<GCELetterConfirmation>();

  const onLetterSubmit: SubmitHandler<FormFields> = async (
    letterData: FormFields
  ) => {
    const letterHtml = await buildLetterHtml(letterData, "en");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { no_unit: _userNoUnit, ...userDetails } = letterData.user_details;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { no_unit: _landlordNoUnit, ...landlordDetails } =
      letterData.landlord_details;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_details, landlord_details, ...letterFields } = letterData;
    const letterPostData: GCELetterPostData = {
      ...letterFields,
      user_details: userDetails,
      landlord_details: landlordDetails,
      extra_emails: flattenExtraEmails(letterData.extra_emails),
      html_content: letterHtml,
    };
    const resp = await sendLetter(letterPostData);
    setLetterResp(resp);
    return resp;
  };

  // for flows with early completion (e.g. rent increase less than maximum %)
  const shouldShowFullProgress =
    currentStep === 2 &&
    getValues("reason") === "PLANNED_INCREASE" &&
    getValues("unreasonable_increase") === false;

  const next = async () => {
    const fields = steps[currentStep].fields;

    if (fields) {
      const isValid = await trigger(fields, { shouldFocus: true });
      if (!isValid) {
        console.warn(errors);
        return;
      }
    }

    if (steps[currentStep].name === "Landlord details") {
      const isDeliverable = await handleAddressVerification(
        getValues("landlord_details")
      );
      if (!isDeliverable) return;
    }

    if (steps[currentStep + 1].routeName === "confirmation") {
      handleSubmit(onLetterSubmit)();
      reset();
    }

    advanceToNextStep();
  };

  const getPrevPath = (): string => {
    if (currentStep === 0) {
      return `/${i18n.locale}/letter`;
    }
    const prevStep = steps[currentStep - 1];
    return `/${i18n.locale}/letter/${prevStep.routeName}`;
  };

  const back = () => {
    const fields = steps[currentStep].fields;
    fields?.forEach((field) => {
      clearErrors(field);
    });

    // avoids error on user email if CC box was checked then go back a step and
    // remove user email from contact info
    if (fields?.includes("cc_user")) {
      reset({ cc_user: false });
    }

    navigate(getPrevPath());
  };

  return (
    // TODO: We should restructure this so steps without inputs aren't within
    // <form> (ie. AllowedIncreaseStep, PreviewStep, ConfirmationStep)
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
              {getValues("reason") === "PLANNED_INCREASE" &&
              getValues("unreasonable_increase") === false ? (
                <AllowedIncreaseStep />
              ) : (
                <UserDetailsStep />
              )}
            </>
          )}
          {currentStep === 3 && (
            <LandlordDetailsStep
              verifyAddressDeliverable={handleAddressVerification}
            />
          )}
          {currentStep === 4 && <PreviewStep />}
          {currentStep === 5 && <MailChoiceStep />}
          {currentStep === 6 && (
            <ConfirmationStep confirmationResponse={letterResp} />
          )}
        </FormContext.Provider>
      </div>

      {addressConfirmationModal}
    </form>
  );
};
