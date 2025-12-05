import { FieldPath } from "react-hook-form";
import { msg } from "@lingui/core/macro";
import { MessageDescriptor } from "@lingui/core";

import { FormFields } from "../../types/LetterFormTypes";
import { ReasonStep } from "./FormSteps/ReasonStep";
import { AllowedIncreaseStep } from "./FormSteps/AllowedIncreaseStep";
import { PlannedIncreaseStep } from "./FormSteps/PlannedIncreaseStep";
import { NonRenewalStep } from "./FormSteps/NonRenewalStep";
import { UserDetailsStep } from "./FormSteps/UserDetailsStep";
import { LandlordDetailsStep } from "./FormSteps/LandlordDetailsStep";
import { PreviewStep } from "./FormSteps/PreviewStep";
import { MailChoiceStep } from "./FormSteps/MailChoiceStep";
import { ConfirmationStep } from "./FormSteps/ConfirmationStep";

export const stepRouteNames = [
  "reason",
  "non_renewal",
  "rent_increase",
  "allowed_increase",
  "contact_info",
  "landlord_details",
  "preview",
  "mail_choice",
  "confirmation",
] as const;

export type StepRouteName = (typeof stepRouteNames)[number];

export type LetterStep = {
  route: StepRouteName;
  stepName: MessageDescriptor;
  component: React.ReactNode;
  fields?: FieldPath<FormFields>[];
  progress: number; // percentage (0-100)
};

export type LetterSteps = {
  [key in StepRouteName]: LetterStep;
};

export const letterSteps: LetterSteps = {
  reason: {
    route: "reason",
    stepName: msg`Reason`,
    component: <ReasonStep />,
    fields: ["reason"],
    progress: 100 / 7,
  },
  non_renewal: {
    route: "non_renewal",
    stepName: msg`Reason for non-renewal`,
    component: <NonRenewalStep />,
    fields: ["good_cause_given"],
    progress: (100 / 7) * 2,
  },
  rent_increase: {
    route: "rent_increase",
    stepName: msg`Your rent increase amount`,
    component: <PlannedIncreaseStep />,
    fields: ["unreasonable_increase"],
    progress: (100 / 7) * 2,
  },
  allowed_increase: {
    route: "allowed_increase",
    stepName: msg`Legal rent increase`,
    component: <AllowedIncreaseStep />,
    progress: 100,
  },
  contact_info: {
    route: "contact_info",
    stepName: msg`Your information`,
    component: <UserDetailsStep />,
    fields: ["user_details"],
    progress: (100 / 7) * 3,
  },
  landlord_details: {
    route: "landlord_details",
    stepName: msg`Your landlord’s information`,
    component: <LandlordDetailsStep />,
    fields: ["landlord_details"],
    progress: (100 / 7) * 4,
  },
  preview: {
    route: "preview",
    stepName: msg`Review your letter`,
    component: <PreviewStep />,
    progress: (100 / 7) * 5,
  },
  mail_choice: {
    route: "mail_choice",
    stepName: msg`Mailing method`,
    component: <MailChoiceStep />,
    // include all for final submission just in case
    fields: [
      "reason",
      "unreasonable_increase",
      "good_cause_given",
      "mail_choice",
      "user_details",
      "landlord_details",
      "cc_user",
      "extra_emails",
    ],
    progress: (100 / 7) * 6,
  },
  confirmation: {
    route: "confirmation",
    stepName: msg`Complete`,
    component: <ConfirmationStep />,
    progress: 100,
  },
};

export const firstLetterStep = letterSteps.reason;
