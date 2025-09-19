import z from "zod";

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
