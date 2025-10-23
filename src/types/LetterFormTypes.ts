import { FieldErrors, UseFormReturn } from "react-hook-form";
import z from "zod";

import { CPI } from "../Components/Pages/RentCalculator/RentIncreaseValues";
import { looseOptional } from "../form-utils";

const lobAddressSchema = z.object({
  primary_line: z.string(),
  secondary_line: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip_code: z
    .string()
    .regex(
      /^\d{5}((-)?\d{4})?$/,
      `ZIP Code must be either 5-digit number or 5-digits with hyphen and 4 additional digits.`
    ),
  urbanization: z.string().optional(),
});

const userDetailsSchema = z.object({
  first_name: z.string().min(1, `First name is required for the letter`),
  last_name: z.string().min(1, `Last name is required for the letter`),
  phone_number: z
    .string({
      error: (iss) =>
        iss.input === undefined || iss.input === ""
          ? `Phone number is required for follow up`
          : `Please enter a complete US phone number`,
    })
    .length(10, `Please enter a complete US phone number`),
  email: looseOptional(z.email(`Please enter a valid email`)),
  ...lobAddressSchema
    .omit({ urbanization: true })
    .extend({ bbl: z.string().regex(/^\d{10}$/) }).shape,
});

const landlordDetailsSchema = z.object({
  name: z.string().min(1, `Landlord name is required`),
  email: looseOptional(z.email(`Please enter a valid email`)),
  ...lobAddressSchema.shape,
});

const letterExtrasSchema = z.object({
  mail_choice: z.literal(
    ["WE_WILL_MAIL", "USER_WILL_MAIL"],
    `Please select an option for mailing the letter`
  ),
  // Flat arrays don't work with react-hook-form field array
  extra_emails: looseOptional(
    z.array(z.object({ email: looseOptional(z.email()) }))
  ),
});

const plannedIncreaseLetterSchema = z.object({
  user_details: userDetailsSchema,
  landlord_details: landlordDetailsSchema,
  ...letterExtrasSchema.shape,
  reason: z.literal("PLANNED_INCREASE"),
  unreasonable_increase: z.boolean(
    `Please select whether the increase is beyond ${CPI + 5}%`
  ),
});

const nonRenewalLetterSchema = z.object({
  user_details: userDetailsSchema,
  landlord_details: landlordDetailsSchema,
  ...letterExtrasSchema.shape,
  reason: z.literal("NON_RENEWAL"),
  good_cause_given: z.boolean(
    `Please select whether your landlord provided one of the listed reasons for not renewing your lease.`
  ),
});

export const formSchema = z.discriminatedUnion(
  "reason",
  [plannedIncreaseLetterSchema, nonRenewalLetterSchema],
  { error: `Please select a reason for your letter.` }
);

export type FormFields = z.infer<typeof formSchema>;

type PlanedIncreaseErrors = FieldErrors<
  z.infer<typeof plannedIncreaseLetterSchema>
>;
type NonRenewalErrors = FieldErrors<z.infer<typeof nonRenewalLetterSchema>>;

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
};

export const sampleFormValues: FormFields = {
  user_details: {
    first_name: "Maxwell",
    last_name: "Austensen",
    phone_number: "2125551212",
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
  extra_emails: [{ email: "maxwell@justfix.org" }],
  reason: "PLANNED_INCREASE",
  unreasonable_increase: false,
};
