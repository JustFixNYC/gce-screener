import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { useRollbar } from "@rollbar/react";
import classNames from "classnames";

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
import {
  LetterStep,
  letterSteps,
  StepRouteName,
  firstLetterStep,
} from "./LetterSteps";
import { InfoBox } from "../InfoBox/InfoBox";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import { ProgressBar } from "./ProgressBar/ProgressBar";
import "./LetterBuilderForm.scss";

export const LetterBuilderForm: React.FC = () => {
  const { i18n } = useLingui();
  const rollbar = useRollbar();
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
    getValues,
    formState: { errors },
  } = formMethods;

  const currentStep = getStepFromPathname(location.pathname);

  const [confirmationResponse, setConfirmationResponse] = useState<
    GCELetterConfirmation | { error: boolean }
  >();

  const [allowedRoutes, setAllowedRoutes, clearAllowedRoutes] =
    useSessionStorage<StepRouteName[]>("allowedLetterRoutes", [
      firstLetterStep.route,
    ]);

  const [sessionFormValues, setSessionFormValues, clearSessionFormValues] =
    useSessionStorage<Partial<FormFields>>("formValues", getValues());

  const errorScrollRef = useRef<HTMLDivElement | null>(null);

  const { trigger: sendLetter } = useSendGceLetterData();

  // load saved form values from sessionStorage on mount
  useEffect(() => {
    reset(sessionFormValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLetterSubmit: SubmitHandler<FormFields> = async (
    letterData: FormFields
  ) => {
    try {
      const letterHtml = await buildLetterHtml(letterData, "en");
      const letterPostData = getLetterPostData(letterData, letterHtml);
      const resp = await sendLetter(letterPostData);
      setConfirmationResponse(resp);
    } catch (e) {
      setConfirmationResponse({ error: true });
      rollbar.error(`Failed to send letter: ${e}`);
    }
    clearSessionFormValues();
    clearAllowedRoutes();
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
        errorScrollRef?.current?.scrollIntoView();
        return;
      }
      setSessionFormValues(getValues());
    }

    if (!nextStepName) return;

    setAllowedRoutes(
      allowedRoutes
        ? allowedRoutes.concat([nextStepName])
        : [currentStep.route, nextStepName]
    );

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
    <div className="letter-builder" ref={errorScrollRef}>
      <FormContext.Provider
        value={{
          formMethods,
          back,
          next,
          confirmationResponse,
        }}
      >
        {currentStep.route !== "confirmation" && (
          <ProgressBar {...currentStep} />
        )}
        {currentStep.component}
      </FormContext.Provider>
    </div>
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

type LetterStepFormProps = {
  nextStep?: StepRouteName;
  onSubmit?: () => void;
  children?: React.ReactNode;
  className?: string;
};

export const LetterStepForm: React.FC<LetterStepFormProps> = ({
  nextStep,
  onSubmit,
  children,
  className,
}) => {
  const {
    next,
    formMethods: {
      formState: { errors },
    },
  } = useContext(FormContext);
  const anyErrors = Object.keys(errors).length > 0;
  const handleSubmit = handleFormNoDefault(onSubmit || (() => next(nextStep)));
  return (
    <form
      onSubmit={handleSubmit}
      className={classNames("letter-form", className)}
    >
      {anyErrors && (
        <InfoBox color="orange" className="letter-form__global-error">
          <Trans>Please review the page and fix the issues below.</Trans>
        </InfoBox>
      )}
      {children}
    </form>
  );
};
