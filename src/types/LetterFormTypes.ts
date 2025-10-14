import { FieldErrors, UseFormReturn } from "react-hook-form";
import { I18n } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import z from "zod";

import { CPI } from "../Components/Pages/RentCalculator/RentIncreaseValues";

const lobAddressSchema = (i18n: I18n) =>
  z.object({
    primary_line: z.string(),
    secondary_line: z.string().optional(),
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
  });

const userDetailsSchema = (i18n: I18n) =>
  z.object({
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
    // Email has god default validator regex, plus alternatives, and way to
    // include custom ({pattern: /<regex>/})
    email: z.email({
      // To customize error messages add a function that checks different possible
      // issues with the field, since z.email("invalid format") would also give
      // the same message even if empty input
      error: (iss) =>
        iss.input === undefined || iss.input === ""
          ? i18n._(msg`Email is required to send your copy of the letter`)
          : i18n._(msg`Please enter a valid email`),
    }),
    ...lobAddressSchema(i18n)
      .omit({ urbanization: true })
      .extend({ bbl: z.string().regex(/^\d{10}$/) }).shape,
  });

const landlordDetailsSchema = (i18n: I18n) =>
  z.object({
    name: z.string().min(1, i18n._(msg`Landlord name is required`)),
    email: z.email().optional(),
    ...lobAddressSchema(i18n).shape,
  });

const letterExtrasSchema = (i18n: I18n) =>
  z.object({
    mail_choice: z.literal(
      ["WE_WILL_MAIL", "USER_WILL_MAIL"],
      i18n._(msg`Please select an option for mailing the letter`)
    ),
    email_to_landlord: z.boolean(),
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

export const formSchema = (i18n: I18n) =>
  z.discriminatedUnion(
    "reason",
    [plannedIncreaseLetterSchema(i18n), nonRenewalLetterSchema(i18n)],
    { error: i18n._(msg`Please select a reason for your letter.`) }
  );

export type FormFields = z.infer<ReturnType<typeof formSchema>>;

export type FormHookProps = UseFormReturn<FormFields>;

export const defaultFormValues: FormFields = {
  user_details: {
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    primary_line: "",
    secondary_line: undefined,
    city: "",
    state: "",
    zip_code: "",
    bbl: "",
  },
  landlord_details: {
    name: "",
    email: "",
    primary_line: "",
    secondary_line: undefined,
    city: "",
    state: "",
    zip_code: "",
    urbanization: undefined,
  },
  mail_choice: "WE_WILL_MAIL",
  reason: "PLANNED_INCREASE",
  unreasonable_increase: false,
  email_to_landlord: true,
};

export const sampleFormValues: FormFields = {
  user_details: {
    first_name: "Maxwell",
    last_name: "Austensen",
    phone_number: "3475551234",
    email: "maxwell@justfix.org",
    primary_line: "deliverable",
    secondary_line: "Apt 1",
    city: "BROOKLYN",
    state: "NY",
    zip_code: "11111",
    bbl: "3000010001",
  },
  landlord_details: {
    name: "Maxwell Austensen",
    email: "maxwell@justfix.org",
    primary_line: "deliverable",
    secondary_line: "Apt 1",
    city: "BROOKLYN",
    state: "NY",
    zip_code: "11111",
  },
  mail_choice: "WE_WILL_MAIL",
  reason: "PLANNED_INCREASE",
  unreasonable_increase: false,
  email_to_landlord: true,
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
