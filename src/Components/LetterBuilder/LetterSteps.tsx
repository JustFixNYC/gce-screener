import { FieldPath } from "react-hook-form";

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
  name: StepRouteName;
  component: React.ReactNode;
  fields?: FieldPath<FormFields>[];
  progress: number; // percentage (0-100)
};

export type LetterSteps = {
  [key in StepRouteName]: LetterStep;
};

export const letterSteps: LetterSteps = {
  reason: {
    name: "reason",
    component: <ReasonStep />,
    fields: ["reason"],
    progress: 100 / 7,
  },
  non_renewal: {
    name: "non_renewal",
    component: <NonRenewalStep />,
    fields: ["good_cause_given"],
    progress: (100 / 7) * 2,
  },
  rent_increase: {
    name: "rent_increase",
    component: <PlannedIncreaseStep />,
    fields: ["unreasonable_increase"],
    progress: (100 / 7) * 2,
  },
  allowed_increase: {
    name: "allowed_increase",
    component: <AllowedIncreaseStep />,
    progress: 100,
  },
  contact_info: {
    name: "contact_info",
    component: <UserDetailsStep />,
    fields: ["user_details"],
    progress: (100 / 7) * 3,
  },
  landlord_details: {
    name: "landlord_details",
    component: <LandlordDetailsStep />,
    fields: ["landlord_details"],
    progress: (100 / 7) * 4,
  },
  preview: {
    name: "preview",
    component: <PreviewStep />,
    progress: (100 / 7) * 5,
  },
  mail_choice: {
    name: "mail_choice",
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
    name: "confirmation",
    component: <ConfirmationStep />,
    progress: 100,
  },
};
