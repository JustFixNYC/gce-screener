import { Controller, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput } from "@justfixnyc/component-library";
import {
  formatPhoneNumber,
  parseFormattedPhoneNumber,
} from "../../../form-utils";

const FormSchema = z.object({
  phone: z
    .string()
    .length(10, "Please enter a complete US phone number")
    .optional(),
});

type FormFields = z.infer<typeof FormSchema>;

export const PhoneNumberFormControlled: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(FormSchema),
  });

  const processForm: SubmitHandler<FormFields> = (data: FormFields) => {
    console.log({ data });
  };

  // This may not be necessary, but in case a type="submit" button starts
  // interfering with other forms on the page this will prevent it.
  const onSubmit: React.FormEventHandler<HTMLFormElement> | undefined = (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    void handleSubmit(processForm)(event);
  };

  console.log({ phone: watch("phone") });

  return (
    <form onSubmit={onSubmit} className="letter-form">
      <h3>
        <pre>PhoneNumberFormControlled</pre>
      </h3>
      <p>optional, formatted, controlled component, validate on submit</p>
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <TextInput
            {...field}
            value={formatPhoneNumber(field.value)}
            onChange={(e) =>
              field.onChange(parseFormattedPhoneNumber(e.target.value))
            }
            id="letter-phone2"
            labelText="Phone number (formatted)"
            invalid={!!errors?.phone}
            invalidText={errors?.phone?.message}
            invalidRole="status"
            type="tel"
          />
        )}
      />

      <Button labelText="Submit" type="submit" />
    </form>
  );
};
