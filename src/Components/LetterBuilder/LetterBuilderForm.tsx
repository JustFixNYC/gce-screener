import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
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
  stepRouteNames,
  StepRouteName,
} from "./LetterSteps";
import { ProgressBar } from "./ProgressBar/ProgressBar";
import { InfoBox } from "../InfoBox/InfoBox";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import "./LetterBuilderForm.scss";
import { useRollbar } from "@rollbar/react";

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

  const [lastStepReached, setLastStepReached] =
    useSessionStorage<StepRouteName>("lastStepReached", stepRouteNames[0]);

  const errorScrollRef = useRef<HTMLDivElement | null>(null);

  const { trigger: sendLetter } = useSendGceLetterData();

  // load saved form values from sessionStorage on mount
  useEffect(() => {
    const loadFromSessionStorage = () => {
      const allFields = Object.values(letterSteps)
        .flatMap((step) => step.fields || [])
        .filter((field, index, self) => self.indexOf(field) === index); // unique fields

      allFields.forEach((field) => {
        const savedValue = window.sessionStorage.getItem(field);
        if (savedValue) {
          try {
            const parsedValue = JSON.parse(savedValue);
            setValue(field, parsedValue);
          } catch {
            rollbar.error(`Failed to parse ${field} from sessionStorage`);
          }
        }
      });
    };

    loadFromSessionStorage();
  }, []);

  // handles redirects
  useEffect(() => {
    if (!currentStep || !lastStepReached) return;

    const currentStepIndex = stepRouteNames.indexOf(currentStep.name);
    const lastStepIndex = stepRouteNames.indexOf(lastStepReached);

    // case: undefined step names in URL will set the indices to -1.
    // reset to first step. progress of other inputs will be saved in sessionStorage anyway
    if (currentStepIndex === -1 || lastStepIndex === -1) {
      setLastStepReached(stepRouteNames[0]);
      return;
    }

    // case: user is trying to skip ahead, redirect to the lastStepReached
    if (currentStepIndex > lastStepIndex) {
      navigateToStep(lastStepReached);
    }
  }, [location.pathname, lastStepReached, currentStep]);

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
    clearFormFromSessionStorage();
    // todo: when lastStepReached = confirmation, don't let the user go back to any other steps.
    // clear lastStepReached afterward
  };

  const clearFormFromSessionStorage = () => {
    const allFields = Object.values(letterSteps)
      .flatMap((step) => step.fields || [])
      .filter((field, index, self) => self.indexOf(field) === index);

    allFields.forEach((field) => {
      window.sessionStorage.removeItem(field);
    });
  };

  const navigateToStep = (stepName: StepRouteName) => {
    navigate(`/${i18n.locale}/letter/${stepName}`);
  };

  const saveFieldsToSessionStorage = (fields: string[]) => {
    const formValues = getValues();

    fields.forEach((field) => {
      const fieldValue = formValues[field as keyof FormFields];
      if (fieldValue !== undefined) {
        try {
          window.sessionStorage.setItem(field, JSON.stringify(fieldValue));
        } catch {
          rollbar.error(`Failed to save ${field} to sessionStorage`);
        }
      }
    });
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
      saveFieldsToSessionStorage(fields);
    }

    if (!nextStepName) return;

    const nextStepIndex = stepRouteNames.indexOf(nextStepName);
    const currentLastIndex = stepRouteNames.indexOf(
      lastStepReached || stepRouteNames[0]
    );

    if (nextStepIndex > currentLastIndex) {
      setLastStepReached(nextStepName);
    }

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
      <div className="letter-builder" ref={errorScrollRef}>
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
