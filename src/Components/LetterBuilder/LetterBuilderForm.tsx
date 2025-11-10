import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";

import { flattenExtraEmails, handleFormNoDefault } from "../../form-utils";
import {
  formSchema,
  FormFields,
  FormContext,
  defaultFormValues,
} from "../../types/LetterFormTypes";
import { buildLetterHtml } from "./Letter/letter-utils";
import {
  GCELetterConfirmation,
  GCELetterPostData,
} from "../../types/APIDataTypes";
import { useSendGceLetterData } from "../../api/hooks";
import { LetterStep, letterSteps, StepRouteName } from "./LetterSteps";
import { ProgressBar } from "./ProgressBar/ProgressBar";
import { InfoBox } from "../InfoBox/InfoBox";
import "./LetterBuilderForm.scss";

export const LetterBuilderForm: React.FC = () => {
  const { i18n } = useLingui();
  const navigate = useNavigate();
  const location = useLocation();
  const formMethods = useForm<FormFields>({
    // Issue with the inferred type being "unknown" when preprocess() is used to
    // handle values that should be changed to undefined
    resolver: zodResolver(formSchema(i18n)) as Resolver<FormFields>,
    mode: "onSubmit",
    defaultValues: defaultFormValues,
  });

  const {
    reset,
    trigger,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = formMethods;

  const currentStep = getStepFromPathname(location.pathname);

  const [confirmationResponse, setConfirmationResponse] =
    useState<GCELetterConfirmation>();

  const { trigger: sendLetter } = useSendGceLetterData();

  const onLetterSubmit: SubmitHandler<FormFields> = async (
    letterData: FormFields
  ) => {
    const letterHtml = await buildLetterHtml(letterData, "en");
    const letterPostData = getLetterPostData(letterData, letterHtml);
    const resp = await sendLetter(letterPostData);
    setConfirmationResponse(resp);
    return resp;
  };

  const navigateToStep = (stepName: StepRouteName) => {
    navigate(`/${i18n.locale}/letter/${stepName}`);
  };

  const next = async (nextStepName?: StepRouteName) => {
    const fields = currentStep.fields;

    if (fields) {
      const isValid = await trigger(fields, { shouldFocus: true });
      if (!isValid) {
        console.warn(errors);
        return;
      }
    }

    if (!nextStepName) return;

    if (nextStepName === "confirmation") {
      handleSubmit(onLetterSubmit)();
      reset();
    }

    navigateToStep(nextStepName);
  };

  const back = (prevStepName: StepRouteName) => {
    const fields = currentStep.fields;

    fields?.forEach((field) => {
      clearErrors(field);
    });

    // avoids error on user email if CC box was checked then go back a step and
    // remove user email from contact info
    if (fields?.includes("cc_user")) {
      setValue("cc_user", false);
    }

    navigateToStep(prevStepName);
  };

  return (
    <>
      <ProgressBar percentage={currentStep.progress} />
      <div className="letter-builder">
        <FormContext.Provider
          value={{ formMethods, back, next, confirmationResponse }}
        >
          {currentStep.component}
        </FormContext.Provider>
      </div>
    </>
  );
};

const getStepFromPathname = (pathname: string): LetterStep => {
  const parts = pathname.split("/").filter(Boolean);
  const letterIndex = parts.indexOf("letter");
  const routeSegment = letterIndex >= 0 ? parts[letterIndex + 1] : undefined;
  return letterSteps[routeSegment as StepRouteName];
};

const getLetterPostData = (
  letterData: FormFields,
  letterHtml: string
): GCELetterPostData => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { no_unit: _userNoUnit, ...userDetails } = letterData.user_details;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { no_unit: _landlordNoUnit, ...landlordDetails } =
    letterData.landlord_details;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user_details, landlord_details, ...letterFields } = letterData;
  return {
    ...letterFields,
    user_details: userDetails,
    landlord_details: landlordDetails,
    extra_emails: flattenExtraEmails(letterData.extra_emails),
    html_content: letterHtml,
  };
};

export const LetterStepForm: React.FC<{
  nextStep?: StepRouteName;
  children: React.ReactNode;
}> = ({ nextStep, children }) => {
  const {
    next,
    formMethods: {
      formState: { errors },
    },
  } = useContext(FormContext);
  const anyErrors = Object.keys(errors).length > 0;
  const onSubmit = handleFormNoDefault(() => next(nextStep));
  return (
    <form onSubmit={onSubmit} className="letter-form">
      {anyErrors && (
        <InfoBox color="orange" className="letter-form__global-error">
          <Trans>
            Please review the page and fix the errors below before continuing
          </Trans>
        </InfoBox>
      )}
      {children}
    </form>
  );
};
