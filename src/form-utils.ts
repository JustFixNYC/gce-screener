import z from "zod";
import { FormFields } from "./types/LetterFormTypes";

// For a react-hook-form object (of subset) check if there are any errors for a
// list of fields. Note this only looks at a single level, so you will need to
// call this multiple times for a set oif fields at different levels of nesting
export const anyErrors = (
  fields: string[],
  errors?: { [key: string]: unknown }
) => {
  if (!errors || Object.keys(errors).length === 0) return false;
  console.log(errors, fields);
  return Object.keys(errors).some((errorField) => fields.includes(errorField));
};

// Helps handle the default empty string value that inputs take on
// https://timjames.dev/blog/building-forms-with-zod-and-react-hook-form-2geg
export const looseOptional = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(
    (value: unknown) =>
      value === null || (typeof value === "string" && value === "")
        ? undefined
        : value,
    schema.optional()
  );

export const flattenExtraEmails = (
  extraEmails: FormFields["extra_emails"]
): string[] | undefined =>
  extraEmails
    ?.map(({ email }) => email)
    .filter((email): email is string => !!email);

// Handles undefined or string since untouched input will have undefined
// value, but must always return a string otherwise it messes up the
// controlled/uncontrolled component logic
export const formatPhoneNumber = (value: string | undefined): string => {
  if (value === undefined) return "";

  // remove all non-digit characters
  const cleaned = value.replace(/\D/g, "");
  // limit to 10 characters
  const limited = cleaned.slice(0, 10);

  // format with parentheses and dashes e.g. (555) 666-7777
  const match = limited.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (match) {
    const [, part1, part2, part3] = match;

    const formatted = [
      part1 ? `(${part1}` : "",
      part2 ? `) ${part2}` : "",
      part3 ? `-${part3}` : "",
    ]
      .join("")
      .trim();
    return formatted;
  }
  return value;
};

// Takes formatted phone number "(123) 456-7890", always a string based on above
// formatting output, but returns undefined instead of empty strings so that zod
// validation for optional field works, otherwise it can raise validation errors
export const parseFormattedPhoneNumber = (
  value: string
): string | undefined => {
  const parsed = value.replace(/\D/g, "").slice(0, 10);
  return parsed === "" ? undefined : parsed;
};

// The default form submission (eg. via "enter" on input) can mess with our
// controlled process so this wraps the function provided to <form> onSubmit
export const handleFormNoDefault = (
  fun: () => void
): React.FormEventHandler<HTMLFormElement> => {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    fun();
  };
};
