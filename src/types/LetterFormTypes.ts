import { createContext } from "react";
import { FieldErrors, UseFormReturn } from "react-hook-form";
import { I18n } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import z from "zod";

import { CPI } from "../Components/Pages/RentCalculator/RentIncreaseValues";
import { flattenExtraEmails, looseOptional } from "../form-utils";
import { GCELetterConfirmation } from "./APIDataTypes";

const lobAddressSchema = (i18n: I18n) =>
  z.object({
    primary_line: z.string(i18n._(msg`Address is required for the letter`)),
    city: z.string(),
    state: z.string(),
    zip_code: z
      .string()
      .regex(
        /^\d{5}((-)?\d{4})?$/,
        i18n._(
          msg`ZIP Code must be either 5-digit number or 5-digits with hyphen and 4 additional digits.`
        )
      ),
    urbanization: z.string().optional(),
    secondary_line: z.string().optional(),
    no_unit: z.boolean(),
  });

const userDetailsSchema = (i18n: I18n) => {
  const schema = z.object({
    first_name: z
      .string()
      .min(1, i18n._(msg`First name is required for the letter`)),
    last_name: z
      .string()
      .min(1, i18n._(msg`Last name is required for the letter`)),
    phone_number: z
      .string({
        error: (iss) =>
          iss.input === undefined || iss.input === ""
            ? i18n._(msg`Phone number is required for follow up`)
            : i18n._(msg`Please enter a complete US phone number`),
      })
      .length(10, i18n._(msg`Please enter a complete US phone number`)),
    email: looseOptional(z.email(i18n._(msg`Please enter a valid email`))),
    ...lobAddressSchema(i18n)
      .omit({ urbanization: true })
      .extend({ bbl: z.string().regex(/^\d{10}$/) }).shape,
  });

  return schema.refine(
    // Sadly there's no good way to avoid repeating this for user & landlord
    // since .omit and .extend wipe out .refine
    (data) => {
      return (
        (!data.secondary_line && data.no_unit) ||
        (!!data.secondary_line && !data.no_unit)
      );
    },
    {
      message: i18n._(
        msg`Please provide a unit number or check the box to confirm that there is no unit number`
      ),
      path: ["secondary_line"],

      // necessary for this refine error to run even when there are validation
      // errors in other fields in the object.
      when(payload) {
        return schema
          .pick({ secondary_line: true, no_unit: true })
          .safeParse(payload.value).success;
      },
    }
  );
};

const landlordDetailsSchema = (i18n: I18n) => {
  const schema = z.object({
    name: z.string().min(1, i18n._(msg`Landlord name is required`)),
    email: looseOptional(z.email(i18n._(msg`Please enter a valid email`))),
    ...lobAddressSchema(i18n).shape,
  });

  return schema.refine(
    (data) => {
      return (
        (!data.secondary_line && data.no_unit) ||
        (!!data.secondary_line && !data.no_unit)
      );
    },
    {
      message: i18n._(
        msg`Please provide a unit number or check the box to confirm that there is no unit number`
      ),
      path: ["secondary_line"],

      // necessary for this refine error to run even when there are validation
      // errors in other fields in the object.
      when(payload) {
        return schema
          .pick({ secondary_line: true, no_unit: true })
          .safeParse(payload.value).success;
      },
    }
  );
};

const letterExtrasSchema = (i18n: I18n) =>
  z.object({
    mail_choice: z.literal(
      ["WE_WILL_MAIL", "USER_WILL_MAIL"],
      i18n._(msg`Please select an option for mailing the letter`)
    ),
    // Flat arrays don't work with react-hook-form field array
    extra_emails: looseOptional(
      z.array(z.object({ email: looseOptional(z.email()) }))
    ),
    cc_user: z.boolean(),
  });

const plannedIncreaseLetterSchema = (i18n: I18n) =>
  z.object({
    user_details: userDetailsSchema(i18n),
    landlord_details: landlordDetailsSchema(i18n),
    ...letterExtrasSchema(i18n).shape,
    reason: z.literal("PLANNED_INCREASE"),
    unreasonable_increase: z.boolean(
      i18n._(msg`Please select whether the increase is beyond ${CPI + 5}%`)
    ),
  });

const nonRenewalLetterSchema = (i18n: I18n) =>
  z.object({
    user_details: userDetailsSchema(i18n),
    landlord_details: landlordDetailsSchema(i18n),
    ...letterExtrasSchema(i18n).shape,
    reason: z.literal("NON_RENEWAL"),
    good_cause_given: z.boolean(
      i18n._(
        msg`Please select whether your landlord provided one of the listed reasons for not renewing your lease.`
      )
    ),
  });

export const formSchema = (i18n: I18n) => {
  const schema = z.discriminatedUnion(
    "reason",
    [plannedIncreaseLetterSchema(i18n), nonRenewalLetterSchema(i18n)],
    { error: i18n._(msg`Please select a reason for your letter.`) }
  );
  return schema.refine((data) => !data.cc_user || !!data.user_details.email, {
    message: i18n._(
      msg`Please enter your email address or uncheck the option to CC you on the email to your landlord`
    ),
    path: ["user_details.email"],

    when(payload) {
      // only need to do this on one part of the discriminated union
      return z
        .object({
          ...schema.options[0].pick({ cc_user: true }).shape,
          ...schema.options[0].shape.user_details.pick({ email: true }).shape,
        })
        .safeParse(payload.value).success;
    },
  });
};

export type FormFields = z.infer<ReturnType<typeof formSchema>>;

export type FormHookProps = UseFormReturn<FormFields>;

export const FormContext = createContext<{
  formMethods: FormHookProps;
  back: () => void;
  next: () => void;
}>(null!);

export const defaultFormValues: FormFields = {
  user_details: {
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    primary_line: "",
    secondary_line: "",
    city: "",
    state: "",
    zip_code: "",
    bbl: "",
    no_unit: false,
  },
  landlord_details: {
    name: "",
    email: "",
    primary_line: "",
    secondary_line: "",
    city: "",
    state: "",
    zip_code: "",
    urbanization: undefined,
    no_unit: false,
  },
  mail_choice: "WE_WILL_MAIL",
  reason: "PLANNED_INCREASE",
  unreasonable_increase: false,
  cc_user: false,
};

export const sampleFormValues: FormFields = {
  user_details: {
    first_name: "Maxwell",
    last_name: "Austensen",
    phone_number: "2125551212",
    email: "tenant@email.com",
    primary_line: "deliverable",
    secondary_line: "Apt 1",
    city: "BROOKLYN",
    state: "NY",
    zip_code: "11111",
    bbl: "3000010001",
    no_unit: false,
  },
  landlord_details: {
    name: "Maxwell Austensen",
    email: "landlord@email.com",
    primary_line: "deliverable",
    secondary_line: "Apt 1",
    city: "BROOKLYN",
    state: "NY",
    zip_code: "11111",
    no_unit: false,
  },
  mail_choice: "WE_WILL_MAIL",
  extra_emails: [{ email: "extra@email.com" }],
  reason: "PLANNED_INCREASE",
  unreasonable_increase: false,
  cc_user: true,
};

// This shouldn't be necessary, but for some reason it's unable to infer the
// types based on value for discriminating variable "reason" as expected, so
// setting up these specific types nad predicate functions
type PlanedIncreaseErrors = FieldErrors<
  z.infer<ReturnType<typeof plannedIncreaseLetterSchema>>
>;
type NonRenewalErrors = FieldErrors<
  z.infer<ReturnType<typeof nonRenewalLetterSchema>>
>;

export function isPlannedIncreaseErrors(
  _errors: PlanedIncreaseErrors | NonRenewalErrors,
  reason: FormFields["reason"]
): _errors is PlanedIncreaseErrors {
  return reason === "PLANNED_INCREASE";
}

export function isNonRenewalErrors(
  _errors: PlanedIncreaseErrors | NonRenewalErrors,
  reason: FormFields["reason"]
): _errors is NonRenewalErrors {
  return reason === "NON_RENEWAL";
}

export const sampleConfirmationValues: GCELetterConfirmation = {
  errors: {
    landlord_email: {
      error: false,
    },
    user_email: {
      error: false,
    },
    letter_mail: {
      error: false,
    },
    textit_campaign: {
      error: false,
    },
  },
  data: {
    user_email: sampleFormValues.user_details.email,
    landlord_email: sampleFormValues.landlord_details.email,
    extra_emails: flattenExtraEmails(sampleFormValues.extra_emails),
    user_phone_number: sampleFormValues.user_details.phone_number,
    mail_choice: sampleFormValues.mail_choice,
    letter_pdf: "xxx",
    tracking_number: "1111111",
    reason: sampleFormValues.reason,
  },
};
