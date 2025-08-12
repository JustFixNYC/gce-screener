import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import z from "zod";
import { looseOptional } from "../../../form-utils";
import { Button, TextInput } from "@justfixnyc/component-library";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  // looseOptional() applies z.optional() to the schema and uses z.preprocess()
  // to convert the default empty string to undefined
  phone: looseOptional(
    z.string().length(10, "Please enter a complete US phone number")
  ),
});

type FormFields = z.infer<typeof FormSchema>;

export const PhoneNumberForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormFields>({
    // Issue with the inferred type being "unknown" when preprocess() is used to
    // handle values that should be changed to undefined
    resolver: zodResolver(FormSchema) as Resolver<FormFields>,
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormFields> = (data: FormFields) => {
    console.log({ data });
  };

  console.log({ phone: watch("phone") });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="letter-form">
      <h3>
        <pre>PhoneNumberForm</pre>
      </h3>
      <p>optional, unformatted, default implementation, validate on blur</p>
      <TextInput
        {...register("phone")}
        id="letter-phone"
        labelText="Phone number"
        invalid={!!errors?.phone}
        invalidText={errors?.phone?.message}
        invalidRole="status"
        type="tel"
      />

      <Button labelText="Submit" type="submit" />
    </form>
  );
};
