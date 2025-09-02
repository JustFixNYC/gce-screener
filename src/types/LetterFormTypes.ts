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
  userDetails: z.object({
    firstName: z.string().min(1, "Name is required for the letter"),
    lastName: z.string().min(1, "Name is required for the letter"),
    phone: z
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
    address: addressLOB
      .omit({ urbanization: true })
      .extend({ bbl: z.string().regex(/^\d{10}$/) }),
  }),
  landlordDetails: z.object({
    name: z.string().min(1, "Landlord name is required"),
    address: addressLOB,
  }),

  // TODO: add fieldArray of emails (see https://react-hook-form.com/docs/usefieldarray)
});

export const defaultFormValues: FormFields = {
  userDetails: {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: {
      primary_line: "",
      secondary_line: undefined,
      city: "",
      state: "",
      zip_code: "",
      bbl: "",
    },
  },
  landlordDetails: {
    name: "",
    address: {
      primary_line: "",
      secondary_line: undefined,
      city: "",
      state: "",
      zip_code: "",
      urbanization: undefined,
    },
  },
};

export type FormFields = z.infer<typeof FormSchema>;

export type FormHookProps = UseFormReturn<FormFields>;
