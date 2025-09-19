import { UseFormReturn } from "react-hook-form";
import z from "zod";

const addressLOB = z.object({
  primary_line: z.string(),
  secondary_line: z.string().optional(),
  city: z.string(),
  state: z.string(),
  zip_code: z
    .string()
    .regex(
      /^\d{5}((-)?\d{4})?$/,
      "ZIP Code must be of format 12345 or 12345-1234"
    ),
  urbanization: z.string().optional(),
});

export const FormSchema = z.object({
  user_details: z.object({
    first_name: z.string().min(1, "Name is required for the letter"),
    last_name: z.string().min(1, "Name is required for the letter"),
    phone_number: z
      .string({
        error: (iss) =>
          iss.input === undefined || iss.input === ""
            ? "Phone number is required for follow up"
            : "Please enter a complete US phone number",
      })
      .length(10, "Please enter a complete US phone number"),
    // Email has god default validator regex, plus alternatives, and way to
    // include custom ({pattern: /<regex>/})
    email: z.email({
      // To customize error messages add a function that checks different possible
      // issues with the field, since z.email("invalid format") would also give
      // the same message even if empty input
      error: (iss) =>
        iss.input === undefined || iss.input === ""
          ? "Email is required to send your copy of the letter"
          : "Please enter a valid email",
    }),
    ...addressLOB
      .omit({ urbanization: true })
      .extend({ bbl: z.string().regex(/^\d{10}$/) }).shape,
  }),
  landlord_details: z.object({
    name: z.string().min(1, "Landlord name is required"),
    email: z.email().optional(),
    ...addressLOB.shape,
  }),
  mail_choice: z.literal(
    ["WE_WILL_MAIL", "USER_WILL_MAIL"],
    "Please select an option for mailing the letter"
  ),
  email_to_landlord: z.boolean(),
  // TODO: add fieldArray of emails (see https://react-hook-form.com/docs/usefieldarray)
});

export type FormFields = z.infer<typeof FormSchema>;

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
  email_to_landlord: true,
};
